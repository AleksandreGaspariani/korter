import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Building2, Calendar, Users, Phone, Globe, Star, Search, X, Plus, Edit, Save, Eye, Navigation, Layers, Info, DollarSign, Clock, Camera, Tag, Trash2, CheckCircle } from 'lucide-react';

// Enhanced building data structure
const INITIAL_BUILDING_DATA = {
  "opera_theatre": {
    id: "opera_theatre",
    coordinates: [44.8015, 41.7016],
    title: "Tbilisi Opera and Ballet Theatre",
    category: "Cultural",
    description: "Historic opera house built in 1896, featuring neoclassical architecture and world-class performances.",
    price: "15-80 GEL",
    yearBuilt: 1896,
    architect: "Viktor Schröter",
    capacity: 1200,
    phone: "+995 32 299 33 95",
    website: "www.opera.ge",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop",
    features: ["Historic Architecture", "Concert Hall", "Ballet Stage", "Museum"],
    openingHours: "10:00 - 19:00",
    status: "Open",
    area: "5,200 m²",
    floors: 4,
    marked: true
  },
  "freedom_square": {
    id: "freedom_square", 
    coordinates: [44.8084, 41.6941],
    title: "Freedom Square",
    category: "Public Space",
    description: "Central square of Tbilisi, formerly known as Erivan Square and Lenin Square.",
    price: "Free",
    yearBuilt: 1801,
    phone: "N/A",
    website: "www.tbilisi.gov.ge",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    features: ["Monument", "Public Events", "Shopping", "Transport Hub"],
    openingHours: "24/7",
    area: "4,500 m²",
    status: "Public",
    marked: true
  }
};

const CATEGORIES = {
  "Cultural": { color: "#e91e63", icon: "🎭" },
  "Historical": { color: "#795548", icon: "🏛️" },
  "Government": { color: "#3f51b5", icon: "🏛️" },
  "Public Space": { color: "#4caf50", icon: "🏞️" },
  "Commercial": { color: "#ff9800", icon: "🏢" },
  "Residential": { color: "#2196f3", icon: "🏠" },
  "Religious": { color: "#9c27b0", icon: "⛪" },
  "Educational": { color: "#009688", icon: "🎓" },
  "Healthcare": { color: "#f44336", icon: "🏥" },
  "Entertainment": { color: "#ffeb3b", icon: "🎪" }
};

