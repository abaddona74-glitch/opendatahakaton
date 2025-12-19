"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
} from "react-leaflet";

type MapViewProps = {
  className?: string;
};

// load CSS only on client
export default function MapView({ className }: MapViewProps) {
  const [regions, setRegions] = useState<any[]>([]);
  const [houses, setHouses] = useState<any[]>([]);

  const containerClass = useMemo(() => {
    return className ?? "h-[600px] w-full";
  }, [className]);

  useEffect(() => {
    // Load Leaflet CSS via CDN (reliable in Codespaces + avoids TS module issues)
    const existing = document.querySelector('link[data-leaflet="true"]');
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.setAttribute("data-leaflet", "true");
      document.head.appendChild(link);
    }

    // fix default marker icons when bundler doesn't copy images
    L.Icon.Default.mergeOptions({
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    // load regions and houses
    fetch("/api/regions")
      .then((r) => r.json())
      .then((d) => setRegions(d.regions || []))
      .catch(console.error);

    fetch("/api/houses")
      .then((r) => r.json())
      .then((d) => setHouses(d.houses || []))
      .catch(console.error);
  }, []);

  return (
    <div className={containerClass}>
      <MapContainer
        {...({
          center: [41.3, 69.2],
          zoom: 11,
          style: { height: "100%", width: "100%" },
        } as any)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {regions.map((reg) => (
          <GeoJSON
            key={reg.id}
            {...({
              data: reg.polygon,
              style: () => ({
                color: `hsl(${(reg.id * 60) % 360},60%,40%)`,
                weight: 2,
                fillOpacity: 0.25,
              }),
              eventHandlers: {
                click: () => {
                  // open details, or fetch /api/regions/:id for counts
                  alert(`${reg.name} (${reg.code})`);
                },
              },
            } as any)}
          />
        ))}

        {houses
          .filter((h) => h.location && h.location.lat && h.location.lng)
          .map((h) => (
            <Marker
              key={h.id}
              position={[h.location.lat, h.location.lng]}
            >
              <Popup>
                <div>
                  <div className="font-semibold">House {h.number}</div>
                  <div className="text-sm">Street ID: {h.streetId}</div>
                  <button
                    className="mt-2 underline text-blue-600"
                    onClick={async (e) => {
                      e.preventDefault();
                      // fetch residents for this house and show inline
                      const res = await fetch(`/api/residents?houseId=${h.id}`);
                      const data = await res.json();
                      alert(
                        `Residents:\n${(data.residents || [])
                          .map((r: any) => `${r.firstName} ${r.lastName}`)
                          .join("\n")}`
                      );
                    }}
                  >
                    Show residents
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
