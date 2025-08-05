import React, { useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, LayersControl, ScaleControl, useMap, ZoomControl, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const locations = [
  { id: 1, lat: 41.7151, lng: 44.8271, name: 'Location A', route: '/location-a' },
  { id: 2, lat: 41.72, lng: 44.82, name: 'Location B', route: '/location-b' },
];

// Component to locate user and fly to their position
function LocateButton() {
  const map = useMap();
  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 16 });
    map.once('locationfound', (e) => {
      L.marker(e.latlng, { icon: customIcon }).addTo(map)
        .bindPopup('თქვენი მდებარეობა').openPopup();
    });
  };
  return (
    <button
      className="absolute top-4 right-4 z-[1000] bg-white border rounded shadow px-2 py-1 text-xs hover:bg-gray-100"
      onClick={handleLocate}
      style={{ right: 10, top: 80, position: 'absolute' }}
    >
      ჩემი მდებარეობა
    </button>
  );
}

// Component to handle map clicks and add marker
function ClickMarker({ onCreate }) {
  const [position, setPosition] = useState(null);

  useMapEvent('click', (e) => {
    setPosition(e.latlng);
    if (onCreate) onCreate(e.latlng);
  });

  return position ? (
    <Marker position={position} icon={customIcon}>
      <Popup>
        <div>
          <div>ახალი ობიექტის კოორდინატები:</div>
          <div className="font-mono text-xs">{position.lat.toFixed(6)}, {position.lng.toFixed(6)}</div>
          {/* Place your "Create" button or logic here */}
        </div>
      </Popup>
    </Marker>
  ) : null;
}

const Map = () => {
  const navigate = useNavigate();
  const markerRefs = useRef([]);
  // Optional: handle creation event
  const handleCreate = (latlng) => {
    // You can open a modal, call an API, or log the coordinates here
    // Example: console.log('Create record at:', latlng);
  };

  return (
    <div className="relative">
      <MapContainer
        center={[41.7151, 44.8271]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-[800px] w-full rounded shadow"
        zoomControl={true}
      >
        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomleft" />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Light">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
              attribution=""
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              attribution="Google"
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        {locations.map((loc, idx) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={customIcon}
            draggable={true}
            ref={el => markerRefs.current[idx] = el}
            eventHandlers={{
              click: () => navigate(loc.route),
              dragend: (e) => {
                const marker = markerRefs.current[idx];
                if (marker) {
                  const pos = marker.getLatLng();
                  marker.setPopupContent(
                    `<div><b>${loc.name}</b><br/>New position:<br/>${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}</div>`
                  );
                }
              }
            }}
          >
            <Tooltip>{loc.name}</Tooltip>
            <Popup>
              <div>
                <h4>{loc.name}</h4>
                <p>Clicking takes you to {loc.route}</p>
                <p>Drag me!</p>
              </div>
            </Popup>
          </Marker>
        ))}
        <LocateButton />
        <ClickMarker onCreate={handleCreate} />
      </MapContainer>
    </div>
  );
}

export default Map