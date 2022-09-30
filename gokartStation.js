
var GOKART_SOUND = "https://sounds.pond5.com/go-kart-start-sound-effect-000220962_nw_prev.m4a";
var GOKART_STATION_ROOM = "City"; // import desired room to build the station

// position of the field to DELETE a go-kart (if its placed there and you interact with the station, its deleted instead of getting a new gokart):
var GOKART_DEL_X = 43; 
var GOKART_DEL_Y = 19;
var GOKART_DEL_SOUND = "https://sounds.pond5.com/horn-us-compact-interior-sound-effect-021518602_nw_prev.m4a";


// // ++++ goKarts ++++

// function to ride goKart
function gokartRide(objId, context) {
    game.setGoKartId(objId, context.playerId);
    game.playSound(GOKART_SOUND, 1, context.playerId);

setTimeout(() => {
    // console.log(context.player);
    // console.log("riding?", context.player.goKartId !== "");
    // console.log("not riding?", context.player.goKartId === "");

    game.deleteObject(context.player.map, context.player.goKartId);
}, 200);

// console.log(context?.player?.name ?? context.playerId, "rides goKart", objId);
}

// function to create random id
function makeid(length) {
var result = "";
var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
var charactersLength = characters.length;
for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
}
return result;
}

let goKartId = "";
let delId = "";

game.subscribeToEvent("playerInteracts", (data, context) => {

let objId = data.playerInteracts.objId;
let playerName = context?.player?.name !== "" ? context?.player?.name : context.playerId;

// enable to use existing goKarts again and play sound
if (game.getObject(objId).obj._name === "Go-kart") {
    goKartId = objId;

    gokartRide(goKartId, context);

    console.log(
    playerName,
    "rides goKart",
    goKartId
    );
    goKartId = "";
}

// interacting with objects called "Go-kart Station" (must be type:5!)..
if (game.getObject(objId).obj._name === "Go-kart Station") {
    // look up if a goKart stands on the indicator
    try {
    delId = Object.values(game.completeMaps[GOKART_STATION_ROOM].objects).find((obj) => {
        return obj._name === "Go-kart" &&
        obj.x === GOKART_DEL_X &&
        obj.y === GOKART_DEL_Y;
    }).id;
    } catch (e) {
    if (e instanceof TypeError) {
        console.log("There is no goKart to delete on the indicator!");
    }
    }
    // console.log("delId:",delId);

    // first delete the goKart, if exists in map
    if (delId !== "") {
    game.deleteObject(context.player.map, delId);
    console.log("Gokart deleted:", delId);
    delId = "";
    game.playSound(GOKART_DEL_SOUND, 0.5, context.playerId);
    }
    // get new gokart if you havn't one
    else if (context.player.goKartId === "") {
    
    newId = makeid(10);      
    gokartRide(newId, context);

    console.log(
        playerName,
        "rides NEW goKart",
        newId
    );
    }
}
});
