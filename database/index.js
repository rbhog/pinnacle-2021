const axios = require('axios')
const fs = require('fs')

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
let json = JSON.parse({})
depts.forEach(dept => {
    let courseDept = []
    axios.get(base + "/courses?dept_id=" + dept) 
        .then(res => {
            res.data.forEach(course => {
                courseDept[course.course_id] = course.sections
               
            })
            json.push({[dept]: courseDept})
            console.log(courseDept)
            console.log(JSON.stringify(json))
        })
})





