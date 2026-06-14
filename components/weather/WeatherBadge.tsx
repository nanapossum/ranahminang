"use client";

import { useEffect, useState } from "react";

type WeatherBadgeProps = {
  location: string;
  latitude?: number | null;
  longitude?: number | null;
};

type WeatherState = {
  temperature: number | null;
  condition: string;
  icon: string;
};

const weatherCache = new Map<string, WeatherState | null>();

function fallbackEmoji(condition: string) {
  const value = condition.toLowerCase();

  if (value.includes("rain")) return "🌧️";
  if (value.includes("cloud")) return "☁️";
  if (value.includes("clear") || value.includes("sunny")) return "☀️";
  if (value.includes("storm")) return "⛈️";
  if (value.includes("snow")) return "❄️";
  if (value.includes("mist") || value.includes("fog")) return "🌫️";
  return "🌤️";
}

export function WeatherBadge({ location, latitude, longitude }: WeatherBadgeProps) {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams();

    if (latitude !== null && latitude !== undefined && longitude !== null && longitude !== undefined) {
      params.set("lat", String(latitude));
      params.set("lon", String(longitude));
    } else {
      params.set("location", location);
    }

    const cacheKey = params.toString();
    const cachedWeather = weatherCache.get(cacheKey);

    if (cachedWeather !== undefined) {
      setWeather(cachedWeather);
      setStatus(cachedWeather ? "idle" : "error");
      return () => {
        isMounted = false;
      };
    }

    setStatus("loading");

    fetch(`/api/weather?${cacheKey}`)
      .then(async (response) => {
        const data = (await response.json()) as { weather?: WeatherState | null };

        if (!response.ok || !data.weather || data.weather.temperature === null) {
          throw new Error("Weather unavailable");
        }

        weatherCache.set(cacheKey, data.weather);

        if (isMounted) {
          setWeather(data.weather);
          setStatus("idle");
        }
      })
      .catch(() => {
        weatherCache.set(cacheKey, null);

        if (isMounted) {
          setWeather(null);
          setStatus("error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [location, latitude, longitude]);

  if (status === "loading") {
    return (
      <span className="inline-flex items-center gap-2 rounded-md bg-stone-200 px-3 py-1 text-xs font-semibold text-stone-600">
        <span>...</span>
        <span>Loading weather</span>
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-2 rounded-md bg-stone-200 px-3 py-1 text-xs font-semibold text-stone-600">
        <span>--</span>
        <span>Weather unavailable</span>
      </span>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-700">
      <span>{weather.icon || fallbackEmoji(weather.condition)}</span>
      <span>{weather.temperature}°C • {weather.condition}</span>
    </span>
  );
}
