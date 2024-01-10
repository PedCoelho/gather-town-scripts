# gather-town-scripts

Experimenting with a **gather.town** frontend client scripting to implement things like:

1. `drawMapAllPlayers.js`: An interactive minimap (with live heatmap of player positions)
2. `autoMove.js`: A script that moves the player automatically in a set pattern of directions (or a random pattern)
3. `playerInteracts.ts`: A script that logs data about player interactions with objects in a given space
4. `goKartStation.js`: A script that manages a custom goKart Station object
5. `coordinatesLogger.js`: A script that enables logging and monitoring map coordinates interactively
6. `becomeGoKart.js`: A script that removes and restores the players outfit when he gets on a vehicle
7. `teleportAllPlayers.js`: A script that will prompt the user for a map number to then teleport all players in a gather.town space into.
8. `measureSpeakingTimes.js`: A script that measures speaking times for all players based on the playerActivelySpeaks events firing in a space.
9. `confettiHitDetection.js`: A script that checks for players in the range of the confetti effect and subscribes to the playerShootsConfetti event, triggering a notification.
10. `mapCollisionsToString.js`: A script that converts from map collision data to base64 string data expected by some Gather.Town API methods.
11. `getAvatarImage.js`: A script that takes the player's outfitString, converts it into an ordered list of outfitLayers and requests an avatar's spritesheet or profile image from gather.town's dynamic-assets endpoint.
12. `isMovingNearObjects.js`: A script that demonstrates a playerMoves subscription that logs objects within two squares from the player who moved. This also demonstrates how subscriptions can be cancelled and how events can be filtered from within the game.subscribeToEvent call itself.
13. `findMatchingObjects.js`: A script that finds all objects in the space with any property value including a given string (quickly searches through all property values for every object in a space)
14. `mapTileSelector.js`: A (client-side) script relying on the HTML Canvas to take a map's background image, break it into tiles associated with the gather.town coordinate system and then filter them based on a set of HEX color thresholds. Ex: filter all map tiles containing at least 60% of color f2f2f2 and 10% of color whatever.

<br>

# minimap roadmap

**v2 roadmap**

-   Possibly have a mode that renders all maps in a given space simultaneously
    -   Or allows you to select a given map or a list of maps to render
-   Have a toggle that triggers objects / portals / etc rendering

**v3 roadmap**

-   Have a toggle that triggers heatmap layer rendering

### ⏳ UNDER DEVELOPMENT

-   Handle whether the player has already entered the game or not, in order to get it running on page startup without any problems

```
       * this includes toggling visibility / deleting the canvas if the player leaves the game
       * consider browser navigation / URL change event to stop minimap interval check
       * NEED to find out how to intercept the clicking on the sign OUT button, to avoid late destruction of the map
```

### ✅ DONE

**v1**

-   Include a button on the UI to hide / show the minimap
-   Possibly include a zoom feature to allow for the minimap to be scaled up or down in real-time (could be achieved by buttons)
-   Allow dragging the minimap to reposition it (and a button to reset the minimap's position and scale)

**v2**

-   Add debug function
-   Teleport directly to the coordinate clicked (on double-click)
-   View players names on mouseover
-   View map coordinates on mouseover
-   Implement a **heatmap** view of player movement / player positions
-   Highlight certain important types of objects (ex: portals, interactive objects)
-   Add extra **information about objects, portals and players** on mouseover
-   Add ability to click on a portal to teleport to it's destination
-   Add ability to highlight players in the Gather.Town UI and see the corresponding player highlighted in the minimap

### ⏳ KNOWN BUGS

    No known bugs to report at the moment
