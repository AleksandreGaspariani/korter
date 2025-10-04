"use client"

import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { FiCheck } from "react-icons/fi"

// Set your Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoibjBoMG0wIiwiYSI6ImNtZTYxMWZtMjB5eHcya3M5NXkyeGdwbG0ifQ.KvmrNulPZMM0SfATZ_ZyUA"

const TBILISI_COORDS = [44.793, 41.715]

const MapB2BuildingClick = ({ onBuildingSelect }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [mapError, setMapError] = useState(null)
  const [search, setSearch] = useState("")
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedBuildingIds, setSelectedBuildingIds] = useState([])
  const [hoveredBuildingId, setHoveredBuildingId] = useState(null)
  const selectedBuildingRef = useRef(null)
  const buildingMarkersRef = useRef([])
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!mapboxgl.accessToken || mapboxgl.accessToken === "YOUR_MAPBOX_ACCESS_TOKEN") {
      setMapError("Invalid or missing Mapbox access token.")
      return
    }

    if (!mapContainer.current) {
      setMapError("Map container not found.")
      return
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/standard",
        center: TBILISI_COORDS,
        zoom: 16,
        pitch: 45,
        bearing: 0,
        antialias: true,
      })

      map.current.addControl(new mapboxgl.NavigationControl())

      map.current.on("error", (e) => {
        setMapError(`Map error: ${e.error.message}`)
      })

      map.current.on("load", () => {
        // Enable 3D buildings
        map.current.setConfigProperty("basemap", "show3dObjects", true)
        // Set highlight/select colors
        map.current.setConfigProperty("basemap", "colorBuildingHighlight", "#ff6600")
        map.current.setConfigProperty("basemap", "colorBuildingSelect", "#2196f3")

        // Add Interactions API for buildings
        map.current.addInteraction("building-mouseenter", {
          type: "mouseenter",
          target: { featuresetId: "buildings", importId: "basemap" },
          handler: ({ feature }) => {
            map.current.setFeatureState(feature, { highlight: true })
            map.current.getCanvas().style.cursor = "pointer"
          },
        })

        map.current.addInteraction("building-mouseleave", {
          type: "mouseleave",
          target: { featuresetId: "buildings", importId: "basemap" },
          handler: ({ feature }) => {
            map.current.setFeatureState(feature, { highlight: false })
            map.current.getCanvas().style.cursor = ""
          },
        })

        map.current.addInteraction("building-click", {
          type: "click",
          target: { featuresetId: "buildings", importId: "basemap" },
          handler: ({ feature }) => {
            // Deselect previous
            if (selectedBuildingRef.current) {
              map.current.setFeatureState(selectedBuildingRef.current, { select: false })
            }
            // Select new
            map.current.setFeatureState(feature, { select: true })
            selectedBuildingRef.current = feature

            // Only store the last clicked building id
            setSelectedBuildingIds([feature.id])

            // Calculate centroid of the building polygon
            let coords = []
            if (feature.geometry.type === "Polygon") {
              coords = feature.geometry.coordinates[0]
            } else if (feature.geometry.type === "MultiPolygon") {
              coords = feature.geometry.coordinates[0][0]
            }
            let centroid = [0, 0]
            if (coords.length > 0) {
              let lngSum = 0, latSum = 0
              coords.forEach(([lng, lat]) => {
                lngSum += lng
                latSum += lat
              })
              centroid = [lngSum / coords.length, latSum / coords.length]
            }

            // Only send the last clicked building id and centroid
            if (typeof onBuildingSelect === "function") {
              onBuildingSelect({
                building_id_mapbox: feature.id,
                longitude: centroid[0],
                latitude: centroid[1],
              })
            }
          },
        })

        setMapLoaded(true)
      })

      // Handle zoom to toggle 3D buildings
      map.current.on("zoom", () => {
        const zoom = map.current.getZoom()
        map.current.setConfigProperty("basemap", "show3dObjects", zoom >= 15)
      })
    } catch (error) {
      setMapError(`Error initializing map: ${error.message}`)
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!map.current || !mapContainer.current) return

    const resizeObserver = new ResizeObserver(() => {
      // Small delay to ensure the container has finished resizing
      setTimeout(() => {
        if (map.current) {
          map.current.resize()
        }
      }, 100)
    })

    resizeObserver.observe(mapContainer.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [mapLoaded])

  const handleSearch = async () => {
    if (!search) return
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          search,
        )}.json?access_token=${mapboxgl.accessToken}&language=ka&country=GE&proximity=44.793,41.715`,
      )
      const data = await res.json()
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        map.current.flyTo({ center: [lng, lat], zoom: 16 })
      }
    } catch (err) {
      console.error("Search failed:", err)
    }
  }

  // Debounced search on input change
  useEffect(() => {
    if (!search) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      handleSearch()
    }, 500) // 500ms debounce
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search])

  // Add marker to selected building and show it when zoomed out
  useEffect(() => {
    if (!map.current || !mapLoaded) return
    buildingMarkersRef.current.forEach((marker) => marker.remove())
    buildingMarkersRef.current = []

    if (selectedBuildingRef.current && selectedBuildingIds.length > 0) {
      let coordinates
      const feature = selectedBuildingRef.current
      if (feature.geometry.type === "Polygon") {
        coordinates = feature.geometry.coordinates[0][0]
      } else if (feature.geometry.type === "MultiPolygon") {
        coordinates = feature.geometry.coordinates[0][0][0]
      }
      if (coordinates && map.current.getZoom() < 15) {
        // Prepare popup content (customize as needed)
        const popupContent = `
          <div style="min-width:180px">
            <h3 style="margin:0 0 4px 0;">Building Info</h3>
            <div><strong>ID:</strong> ${feature.id}</div>
            <div><strong>Type:</strong> ${feature.geometry.type}</div>
            <div><strong>Coordinates:</strong> ${coordinates.join(", ")}</div>
          </div>
        `
        const marker = new mapboxgl.Marker({ color: "#2196f3" })
          .setLngLat(coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
          .addTo(map.current)
        buildingMarkersRef.current.push(marker)
      }
    }

    return () => {
      buildingMarkersRef.current.forEach((marker) => marker.remove())
      buildingMarkersRef.current = []
    }
  }, [selectedBuildingIds, mapLoaded])

  // Listen for zoom changes to update markers visibility
  useEffect(() => {
    if (!map.current || !mapLoaded) return
    const handleZoom = () => {
      // Force update by resetting selectedBuildingIds (triggers marker effect)
      setSelectedBuildingIds((ids) => [...ids])
    }
    map.current.on("zoom", handleZoom)
    return () => {
      if (map.current) map.current.off("zoom", handleZoom)
    }
  }, [mapLoaded])

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Search Bar */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 2,
          background: "rgba(255,255,255,0.95)",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          gap: "8px",
        }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a place in Georgia..."
          style={{
            padding: "6px 12px",
            width: "200px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        />
        <button
          type="button"
          style={{
            padding: "6px 16px",
            background: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Selection Info */}
      {selectedBuildingIds.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            zIndex: 2,
            background: "rgba(33, 150, 243, 0.95)",
            color: "white",
            padding: "10px 16px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          <FiCheck style={{ display: "inline", marginRight: "6px" }} />
          {selectedBuildingIds.length} building{selectedBuildingIds.length !== 1 ? "s" : ""} selected
        </div>
      )}

      {/* Hover Info */}
      {hoveredBuildingId && !selectedBuildingIds.includes(hoveredBuildingId) && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 10,
            zIndex: 2,
            background: "rgba(255, 255, 255, 0.95)",
            padding: "8px 12px",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            fontSize: "12px",
            color: "#666",
          }}
        >
          Building ID: {hoveredBuildingId}
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {/* Error display */}
      {mapError && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(244, 67, 54, 0.95)",
            color: "white",
            padding: "10px 16px",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 10,
            maxWidth: "80%",
            fontSize: "14px",
          }}
        >
          {mapError}
        </div>
      )}
    </div>
  )
}

export default MapB2BuildingClick
