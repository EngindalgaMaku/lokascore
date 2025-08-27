"use client";

import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";

// Fix default icon paths in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon as any;

function ClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function PositionMarker({ pos }: { pos: [number, number] | null }) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!pos) return;
    if (!markerRef.current) {
      markerRef.current = L.marker(pos).addTo(map);
    } else {
      markerRef.current.setLatLng(pos);
    }
  }, [pos, map]);

  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, []);

  return null;
}

export default function Map({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  const [pos, setPos] = useState<[number, number] | null>([36.8893, 30.7081]); // Muratpaşa merkez
  const [mounted, setMounted] = useState(false);
  const [mapKey, setMapKey] = useState<number | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Avoid SSR/hydration and StrictMode double-invoke issues
    // Also proactively clear any stale leaflet containers left by Fast Refresh
    if (typeof window !== "undefined") {
      const stale = document.querySelectorAll<HTMLDivElement>(".leaflet-container");
      stale.forEach((el) => {
        el.parentElement?.removeChild(el);
      });
    }
    setMounted(true);
    // Ensure a fresh container DOM for Leaflet on first client render (and after HMR)
    setMapKey(Date.now());
    return () => {
      // Dispose any existing map instance tied to this component
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleSelect = (lat: number, lng: number) => {
    setPos([lat, lng]);
    onSelect(lat, lng);
  };

  const mapElement = useMemo(
    () => (
      !mounted ? null : (
        <MapContainer
          key={mapKey ?? 0}
          center={[36.8893, 30.7081]}
          zoom={14}
          className="h-full w-full"
          whenCreated={(map: L.Map) => {
            mapRef.current = map;
          }}
        >
          <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onSelect={handleSelect} />
          <PositionMarker pos={pos} />
        </MapContainer>
      )
    ),
    [mounted, mapKey, pos]
  );

  return (
    <>{mapElement}</>
  );
}
