const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config()

console.log(process.env.MAPBOX_ACCESS_TOKEN)


var base = "https://api.mapbox.com/directions/v5/mapbox/cycling/";

async function getRoute(waypoints) {
    points = ""

    waypoints.forEach((waypoint) => {
        points += `${waypoint[0]},${waypoint[1]};`
    })

    points = points.substring(0, points.length - 1)
    console.log(points)

    const req = await axios.get(`${base}${points}?geometries=geojson&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`)

    return {
        "type": "Feature",
	    "geometry": {
    	    "type": "LineString",
        	"coordinates": req.data.routes[0].geometry.coordinates
        }
    }

}


getRoute([[-84.518641, 39.134270], [-84.512023, 39.102779]]).then((res) => {
    console.log(res)
})
