"use client";

import { useEffect, useRef } from "react";
import type { Location } from "@/data/locations";

type CulturalMapProps = {
  locations: Location[];
};

export function CulturalMap({ locations }: CulturalMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

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
        html: '<span style="display:block;width:18px;height:18px;border-radius:999px;background:#9d4f2f;border:3px solid #f6ead2;box-shadow:0 8px 18px rgba(63,38,24,.35)"></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      locations.forEach((location) => {
        L.marker([location.latitude, location.longitude], { icon: markerIcon })
          .addTo(map)
          .bindPopup(`
            <div style="max-width:240px">
              <h3 style="margin:0;color:#3f2618;font-size:16px">${location.name}</h3>
              <p style="margin:6px 0 0;color:#9d4f2f;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em">${location.region} | ${location.category}</p>
              <p style="margin:12px 0 0;color:#201610;font-size:13px;line-height:1.55">${location.history}</p>
              <p style="margin:8px 0 0;color:rgba(32,22,16,.75);font-size:13px;line-height:1.55">${location.tourismInfo}</p>
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
  }, [locations]);

  return <div ref={mapRef} className="min-h-[480px] w-full rounded-lg" />;
}
