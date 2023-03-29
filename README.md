# gather-town-scripts

Experimenting with a **gather.town** frontend client scripting to implement things like:

1. `drawMapAllPlayers.js`: An interactive minimap
2. `autoMove.js`: A script that moves the player automatically in a set pattern of directions (or a random pattern)
3. `playerInteracts.ts`: A script that logs data about player interactions with objects in a given space
4. `goKartStation.js`: A script that manages a custom goKart Station object
5. `coordinatesLogger.js`: A script that enables logging and monitoring map coordinates interactively
6. `becomeGoKart.js`: A script that removes and restores the players outfit when he gets on a vehicle
7. `teleportAllPlayers.js`: A script that will prompt the user for a map number to then teleport all players in a gather.town space into.
8. `measureSpeakingTimes.js`: A script that measures speaking times for all players based on the playerActivelySpeaks events firing in a space.
9. `confettiHitDetection.js`: A script that checks for players in the range of the confetti effect and subscribes to the playerShootsConfetti event, triggering a notification.
10. `mapCollisionsToString.js`: A script that converts from map collision data to base64 string data expected by some Gather.Town API methods.
11. `getAvatarImage.js`: A script that takes the player's outfitString, converts it into an ordered list of outfitLayers and requests an avatar's spritesheet image from gather.town's dynamic-assets endpoint.
12. `isMovingNearObjects.js`: A script that demonstrates a playerMoves subscription that logs objects within two squares from the player who moved. This also demonstrates how subscriptions can be cancelled and how events can be filtered from within the game.subscribeToEvent call itself.
13. `findMatchingObjects.js`: A script that finds all objects in the space with any property value including a given string (quickly searches through all property values for every object in a space)

<br>

# minimap roadmap

**v2 roadmap**

-   Possibly have a mode that renders all maps in a given space simultaneously
    -   Or allows you to select a given map or a list of maps to render
-   Maybe consider highlighting certain important types / kinds of objects (ex: portals, interactive objects)
    -   could be a toggle that triggers a `boolean` that gets checked on render function, or wrapper
    -   render function could be broken into steps, for better legibility, and wrapped by a wrapper (render players, render map, render objects, etc)

### ⏳ UNDER DEVELOPMENT

-   Handle whether the player has already entered the game or not, in order to get it running on page startup without any problems

```
       * this includes toggling visibility / deleting the canvas if the player leaves the game
       * consider browser navigation / URL change event to stop minimap interval check
       * NEED to find out how to intercept the clicking on the sign OUT button, to avoid late destruction of the map
```

### ✅ DONE

**v1 roadmap**

-   Include a button on the UI to hide / show the minimap
-   Possibly include a zoom feature to allow for the minimap to be scaled up or down in real-time (could be achieved by buttons)
-   Allow dragging the minimap to reposition it (and a button to reset the minimap's position and scale)

**v2 roadmap**

-   Consider the impact and usability of displaying other players on the minimap
-   Add debug function
-   Teleport directly to the coordinate clicked
-   View players names on mouseover

### ⏳ KNOWN BUGS

-   At the moment, when a player enters a portal, map.update doesn`t get triggered. This probably has to do with the fact that we are only triggering map renders when somebody moves in the current map.
