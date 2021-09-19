import React, { useState, useEffect, useCallback } from "react"
import randomColor from "randomcolor"
import Promise from "bluebird"

import Map from "./components/Map"
import Sidebar from "./components/Sidebar"

import AppContext from "./context/AppContext"

import styles from "./styles.scss"

const App = () => {
  const [paths, setPaths] = useState([])
  const [timer, setTimer] = useState(false)

  const [time, setTime] = useState(-1)
  const [timeScalar, setTimeScalar] = useState(1)
  const [startTime, setStartTime] = useState(-1)
  const [endTime, setEndTime] = useState(-1)

  const [map, setMap] = useState(null)

  const startTimer = useCallback(() => {
    if (time >= endTime) return

    setTimer(true)
  }, [time, endTime])

  const stopTimer = useCallback(() => {
    setTimer(false)
  }, [])

  // TODO: Update startTime & endTime on path state update
  useEffect(() => {
    fetch("/paths")
      .then((res) => {let r=res.json();console.log(r);return r})
      .then((paths) => {
        Promise.map(paths, (path) => {
          return fetch(`/paths/${path}`).then((res) => res.json())
        }).then((paths) => {
          let min = paths[0].properties.TIME_START
          let max = paths[0].properties.TIME_END

          paths.slice(1).forEach((path) => {
            if (path.properties.TIME_START < min)
              min = path.properties.TIME_START
            if (path.properties.TIME_END > max) max = path.properties.TIME_END
          })

          paths = paths.map((path) => {
            if (!path.properties.COLOR)
              path.properties.COLOR = randomColor({
                luminosity: "bright",
                hue: "random",
              })

            return path
          })

          setPaths(
            paths
              .sort((a, b) =>
                a.properties.NAME.localeCompare(b.properties.NAME)
              )
              .map((path) => {
                return {
                  enabled: true,
                  data: path,
                }
              })
          )

          setStartTime(min)
          setEndTime(max)

          setTime(min)
        })
      })
  }, [])

  useEffect(() => {
    if (time >= endTime) stopTimer()
  }, [time, endTime, stopTimer])

  useEffect(() => {
    if (!timer) return

    const action = () => {
      setTime((time) => time + 10 * timeScalar)
    }

    action()
    const t = setInterval(action, 100)

    return () => clearInterval(t)
  }, [timer, timeScalar])

 

  if (!paths.length) return null

  return (
    <AppContext.Provider
      value={{
        paths,
        setPaths,

        time,
        setTime,

        timeScalar,
        setTimeScalar,

        startTime,
        endTime,

        timer,
        startTimer,
        stopTimer,

        map,
        setMap,
      }}
    >
      <div>
        <nav className={styles.nav}>
          <h1>Covid Contact Tracing (UMD)</h1>
        </nav>

        <div className={styles.content}>
          <Map className={styles.map} />

          <Sidebar />
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default App
