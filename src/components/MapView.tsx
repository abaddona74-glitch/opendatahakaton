"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

// load CSS only on client
export default function MapView() {
  const [regions, setRegions] = useState<any[]>([]);
  const [houses, setHouses] = useState<any[]>([]);

  useEffect(() => {
    import("leaflet/dist/leaflet.css");

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
    <div className="h-[600px] w-full">
      <MapContainer
        {...({ center: [41.3, 69.2], zoom: 11, style: { height: "100%", width: "100%" } } as any)}
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
