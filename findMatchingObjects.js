//Extracts object property values recursively
const extractProps = (item) => {
    if (typeof item === 'object') {
        return Array.isArray(item)
            ? item.map((val) => extractProps(val)).flat()
            : Object.values(item)
                  .map((value) => extractProps(value))
                  .flat()
    } else {
        return item
    }
}

//Matches an array of property values with a searchTerm,
//by default run as a filter (stopping at first positive).
//Can run through every possible value if required (for data-mining purposes)
const propMatch = (propValues, searchTerm, completeSearch = false) => {
    const nonNumeric = propValues
        .filter((prop) => isNaN(prop))
        .map((prop) => prop.toLowerCase())
    searchTerm = searchTerm.toLowerCase()

    if (completeSearch) {
        let result = false
        nonNumeric.forEach((prop) => {
            if (prop.includes(searchTerm)) {
                matches.add(prop)
                result = true
            }
        })
        return result
    } else {
        return nonNumeric.some((prop) => {
            if (prop.includes(searchTerm.toLowerCase())) {
                matches.add(prop)
                return true
            }
        })
    }
}

//For keeping unique results
const matches = new Set()

//Finds objects in the space with any property value including a given string
function findMatchingObjects(searchTerm) {
    const objects = game.filterObjectsInSpace((obj) => {
        const props = extractProps(obj)
        return propMatch(props, searchTerm)
    })
    console.log(matches, objects)

    return objects
}
