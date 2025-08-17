import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SearchBox } from '@mapbox/search-js-react';

// Helper to remove all markers
const removeAllMarkers = (markersArr) => {
  markersArr.forEach(marker => marker.remove());
};

function getPolygonCentroid(coords) {
  let area = 0, x = 0, y = 0;
  const points = coords[0];
  for (let i = 0, len = points.length - 1; i < len; i++) {
    const xi = points[i][0], yi = points[i][1];
    const xi1 = points[i + 1][0], yi1 = points[i + 1][1];
    const f = xi * yi1 - xi1 * yi;
    area += f;
    x += (xi + xi1) * f;
    y += (yi + yi1) * f;
  }
  area *= 0.5;
  x /= (6 * area);
  y /= (6 * area);
  return [x, y];
}

const MapboxExample = () => {
  const mapContainerRef = useRef();
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [markers, setMarkers] = useState([]);
  const [searchMarker, setSearchMarker] = useState(null); // marker for search result
  const [mapInstance, setMapInstance] = useState(null);
  const [directSearch, setDirectSearch] = useState('');
  const [searchError, setSearchError] = useState(null);

  // Load buildingInfo from localStorage if available
  const getInitialBuildingInfo = () => {
    const stored = localStorage.getItem('buildingInfo');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {
          'building_id_1': { name: 'Building One', description: 'Info about building one' },
        };
      }
    }
    return {
      'building_id_1': { name: 'Building One', description: 'Info about building one' },
    };
  };

  const [buildingInfo, setBuildingInfo] = useState(getInitialBuildingInfo);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibjBoMG0wIiwiYSI6ImNtZTYxMWZtMjB5eHcya3M5NXkyeGdwbG0ifQ.KvmrNulPZMM0SfATZ_ZyUA';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [44.7866, 41.7151], // Tbilisi coordinates
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      antialias: true
    });

    // Store map instance in state for other components to use
    setMapInstance(map);
    
    // Helper to remove all markers
    const removeAllMarkers = (markersArr) => {
      markersArr.forEach(marker => marker.remove());
    };

    // Add markers when style loads and zoom < 15
    const addMarkers = () => {
      const zoom = map.getZoom();
      if (zoom < 15) {
        const newMarkers = [];
        Object.entries(buildingInfo).forEach(([id, info]) => {
          const features = map.querySourceFeatures('composite', {
            sourceLayer: 'building',
            filter: ['==', 'id', id]
          });
          if (features.length > 0) {
            let coords;
            if (features[0].geometry.type === 'Polygon') {
              coords = getPolygonCentroid(features[0].geometry.coordinates);
            } else if (features[0].geometry.type === 'MultiPolygon') {
              coords = getPolygonCentroid(features[0].geometry.coordinates[0]);
            } else {
              coords = features[0].geometry.coordinates[0];
            }
            const marker = new mapboxgl.Marker({ color: '#2196f3' })
              .setLngLat(coords)
              .setPopup(
                new mapboxgl.Popup({ closeButton: true, anchor: 'bottom' })
                  .setHTML(`
                    <div style="min-width:220px;max-width:300px;">
                      ${info.image ? `<img src="${info.image}" alt="Building" style="width:100%;height:auto;border-radius:8px;margin-bottom:8px;" />` : ''}
                      <div style="font-weight:bold;font-size:1.1em;margin-bottom:4px;">${info.name}</div>
                      <div style="margin-bottom:4px;">${info.description}</div>
                    </div>
                  `)
              )
              .addTo(map);
            newMarkers.push(marker);
          }
        });
        setMarkers(newMarkers);
      }
    };

    map.on('style.load', () => {
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;

    map.setConfigProperty('basemap', 'lightPreset', 'dusk');

      map.addLayer(
        {
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 14, // allow transition to 2D below 15
          paint: {
            'fill-extrusion-color': [
              'case',
              ['boolean', ['feature-state', 'highlight'], false],
              '#ffeb3b',
              ['boolean', ['feature-state', 'select'], false],
              '#2196f3',
              '#aaa'
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14, 0,         // At zoom 14, height is 0 (2D)
              15.05, ['get', 'height'] // At zoom 15.05+, use actual height (3D)
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14, 0,
              15.05, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.7
          }
        },
        labelLayerId
      );

      // Highlight building on hover and show popup with title
      let hoveredId = null;
      let hoverPopup = null;
      map.on('mousemove', 'add-3d-buildings', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features.length > 0) {
          if (hoveredId !== null) {
            map.setFeatureState(
              { source: 'composite', sourceLayer: 'building', id: hoveredId },
              { highlight: false }
            );
            if (hoverPopup) {
              hoverPopup.remove();
              hoverPopup = null;
            }
          }
          hoveredId = e.features[0].id;
          map.setFeatureState(
            { source: 'composite', sourceLayer: 'building', id: hoveredId },
            { highlight: true }
          );
          // Show popup with title if info exists
          const info = buildingInfo[hoveredId];
          if (info && info.name) {
            hoverPopup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
              anchor: 'bottom'
            })
              .setLngLat(e.lngLat)
              .setHTML(`<div style="font-weight:bold;font-size:1.1em;">${info.name}</div>`)
              .addTo(map);
          }
        }
      });

      map.on('mouseleave', 'add-3d-buildings', () => {
        map.getCanvas().style.cursor = '';
        if (hoveredId !== null) {
          map.setFeatureState(
            { source: 'composite', sourceLayer: 'building', id: hoveredId },
            { highlight: false }
          );
        }
        hoveredId = null;
        if (hoverPopup) {
          hoverPopup.remove();
          hoverPopup = null;
        }
      });

      // Set select state for all buildings with info in localStorage
      Object.keys(buildingInfo).forEach((id) => {
        map.setFeatureState(
          { source: 'composite', sourceLayer: 'building', id },
          { select: true }
        );
      });

      // Add markers if zoom < 15 after style loads
      addMarkers();
    });

    // Only one click handler for buildings
    map.on('click', 'add-3d-buildings', (e) => {
      const feature = e.features[0];
      const buildingId = feature.id || feature.properties.id;

      if (buildingInfo[buildingId]) {
        map.setFeatureState(
          { source: 'composite', sourceLayer: 'building', id: buildingId },
          { select: true }
        );
        // Enhanced popup HTML
        const info = buildingInfo[buildingId];
        let popupHtml = `
          <div style="min-width:220px;max-width:300px;">
            ${info.image ? `<img src="${info.image}" alt="Building" style="width:100%;height:auto;border-radius:8px;margin-bottom:8px;" />` : ''}
            <div style="font-weight:bold;font-size:1.1em;margin-bottom:4px;">${info.name}</div>
            <div style="margin-bottom:4px;">${info.description}</div>
          </div>
        `;
        new mapboxgl.Popup({ closeButton: true, closeOnClick: true, anchor: 'bottom' })
          .setLngLat(e.lngLat)
          .setHTML(popupHtml)
          .addTo(map);
        setSelectedBuilding(null);
      } else {
        setSelectedBuilding({ id: buildingId, lngLat: e.lngLat });
      }
    });

    // Add zoom event to toggle buildings/markers
    map.on('zoom', () => {
      const zoom = map.getZoom();
      const buildingsLayer = map.getLayer('add-3d-buildings');
      if (zoom < 15) {
        if (buildingsLayer) map.setLayoutProperty('add-3d-buildings', 'visibility', 'visible');
        removeAllMarkers(markers);
        setMarkers([]);
        addMarkers();
      } else {
        if (buildingsLayer) map.setLayoutProperty('add-3d-buildings', 'visibility', 'visible');
        removeAllMarkers(markers);
        setMarkers([]);
      }
    });

    return () => {
      removeAllMarkers(markers);
      if (searchMarker) searchMarker.remove();
      map.remove();
    };
  }, [buildingInfo]);

  // Handler for search result - using useCallback to prevent unnecessary re-renders
  const handleSearchResult = useCallback((result) => {
    console.log("Search result received:", result); // Debug output
    if (!result || !result.features || result.features.length === 0) {
      console.log("No features found in result");
      return;
    }

    const feature = result.features[0];
    console.log("Selected feature:", feature); // Debug output
    
    // Ensure coordinates are in [lng, lat] array format
    let coords = feature.geometry.coordinates;
    if (Array.isArray(coords) && coords.length === 2) {
      console.log("Flying to coordinates:", coords); // Debug output
      
      // Use the stored map instance from state
      if (mapInstance) {
        mapInstance.flyTo({ center: coords, zoom: 16 });
        
        // Remove previous search marker
        if (searchMarker) {
          searchMarker.remove();
        }
        
        // Add new marker
        const marker = new mapboxgl.Marker({ color: '#e91e63' })
          .setLngLat(coords)
          .setPopup(
            new mapboxgl.Popup({ closeButton: true, anchor: 'bottom' })
              .setHTML(`<div style="font-weight:bold;">${feature.properties.name || feature.text}</div>`)
          )
          .addTo(mapInstance);
        setSearchMarker(marker);
        marker.togglePopup();
      } else {
        console.error("Map instance not available");
      }
    } else {
      console.error("Invalid coordinates in result:", coords);
    }
  }, [mapInstance, searchMarker]);

  // Handler for suggestions
  const handleSuggest = useCallback((suggestions) => {
    console.log("Received suggestions:", suggestions); // Debug output to see if suggestions are coming through
  }, []);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      // Convert image to base64 for storage
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData((prev) => ({ ...prev, image: ev.target.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedBuilding) {
      const newInfo = {
        ...buildingInfo,
        [selectedBuilding.id]: {
          name: formData.name,
          description: formData.description,
          image: formData.image
        }
      };
      setBuildingInfo(newInfo);
      localStorage.setItem('buildingInfo', JSON.stringify(newInfo));
      const map = mapboxgl.Map.prototype._instances?.[0];
      if (map && selectedBuilding.lngLat) {
        // Enhanced popup HTML
        let popupHtml = `
          <div style="min-width:220px;max-width:300px;">
            ${formData.image ? `<img src="${formData.image}" alt="Building" style="width:100%;height:auto;border-radius:8px;margin-bottom:8px;" />` : ''}
            <div style="font-weight:bold;font-size:1.1em;margin-bottom:4px;">${formData.name}</div>
            <div style="margin-bottom:4px;">${formData.description}</div>
          </div>
        `;
        new mapboxgl.Popup({ closeButton: true, closeOnClick: true, anchor: 'bottom' })
          .setLngLat(selectedBuilding.lngLat)
          .setHTML(popupHtml)
          .addTo(map);
        map.setFeatureState(
          { source: 'composite', sourceLayer: 'building', id: selectedBuilding.id },
          { select: true }
        );
      }
      setSelectedBuilding(null);
      setFormData({ name: '', description: '', image: '' });
    }
  };

  // Direct search handler using Mapbox Geocoding API (similar to MapB approach)
  const handleDirectSearch = async (e) => {
    e.preventDefault();
    if (!directSearch) return;
    
    try {
      setSearchError(null);
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(directSearch)}.json?access_token=${mapboxgl.accessToken}&language=ka&country=ge`
      );
      
      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Geocoding API response:", data);
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        console.log("Flying to:", [lng, lat]);
        
        if (mapInstance) {
          mapInstance.flyTo({ center: [lng, lat], zoom: 16 });
          
          // Remove previous search marker
          if (searchMarker) {
            searchMarker.remove();
          }
          
          // Add new marker
          const marker = new mapboxgl.Marker({ color: '#e91e63' })
            .setLngLat([lng, lat])
            .setPopup(
              new mapboxgl.Popup({ closeButton: true, anchor: 'bottom' })
                .setHTML(`<div style="font-weight:bold;">${data.features[0].place_name}</div>`)
            )
            .addTo(mapInstance);
          setSearchMarker(marker);
          marker.togglePopup();
        } else {
          console.error("Map instance not available");
        }
      } else {
        setSearchError("No results found for your search");
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchError("Search failed: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {/* Direct Search UI - Similar to MapB */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 20,
        background: 'white',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        padding: 8
      }}>
        <form onSubmit={handleDirectSearch}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="text"
              value={directSearch}
              onChange={e => setDirectSearch(e.target.value)}
              placeholder="Search location..."
              style={{ 
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginRight: '8px',
                width: '220px'
              }}
            />
            <button 
              type="submit"
              style={{ 
                padding: '8px 16px',
                borderRadius: '4px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </div>
          {searchError && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{searchError}</div>
          )}
        </form>
      </div>
      
      {/* Original SearchBox UI - moved to the right */}
      {/* <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 20,
        width: 320,
        background: 'white',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        padding: 8
      }}>
        <SearchBox
          accessToken="pk.eyJ1IjoibjBoMG0wIiwiYSI6ImNtZTYxMWZtMjB5eHcya3M5NXkyeGdwbG0ifQ.KvmrNulPZMM0SfATZ_ZyUA"
          onRetrieve={handleSearchResult}
          onSuggest={handleSuggest}
          options={{
            proximity: { longitude: 44.7866, latitude: 41.7151 },
            countries: ['ge'], // Note: should be lowercase 'ge' not 'GE'
            language: ['ka', 'en'],
            types: ['countries', 'region', 'district', 'postcode', 'locality', 'place', 'neighborhood', 'address', 'poi']
          }}
          value="" // Consider adding a controlled input if needed
          placeholder="ძებნა ქართულად ან ინგლისურად"
          mapboxSearchApiKey={mapboxgl.accessToken} // Use the same token
        />
      </div> */}
      <div ref={mapContainerRef} style={{ height: '100vh' }} />
      {selectedBuilding && (
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: 'white',
          padding: 16,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 10,
          minWidth: 260
        }}>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label>
                Name:
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  style={{ width: '100%', marginBottom: 8 }}
                />
              </label>
            </div>
            <div>
              <label>
                Description:
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  style={{ width: '100%', marginBottom: 8 }}
                />
              </label>
            </div>
            <div>
              <label>
                Image:
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFormChange}
                  style={{ width: '100%', marginBottom: 8 }}
                />
              </label>
            </div>
            <button type="submit" style={{ marginRight: 8 }}>Save Info</button>
            <button type="button" onClick={() => setSelectedBuilding(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MapboxExample;