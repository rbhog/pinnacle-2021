const fs = require('fs')
const path = require('path')

let sectionsFile = JSON.parse(fs.readFileSync(path.join(__dirname, "sections.json")))

let unique = new Set()

let sectionsClean = []

function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
  
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

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
        if (meeting.building == '' || meeting.building == 'TBA' || meeting.building == 'ITV' || meeting.building == 'BLD1' || meeting.building == 'BLD4' || meeting.days == '') {
            
        } else {
            uniqueMeetings.push(meeting)
        }
    })
    // let actuallyUniqueMeetings = uniqueMeetings.filter((thing, index, self) =>
    //     index === self.findIndex((t) => (
    //         t.days === thing.days && t.room === thing.room && t.building === thing.building && t.classtype === thing.classtype && t.start_time === thing.start_time && t.end_time === thing.end_time
    //     ))
    // console.log(uniqueMeetings)
    //  )
    // uniqueMeetings.sort(compareValues('days'))
    let actuallyUniqueMeetings = uniqueMeetings.filter((v,i,a)=>a.findIndex(t=>(JSON.stringify(t) === JSON.stringify(v)))===i)
    let days = new Set()
    actuallyUniqueMeetings.forEach(meeting => {
        
        if (!days.has(meeting.days)) {
            days.add(meeting.days)
        }
        
    })
    // console.log("Unique Days: " + days.size)
    // console.log(days)
    // console.log(actuallyUniqueMeetings)
    // console.log(actuallyUniqueMeetings)
    if (actuallyUniqueMeetings.length == 1) {
        // console.log("NOT AN ARRAY")
        // // console.log(meetings)
        // console.log(actuallyUniqueMeetings)
        
    } else {
        let temp = []
        days.forEach(day =>{
            actuallyUniqueMeetings.forEach(meeting => {
                if (days.has(meeting.days)) {
                    days.delete(meeting.days)
                    temp.push(meeting)
                }
            })
        })
        // console.log(temp)
        actuallyUniqueMeetings = temp
        // console.log(" AN ARRAY")
        // console.log(meetings)
        
        
        // console.log(times)
        
    }
    // actuallyUniqueMeetings.forEach((meetings) => {
    //     console.log(meetings)
        
    // let sectionObj = 
    // {
        
    // }
    // sectionsClean.push()

    // // // })
    section.meetings = actuallyUniqueMeetings
    // console.log(section)
    sectionsClean.push(section)
})

fs.writeFileSync(path.join(__dirname, 'uniquesections.json'), JSON.stringify(sectionsClean))