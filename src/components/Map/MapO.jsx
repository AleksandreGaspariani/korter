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
    });
    map.addOverlay(popup);

    // Marker click handler
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

    // Map click to add marker
    map.on('dblclick', function (evt) {
      if (clickMarker) {
        vectorSource.removeFeature(clickMarker);
        setClickMarker(null);
      }
      const coords = toLonLat(evt.coordinate);
      const feature = new Feature({
        geometry: new Point(fromLonLat([coords[0], coords[1]])),
      });
      feature.setStyle(markerStyle);
      vectorSource.addFeature(feature);
      setClickMarker(feature);
      setPopupContent(
        `<div>ახალი ობიექტის კოორდინატები:<br/><span style="font-family:monospace;font-size:12px">${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}</span></div>`
      );
      setPopupCoord(evt.coordinate);
      popup.setPosition(evt.coordinate);
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

  return (
    <div style={{ position: 'relative' }}>
      {/* Address Search Input */}
      <form
        onSubmit={handleSearch}
        style={{
          position: 'absolute',
          left: 10,
          top: 50,
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
          borderRadius: 4,
          border: '1px solid #ccc',
          minWidth: 120,
          pointerEvents: 'auto',
        }}
        dangerouslySetInnerHTML={{ __html: popupContent }}
      />
      <div style={{ position: 'absolute', left: 10, top: 10, zIndex: 1000, background: '#fff8', padding: 4, borderRadius: 4, fontSize: 12 }}>
        <b>Layer switch:</b> 1 = Light, 2 = Satellite<br />
        <b>Double click</b> to add marker
      </div>
    </div>
  );
};

export default MapO;