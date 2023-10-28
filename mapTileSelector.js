const getBitmaps = async (map) => {
    console.log(`🛜 - Getting map background image.`)
    const mapUrl = game.completeMaps[map].backgroundImagePath
    const mapSize = game.completeMaps[map].dimensions
    console.log(mapSize)
    const data = await fetch(mapUrl, { accept: 'Blob' }).then((x) => x.blob())
    console.log(`✅ - Finish getting map background image.`)
    return await extractTiles(data, mapSize)
}

const extractTiles = async (data, size) => {
    console.log(`🎨🖌️ - Splitting tile data.`)
    const tiles = []

    for (y = 1; y <= size[0]; y++) {
        for (x = 1; x <= size[1]; x++) {
            const bitmap = await createImageBitmap(data, x * 32, y * 32, 32, 32)
            tiles.push({ x, y, bitmap })
        }
    }

    console.log(`✅ - Finish splitting tile data.`)
    return tiles
}

const tiles = await getBitmaps(game.getMyPlayer().map) //for example purposes, but could use any mapId

// --- stack-overflow: https://stackoverflow.com/a/5162976/14524962 ---
const getColors = (pixels) => {
    // returns a map counting the frequency of each color
    // in the image on the canvas
    let col,
        colors = {}
    let r, g, b, a
    r = g = b = a = 0
    for (let i = 0, data = pixels.data; i < data.length; i += 4) {
        r = data[i]
        g = data[i + 1]
        b = data[i + 2]
        a = data[i + 3] // alpha
        // skip pixels >50% transparent
        if (a < 255 / 2) continue
        col = rgbToHex(r, g, b)
        if (!colors[col]) colors[col] = 0
        colors[col]++
    }
    return colors
}

const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255) throw 'Invalid color component'
    return ((r << 16) | (g << 8) | b).toString(16)
}

//--- end-of-stack-overflow code ---

const renderTiles = (
    tiles,
    canvas = undefined,
    delay = undefined,
    drawInFull = false
) => {
    console.log(`🎨🖌️ - Start tiles rendering / parsing.`)
    canvas = canvas ? canvas : document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    ctx.imageSmoothingEnabled = false

    canvas.width = drawInFull
        ? Math.max(...tiles.map((tile) => tile.x)) * 32
        : 32
    canvas.height = drawInFull
        ? Math.max(...tiles.map((tile) => tile.y)) * 32
        : 32

    tiles.forEach((tile, i) => {
        if (drawInFull) {
            ctx.drawImage(tile.bitmap, tile.x * 32, tile.y * 32)
            ctx.fillText(
                tile.y + '/' + tile.x,
                tile.x * 32 + 16,
                tile.y * 32 + 16
            )
            return
        }
        // setTimeout(()=>{
        ctx.drawImage(tile.bitmap, 0, 0, canvas.width, canvas.height)
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
        tile.data = getColors(pixels) //parsing
        return Promise.resolve()
        // },delay) // for demo purposes, but will break filter because of timeout
    })
    console.log(`✅ - Finish tiles rendering / parsing.`)
}

renderTiles(tiles)

const filterTiles = (tiles, thresholds) =>
    tiles.filter((tile) =>
        Object.entries(thresholds).every(
            ([color, threshold]) => tile.data[color] >= (1024 * threshold) / 100
        )
    )

const filtered = filterTiles(tiles, { '639bff': 60 }) // map of hex colors and minimum percentage threshold for filtering tiles

console.log(`Filtered Tiles:`, filtered)

// do whatever with the results, like:
// filtered.forEach((tile,i)=> setTimeout(()=>game.teleport(game.getMyPlayer().map,tile.x,tile.y),i*100))
