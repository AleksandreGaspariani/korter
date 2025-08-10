import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibjBoMG0wIiwiYSI6ImNtZTYxMWZtMjB5eHcya3M5NXkyeGdwbG0ifQ.KvmrNulPZMM0SfATZ_ZyUA';

const TBILISI_COORDS = [44.793, 41.715]; // Tbilisi, Georgia

const MapB = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapError, setMapError] = useState(null);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ visible: false, info: null, x: 0, y: 0 });
  const [markedBuildings, setMarkedBuildings] = useState([]); // [{id, coordinates, info}]
  const [hoveredBuildingInfo, setHoveredBuildingInfo] = useState(null);
  const [hoveredBuildingId, setHoveredBuildingId] = useState(null);
  const [isModalHovered, setIsModalHovered] = useState(false);
  const [addModal, setAddModal] = useState({ visible: false, id: null, coordinates: null, x: 0, y: 0 });
  const [addForm, setAddForm] = useState({ title: '', description: '', image: '' });

  useEffect(() => {
    // Check if the access token is set
    if (!mapboxgl.accessToken || mapboxgl.accessToken === 'YOUR_MAPBOX_ACCESS_TOKEN') {
      setMapError('Invalid or missing Mapbox access token. Please provide a valid token.');
      return;
    }

    // Check if the container exists
    if (!mapContainer.current) {
      setMapError('Map container not found.');
      return;
    }

    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: TBILISI_COORDS,
        zoom: 16,
        pitch: 60,
        bearing: -17.6,
        antialias: true
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl());

      // Handle map load errors
      map.current.on('error', (e) => {
        setMapError(`Map failed to load: ${e.error.message}`);
      });

      // Add 3D buildings layer after map loads
      map.current.on('load', () => {
        // Insert the layer beneath any symbol layer.
        const layers = map.current.getStyle().layers;
        let labelLayerId;
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
          }
        }

        // 3D buildings layer with dynamic color
        map.current.addLayer(
          {
            id: 'add-3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': [
                'case',
                ['boolean', ['feature-state', 'marked'], false], '#2196f3', // blue for marked
                ['boolean', ['feature-state', 'hover'], false], '#ff6600', // orange for hover
                '#aaa'
              ],
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.7
            }
          },
          labelLayerId
        );

        let hoveredId = null;

        map.current.on('mousemove', 'add-3d-buildings', (e) => {
          map.current.getCanvas().style.cursor = 'pointer';
          if (e.features.length > 0) {
            const feature = e.features[0];
            const id = feature.id;
            if (hoveredId !== null && !markedBuildings.some(b => b.id === hoveredId)) {
              map.current.setFeatureState(
                { source: 'composite', sourceLayer: 'building', id: hoveredId },
                { hover: false }
              );
            }
            hoveredId = id;
            setHoveredBuildingId(id);
            // Only set hover if not marked
            if (!markedBuildings.some(b => b.id === hoveredId)) {
              map.current.setFeatureState(
                { source: 'composite', sourceLayer: 'building', id: hoveredId },
                { hover: true }
              );
            }
            // Show info if marked and not already shown
            const marked = markedBuildings.find(b => b.id === id);
            if (marked && marked.info && !hoveredBuildingInfo) {
              setHoveredBuildingInfo({
                ...marked.info,
                id
              });
            }
          }
        });

        map.current.on('mouseleave', 'add-3d-buildings', () => {
          map.current.getCanvas().style.cursor = 'grab';
          if (hoveredId !== null && !markedBuildings.some(b => b.id === hoveredId)) {
            map.current.setFeatureState(
              { source: 'composite', sourceLayer: 'building', id: hoveredId },
              { hover: false }
            );
          }
          hoveredId = null;
          setHoveredBuildingId(null);
          // Only hide modal if not hovering modal itself
          setTimeout(() => {
            if (!isModalHovered) setHoveredBuildingInfo(null);
          }, 10);
        });

        // Mark building on CTRL+click and show add info modal
        map.current.on('click', 'add-3d-buildings', (e) => {
          if (e.originalEvent.ctrlKey && e.features.length > 0) {
            const feature = e.features[0];
            const id = feature.id;
            if (!markedBuildings.some(b => b.id === id)) {
              const coordinates = feature.geometry.type === 'Polygon'
                ? feature.geometry.coordinates[0][0]
                : feature.geometry.coordinates[0][0][0];
              setAddModal({
                visible: true,
                id,
                coordinates,
                x: e.originalEvent.clientX,
                y: e.originalEvent.clientY
              });
              setAddForm({ title: '', description: '', image: '' });
            }
          }
        });

        // Add a marker to a building (example: Tbilisi Opera and Ballet Theatre)
        const markerCoords = [44.8015, 41.7016];
        const marker = new mapboxgl.Marker()
          .setLngLat(markerCoords)
          .addTo(map.current);

        // Show modal with info on marker hover
        marker.getElement().addEventListener('mouseenter', (e) => {
          setModal({
            visible: true,
            info: {
              title: 'Tbilisi Opera and Ballet Theatre',
              description: 'A historic opera house in Tbilisi, Georgia.'
            },
            x: e.clientX,
            y: e.clientY
          });
        });
        marker.getElement().addEventListener('mouseleave', () => {
          setModal({ visible: false, info: null, x: 0, y: 0 });
        });

        map.current.resize();
      });

    } catch (error) {
      setMapError(`Error initializing map: ${error.message}`);
    }

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markedBuildings as dependency to update feature-state when it changes
  useEffect(() => {
    if (!map.current) return;
    // Clear all marked states first
    const source = 'composite';
    const sourceLayer = 'building';
    // Remove marked state from all buildings not in markedBuildings
    // (Optional: could be optimized)
    // Set marked state for all marked buildings
    markedBuildings.forEach(b => {
      map.current.setFeatureState(
        { source, sourceLayer, id: b.id },
        { marked: true, hover: false }
      );
    });
  }, [markedBuildings]);

  // Search handler using Mapbox Geocoding API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          search
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        map.current.flyTo({ center: [lng, lat], zoom: 16 });
      }
    } catch (err) {
      setMapError('Search failed.');
    }
  };

  // Handler for submitting the add info modal
  const handleAddModalSubmit = (e) => {
    e.preventDefault();
    if (!addForm.title || !addForm.description) return;
    setMarkedBuildings(prev => [
      ...prev,
      {
        id: addModal.id,
        coordinates: addModal.coordinates,
        info: { ...addForm }
      }
    ]);
    // Set feature-state for marked
    if (map.current) {
      map.current.setFeatureState(
        { source: 'composite', sourceLayer: 'building', id: addModal.id },
        { marked: true, hover: false }
      );
    }
    setAddModal({ visible: false, id: null, coordinates: null, x: 0, y: 0 });
    setAddForm({ title: '', description: '', image: '' });
  };

  const handleAddModalClose = () => {
    setAddModal({ visible: false, id: null, coordinates: null, x: 0, y: 0 });
    setAddForm({ title: '', description: '', image: '' });
  };

  // Ensure modal follows mouse for marked buildings
  useEffect(() => {
    if (!hoveredBuildingId) return;
    function handleMove(e) {
      const marked = markedBuildings.find(b => b.id === hoveredBuildingId);
      if (marked && marked.info) {
        setHoveredBuildingInfo({
          ...marked.info,
          x: e.clientX,
          y: e.clientY
        });
      }
    }
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [hoveredBuildingId, markedBuildings]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 2,
          background: 'rgba(255,255,255,0.9)',
          padding: 8,
          borderRadius: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for a place..."
          style={{ padding: 4, width: 180 }}
        />
        <button type="submit" style={{ marginLeft: 8, padding: '4px 10px' }}>
          Search
        </button>
      </form>
      {/* Modal for marker info */}
      {modal.visible && (
        <div
          style={{
            position: 'fixed',
            left: modal.x + 10,
            top: modal.y + 10,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: 12,
            zIndex: 10,
            minWidth: 200,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <strong>{modal.info.title}</strong>
          <div>{modal.info.description}</div>
          {modal.info.image && (
            <img src={modal.info.image} alt={modal.info.title} style={{ width: '100%', marginTop: 8, borderRadius: 4 }} />
          )}
        </div>
      )}
      {/* Modal for hovered building info, statically on the left */}
      {hoveredBuildingInfo && (
        <div
          style={{
            position: 'absolute',
            left: 10,
            top: 70,
            background: '#fff',
            border: '1px solid #2196f3',
            borderRadius: 6,
            padding: 12,
            zIndex: 20,
            minWidth: 220,
            maxWidth: 320,
            boxShadow: '0 2px 8px rgba(33,150,243,0.15)'
          }}
          onMouseEnter={() => setIsModalHovered(true)}
          onMouseLeave={() => {
            setIsModalHovered(false);
            // If mouse is not over building, hide modal
            if (!hoveredBuildingId) setHoveredBuildingInfo(null);
          }}
        >
          <strong>{hoveredBuildingInfo.title}</strong>
          <div>{hoveredBuildingInfo.description}</div>
          {hoveredBuildingInfo.image && (
            <img src={hoveredBuildingInfo.image} alt={hoveredBuildingInfo.title} style={{ width: '100%', marginTop: 8, borderRadius: 4 }} />
          )}
        </div>
      )}
      {/* Modal for adding building info */}
      {addModal.visible && (
        <div
          style={{
            position: 'fixed',
            left: addModal.x + 10,
            top: addModal.y + 10,
            background: '#fff',
            border: '2px solid #2196f3',
            borderRadius: 8,
            padding: 16,
            zIndex: 20,
            minWidth: 260,
            boxShadow: '0 4px 16px rgba(33,150,243,0.15)'
          }}
        >
          <form onSubmit={handleAddModalSubmit}>
            <div style={{ marginBottom: 8 }}>
              <label>
                <strong>Title:</strong>
                <input
                  type="text"
                  value={addForm.title}
                  onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
                  style={{ width: '100%', marginTop: 4 }}
                  required
                />
              </label>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>
                <strong>Description:</strong>
                <textarea
                  value={addForm.description}
                  onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                  style={{ width: '100%', marginTop: 4 }}
                  required
                />
              </label>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>
                <strong>Image URL:</strong>
                <input
                  type="text"
                  value={addForm.image}
                  onChange={e => setAddForm(f => ({ ...f, image: e.target.value }))}
                  style={{ width: '100%', marginTop: 4 }}
                  placeholder="https://example.com/image.jpg"
                />
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={handleAddModalClose} style={{ padding: '4px 12px' }}>
                Cancel
              </button>
              <button type="submit" style={{ padding: '4px 12px', background: '#2196f3', color: '#fff', border: 'none', borderRadius: 4 }}>
                Save
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Map container */}
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '500px', minHeight: '500px' }}
      />
      {/* Error display */}
      {mapError && (
        <div style={{ color: 'red', padding: '10px', position: 'absolute', bottom: 0, left: 0, zIndex: 2 }}>
          {mapError}
        </div>
      )}
    </div>
  );
};

export default MapB;