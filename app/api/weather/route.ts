import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeCondition(condition: string) {
  const value = condition.toLowerCase();

  if (value.includes("rain")) return "Rain";
  if (value.includes("cloud")) return "Cloudy";
  if (value.includes("clear")) return "Clear";
  if (value.includes("storm")) return "Storm";
  if (value.includes("mist") || value.includes("fog")) return "Misty";
  return condition;
}

function conditionEmoji(condition: string) {
  const value = condition.toLowerCase();

  if (value.includes("rain")) return "🌧️";
  if (value.includes("cloud")) return "☁️";
  if (value.includes("clear")) return "☀️";
  if (value.includes("storm")) return "⛈️";
  if (value.includes("mist") || value.includes("fog")) return "🌫️";
  return "🌤️";
}

function getFallbackCoordinates(locationName: string): { lat: number; lon: number } {
  const value = locationName.toLowerCase();
  if (value.includes("pagaruyung") || value.includes("tanah datar") || value.includes("batu sangkar")) {
    return { lat: -0.4716, lon: 100.6215 };
  }
  if (value.includes("jam gadang") || value.includes("bukittinggi") || value.includes("sianok") || value.includes("agam")) {
    return { lat: -0.3052, lon: 100.3692 };
  }
  if (value.includes("harau") || value.includes("limapuluh") || value.includes("payakumbuh")) {
    return { lat: -0.1049, lon: 100.6654 };
  }
  if (value.includes("maninjau")) {
    return { lat: -0.3093, lon: 100.2036 };
  }
  if (value.includes("air manis") || value.includes("padang")) {
    return { lat: -0.9718, lon: 100.3329 };
  }
  return { lat: -0.95, lon: 100.35 }; // Padang default
}

function mapWMOToCondition(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: "Clear", icon: "☀️" };
  if (code === 1 || code === 2 || code === 3) return { condition: "Cloudy", icon: "☁️" };
  if (code === 45 || code === 48) return { condition: "Misty", icon: "🌫️" };
  if (
    (code >= 51 && code <= 57) ||
    (code >= 61 && code <= 67) ||
    (code >= 80 && code <= 82)
  ) {
    return { condition: "Rain", icon: "🌧️" };
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return { condition: "Snow", icon: "❄️" };
  }
  if (code >= 95 && code <= 99) return { condition: "Storm", icon: "⛈️" };
  return { condition: "Cloudy", icon: "🌤️" };
}

function getFailSafeWeather(locationName: string, lat: number, lon: number) {
  // Generate deterministic temp and condition based on coordinates/name length
  const hash = Math.round((Math.abs(lat) * 1000 + Math.abs(lon) * 1000 + locationName.length)) % 100;
  
  // Highland areas (lat > -0.6) are cooler (e.g. Bukittinggi is -0.3)
  const isHighland = lat > -0.6;
  const baseTemp = isHighland ? 21 : 28;
  const tempOffset = (hash % 5) - 2; // -2 to +2
  const temperature = baseTemp + tempOffset;
  
  const conditions = ["Clear", "Cloudy", "Cloudy", "Rain", "Cloudy"];
  const condition = conditions[hash % conditions.length];
  
  const emojis: Record<string, string> = {
    "Clear": "☀️",
    "Cloudy": "☁️",
    "Rain": "🌧️"
  };
  const icon = emojis[condition] || "🌤️";
  
  return {
    location: locationName,
    temperature,
    condition,
    icon
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");
  const location = searchParams.get("location") || "West Sumatra";

  const lat = latStr ? parseFloat(latStr) : null;
  const lon = lonStr ? parseFloat(lonStr) : null;

  const apiKey = process.env.OPENWEATHER_API_KEY;

  // 1. Try OpenWeather API if API key is present
  if (apiKey) {
    try {
      const query =
        latStr && lonStr
          ? `lat=${encodeURIComponent(latStr)}&lon=${encodeURIComponent(lonStr)}`
          : `q=${encodeURIComponent(location)}`;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`,
        { next: { revalidate: 60 * 20 } }
      );

      if (response.ok) {
        const data = (await response.json()) as {
          name?: string;
          main?: { temp?: number };
          weather?: Array<{ main?: string; description?: string }>;
        };

        const rawCondition = data.weather?.[0]?.main || data.weather?.[0]?.description || "Weather";
        const condition = normalizeCondition(rawCondition);

        return NextResponse.json({
          weather: {
            location: data.name || location,
            temperature: typeof data.main?.temp === "number" ? Math.round(data.main.temp) : null,
            condition,
            icon: conditionEmoji(condition)
          }
        });
      }
    } catch (err) {
      console.error("OpenWeather API fetch failed, falling back to Open-Meteo:", err);
    }
  }

  // 2. Fall back to Open-Meteo API (does not require key)
  const coords = (lat !== null && lon !== null) 
    ? { lat, lon } 
    : getFallbackCoordinates(location);

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`,
      { next: { revalidate: 60 * 20 } }
    );

    if (response.ok) {
      const data = (await response.json()) as {
        current_weather?: {
          temperature?: number;
          weathercode?: number;
        };
      };

      if (data.current_weather) {
        const temp = data.current_weather.temperature;
        const code = data.current_weather.weathercode ?? 1;
        const mapped = mapWMOToCondition(code);

        return NextResponse.json({
          weather: {
            location: location,
            temperature: typeof temp === "number" ? Math.round(temp) : null,
            condition: mapped.condition,
            icon: mapped.icon
          }
        });
      }
    }
  } catch (err) {
    console.error("Open-Meteo API fetch failed, falling back to deterministic fail-safe:", err);
  }

  // 3. Fail-safe deterministic local weather fallback
  const failSafe = getFailSafeWeather(location, coords.lat, coords.lon);
  return NextResponse.json({ weather: failSafe });
}

