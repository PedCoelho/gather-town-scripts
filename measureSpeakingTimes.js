;(() => {
    //setup duration humanizer lib
    const script = document.createElement('script')
    script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/humanize-duration/3.28.0/humanize-duration.js'
    document.body.appendChild(script)
})()

const speakingTimes = {}

game.subscribeToEvent(
    'playerActivelySpeaks',
    ({ playerActivelySpeaks: { activelySpeaking } }, { player, playerId }) => {
        const date = Date.now()
        if (!speakingTimes[playerId])
            speakingTimes[playerId] = { totalDuration: 0 }

        const playerData = speakingTimes[playerId]

        if (activelySpeaking) {
            console.log(
                `🍏 ${
                    player.name
                } (${playerId}) started speaking. At ${new Date(
                    date
                ).toLocaleString()}`
            )
            //if several activelySpeaking events trigger without any stop, skip update and consider the earliest
            if (playerData.lastStarted) return
            playerData.lastStarted = date
        } else {
            if (!playerData.lastStarted) return
            playerData.totalDuration += date - playerData.lastStarted
            delete playerData.lastStarted
            const readableDuration = humanizeDuration(
                playerData.totalDuration,
                { maxDecimalPoints: 2, round: false }
            )
            console.log(
                `🍎 ${player.name} (${playerId}) stopped speaking. Total Speaking Time: ${readableDuration}.`
            )
        }
    }
)
