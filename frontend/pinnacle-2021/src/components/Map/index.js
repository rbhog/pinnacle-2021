import ReactDOM from "react-dom"
import React, { useRef, useState, useEffect, useContext, useMemo } from "react"
import mapboxgl from "mapbox-gl"
import { featureCollection, circle, lineString } from "@turf/turf"
import {
  FaPlayCircle,
  FaPauseCircle,
  FaBackward,
  FaForward,
} from "react-icons/fa"



import AppContext from "../../context/AppContext"
import TimeBar from "../Slider"
import Popup from "../Popup"

import styles from "./Map.module.scss"

const SAFE_RADIUS = 0.04

mapboxgl.accessToken =
  "pk.eyJ1IjoicmJob2ciLCJhIjoiY2tieWE0N3ByMGFhMTJ5dDZldXA2b3E0bCJ9.9m48ruH9QzUOYpeISYI-lg"

const handleClick = (map, lngLat, data) => {
  let popup = document.createElement("div")
  ReactDOM.render(<Popup data={data} />, popup)

  new mapboxgl.Popup({
    maxWidth: "none",
  })
    .setLngLat(lngLat)
    .setDOMContent(popup)
    .addTo(map)
}

const handleMouse = (map, value) => {
  map.getCanvas().style.cursor = value
}

const Map = (props) => {
  const mapRef = useRef()

  // const [pathSpeeds, setPathSpeeds] = useState([])
  const [currentMap, setCurrentMap] = useState(null)
  const [mapState, setMapState] = useState({
    lat: 38.9901,
    lng: -76.9425,
    zoom: 14.71,
  })

  const {
    paths,
    time,
    timer,
    stopTimer,
    startTimer,
    timeScalar,
    setTimeScalar,

    map,
    setMap,
  } = useContext(AppContext)

  useEffect(() => {
    const myMap = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/dark-v10?optimize=true",
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,

      logoPosition: "top-right",

      attributionControl: false,
    })

    myMap.on("load", () => {
      setMap(myMap)
    })
  }, [])

  useEffect(() => {
    if (!map) return

    // map.addControl(new TooltipControl())
   
    map.on("move", () => {
      setMapState({
        lat: map.getCenter().lat.toFixed(4),
        lng: map.getCenter().lng.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      })
    })
  }, [map])

  useEffect(() => {
    if (!map) return

    paths.forEach(({ enabled, data }) => {
      const lineLayerName = "path_" + data.properties.NAME + "_line"
      const circleLayerName = "path_" + data.properties.NAME + "_circle"
      const lineLayer = map.getSource(lineLayerName)

      // If line layer exists already, show / hide
      if (lineLayer) {
        map.setLayoutProperty(
          lineLayerName,
          "visibility",
          enabled ? "visible" : "none"
        )

        return
      }

      map.on("mouseenter")

      map.on("click", lineLayerName, (e) => handleClick(map, e.lngLat, data))
      map.on("click", circleLayerName, (e) => handleClick(map, e.lngLat, data))

      map.on("mouseenter", lineLayerName, () => handleMouse(map, "pointer"))
      map.on("mouseenter", circleLayerName, () => handleMouse(map, "pointer"))

      map.on("mouseleave", lineLayerName, () => handleMouse(map, ""))
      map.on("mouseleave", circleLayerName, () => handleMouse(map, ""))

      // Add initial sources + layers
      // Initial source has empty featureCollection, since it'll be updated later
      map
        .addSource(lineLayerName, {
          type: "geojson",
          data: featureCollection([]),
        })
        .addSource(circleLayerName, {
          type: "geojson",
          data: featureCollection([]),
        })
        .addLayer({
          id: lineLayerName,
          type: "line",
          source: lineLayerName,
          paint: {
            "line-color": data.properties.COLOR,
            "line-opacity": 0.4,
            "line-width": 2,
          },
          layout: {
            "line-cap": "round",
            "line-join": "bevel",
          },
        })
        .addLayer({
          id: circleLayerName,
          type: "fill",
          source: circleLayerName,
          paint: {
            "fill-color": data.properties.COLOR,
            "fill-opacity": 0.2,
            "fill-outline-color": data.properties.COLOR,
          },
        })
    })
  }, [map, paths])

  useEffect(() => {
    if (!map) return


    paths.forEach(({ enabled, data }, i) => {
      let {
        NAME: name,
        TIME_START: start,
        TIME_END: end,
        TIME_STEP: step,
      } = data.properties

      const lineLayerName = "path_" + name + "_line"
      const circleLayerName = "path_" + name + "_circle"

      const endIndex = ~~((time - start) / step)
      const coords = [...data.geometry.coordinates].slice(0, endIndex + 1)

      const lastPoint = coords[endIndex]

      // Clear circles if not in time range / not enabled
      // Clear lines if there aren't >= 2 points

      if (!enabled || time < start || time > end)
        map.getSource(circleLayerName).setData(featureCollection([]))

      if (!enabled || time <= start) {
        map.getSource(lineLayerName).setData(featureCollection([]))
        return
      }

      // Add line if at least 2 points
      if (coords.length >= 2) {
        map.getSource(lineLayerName).setData(lineString(coords))

      }

      // Add circle & perform collision detection if in time range
      if (lastPoint) {
        map.getSource(circleLayerName).setData(
          featureCollection([
            circle(lastPoint, SAFE_RADIUS, {
              steps: 500,
              units: "kilometers",
            }),
          ])
        )

      }
    })

    // setPathSpeeds(speeds)
  }, [map, time, paths])

  return (
    <div {...props}>
      <span className={styles.mapInfo}>
        <p>Lat: {mapState.lat}</p>
        <p>Lng: {mapState.lng}</p>
        <p>Zoom: {mapState.zoom}</p>
        <p>Time: {new Date(time * 1000).toLocaleString("en-US")}</p>
        <p>Time Scalar: x{timeScalar.toFixed(2)}</p>
      </span>

      <div className={styles.map} ref={mapRef} />

      <div className={styles.footer}>
        {useMemo(
          () => (
            <FaBackward
              onClick={() => setTimeScalar((timeScalar) => timeScalar / 2)}
            />
          ),
          [setTimeScalar]
        )}

        {useMemo(() => {
          if (timer) return <FaPauseCircle onClick={stopTimer} />
          else return <FaPlayCircle onClick={startTimer} />
        }, [timer, stopTimer, startTimer])}

        {useMemo(
          () => (
            <FaForward
              onClick={() => setTimeScalar((timeScalar) => timeScalar * 2)}
            />
          ),
          [setTimeScalar]
        )}

        <TimeBar />
      </div>
    </div>
  )
}

export default Map
