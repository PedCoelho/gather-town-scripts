;(function teleportAll(mapId) {
    const allPlayers = Object.entries(game.players)
        .filter(([id, player]) => !player.isNpc)
        .map(([id, player]) => id)

    console.group('Players to teleport:')
    allPlayers.forEach((player) =>
        console.log(`✅ ${game.players[player].name}`)
    )
    console.groupEnd()

    const getMap = () => {
        const maps = Object.entries(gameSpace.mapState).map(
            ([id, { name }]) => ({ id, name })
        )
        let message = 'Pick a map number:'
        maps.forEach(
            (map, i) =>
                (message = message.concat(`\n
        ${i + 1} = ${map.id} ( ${map.name || 'no name'} )`))
        )
        const map = Number(prompt(message))
        if (
            typeof map !== 'number' ||
            Number.isNaN(map) ||
            map < 0 ||
            map > maps.length
        ) {
            const message = `Invalid map number "${map}", try again.`
            alert(message)
            throw new Error(message)
        }
        return maps[map - 1]?.id
    }

    const endMap = mapId || getMap() //Map where everyone is going or CURRENT map
    const spawns = game.completeMaps[endMap].spawns
    const getRandomSpawn = () => {
        const i = Math.floor(Math.random() * spawns.length)
        return spawns[i]
    }

    let t = 0
    allPlayers.forEach((playerId) => {
        setTimeout(() => {
            const { x, y } = getRandomSpawn()
            game.teleport(endMap, x, y, playerId)
        }, 100 * t)
        t++
    })

    return '✨ DONE TELEPORTING PLAYERS ✨'
})()
