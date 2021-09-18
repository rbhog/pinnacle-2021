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
    }  
})

let sectionStrings = []
let i,j,temp,chunk = 100;
for (i = 0, j = master.length; i < j; i += chunk) {
    sectionStrings.push(master.slice(i, i+ chunk))
}

let newStrings = []

sectionStrings.forEach(str => {
    newStrings.push(str.join(","))
})
console.log(newStrings)


// function wait(ms, value) {
//     return new Promise(resolve => setTimeout(resolve, ms, value));
// }

// Promise.map(master, async section => {
//     await axios.get(`${base}/courses/sections/${section}`)
//         .then(async res => wait(1000, res))
//         .then(res => {
//             console.log(res.data)
//         })
// }, {concurrency: 2})



