const { default: axios } = require('axios');
const coursesFile = require('./courses.json')
const sectionsFile = require('./uniquesections.json')
const addresses = require('./addresses.json')
const fs = require("fs");
const path = require('path')

const { pathToFileURL } = require('url');

let depts = Object.keys(coursesFile)

const base = "https://api.umd.io/v1"

const phonenums = ["2402746024"]

const numToGen = 5;

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

let schedules = []

for (let i = 0; i < numToGen; i++) {
    let randomDepts = getRandom(depts, 4)
    let courses = [] // list of 4 random courses
    randomDepts.forEach(dept => {
        courses.push(Object.keys(coursesFile[dept])[Math.floor(Math.random() * Object.keys(coursesFile[dept]).length)])
    })

    let schedule = {
        "M" : [],
        "T" : [],
        "W" : [],
        "R" : [],
        "F" : []
    }


    courses.forEach(course => {
        let courseSection = coursesFile[course.substring(0,4)][course][0]
        if (coursesFile[course.substring(0,4)][course][0] == undefined) return
        let sectionData = sectionsFile.find(o => o.section_id === courseSection)
        console.log(sectionData)


        sectionData.meetings.forEach(meeting => {
            let days = []//meeting.days.split() // all days that the given time meets
            if(meeting.days.includes('M')){
                days.push('M');
            }if(meeting.days.includes('Tu')){
                days.push('T');
            }if(meeting.days.includes('W')){
                days.push('W');
            }if(meeting.days.includes('Th')){
                days.push('R');
            }if(meeting.days.includes('F')){
                days.push('F');
            }
            console.log(days)
            // days.forEach(day => {
            //     if(!schedule[day].includes(meeting.start_time())){
            //         schedule.day.push(meeting.start_time())
            //     }
            // })


            let dayIndex = 0
            // console.log(days[dayIndex])
            if (!days.some(day => {return !schedule[day].start_time == meeting.start_time})) {
                console.log("fits schedule")
                meeting["courseSection"] = courseSection
                meeting["coords"] = addresses[meeting.building]
                days.forEach(day => {
                    schedule[day].push(meeting)
                })
                // schedule[days[dayIndex++]].push(meeting)
            } else {
                return
            }
        })

        // axios.get(`${base}/courses/${course}/sections/${courseSection.split("-")[1]}`).then((res) => {
        //     let classMeets = res.data[0].meetings

        //     // Sorts sections to get unique times
        //     let uniques = []  // holds unique sections for given course
        //     const map = new Map()

        //     classMeets.forEach(meeting => {
        //         let id = Object.values(meeting).join()
        //         if (!map.has(id)) {
        //             map.set(id, true)
        //             uniques.push(meeting)
        //         }
        //     })

        //     // end section filtering
            

        // })

    })

    schedules.push(schedule)

    
    /*

    {
        "monday": {
            "cmsc216-0101": {
                start_time: ""
                end_time: ""
            }
        }
    }


    For every student:
        Generate a new empty schedule representing each day of the week
        Iterate through the list of classes for the given course
            - Pick random section number
            - Iterate through all classes that day
                - If any conflict, skip section and go to next section
            Fill schedule with that section number

    */
}

fs.writeFileSync(path.join(__dirname, "schedules.json"), JSON.stringify(schedules))