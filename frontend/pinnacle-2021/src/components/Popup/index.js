import React from "react"
import { length } from "@turf/turf"


const prettify = (time) => {
  return new Date(time * 1000).toLocaleString("en-US")
}

const Popup = ({ data }) => {
  const {
    NAME: name,LUID: luid,
    TIME_START: start,
    TIME_END: end,
    TIME_STEP: step,
  } = data.properties

  // Miles & mph cause we like america :>
  const dist = length(data, { length: "miles" })
  const speed = (dist / (end - start)) * 60 * 60

  return (
    <div >
      <h2>{name}</h2>

      <p>
        <b>Time Start:</b> {prettify(start)}
      </p>
      <p>
        <b>Time End:</b> {prettify(end)}
      </p>
      <p>
        <b>Time Interval:</b> {step.toFixed(4)} seconds
      </p>
      <p>
        <b>Total Distance:</b> {dist.toFixed(4)} miles
      </p>
      <p>
        <b>Average Speed:</b> {speed.toFixed(4)} mph
      </p>
    </div>
  )
}

export default Popup
