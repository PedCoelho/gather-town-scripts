//to be used in "https://dynamic-assets.gather.town/v2/sprite/avatar-{{data}}.png?d=."
//OR "https://dynamic-assets.gather.town/v2/sprite-profile/avatar-{{data}}.png?d=."
//IF querying profile image

const generateAvatarImage = (outfitString, isProfile = false) => {
    const WearableLayerOrderMap = {
        'mobility back': 0,
        'other back': 1,
        'hat back': 2,
        'hair back': 3,
        'jacket back': 4,
        'skin front': 5,
        'bottom front': 6,
        'shoes front': 7,
        'top front': 8,
        'jacket front': 9,
        'other middle': 10,
        'glasses front': 11,
        'facial_hair front': 12,
        'hair front': 13,
        'hat front': 14,
        'other front': 15,
        'mobility front': 16,
        'costume front': 17,
    }
    const outfit = Object.values(JSON.parse(outfitString))
    const spriteSheetParts = outfit
        .map((outfitLayer) =>
            outfitLayer?.parts.map((part) => ({
                spritesheetId: part?.spritesheetId,
                layerId: part?.layerId,
            }))
        )
        .filter((x) => x)
        .flat()
        .sort((a, b) =>
            WearableLayerOrderMap[a.layerId] < WearableLayerOrderMap[b.layerId]
                ? -1
                : 0
        )
        .map((x) => x.spritesheetId)

    const profileImageParts = outfit
        .map((outfitLayer) => outfitLayer?.id)
        .filter((x) => x)

    return isProfile ? profileImageParts.join('.') : spriteSheetParts.join('.')
}
