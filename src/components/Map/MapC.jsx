import React, { useEffect, useRef, useState } from 'react';
// Import Cesium as a namespace for compatibility with Vite
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { useNavigate } from 'react-router-dom';

// Cesium Ion default token (replace with your own for production)
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYmQyNWMyMC0xZWE4LTQ0MDQtYWY4MS1iOGRlMTZiZDMwY2IiLCJpZCI6MzI3NDcwLCJpYXQiOjE3NTM5NjQzMDd9.eASug5tMXuX6UYBwrmUMhY4mJMhDiJw7nagzQEF7cYU';

const locations = [
  { id: 1, lat: 41.7151, lng: 44.8271, name: 'Location A', route: '/location-a' },
  { id: 2, lat: 41.72, lng: 44.82, name: 'Location B', route: '/location-b' },
];

const tbilisiCoords = [41.7151, 44.8271];

const MapC = () => {
  const cesiumContainer = useRef();
  const [viewer, setViewer] = useState(null);
  const [entities, setEntities] = useState([]);
  const [userEntity, setUserEntity] = useState(null);
  const [clickEntity, setClickEntity] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchEntity, setSearchEntity] = useState(null);
  const [popup, setPopup] = useState({ show: false, html: '', position: null });
  const navigate = useNavigate();

  // Initialize Cesium Viewer
  useEffect(() => {
    if (viewer) return;

    // Cesium Viewer setup
    const v = new Cesium.Viewer(cesiumContainer.current, {
      terrainProvider: Cesium.CesiumTerrainProvider.fromIonAssetId(1),
      imageryProvider: undefined, // We'll add layers below
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      shouldAnimate: false,
    });

    // Add base layers
    const bingAerial = v.imageryLayers.addImageryProvider(
      new Cesium.BingMapsImageryProvider({
        url: 'https://dev.virtualearth.net',
        key: '', // Optional: Add your Bing Maps key
        mapStyle: Cesium.BingMapsStyle.AERIAL
      })
    );
    const bingRoad = v.imageryLayers.addImageryProvider(
      new Cesium.BingMapsImageryProvider({
        url: 'https://dev.virtualearth.net',
        key: '',
        mapStyle: Cesium.BingMapsStyle.ROAD
      })
    );
    bingRoad.show = false; // Start with Aerial

    // Layer switcher: 1 = Aerial, 2 = Road
    v.scene.canvas.tabIndex = 0;
    v.scene.canvas.addEventListener('keydown', (e) => {
      if (e.key === '1') {
        bingAerial.show = true;
        bingRoad.show = false;
      }
      if (e.key === '2') {
        bingAerial.show = false;
        bingRoad.show = true;
      }
    });

    // Add location markers
    const markerEntities = locations.map(loc => {
      const isTbilisi =
        Math.abs(loc.lat - tbilisiCoords[0]) < 0.01 &&
        Math.abs(loc.lng - tbilisiCoords[1]) < 0.01;
      return v.entities.add({
        position: Cesium.Cartesian3.fromDegrees(loc.lng, loc.lat, 0),
        billboard: {
          image: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
          scale: 0.08,
          color: isTbilisi ? Cesium.Color.WHITE : Cesium.Color.GRAY.withAlpha(0.3),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
        label: {
          text: loc.name,
          font: '14px sans-serif',
          fillColor: Cesium.Color.DODGERBLUE,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -40),
          showBackground: true,
          backgroundColor: Cesium.Color.WHITE.withAlpha(0.7),
        },
        description: `<div><b>${loc.name}</b><br/>Clicking takes you to ${loc.route}<br/>Drag me!</div>`,
        properties: {
          route: loc.route,
          draggable: isTbilisi,
        }
      });
    });

    setEntities(markerEntities);

    // Fly to Tbilisi
    v.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(44.8271, 41.7151, 3000),
      duration: 1.5,
    });

    // Click handler for markers and globe
    const handler = new Cesium.ScreenSpaceEventHandler(v.scene.canvas);
    handler.setInputAction((movement) => {
      const picked = v.scene.pick(movement.position);
      if (Cesium.defined(picked) && picked.id && picked.id.properties && picked.id.properties.route) {
        // Marker clicked
        setPopup({
          show: true,
          html: picked.id.description.getValue(),
          position: picked.id.position.getValue()
        });
        setTimeout(() => navigate(picked.id.properties.route.getValue()), 200);
      } else {
        // Globe clicked: add marker
        const cartesian = v.camera.pickEllipsoid(movement.position, v.scene.globe.ellipsoid);
        if (cartesian) {
          const carto = Cesium.Cartographic.fromCartesian(cartesian);
          const lat = Cesium.CesiumMath.toDegrees(carto.latitude);
          const lng = Cesium.CesiumMath.toDegrees(carto.longitude);
          if (clickEntity) v.entities.remove(clickEntity);
          const entity = v.entities.add({
            position: Cesium.Cartesian3.fromDegrees(lng, lat, 0),
            billboard: {
              image: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
              scale: 0.08,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            },
            description: `<div>ახალი ობიექტის კოორდინატები:<br/><span style="font-family:monospace;font-size:12px">${lat.toFixed(6)}, ${lng.toFixed(6)}</span></div>`
          });
          setClickEntity(entity);
          setPopup({
            show: true,
            html: entity.description.getValue(),
            position: entity.position.getValue()
          });
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Drag marker logic (only for Tbilisi)
    let draggingEntity = null;
    handler.setInputAction((movement) => {
      const picked = v.scene.pick(movement.position);
      if (Cesium.defined(picked) && picked.id && picked.id.properties && picked.id.properties.draggable && picked.id.properties.draggable.getValue()) {
        draggingEntity = picked.id;
        v.scene.screenSpaceCameraController.enableRotate = false;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction((movement) => {
      if (draggingEntity) {
        const cartesian = v.camera.pickEllipsoid(movement.endPosition, v.scene.globe.ellipsoid);
        if (cartesian) {
          draggingEntity.position = cartesian;
          const carto = Cesium.Cartographic.fromCartesian(cartesian);
          const lat = Cesium.CesiumMath.toDegrees(carto.latitude);
          const lng = Cesium.CesiumMath.toDegrees(carto.longitude);
          draggingEntity.description = `<div><b>${draggingEntity.label.text.getValue()}</b><br/>New position:<br/>${lat.toFixed(5)}, ${lng.toFixed(5)}</div>`;
          setPopup({
            show: true,
            html: draggingEntity.description,
            position: cartesian
          });
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(() => {
      draggingEntity = null;
      v.scene.screenSpaceCameraController.enableRotate = true;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    setViewer(v);

    // Clean up
    return () => {
      v.destroy();
    };
    // eslint-disable-next-line
  }, []);

  // Locate Me button handler
  const handleLocate = () => {
    if (!viewer || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = [pos.coords.longitude, pos.coords.latitude];
      if (userEntity) viewer.entities.remove(userEntity);
      const entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(coords[0], coords[1], 0),
        billboard: {
          image: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
          scale: 0.08,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
        description: 'თქვენი მდებარეობა'
      });
      setUserEntity(entity);
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(coords[0], coords[1], 2000),
        duration: 1.5,
      });
      setPopup({
        show: true,
        html: entity.description,
        position: entity.position.getValue()
      });
    });
  };

  // Address search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim() || !viewer) return;
    // Nominatim API
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const data = await res.json();
    if (data && data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const coords = [parseFloat(lon), parseFloat(lat)];
      if (searchEntity) viewer.entities.remove(searchEntity);
      const entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(coords[0], coords[1], 0),
        billboard: {
          image: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
          scale: 0.08,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
        description: `<div><b>${display_name}</b></div>`
      });
      setSearchEntity(entity);
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(coords[0], coords[1], 2000),
        duration: 1.5,
      });
      setPopup({
        show: true,
        html: entity.description,
        position: entity.position.getValue()
      });
    } else {
      setPopup({ show: true, html: '<div>Address not found</div>', position: null });
    }
  };

  // Popup overlay
  const renderPopup = () => {
    if (!popup.show || !popup.position || !viewer) return null;
    const cartesian2d = viewer.scene.cartesianToCanvasCoordinates(popup.position);
    if (!cartesian2d) return null;
    return (
      <div
        style={{
          position: 'absolute',
          left: cartesian2d.x,
          top: cartesian2d.y,
          transform: 'translate(-50%, -100%)',
          background: 'white',
          padding: 8,
          borderRadius: 4,
          border: '1px solid #ccc',
          minWidth: 120,
          pointerEvents: 'auto',
          zIndex: 2000,
        }}
        dangerouslySetInnerHTML={{ __html: popup.html }}
      />
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 800 }}>
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
      {/* Locate Me Button */}
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
      {/* Layer switch info */}
      <div style={{ position: 'absolute', left: 10, top: 10, zIndex: 1000, background: '#fff8', padding: 4, borderRadius: 4, fontSize: 12 }}>
        <b>Layer switch:</b> 1 = Aerial, 2 = Road<br />
        <b>Click globe</b> to add marker
      </div>
      {/* Cesium container */}
      <div
        ref={cesiumContainer}
        style={{ width: '100%', height: 800, borderRadius: 8, boxShadow: '0 2px 8px #0001' }}
        tabIndex={0}
      />
      {/* Popup overlay */}
      {renderPopup()}
    </div>
  );
};

export default MapC;