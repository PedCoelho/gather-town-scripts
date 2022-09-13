const [left, right, up, down] = [0, 1, 2, 3] //for ease of use, map directions to readable variables

function autoMove(moves = [left, left, right, right], randomWalk = false) {
    const printCycle = (moves) => {
        const movesMap = { 0: '⬅️', 1: '➡️', 2: '⬆️', 3: '⬇️' }

        console.log(
            'Current move cycle:',
            moves.map((move) => movesMap[move]).join('')
        )
    }

    const DELAY = 300
    const TOTAL_TIME = moves.length * DELAY
    console.log('Cycle time:', TOTAL_TIME)

    printCycle(moves)

    const interval = setInterval(() => {
        if (randomWalk) {
            moves = moves.map(() => Math.floor(Math.random() * 4))
            printCycle(moves)
        }

        moves.forEach((dir, i) => {
            setTimeout(() => {
                game.move(dir)
            }, DELAY * i)
        })
    }, TOTAL_TIME)

    window.walks = window.walks ? [...window.walks, interval] : [interval]
    window.clearWalk = () => {
        window.walks.forEach((interval) => clearInterval(interval))
        window.walks = []
    }
}