const MapB = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapboxgl, setMapboxgl] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [markedBuildings, setMarkedBuildings] = useState(INITIAL_BUILDING_DATA);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12');
  const [showControls, setShowControls] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [markingMode, setMarkingMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingMarker, setPendingMarker] = useState(null);
  const [newBuildingForm, setNewBuildingForm] = useState({
    title: '',
    description: '',
    category: 'Commercial',
    price: '',
    yearBuilt: '',
    architect: '',
    phone: '',
    website: '',
    image: '',
    features: '',
    openingHours: '',
    capacity: '',
    area: '',
    floors: '',
    status: 'Active'
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [markers, setMarkers] = useState({});

  // Mapbox access token - replace with your own
  const MAPBOX_TOKEN = 'pk.eyJ1IjoibjBoMG0wIiwiYSI6ImNtZTYxMWZtMjB5eHcya3M5NXkyeGdwbG0ifQ.KvmrNulPZMM0SfATZ_ZyUA';

  const mapStyles = [
    { id: 'mapbox://styles/mapbox/streets-v12', name: 'Streets', icon: '🗺️' },
    { id: 'mapbox://styles/mapbox/satellite-streets-v12', name: 'Satellite', icon: '🛰️' },
    { id: 'mapbox://styles/mapbox/dark-v11', name: 'Dark', icon: '🌙' },
    { id: 'mapbox://styles/mapbox/light-v11', name: 'Light', icon: '☀️' },
    { id: 'mapbox://styles/mapbox/outdoors-v12', name: 'Outdoors', icon: '🏔️' }
  ];

  // Load Mapbox GL dynamically
  useEffect(() => {
    const loadMapbox = async () => {
      try {
        // Load Mapbox GL from CDN
        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
        script.onload = () => {
          const link = document.createElement('link');
          link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
          link.rel = 'stylesheet';
          document.head.appendChild(link);
          
          window.mapboxgl.accessToken = MAPBOX_TOKEN;
          setMapboxgl(window.mapboxgl);
        };
        script.onerror = () => {
          setMapError('Failed to load Mapbox GL. Please check your internet connection.');
        };
        document.head.appendChild(script);
      } catch (error) {
        setMapError(`Error loading Mapbox: ${error.message}`);
      }
    };

    if (!window.mapboxgl) {
      loadMapbox();
    } else {
      window.mapboxgl.accessToken = MAPBOX_TOKEN;
      setMapboxgl(window.mapboxgl);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxgl) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [44.793, 41.715], // Tbilisi coordinates
        zoom: 13,
        pitch: 45,
        bearing: -17.6,
        antialias: true,
        attributionControl: false
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
      
      // Add geolocate control
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        }),
        'top-right'
      );

      // Handle map load
      map.current.on('load', () => {
        // Add 3D buildings layer
        const layers = map.current.getStyle().layers;
        const labelLayerId = layers.find(
          (layer) => layer.type === 'symbol' && layer.layout && layer.layout['text-field']
        )?.id;

        map.current.addLayer(
          {
            id: 'add-3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': '#aaa',
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
              'fill-extrusion-opacity': 0.6
            }
          },
          labelLayerId
        );

        setMapLoaded(true);
      });

      // Handle map clicks for marking buildings
      map.current.on('click', (e) => {
        if (markingMode) {
          const { lng, lat } = e.lngLat;
          setPendingMarker({ 
            coordinates: [lng, lat], 
            x: e.point.x, 
            y: e.point.y 
          });
          setShowAddModal(true);
        }
      });

      return () => {
        if (map.current) map.current.remove();
      };
    } catch (error) {
      setMapError(`Error initializing map: ${error.message}`);
    }
  }, [mapboxgl, mapStyle, markingMode]);

  // Update markers when buildings or filters change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    Object.values(markers).forEach(marker => marker.remove());
    setMarkers({});

    // Add new markers for filtered buildings
    const newMarkers = {};
    getFilteredBuildings().forEach(building => {
      const marker = addBuildingMarker(building);
      if (marker) {
        newMarkers[building.id] = marker;
      }
    });
    setMarkers(newMarkers);
  }, [markedBuildings, activeCategory, mapLoaded]);

  // Add a building marker to the map
  const addBuildingMarker = (building) => {
    if (!map.current || !mapboxgl) return null;

    // Create custom marker element
    const el = document.createElement('div');
    el.className = 'building-marker';
    el.innerHTML = `
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        transition: transform 0.2s;
        background-color: ${CATEGORIES[building.category]?.color || '#666'};
        color: white;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        ${CATEGORIES[building.category]?.icon || '🏢'}
      </div>
    `;

    // Add click handler
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      handleBuildingClick(building);
    });

    // Create and add marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat(building.coordinates)
      .addTo(map.current);

    return marker;
  };

  // Fly to building location
  const flyToBuilding = (building) => {
    if (map.current) {
      map.current.flyTo({
        center: building.coordinates,
        zoom: 16,
        pitch: 60,
        bearing: 0,
        essential: true
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search) return;
    
    const searchTerm = search.toLowerCase();
    const matchedBuilding = Object.values(markedBuildings).find(b => 
      b.title.toLowerCase().includes(searchTerm) ||
      b.category.toLowerCase().includes(searchTerm) ||
      b.description.toLowerCase().includes(searchTerm)
    );
    
    if (matchedBuilding) {
      setSelectedBuilding(matchedBuilding);
      flyToBuilding(matchedBuilding);
    }
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
  };

  const getFilteredBuildings = () => {
    const buildings = Object.values(markedBuildings).filter(b => b.marked);
    if (activeCategory === 'all') return buildings;
    return buildings.filter(b => b.category === activeCategory);
  };

  const handleMarkBuilding = () => {
    setMarkingMode(!markingMode);
    if (markingMode) {
      setPendingMarker(null);
      setShowAddModal(false);
    }
  };

  const handleAddBuilding = (e) => {
    e.preventDefault();
    if (!newBuildingForm.title || !pendingMarker) return;

    const newId = `building_${Date.now()}`;
    const newBuilding = {
      id: newId,
      coordinates: pendingMarker.coordinates,
      ...newBuildingForm,
      features: newBuildingForm.features.split(',').map(f => f.trim()).filter(f => f),
      marked: true,
      rating: 0
    };

    setMarkedBuildings(prev => ({
      ...prev,
      [newId]: newBuilding
    }));

    // Reset form
    setNewBuildingForm({
      title: '',
      description: '',
      category: 'Commercial',
      price: '',
      yearBuilt: '',
      architect: '',
      phone: '',
      website: '',
      image: '',
      features: '',
      openingHours: '',
      capacity: '',
      area: '',
      floors: '',
      status: 'Active'
    });

    setShowAddModal(false);
    setPendingMarker(null);
    setMarkingMode(false);
  };

  const handleEditSave = () => {
    if (selectedBuilding && editForm.title) {
      const updatedBuilding = {
        ...selectedBuilding,
        ...editForm,
        features: typeof editForm.features === 'string' 
          ? editForm.features.split(',').map(f => f.trim()).filter(f => f)
          : editForm.features
      };
      
      setMarkedBuildings(prev => ({
        ...prev,
        [selectedBuilding.id]: updatedBuilding
      }));
      setSelectedBuilding(updatedBuilding);
    }
    setEditMode(false);
  };

  const startEdit = () => {
    setEditForm({
      ...selectedBuilding,
      features: Array.isArray(selectedBuilding.features) 
        ? selectedBuilding.features.join(', ') 
        : selectedBuilding.features || ''
    });
    setEditMode(true);
  };

  const handleDeleteBuilding = (buildingId) => {
    const { [buildingId]: deleted, ...rest } = markedBuildings;
    setMarkedBuildings(rest);
    if (selectedBuilding?.id === buildingId) {
      setSelectedBuilding(null);
    }
  };

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
    flyToBuilding(building);
  };

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-red-600 p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold mb-2">Map Error</h3>
          <p>{mapError}</p>
          <p className="text-sm mt-2">Make sure you have a valid Mapbox access token</p>
        </div>
      </div>
    );
  }

  if (!mapboxgl) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading Map...</p>
        </div>
      </div>
    );
  }

  const filteredBuildings = getFilteredBuildings();

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      {/* Enhanced Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Building2 className="mr-2" />
              Tbilisi Buildings Manager
            </h1>
            <div className="text-sm text-gray-600">
              Mark, Edit & Explore Buildings - {filteredBuildings.length} buildings marked
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMarkBuilding}
              className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-all ${
                markingMode 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {markingMode ? (
                <>
                  <X size={16} className="mr-1" />
                  Cancel Marking
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-1" />
                  Mark Building
                </>
              )}
            </button>
            <button
              onClick={() => setShowControls(!showControls)}
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Layers size={16} />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              <Info size={16} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              placeholder="Search buildings by name, category, or description..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              onClick={handleSearch} 
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Marking Mode Overlay */}
      {markingMode && (
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-30 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <MapPin className="mr-2" size={20} />
          <span className="font-medium">Click anywhere on the map to mark a building</span>
        </div>
      )}

      {/* Controls Panel */}
      {showControls && (
        <div className="absolute top-32 left-4 z-20 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-semibold mb-3 flex items-center">
            <Layers className="mr-2" size={16} />
            Map Controls
          </h3>
          
          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Filter by Category:</label>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              <button
                onClick={() => handleCategoryFilter('all')}
                className={`w-full text-left px-3 py-1 rounded ${activeCategory === 'all' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                All Categories ({filteredBuildings.length})
              </button>
              {Object.entries(CATEGORIES).map(([cat, data]) => {
                const count = Object.values(markedBuildings).filter(b => b.marked && b.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryFilter(cat)}
                    className={`w-full text-left px-3 py-1 rounded flex items-center justify-between ${activeCategory === cat ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{data.icon}</span>
                      {cat}
                    </div>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map Style Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Map Style:</label>
            <div className="grid grid-cols-2 gap-1">
              {mapStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setMapStyle(style.id)}
                  className={`p-2 text-xs rounded flex items-center justify-center ${mapStyle === style.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <span className="mr-1">{style.icon}</span>
                  {style.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl z-20 overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Marked Buildings</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">{filteredBuildings.length} buildings found</p>
          </div>
          <div className="p-4 space-y-3">
            {filteredBuildings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building2 size={48} className="mx-auto mb-4 opacity-50" />
                <p>No buildings marked yet</p>
                <p className="text-sm">Click "Mark Building" to add your first building</p>
              </div>
            ) : (
              filteredBuildings.map(building => (
                <div
                  key={building.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleBuildingClick(building)}
                >
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      style={{ backgroundColor: CATEGORIES[building.category]?.color }}
                    >
                      {CATEGORIES[building.category]?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{building.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{building.category}</span>
                        {building.price && (
                          <span className="text-xs text-green-600 font-medium">{building.price}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{building.description}</p>
                      {building.rating > 0 && (
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          <span className="text-xs">{building.rating}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBuilding(building.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Building Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center">
                  <Plus className="mr-2" />
                  Add New Building
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setPendingMarker(null);
                    setMarkingMode(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddBuilding} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newBuildingForm.title}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={newBuildingForm.category}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.keys(CATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{CATEGORIES[cat].icon} {cat}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newBuildingForm.description}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="text"
                    value={newBuildingForm.price}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, price: e.target.value})}
                    placeholder="e.g., $500, 50-100 GEL, Free"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Year Built</label>
                  <input
                    type="number"
                    value={newBuildingForm.yearBuilt}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, yearBuilt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Architect</label>
                  <input
                    type="text"
                    value={newBuildingForm.architect}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, architect: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newBuildingForm.phone}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <input
                    type="url"
                    value={newBuildingForm.website}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, website: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Opening Hours</label>
                  <input
                    type="text"
                    value={newBuildingForm.openingHours}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, openingHours: e.target.value})}
                    placeholder="e.g., 9:00 - 17:00, 24/7"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Area</label>
                  <input
                    type="text"
                    value={newBuildingForm.area}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, area: e.target.value})}
                    placeholder="e.g., 1,500 m², 50 sqft"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Floors</label>
                  <input
                    type="number"
                    value={newBuildingForm.floors}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, floors: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Capacity</label>
                  <input
                    type="text"
                    value={newBuildingForm.capacity}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, capacity: e.target.value})}
                    placeholder="e.g., 500 people, 100 seats"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newBuildingForm.image}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Features</label>
                  <input
                    type="text"
                    value={newBuildingForm.features}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, features: e.target.value})}
                    placeholder="Separate with commas: WiFi, Parking, AC, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={newBuildingForm.status}
                    onChange={(e) => setNewBuildingForm({...newBuildingForm, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Closed">Closed</option>
                    <option value="Renovating">Renovating</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setPendingMarker(null);
                    setMarkingMode(false);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save size={16} className="mr-1" />
                  Add Building
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Building Details Modal */}
      {selectedBuilding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {selectedBuilding.image && (
                <img 
                  src={selectedBuilding.image} 
                  alt={selectedBuilding.title}
                  className="w-full h-64 object-cover rounded-t-xl"
                />
              )}
              <button
                onClick={() => setSelectedBuilding(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-4 left-4 flex space-x-2">
                {!editMode && (
                  <button
                    onClick={startEdit}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center text-sm hover:bg-blue-700 transition-colors"
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </button>
                )}
                <button
                  onClick={() => flyToBuilding(selectedBuilding)}
                  className="bg-green-600 text-white px-3 py-1 rounded-full flex items-center text-sm hover:bg-green-700 transition-colors"
                >
                  <Navigation size={14} className="mr-1" />
                  View on Map
                </button>
                <button
                  onClick={() => handleDeleteBuilding(selectedBuilding.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center text-sm hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>

            <div className="p-6">
              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full text-2xl font-bold border-b-2 border-gray-200 focus:border-blue-500 outline-none pb-2"
                        placeholder="Building Title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        value={editForm.category || ''}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.keys(CATEGORIES).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Price</label>
                      <input
                        type="text"
                        value={editForm.price || ''}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Year Built</label>
                      <input
                        type="number"
                        value={editForm.yearBuilt || ''}
                        onChange={(e) => setEditForm({ ...editForm, yearBuilt: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Architect</label>
                      <input
                        type="text"
                        value={editForm.architect || ''}
                        onChange={(e) => setEditForm({ ...editForm, architect: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        value={editForm.phone || ''}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Website</label>
                      <input
                        type="url"
                        value={editForm.website || ''}
                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Opening Hours</label>
                      <input
                        type="text"
                        value={editForm.openingHours || ''}
                        onChange={(e) => setEditForm({ ...editForm, openingHours: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Capacity</label>
                      <input
                        type="text"
                        value={editForm.capacity || ''}
                        onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Area</label>
                      <input
                        type="text"
                        value={editForm.area || ''}
                        onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Floors</label>
                      <input
                        type="number"
                        value={editForm.floors || ''}
                        onChange={(e) => setEditForm({ ...editForm, floors: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <input
                        type="url"
                        value={editForm.image || ''}
                        onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Features</label>
                      <input
                        type="text"
                        value={editForm.features || ''}
                        onChange={(e) => setEditForm({ ...editForm, features: e.target.value })}
                        placeholder="Separate with commas"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4 border-t">
                    <button
                      onClick={handleEditSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedBuilding.title}</h2>
                      <div className="flex items-center space-x-4 flex-wrap gap-2">
                        <span 
                          className="px-3 py-1 rounded-full text-sm font-medium text-white"
                          style={{ backgroundColor: CATEGORIES[selectedBuilding.category]?.color }}
                        >
                          {CATEGORIES[selectedBuilding.category]?.icon} {selectedBuilding.category}
                        </span>
                        {selectedBuilding.price && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            <DollarSign size={14} className="inline mr-1" />
                            {selectedBuilding.price}
                          </span>
                        )}
                        {selectedBuilding.status && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedBuilding.status === 'Active' ? 'bg-green-100 text-green-800' :
                            selectedBuilding.status === 'Under Construction' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            <CheckCircle size={14} className="inline mr-1" />
                            {selectedBuilding.status}
                          </span>
                        )}
                        {selectedBuilding.rating > 0 && (
                          <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{selectedBuilding.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">{selectedBuilding.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedBuilding.yearBuilt && (
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500">Year Built</div>
                          <div className="font-medium">{selectedBuilding.yearBuilt}</div>
                        </div>
                      </div>
                    )}

                    {selectedBuilding.architect && (
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500">Architect</div>
                          <div className="font-medium">{selectedBuilding.architect}</div>
                        </div>
                      </div>
                    )}

                    {selectedBuilding.capacity && (
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500">Capacity</div>
                          <div className="font-medium">{selectedBuilding.capacity}</div>
                        </div>
                      </div>
                    )}

                    {selectedBuilding.area && (
                      <div className="flex items-center">
                        <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500">Area</div>
                          <div className="font-medium">{selectedBuilding.area}</div>
                        </div>
                      </div>
                    )}

                    {selectedBuilding.floors && (
                      <div className="flex items-center">
                        <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500">Floors</div>
                          <div className="font-medium">{selectedBuilding.floors}</div>
                        </div>
                      </div>
                    )}

                    {selectedBuilding.phone && selectedBuilding.phone !== 'N/A' && (
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500">Phone</div>
                          <div className="font-medium">{selectedBuilding.phone}</div>
                        </div>
                      </div>
                    )}

                    {selectedBuilding.website && (
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500">Website</div>
                          <div className="font-medium text-blue-600 hover:underline cursor-pointer">{selectedBuilding.website}</div>
                        </div>
                      </div>
                    )}

                    {selectedBuilding.openingHours && (
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500">Opening Hours</div>
                          <div className="font-medium">{selectedBuilding.openingHours}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedBuilding.features && selectedBuilding.features.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Tag className="mr-2" size={16} />
                        Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedBuilding.features.map((feature, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className={`w-full h-full bg-gray-200 ${markingMode ? 'cursor-crosshair' : 'cursor-grab'}`}
        style={{
          background: `linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%), 
                       linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px'
        }}
      />
    </div>
  );
};

export default MapB;