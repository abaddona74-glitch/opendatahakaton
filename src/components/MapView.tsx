"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView() {
  const [regions, setRegions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/regions')
      .then((r) => r.json())
      .then((data) => setRegions(data.regions || []))
      .catch(console.error);
  }, []);

  return (
    <div className="h-[600px] w-full">
      <MapContainer center={[41.3, 69.2]} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {regions.map((reg) => (
          <GeoJSON
            key={reg.id}
            data={reg.polygon}
            style={() => ({ color: `hsl(${(reg.id * 60) % 360},60%,40%)`, weight: 2, fillOpacity: 0.3 })}
            eventHandlers={{
              click: () => {
                // on click show popup via API fetch in real app
                alert(`${reg.name} (${reg.code})`);
              }
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
