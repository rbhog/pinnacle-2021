const axios = require('axios')
const fs = require('fs')
const path = require('path')

const Promise = require('bluebird')

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:<password>@cluster0.wfujl.mongodb.net/contact-tracing?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const base = "https://api.umd.io/v1"

const courses = {
    "CMSC": [
        131,
        132,
        216,
        250,
        351
    ],
    "HIST": [

    ],
    "ENGL": [

    ],
    "BMGT": [

    ],
    "STAT": [

    ],
    "ENEE": [

    ],
    "MATH": [

    ],
    "ENAE": [

    ],
    "ECON": [

    ]
}

// function getCourses(dept) {
//     return axios.get(base + "/courses?dept_id=" + dept).then(res => res.data)
// }

const depts = Object.keys(courses)



const populateCourse = (data) => {courseList.push(data)}

const getCourses = async function (dept) {
    let json = {}
    
};

    // let test = getCourses("CMSC")
    //     .then(res => {
    //         let json = {}
    //         json[res.course_id] = res.sections
    //         fs.writeFile('courses.json', JSON.stringify(json), err => console.log(err))
    //         console.log(res.course_id)
//     })
let json = {}

Promise.each(depts, dept => {
    let courseDept = {}
    return axios.get(base + "/courses?dept_id=" + dept) 
        .then(res => {
            let temp = {}
            res.data.forEach(course => {
                courseDept[course.course_id] = course.sections
                json[dept] = courseDept

            })
            return json
            
            
        })
})
.then(res => {
    // console.log(res)
    console.log(json)
    fs.writeFileSync(path.join(__dirname, 'courses.json'), JSON.stringify(json))
    // fs.writeFileSync('./courses.json', JSON.stringify(json))
})
// depts.forEach(dept => {
//     let courseDept = []
    
    
// })




