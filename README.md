# gather-town-scripts

Experimenting with a **gather.town** frontend client scripting to implement things like:

1. An interactive minimap (WIP)
2. A script that moves the player automatically in a set or random pattern of directions
3. A script that logs data about player interactions with objects in a given space

<br>

# minimap roadmap

**v1 roadmap**

- Possibly include a zoom feature to allow for the minimap to be scaled up or down in real-time (could be achieved by buttons)

**v2 roadmap**

- Possibly add some kind of interaction
  - Teleport directly to the coordinate clicked (easier)
- Maybe view players names on mouseover

```
        * this could be done by checking the name of the player which is on a given x,y coordinate at runtime
        * it can also be done by storing the players name directly, although I dont think thats viable on canvas object
        * instead of drawing on canvas directly, it could be shown below the canvas
```

- Possibly have a mode that renders all maps in a given space simultaneously
- Maybe consider highlighting certain important types / kinds of objects (ex: portals, interactive objects)
  - could be a toggle that triggers a boolean that gets checked on render function, or wrapper
  - render function could be broken into steps, for better legibility, and wrapped by a wrapper (render players, render map, render objects, etc)

### ⏳ UNDER DEVELOPMENT

- Handle whether the player has already entered the game or not, in order to get it running on page startup without any problems

```
       * this includes toggling visibility / deleting the canvas if the player leaves the game
       * consider browser navigation / URL change event to stop minimap interval check
       * NEED to find out how to intercept the clicking on the sign OUT button, to avoid late destruction of the map
```

### ✅ DONE

**v1 roadmap**

- Include a button on the UI to hide / show the minimap 

**v2 roadmap**

- Consider the impact and usability of displaying other players on the minimap 
- Add debug function
