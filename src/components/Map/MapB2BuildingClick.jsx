import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef as useReactRef } from 'react';
import { FiCheck } from 'react-icons/fi';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibjBoMG0wIiwiYSI6ImNtZTYxMWZtMjB5eHcya3M5NXkyeGdwbG0ifQ.KvmrNulPZMM0SfATZ_ZyUA';

const TBILISI_COORDS = [44.793, 41.715]; // Tbilisi, Georgia

// Dummy buildings with specific ids
const DUMMY_BUILDINGS = [];

const MapB2BuildingClick = ({ onBuildingSelect }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapError, setMapError] = useState(null);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ visible: false, info: null, x: 0, y: 0 });
  const [markedBuildings, setMarkedBuildings] = useState(DUMMY_BUILDINGS); // [{id, coordinates, info}]
  const [hoveredBuildingInfo, setHoveredBuildingInfo] = useState(null);
  const [hoveredBuildingId, setHoveredBuildingId] = useState(null);
  const [isModalHovered, setIsModalHovered] = useState(false);
  const [addModal, setAddModal] = useState({ visible: false, id: null, coordinates: null, x: 0, y: 0 });
  const [addForm, setAddForm] = useState({ title: '', description: '', image: '' });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedBuildingIds, setSelectedBuildingIds] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false); // Add state for selection mode
  const markersRef = useReactRef([]); // To keep track of marker instances

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
        style: 'mapbox://styles/mapbox/streets-v11',
        center: TBILISI_COORDS,
        zoom: 16,
        pitch: 0, // 2D view
        bearing: 0,
        antialias: false
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
            paint: {
              'fill-extrusion-color': [
                'case',
                ['boolean', ['feature-state', 'selected'], false], '#2196f3', // blue for selected
                ['boolean', ['feature-state', 'marked'], false], '#2196f3', // blue for marked
                ['boolean', ['feature-state', 'hover'], false], '#ff6600', // orange for hover
                '#aaa'
              ],
              'fill-extrusion-height': [
                'interpolate', ['linear'], ['zoom'],
                15, 0,
                16, ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate', ['linear'], ['zoom'],
                15, 0,
                16, ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.7
            }
          },
          labelLayerId
        );

        // Update all event listeners to use 'add-3d-buildings' instead of 'add-2d-buildings'
        let hoveredId = null;

        map.current.on('mousemove', 'add-3d-buildings', (e) => {
          map.current.getCanvas().style.cursor = 'pointer';
          if (e.features.length > 0) {
            const feature = e.features[0];
            const id = feature.id;
            
            // Add validation for hoveredId before setting feature state
            if (hoveredId !== null && hoveredId !== undefined && hoveredId !== '' && 
                !markedBuildings.some(b => b.id === hoveredId)) {
              map.current.setFeatureState(
                { source: 'composite', sourceLayer: 'building', id: hoveredId },
                { hover: false }
              );
            }
            
            hoveredId = id;
            setHoveredBuildingId(id);
            
            // Only set hover if not marked and id is valid
            if (id !== undefined && id !== null && id !== '' && 
                !markedBuildings.some(b => b.id === hoveredId)) {
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
          // Add validation for hoveredId before setting feature state
          if (hoveredId !== null && hoveredId !== undefined && hoveredId !== '' && 
              !markedBuildings.some(b => b.id === hoveredId)) {
            map.current.setFeatureState(
              { source: 'composite', sourceLayer: 'building', id: hoveredId },
              { hover: false }
            );
          }
          hoveredId = null;
          setHoveredBuildingId(null);
          setTimeout(() => {
            if (!isModalHovered) setHoveredBuildingInfo(null);
          }, 10);
        });

        // Mark building on CTRL+click and show add info modal
        map.current.on('click', 'add-3d-buildings', (e) => {
          if (e.features.length > 0) {
            const feature = e.features[0];
            const id = feature.id;
            
            // Ensure id is valid
            if (id === undefined || id === null || id === '') {
              console.error("Invalid building id detected:", id);
              return;
            }
            
            // Get coordinates from the feature geometry
            let coordinates;
            if (feature.geometry.type === 'Polygon') {
              coordinates = feature.geometry.coordinates[0][0];
            } else if (feature.geometry.type === 'MultiPolygon') {
              coordinates = feature.geometry.coordinates[0][0][0];
            }
            
            // Handle selection with Ctrl+click for multi-select
            if (e.originalEvent.ctrlKey) {
              console.log('Ctrl+click - Multi-select mode');
              
              // Check if this building is already selected
              const isAlreadySelected = selectedBuildingIds.includes(id);
              let newSelectedIds;
              
              if (isAlreadySelected) {
                // If already selected, remove it from selection
                newSelectedIds = selectedBuildingIds.filter(buildingId => buildingId !== id);
                console.log(`Deselected building ${id}. Removed from array.`);
                
                // Immediately update the visual state
                map.current.setFeatureState(
                  { source: 'composite', sourceLayer: 'building', id },
                  { selected: false }
                );
              } else {
                // If not selected, add it to selection (keeping previous selections)
                newSelectedIds = [...selectedBuildingIds, id];
                console.log(`Selected building ${id}. Added to array.`);
                
                // Immediately update the visual state
                map.current.setFeatureState(
                  { source: 'composite', sourceLayer: 'building', id },
                  { selected: true }
                );
              }
              
              // Update state with new selection
              setSelectedBuildingIds(newSelectedIds);
              console.log('New multi-selection array:', newSelectedIds);
              
              // Call callback with updated selection and coordinates
              if (typeof onBuildingSelect === 'function') {
                console.log('Returning to parent:', newSelectedIds, coordinates);
                onBuildingSelect(newSelectedIds, coordinates);
              }
            } else {
              // Regular click (without Ctrl) - replace selection
              console.log('Regular click - Single selection mode');
              
              // Check if this building is already selected
              const isAlreadySelected = selectedBuildingIds.includes(id);
              let newSelectedIds;
              
              if (isAlreadySelected && selectedBuildingIds.length === 1) {
                // If this is the only selected building, deselect it
                newSelectedIds = [];
                console.log(`Deselected building ${id}. Cleared selection.`);
                
                // Immediately update the visual state
                map.current.setFeatureState(
                  { source: 'composite', sourceLayer: 'building', id },
                  { selected: false }
                );
              } else {
                // Select only this building, clearing previous selections
                newSelectedIds = [id];
                console.log(`Selected building ${id}. Replaced selection.`);
                
                // Clear previous selections
                selectedBuildingIds.forEach(prevId => {
                  if (prevId !== id && prevId !== undefined && prevId !== null && prevId !== '') {
                    map.current.setFeatureState(
                      { source: 'composite', sourceLayer: 'building', id: prevId },
                      { selected: false }
                    );
                  }
                });
                
                // Immediately update the visual state for the new selection
                map.current.setFeatureState(
                  { source: 'composite', sourceLayer: 'building', id },
                  { selected: true }
                );
              }
              
              // Update state with new selection
              setSelectedBuildingIds(newSelectedIds);
              console.log('New single selection array:', newSelectedIds);
              
              // Call callback with updated selection and coordinates
              if (typeof onBuildingSelect === 'function') {
                console.log('Returning to parent:', newSelectedIds, coordinates);
                onBuildingSelect(newSelectedIds, coordinates);
              }
            }
            
            // Show info modal for marked building on click
            const marked = markedBuildings.find(b => b.id === id);
            if (marked && marked.info) {
              setModal({
                visible: true,
                info: marked.info,
                x: e.originalEvent.clientX,
                y: e.originalEvent.clientY
              });
            }
           
          }
        });

        // Add a marker to a building (example: Tbilisi Opera and Ballet Theatre)
        // const markerCoords = [44.8015, 41.7016];
        // const marker = new mapboxgl.Marker()
        //   .setLngLat(markerCoords)
        //   .addTo(map.current);

        // // Show modal with info on marker hover
        // marker.getElement().addEventListener('mouseenter', (e) => {
        //   setModal({
        //     visible: true,
        //     info: {
        //       title: 'Tbilisi Opera and Ballet Theatre',
        //       description: 'A historic opera house in Tbilisi, Georgia.'
        //     },
        //     x: e.clientX,
        //     y: e.clientY
        //   });
        // });
        // marker.getElement().addEventListener('mouseleave', () => {
        //   setModal({ visible: false, info: null, x: 0, y: 0 });
        // });

        map.current.resize();
        setMapLoaded(true);
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
  
  // Only set feature state after map is loaded
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const source = 'composite';
    const sourceLayer = 'building';
    markedBuildings.forEach(b => {
      map.current.setFeatureState(
        { source, sourceLayer, id: b.id },
        { marked: true, hover: false }
      );
    });
  }, [markedBuildings, mapLoaded]);

  // Fix the useEffect to properly handle multiple building selections
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    console.log("Updating building selection states. Current selections:", selectedBuildingIds);
    
    const source = 'composite';
    const sourceLayer = 'building';
    
    // Get all possible building IDs that need state updates
    const allBuildingIds = [...new Set([
      ...markedBuildings.map(b => b.id), 
      ...selectedBuildingIds,
      // Also include buildings that were previously selected but might not be in the arrays anymore
      ...Array.from(document.querySelectorAll('[data-previously-selected="true"]'))
        .map(el => el.dataset.buildingId)
        .filter(Boolean)
    ])];
    
    // First, reset all buildings to unselected
    allBuildingIds.forEach(id => {
      try {
        // Only set feature state if id is valid
        if (id !== undefined && id !== null && id !== '') {
          map.current.setFeatureState(
            { source, sourceLayer, id },
            { selected: false }
          );
          console.log(`Reset selection state for building ${id}`);
        }
      } catch (err) {
        console.error(`Error resetting state for building ${id}:`, err);
      }
    });
    
    // Then set selected state for all currently selected buildings
    selectedBuildingIds.forEach(id => {
      try {
        // Only set feature state if id is valid
        if (id !== undefined && id !== null && id !== '') {
          map.current.setFeatureState(
            { source, sourceLayer, id },
            { selected: true }
          );
          // Track buildings that have been selected for future reference
          const el = document.createElement('div');
          el.style.display = 'none';
          el.dataset.previouslySelected = 'true';
          el.dataset.buildingId = id;
          document.body.appendChild(el);
          
          console.log(`Set selected=true for building ${id}`);
        }
      } catch (err) {
        console.error(`Error setting selected state for building ${id}:`, err);
      }
    });
    
    console.log("Building selection update complete");
  }, [selectedBuildingIds, markedBuildings, mapLoaded]);

  // Handler for the check button click
  const handleSelectionComplete = () => {
    console.log("Selection complete. Selected buildings:", selectedBuildingIds);
    if (typeof onBuildingSelect === 'function') {
      // Call the callback with final selection and null coordinates (we're not clicking on a building)
      onBuildingSelect(selectedBuildingIds, null);
    }
    setSelectionMode(false); // Exit selection mode if needed
  };

  // Update the click handler to support Ctrl+click for multi-selection
  // DELETE THIS DUPLICATE CLICK HANDLER - It's causing the error
  // map.current.on('click', 'add-3d-buildings', (e) => {
  //   if (e.features.length > 0) {
  //     const feature = e.features[0];
  //     const id = feature.id;
  //     // Get coordinates from the feature geometry
  //     let coordinates;
  //     if (feature.geometry.type === 'Polygon') {
  //       coordinates = feature.geometry.coordinates[0][0];
  //     } else if (feature.geometry.type === 'MultiPolygon') {
  //       coordinates = feature.geometry.coordinates[0][0][0];
  //     }
      
  //     // Handle selection (not Ctrl+click)
  //     if (!e.originalEvent.ctrlKey) {
  //       console.log('Before change - Selected buildings:', selectedBuildingIds);
        
  //       // Check if this building is already selected
  //       const isAlreadySelected = selectedBuildingIds.includes(id);
  //       let newSelectedIds;
        
  //       if (isAlreadySelected) {
  //         // If already selected, remove it from selection
  //         newSelectedIds = selectedBuildingIds.filter(buildingId => buildingId !== id);
  //         console.log(`Deselected building ${id}. Removed from array.`);
          
  //         // Immediately update the visual state
  //         map.current.setFeatureState(
  //           { source: 'composite', sourceLayer: 'building', id },
  //           { selected: false }
  //         );
  //       } else {
  //         // If not selected, add it to selection
  //         newSelectedIds = [...selectedBuildingIds, id];
  //         console.log(`Selected building ${id}. Added to array.`);
          
  //         // Immediately update the visual state
  //         map.current.setFeatureState(
  //           { source: 'composite', sourceLayer: 'building', id },
  //           { selected: true }
  //         );
  //       }
        
  //       // Update state with new selection
  //       setSelectedBuildingIds(newSelectedIds);
  //       console.log('New selection array:', newSelectedIds);
        
  //       // Call callback with updated selection and coordinates
  //       if (typeof onBuildingSelect === 'function') {
  //         console.log('Returning to parent:', newSelectedIds, coordinates);
  //         onBuildingSelect(newSelectedIds, coordinates);
  //       }
  //     }
      
  //     // Mark building on CTRL+click and show add info modal
  //     if (e.originalEvent.ctrlKey) {
  //       if (!markedBuildings.some(b => b.id === id)) {
  //         const coordinates = feature.geometry.type === 'Polygon'
  //           ? feature.geometry.coordinates[0][0]
  //           : feature.geometry.coordinates[0][0][0];
  //         setAddModal({
  //           visible: true,
  //           id,
  //           coordinates,
  //           x: e.originalEvent.clientX,
  //           y: e.originalEvent.clientY
  //         });
  //         setAddForm({ title: '', description: '', image: '' });
  //       }
  //     } else {
  //       // Show info modal for marked building on click
  //       const marked = markedBuildings.find(b => b.id === id);
  //       if (marked && marked.info) {
  //         setModal({
  //           visible: true,
  //           info: marked.info,
  //           x: e.originalEvent.clientX,
  //           y: e.originalEvent.clientY
  //         });
  //       }
  //     }
  //   }
  // });

  // Update handleSearch to not reload the page
  const handleSearch = async () => {
    if (!search) return;
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          search
        )}.json?access_token=${mapboxgl.accessToken}&language=ka`
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
    const buildingData = {
      id: addModal.id,
      coordinates: addModal.coordinates,
      info: { ...addForm }
    };
    // Log the building data being saved
    console.log('Saving building data:', buildingData);
    setMarkedBuildings(prev => [
      ...prev,
      buildingData
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

  // Add annotation markers for buildings with info
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove previous markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    markedBuildings.forEach(b => {
      if (!b.coordinates || !b.info) return;
      // Create a DOM element for the marker (could be customized)
      const el = document.createElement('div');
      el.style.background = '#2196f3';
      el.style.width = '18px';
      el.style.height = '18px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid #fff';
      el.style.boxShadow = '0 2px 6px rgba(33,150,243,0.3)';
      el.style.cursor = 'pointer';

      // Add a popup for annotation
      const popup = new mapboxgl.Popup({ offset: 18 })
        .setHTML(
          `<strong>${b.info.title}</strong><br/>${b.info.description}${
            b.info.image
              ? `<br/><img src="${b.info.image}" alt="" style="width:120px;margin-top:4px;border-radius:4px"/>`
              : ''
          }`
        );

      const marker = new mapboxgl.Marker(el)
        .setLngLat(b.coordinates)
        .setPopup(popup)
        .addTo(map.current);

      markersRef.current.push(marker);
    });

    // Cleanup on unmount or update
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [markedBuildings, mapLoaded]);

  // Close modal when clicking elsewhere on the map
  useEffect(() => {
    if (!map.current) return;
    const handleMapClick = () => {
      setModal({ visible: false, info: null, x: 0, y: 0 });
    };
    map.current.on('click', handleMapClick);
    return () => {
      if (map.current) map.current.off('click', handleMapClick);
    };
  }, [mapLoaded]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Search Bar */}
      <div
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
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <button
          type="button"
          style={{ marginLeft: 8, padding: '4px 10px' }}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {/* Modal for marker info or building info */}
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

      {/* Check button for selection completion */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          zIndex: 5,
        }}
      >
        <button
          onClick={handleSelectionComplete}
          style={{
            backgroundColor: selectedBuildingIds.length > 0 ? '#2196f3' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: selectedBuildingIds.length > 0 ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease'
          }}
          disabled={selectedBuildingIds.length === 0}
          title="Confirm selection"
        >
          <FiCheck size={24} />
        </button>
        <div style={{ 
          marginTop: 5,
          textAlign: 'center',
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: '2px 5px',
          borderRadius: 3,
          fontSize: 12
        }}>
          {selectedBuildingIds.length} selected
        </div>
      </div>

      {/* Error display */}
      {mapError && (
        <div style={{ color: 'red', padding: '10px', position: 'absolute', bottom: 0, left: 0, zIndex: 2 }}>
          {mapError}
        </div>
      )}
    </div>
  );
};

export default MapB2BuildingClick;