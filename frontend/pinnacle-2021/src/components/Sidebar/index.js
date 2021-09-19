import React, { useState, useEffect, useContext, useMemo } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

import styles from "./Sidebar.module.scss"

import AppContext from "../../context/AppContext"

const Sidebar = () => {
  const [open, setOpen] = useState(false)

  const { paths, setPaths, setTime, map } = useContext(AppContext)

  // Necessary to trigger inital animation & avoid mapbox not resizing
  useEffect(() => {
    setOpen(true)
  }, [])

  return useMemo(() => (
    <div
      className={styles.sidebar}
      style={{
        width: open ? "250px" : 0,
      }}
    >
      <div className={styles.tab} onClick={() => setOpen(!open)}>
        {open ? <FaChevronRight /> : <FaChevronLeft />}
      </div>

      <div className={styles.content}>
        <h2>SUBJECTS</h2>

        {paths.map(({ enabled, data }, i) => {
          return (
            <span className={styles.entry} key={i}>
              <div
                className={styles.color}
                style={{ backgroundColor: data.properties.COLOR }}
              />

              <p
                title={data.properties.NAME}
                onClick={() => {
                  setTime(data.properties.TIME_START)

                  map.flyTo({
                    center: data.geometry.coordinates[0],
                    zoom: 18,

                    speed: 2,
                    curve: 1,

                    essential: true,
                  })
                }}
              >
                {data.properties.NAME.length > 16
                  ? data.properties.NAME.slice(0, 14) + "..."
                  : data.properties.NAME}
              </p>

              <div
                className={styles.tick}
                onClick={() => {
                  paths[i].enabled = !enabled
                  setPaths([...paths])
                }}
                style={{
                  backgroundColor: enabled ? "red" : "#656565",
                }}
              ></div>
            </span>
          )
        })}
      </div>
    </div>
  ), [open, setOpen, paths, setPaths, setTime, map])
}

export default Sidebar
