const fs = require('fs')
const path = require('path')

let sectionsFile = JSON.parse(fs.readFileSync(path.join(__dirname, "sections.json")))

let unique = new Set()

function checkMeetingEqual(object1, object2) {
    if (object1 == undefined) return false
    if (object2 == undefined) return true

    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    console.log(keys1)

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
        return false;
        }
    }

    return true;
}

sectionsFile.forEach(section => {
    // TBA, ITV, BLD1, BLD4
    // console.log(section)
    let uniqueMeetings = []
    section.meetings.forEach(meeting => {
        // console.log(meeting)
        if (!unique.has(meeting.building)) unique.add(meeting.building)
        if (meeting.building != '' || meeting.building != 'TBA' || meeting.building != 'ITV' || meeting.building != 'BLD1' || meeting.building != 'BLD4') {
            uniqueMeetings.push(meeting)
        }
    })
    actuallyUniqueMeetings = uniqueMeetings.filter((v,i,a)=>a.findIndex(t=>(JSON.stringify(t) === JSON.stringify(v)))===i)
    actuallyUniqueMeetings.forEach(meetings, idx, actuallyUniqueMeetings => {
        meetings.forEach(meeting, idx, meetings => {

        })
    })
    console.log(actuallyUniqueMeetings)
})

console.log(unique)
