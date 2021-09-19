import React, { useContext, useEffect, useState } from "react"
import { lineString, length } from "@turf/turf"
import $ from "jquery"

import "ion-rangeslider"
import "ion-rangeslider/css/ion.rangeSlider.min.css"

import styles from "./TimeBar.module.scss"

import AppContext from "../../context/AppContext"

const SAFE_RADIUS = 0.04
const SAFE_DIST = SAFE_RADIUS * 2

const TimeBar = () => {
  const { time, startTime, endTime, setTime, stopTimer, paths } = useContext(
    AppContext
  )

  const [slider, setSlider] = useState(null)

  const [ranges, setRanges] = useState([])
  useEffect(() => {
    if (slider || startTime === -1 || endTime === -1 || time === -1) return

    $(".js-range-slider").ionRangeSlider({
      skin: "flat",
      min: startTime,
      max: endTime,
      from: time,

      keyboard: false,
      grid: true,
      force_edges: true,

      prettify: (time) => {
        return new Date(time * 1000).toLocaleString("en-US")
      },

      onChange: (data) => {
        stopTimer()
        setTime(parseInt(data.input[0].value, 10))
      },
    })

    setSlider($(".js-range-slider").data("ionRangeSlider"))
  }, [stopTimer, setTime, startTime, endTime, time, slider])

  useEffect(() => {
    if (!slider || slider.dragging) return

    slider.update({
      from: time,
    })
  }, [slider, time])

  return (
    <div className={styles.container}>
      <input type="text" className="js-range-slider" name="timebar" />
    </div>
  )
}

export default TimeBar
