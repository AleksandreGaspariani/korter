import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, XYZ, Vector as VectorSource } from 'ol/source';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import { defaults as defaultControls, ScaleLine, Zoom } from 'ol/control';
import { useNavigate } from 'react-router-dom';

const locations = [
  { id: 1, lat: 41.7151, lng: 44.8271, name: 'Location A', route: '/location-a' },
  { id: 2, lat: 41.72, lng: 44.82, name: 'Location B', route: '/location-b' },
];

const customIcon = new Icon({
  src: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
  anchor: [0.5, 1],
  scale: 0.0625, // 32/512
});

const markerStyle = new Style({ image: customIcon });

const MapO = () => {
  const mapRef = useRef();
  const [mapObj, setMapObj] = useState(null);
  const [vectorSource] = useState(new VectorSource());
  const [userMarker, setUserMarker] = useState(null);
  const [clickMarker, setClickMarker] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchMarker, setSearchMarker] = useState(null);
  const navigate = useNavigate();
  const popupRef = useRef();
  const [popupContent, setPopupContent] = useState('');
  const [popupCoord, setPopupCoord] = useState(null);
  const [showMarkerModal, setShowMarkerModal] = useState(false);
  const [newMarkerCoords, setNewMarkerCoords] = useState(null);
  const [markerForm, setMarkerForm] = useState({ image: '', title: '', desc: '' });

  // Initialize map
  useEffect(() => {
    if (mapObj) return;

    // Base layers
    const lightLayer = new TileLayer({
      source: new OSM(),
      visible: true,
      title: 'Light',
    });
    const satelliteLayer = new TileLayer({
      source: new XYZ({
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        attributions: 'Google',
      }),
      visible: false,
      title: 'Satellite',
    });

    // Vector layer for markers
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: markerStyle,
    });

    // Map object
    const map = new Map({
      target: mapRef.current,
      layers: [lightLayer, satelliteLayer, vectorLayer],
      view: new View({
        center: fromLonLat([44.8271, 41.7151]),
        zoom: 13,
      }),
      controls: defaultControls().extend([
        new ScaleLine(),
        new Zoom({ className: 'ol-zoom', target: undefined }),
      ]),
    });

    // Add markers for locations
    locations.forEach((loc, idx) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([loc.lng, loc.lat])),
        name: loc.name,
        route: loc.route,
        idx,
      });
      feature.setStyle(markerStyle);
      feature.set('draggable', true);
      vectorSource.addFeature(feature);
    });

    // Popup overlay
    const popup = new Overlay({
      element: popupRef.current,
      autoPan: true,
      autoPanAnimation: { duration: 250 },
      positioning: 'bottom-center',
      offset: [0, -32], // move popup above marker
      stopEvent: false,
    });
    map.addOverlay(popup);

    // Marker click handler (for navigation)
    map.on('singleclick', function (evt) {
      let found = false;
      map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        const name = feature.get('name');
        const route = feature.get('route');
        if (name && route) {
          setPopupContent(
            `<div><b>${name}</b><br/>Clicking takes you to ${route}<br/>Drag me!</div>`
          );
          setPopupCoord(evt.coordinate);
          popup.setPosition(evt.coordinate);
          found = true;
          // Navigate on click
          setTimeout(() => navigate(route), 200);
        }
      });
      if (!found) {
        popup.setPosition(undefined);
      }
    });

    // Add marker on CTRL + click (open modal instead of adding directly)
    map.on('singleclick', function (evt) {
      if (!evt.originalEvent.ctrlKey) return;
      setNewMarkerCoords(evt.coordinate);
      setMarkerForm({ image: '', title: '', desc: '' });
      setShowMarkerModal(true);
    });

    // Drag marker logic
    let dragFeature = null;
    map.on('pointerdown', function (evt) {
      map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        if (feature.get('draggable')) {
          dragFeature = feature;
        }
      });
    });
    map.on('pointerup', function () {
      dragFeature = null;
    });
    map.on('pointerdrag', function (evt) {
      if (dragFeature) {
        dragFeature.getGeometry().setCoordinates(evt.coordinate);
        setPopupContent(
          `<div><b>${dragFeature.get('name')}</b><br/>New position:<br/>${toLonLat(evt.coordinate)[1].toFixed(5)}, ${toLonLat(evt.coordinate)[0].toFixed(5)}</div>`
        );
        setPopupCoord(evt.coordinate);
        popup.setPosition(evt.coordinate);
      }
    });

    // Marker hover logic (show pretty modal)
    map.on('pointermove', function (evt) {
      let hit = false;
      map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        const title = feature.get('title');
        const desc = feature.get('desc');
        const image = feature.get('image');
        if (title && desc && image) {
          setPopupContent(
            `<div style="padding:8px 12px;min-width:200px;text-align:center;">
              <img src="${image}" alt="" style="width:100%;max-width:180px;max-height:120px;object-fit:cover;border-radius:6px;margin-bottom:8px;"/>
              <b style="font-size:16px;">${title}</b><br/>
              <span style="font-size:13px;color:#444;">${desc}</span>
            </div>`
          );
          setPopupCoord(evt.coordinate);
          popup.setPosition(evt.coordinate);
          hit = true;
        } else if (feature.get('name') && feature.get('route')) {
          // fallback for default markers
          setPopupContent(
            `<div style="padding:8px 12px;min-width:160px;text-align:center;">
              <b style="font-size:16px;">${feature.get('name')}</b><br/>
              <span style="font-size:12px;color:#888;">Route: ${feature.get('route')}</span>
            </div>`
          );
          setPopupCoord(evt.coordinate);
          popup.setPosition(evt.coordinate);
          hit = true;
        }
      });
      if (!hit) {
        popup.setPosition(undefined);
      }
    });

    setMapObj(map);

    // Layer switcher (simple)
    map.getTargetElement().addEventListener('keydown', (e) => {
      if (e.key === '1') {
        lightLayer.setVisible(true);
        satelliteLayer.setVisible(false);
      }
      if (e.key === '2') {
        lightLayer.setVisible(false);
        satelliteLayer.setVisible(true);
      }
    });

    // Clean up
    return () => {
      map.setTarget(null);
    };
    // eslint-disable-next-line
  }, []);

  // Locate Me button handler
  const handleLocate = () => {
    if (!mapObj) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = [pos.coords.longitude, pos.coords.latitude];
      if (userMarker) {
        vectorSource.removeFeature(userMarker);
      }
      const feature = new Feature({
        geometry: new Point(fromLonLat(coords)),
      });
      feature.setStyle(markerStyle);
      vectorSource.addFeature(feature);
      setUserMarker(feature);
      mapObj.getView().animate({ center: fromLonLat(coords), zoom: 16 });
      setPopupContent('თქვენი მდებარეობა');
      setPopupCoord(fromLonLat(coords));
      mapObj.getOverlays().item(0).setPosition(fromLonLat(coords));
    });
  };

  // Address search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim() || !mapObj) return;
    // Nominatim API
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const data = await res.json();
    if (data && data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const coords = [parseFloat(lon), parseFloat(lat)];
      if (searchMarker) {
        vectorSource.removeFeature(searchMarker);
      }
      const feature = new Feature({
        geometry: new Point(fromLonLat(coords)),
      });
      feature.setStyle(markerStyle);
      vectorSource.addFeature(feature);
      setSearchMarker(feature);
      mapObj.getView().animate({ center: fromLonLat(coords), zoom: 16 });
      setPopupContent(`<div><b>${display_name}</b></div>`);
      setPopupCoord(fromLonLat(coords));
      mapObj.getOverlays().item(0).setPosition(fromLonLat(coords));
    } else {
      setPopupContent('<div>Address not found</div>');
      setPopupCoord(null);
      mapObj.getOverlays().item(0).setPosition(undefined);
    }
  };

  // Handle marker modal form submit
  const handleMarkerFormSubmit = (e) => {
    e.preventDefault();
    if (!newMarkerCoords) return;
    if (clickMarker) {
      vectorSource.removeFeature(clickMarker);
      setClickMarker(null);
    }
    const coords = toLonLat(newMarkerCoords);
    const feature = new Feature({
      geometry: new Point(fromLonLat([coords[0], coords[1]])),
      image: markerForm.image,
      title: markerForm.title,
      desc: markerForm.desc,
    });
    feature.setStyle(markerStyle);
    vectorSource.addFeature(feature);
    setClickMarker(feature);
    setShowMarkerModal(false);
    setPopupContent(
      `<div style="padding:8px 12px;min-width:200px;text-align:center;">
        <img src="${markerForm.image}" alt="" style="width:100%;max-width:180px;max-height:120px;object-fit:cover;border-radius:6px;margin-bottom:8px;"/>
        <b style="font-size:16px;">${markerForm.title}</b><br/>
        <span style="font-size:13px;color:#444;">${markerForm.desc}</span>
      </div>`
    );
    setPopupCoord(newMarkerCoords);
    mapObj && mapObj.getOverlays().item(0).setPosition(newMarkerCoords);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Address Search Input */}
      <form
        onSubmit={handleSearch}
        style={{
          position: 'absolute',
          left: 10,
          top: 70,
          zIndex: 1100,
          background: '#fff',
          borderRadius: 4,
          boxShadow: '0 1px 4px #0002',
          padding: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
        autoComplete="off"
      >
        <input
          type="text"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="Search address..."
          style={{
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 8px',
            fontSize: 14,
            width: 220,
          }}
        />
        <button
          type="submit"
          style={{
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            padding: '4px 12px',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Search
        </button>
      </form>
      <div
        ref={mapRef}
        style={{ width: '100%', height: 800, borderRadius: 8, boxShadow: '0 2px 8px #0001' }}
        tabIndex={0}
      />
      <button
        onClick={handleLocate}
        style={{
          position: 'absolute',
          right: 10,
          top: 80,
          zIndex: 1000,
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: 4,
          boxShadow: '0 1px 4px #0002',
          padding: '4px 8px',
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        ჩემი მდებარეობა
      </button>
      <div
        ref={popupRef}
        style={{
          position: 'absolute',
          background: 'white',
          padding: 8,
          borderRadius: 8,
          border: '1px solid #1976d2',
          minWidth: 120,
          pointerEvents: 'auto',
          boxShadow: '0 4px 16px #1976d233',
          zIndex: 2000,
          transform: 'translate(-50%, -100%)',
          fontFamily: 'inherit',
        }}
        dangerouslySetInnerHTML={{ __html: popupContent }}
      />
      <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 1000, background: '#fff8', padding: 4, borderRadius: 4, fontSize: 12 }}>
        <b>Layer switch:</b> 1 = Light, 2 = Satellite<br />
        <b>CTRL + Click</b> to add marker
      </div>
      {/* Marker Modal */}
      {showMarkerModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.25)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <form
            onSubmit={handleMarkerFormSubmit}
            style={{
              background: '#fff', borderRadius: 10, boxShadow: '0 8px 32px #0003',
              padding: 24, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative'
            }}
          >
            <button
              type="button"
              onClick={() => setShowMarkerModal(false)}
              style={{
                position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer'
              }}
              aria-label="Close"
            >×</button>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Add Marker</div>
            <input
              type="url"
              required
              placeholder="Image URL"
              value={markerForm.image}
              onChange={e => setMarkerForm(f => ({ ...f, image: e.target.value }))}
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', fontSize: 15 }}
            />
            <input
              type="text"
              required
              placeholder="Title"
              value={markerForm.title}
              onChange={e => setMarkerForm(f => ({ ...f, title: e.target.value }))}
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', fontSize: 15 }}
            />
            <textarea
              required
              placeholder="Description"
              value={markerForm.desc}
              onChange={e => setMarkerForm(f => ({ ...f, desc: e.target.value }))}
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', fontSize: 15, minHeight: 60 }}
            />
            <button
              type="submit"
              style={{
                background: '#1976d2', color: 'white', border: 'none', borderRadius: 4,
                padding: '8px 0', fontSize: 16, fontWeight: 600, cursor: 'pointer'
              }}
            >
              Add Marker
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MapO;