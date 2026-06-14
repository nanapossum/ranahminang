"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type MapDestination = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  location: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
};

type CulturalMapProps = {
  destinations?: MapDestination[];
};

const categoryFilters = ["All", "Nature", "Historical", "Cultural", "Mountain", "Other"];

function normalizeCategory(category: string) {
  const value = category.toLowerCase();

  if (value.includes("nature") || value.includes("lake") || value.includes("geological")) return "Nature";
  if (value.includes("histor")) return "Historical";
  if (value.includes("culture") || value.includes("palace") || value.includes("heritage")) return "Cultural";
  if (value.includes("mountain") || value.includes("highland")) return "Mountain";
  return "Other";
}

export function CulturalMap({ destinations = [] }: CulturalMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const points = useMemo(() => {
    return destinations
      .filter((destination) => destination.latitude !== null && destination.longitude !== null)
      .map((destination) => ({
        id: destination.id,
        title: destination.title,
        description: destination.description,
        image: destination.image,
        category: destination.category,
        location: destination.location,
        latitude: destination.latitude as number,
        longitude: destination.longitude as number,
        href: `/destinations/${destination.id}`
      }))
      .filter(
        (point) => activeFilter === "All" || normalizeCategory(point.category) === activeFilter
      );
  }, [destinations, activeFilter]);

  useEffect(() => {
    let isCancelled = false;
    let cleanup = () => {};

    async function loadMap() {
      if (!mapRef.current) {
        return;
      }

      const L = await import("leaflet");

      if (isCancelled || !mapRef.current) {
        return;
      }

      const container = mapRef.current as HTMLDivElement & { _leaflet_id?: number };
      if (container._leaflet_id) {
        container._leaflet_id = undefined;
      }

      const map = L.map(mapRef.current, {
        center: [-0.29, 100.45],
        zoom: 10,
        scrollWheelZoom: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      const markerIcon = L.divIcon({
        className: "",
        html: '<span style="display:block;width:22px;height:22px;border-radius:999px;background:#15803d;border:4px solid #f59e0b;box-shadow:0 10px 22px rgba(20,83,45,.35)"></span>',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      points.forEach((point) => {
        L.marker([point.latitude, point.longitude], { icon: markerIcon })
          .addTo(map)
          .bindPopup(`
            <div style="width:240px;overflow:hidden;border-radius:10px">
              ${
                point.image
                  ? `<img src="${point.image}" alt="" style="width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:10px" />`
                  : ""
              }
              <h3 style="margin:0;color:#1c1917;font-size:16px;font-weight:800">${point.title}</h3>
              <p style="margin:6px 0 0;color:#15803d;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em">${point.location} | ${point.category}</p>
              <p style="margin:10px 0 12px;color:#44403c;font-size:13px;line-height:1.55">${point.description.slice(0, 130)}...</p>
              <a href="${point.href}" style="display:inline-block;border-radius:6px;background:#f59e0b;color:#1c1917;padding:8px 10px;font-size:12px;font-weight:800;text-decoration:none">View Details</a>
            </div>
          `);
      });

      cleanup = () => {
        map.remove();
      };
    }

    void loadMap();

    return () => {
      isCancelled = true;
      cleanup();
    };
  }, [points]);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto p-2">
        {categoryFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={
              activeFilter === filter
                ? "shrink-0 rounded-full bg-green-700 px-3 py-1.5 text-xs font-semibold text-white"
                : "shrink-0 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-amber-400 hover:text-green-700"
            }
          >
            {filter}
          </button>
        ))}
      </div>
      {points.length === 0 ? (
        <div className="px-4 pb-2 pt-1 text-sm text-stone-600">
          No mapped destinations are available yet.
        </div>
      ) : null}
      <div ref={mapRef} className="min-h-[480px] w-full rounded-lg" />
    </div>
  );
}
