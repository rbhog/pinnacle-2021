const axios = require('axios')
const fs = require('fs')
const path = require('path')

const Promise = require('bluebird')

const base = "https://api.umd.io/v1"



const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'courses.json')))

const depts = Object.keys(raw)


let master = []


depts.forEach(dept => {
    for (let cls of Object.keys(raw[dept])) {
        for (section of Object.values(raw[dept][cls])) {
            if (typeof section == "string") {
                master.push(section)
            }
        }
        // master.concat(raw[depts][cls])
    }
    
    
    // courseList.forEach(course => {
    //     console.log(course)
    // })
   
})

console.log(master)

