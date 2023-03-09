//get the map definition from the gather client
const map = gameSpace.getMyPlayerMap()

//convert collisions from an Object into a charCode array (for 0 and 1 values)
//of the same size as the map dimensions and then into a base64 encoded string
const proccessCollisions = ({ collisions, dimensions }) => {
    const data = []
    const [xSize, ySize] = dimensions

    for (y = 0; y < ySize; y++) {
        for (x = 0; x < xSize; x++) {
            const possibleCollision = collisions?.[y]?.[x]
            data.push(
                possibleCollision === true
                    ? String.fromCharCode(1)
                    : String.fromCharCode(0)
            )
        }
    }

    return btoa(data.join(''))
}

//data the HTTP API expects for map collisions
const collisionsData = proccessCollisions(map)
