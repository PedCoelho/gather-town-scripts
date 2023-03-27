function isNearPlayer(target, player, distance = 2) {
    const { x, y } = player
    return (
        target.x >= x - distance &&
        target.x <= x + distance &&
        target.y >= y - distance &&
        target.y <= y + distance
    )
}

/* ------ subscription() can be called to cancel the subscription later ----- */

const subscription = game.subscribeToEvent(
    'playerMoves',
    (data, context) => {
        const { player } = context
        const objs = game.filterObjectsInMap(player.map, (obj) =>
            isNearPlayer(obj, player)
        )
        if (objs) console.log(objs)
    }
    /* -------------------------------------------------------------------------- */
    /*                   optional filter parameter demonstration                  */
    /* -------------------------------------------------------------------------- */
    /*        , (data, context) => player.name !== 'Facility Managementbot'       */
    /* -------------------------------------------------------------------------- */
)
