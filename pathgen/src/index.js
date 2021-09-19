const dotenv = require("dotenv");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

dotenv.config();

console.log(process.env.MAPBOX_ACCESS_TOKEN);


var base = "https://api.mapbox.com/directions/v5/mapbox/walking/";

var schedules = JSON.parse(fs.readFileSync(path.join(__dirname, "schedules_combined.json")))

async function getRoute(waypoints) {
    points = ""

    waypoints.forEach((waypoint) => {
        points += `${waypoint[0]},${waypoint[1]};`
    })

    points = points.substring(0, points.length - 1)
    console.log(points)

    const req = await axios.get(`${base}${points}?geometries=geojson&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`)

    console.log(req)

    return {
        "type": "Feature",
	    "geometry": {
    	    "type": "LineString",
        	"coordinates": req.data.routes[0].geometry.coordinates
        }
    }

}


let routes = []
let path_index = 1
async function getAll() {
    for(let i = 0; i <schedules.length;i++) {
        let schedule = schedules[i];
let route = []
        for (day in schedule) {
            schedule[day].forEach(cls => {
                console.log(cls)
                route.push([cls.coords[1], cls.coords[0]])
            })
        }

        let pth = await getRoute(route)

        console.log(pth)
        fs.writeFileSync(path.join(__dirname, `path${i}.geojson`), JSON.stringify({
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": pth
            }
        }))
        // routes.push({
        //     "type": "Feature",
        //     "geometry": {
        //         "type": "LineString",
        //         "coordinates": pth
        //     }
        // })

    }

}

getAll().then(res => {
    // fs.writeFileSync(path.join(__dirname, "paths.json"), JSON.stringify(routes))
})

// getRoute([[-84.518641, 39.134270], [-84.512023, 39.102779]]).then((res) => {
//     console.log(res)
// })
