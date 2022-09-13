function setShoes(playerId) {
    sessionStorage.setItem(
        `currentOutfit - ${playerId}`,
        game.players[playerId].outfitString
    )

    const shoesOnlyOutfit = {
        shoes: {
            id: 'jWRxPyatM2P0bdzSnf50',
            color: 'brown',
            parts: [
                {
                    spritesheetId: 'Thh1O95hOZKq4yyTmVQD',
                    layerId: 'shoes front',
                },
            ],
            isDefault: true,
            name: 'generic',
            previewUrl:
                'https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/rbpTyhl5PUK9bdvPehj3W',
            type: 'shoes',
        },
    }

    game.setOutfitString(JSON.stringify(shoesOnlyOutfit), playerId)
}

function revertOutfit(playerId) {
    const originalOutfit = sessionStorage.getItem(`currentOutfit - ${playerId}`)
    game.setOutfitString(originalOutfit, playerId)
}

game.subscribeToEvent(
    'playerSetsVehicleId',
    ({ playerSetsVehicleId }, { playerId }) => {
        const action = playerSetsVehicleId.action

        if (action === 'mount') {
            setShoes(playerId)
        } else if (action === 'dismount') {
            revertOutfit(playerId)
        }
    }
)
