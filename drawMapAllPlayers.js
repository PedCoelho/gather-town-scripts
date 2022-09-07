// ==UserScript==
// @name         Gather Minimap
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Pedro Coelho (github.com/pedcoelho)
// @match        https://app.gather.town/app/*
// @icon         https://www.google.com/s2/favicons?domain=gather.town
// @grant        none
// ==/UserScript==

(function () {
  /* -------------------------------------------------------------------------- */
  /*         Developed by Pedro Coelho at https://github.com/pedcoelho          */
  /* -------------------------------------------------------------------------- */
  /*                     Reach me at pedcoelho.dev@gmail.com                    */
  /* -------------------------------------------------------------------------- */

  const minimapState = new MinimapState(5);
  window.minimapState = minimapState;

  function MinimapState(initialScale) {
    this.MAP_COLLISION_COLOR = "rgb(32, 37, 64)";
    this.MAP_WALKABLE_COLOR = "rgb(84, 92, 143)";
    this.PLAYER_COLOR = "white";
    this.MAP_SCALE = initialScale || 5;
    this.PLAYER_SCALING_FACTOR = 1;

    this.initialized = false;
    this.eventSubscriptions = []; //to clean when destroying the canvas
    this.debug = false;

    this.canvas = undefined;
    this.toggleButton = undefined;

    this.init = () => {
      try {
        if (!this.initialized) {
          setupGlobalEvents();
          this.canvas = setupCanvas();
          this.toggleButton = setupMinimapButton(this.canvas);
          this.initialized = true;
          this.update();
        } else {
          console.warn("MINIMAP EXTENSION: Assets already initialized!");
        }
      } catch (e) {
        console.error(e);
      }
    };

    this.destroy = () => {
      try {
        if (this.initialized) {
          this.canvas.remove();
          this.toggleButton.remove();
          this.canvas = undefined;
          this.toggleButton = undefined;
          this.eventSubscriptions.forEach((destroySubFn) => destroySubFn());
          this.eventSubscriptions = [];
          this.initialized = false;
        }
      } catch (e) {
        console.error(e);
      }
    };

    this.update = () => {
      try {
        if (!this.initialized) {
          console.error(
            "MINIMAP EXTENSION: Attempting to draw minimap without initializing minimapState."
          );
          this.init();
        } else {
          drawMap(this.MAP_SCALE, this.canvas);
        }
      } catch (e) {
        console.error(e);
      }
    };

    this.changeScale = (value) => {
      this.MAP_SCALE += value;
      this.update();
    };

    this.debugMap = (value = false) => {
      if (value !== true && value !== false) return;
      this.debug = value;
      this.update();
    };
  }

  function setupGlobalEvents() {
    let RETRY = 30;

    const detectGame = setInterval(() => {
      if (RETRY === 0) {
        console.error(
          "MINIMAP EXTENSION: Failed to detect global game object. Map won`t subscribe to game events."
        );
        return clearInterval(detectGame);
      }
      if (window?.game) {
        const subscriptions = [monitorPlayerMovement];

        subscriptions.forEach((eventSubscriptionFn) => {
          minimapState.eventSubscriptions.push(eventSubscriptionFn());
        });

        return clearInterval(detectGame);
      } else {
        return RETRY--;
      }
    }, 100);

    const monitorPlayerMovement = () =>
      game.subscribeToEvent("playerMoves", (evt, { player: { map } }) => {
        if (!minimapState.initialized) return;

        //update map when any player moves in the current map
        const currentMap = gameSpace.mapId;
        if (map === currentMap) {
          minimapState.update();
        }
      });
  }

  function setupCanvas() {
    const canvas = document.createElement("canvas");
    const canvasStyle = document.createElement("style");

    const minimapCss = `
      .minimap{
          border-radius: 4px;
          position: absolute;
          top: 2rem;
          left: 2rem;
          box-shadow: 2px 2px 2px 2px #211d1db8;
          opacity: 0.8;
          transition: all .2s ease;
          outline: 2px solid ${minimapState.MAP_COLLISION_COLOR}
          z-index:6;
      }
      .minimap.hidden{
        opacity:0;
        pointer-events:none;
      }
      .minimap:hover{
          cursor:pointer;
          opacity: 1;
      }
      `;

    canvas.classList.add("minimap");

    canvasStyle.appendChild(document.createTextNode(minimapCss));

    document.head.appendChild(canvasStyle);
    document.body.appendChild(canvas);

    return canvas;
  }

  function setupMinimapButton(canvasElement) {
    const parent = document.querySelector(".GameCanvasWrapper");
    const toggleButton = document.createElement("button");
    const mapIcon = `<svg width="28" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 91 91">
      <path fill="#ffffff" d="m52.2 26.6-13.1-7V65l13.1 6.5zM36.6 19.6l-16.3 8.2c-.6.3-.9.9-.9 1.5v41c0 .6.3 1.1.8 1.4.3.2.6.3.9.3.2 0 .5-.1.7-.2L36.6 65V19.6zM71.2 19.4c-.5-.3-1.1-.3-1.6-.1l-14.9 7.4v44.8l16.7-8.1c.6-.3 1-.9.9-1.5l-.3-41c0-.7-.3-1.2-.8-1.5z"/>
    </svg>`;

    toggleButton.innerHTML = mapIcon;

    const buttonStyle = document.createElement("style");

    const hasSiblings = parent.childElementCount > 2;

    const buttonCss = `
      .minimap-toggle{
        display: flex;
        position: absolute;
        left: 20px;
        bottom: ${!hasSiblings ? "20px" : "88px"};
        width: 48px;
        height: 48px;
        border:0;
        border-radius: 24px;
        background-color: rgb(40, 45, 78);
        justify-content: center;
        align-items: center;
        cursor: pointer;
        box-shadow: rgb(0 0 0 / 55%) 0px 10px 25px;
        z-index:6;
      }
      `;

    toggleButton.classList.add("minimap-toggle");

    buttonStyle.appendChild(document.createTextNode(buttonCss));

    parent.appendChild(toggleButton);
    document.head.appendChild(buttonStyle);

    toggleButton.addEventListener("click", () =>
      canvasElement.classList.toggle("hidden")
    );

    return toggleButton;
  }

  function drawMap(ratio, canvas) {
    if (minimapState.debug) ratio = 25;
    const currentMap = gameSpace.mapState[gameSpace.mapId];
    const collisions = currentMap.collisions;
    const dimensions = currentMap.dimensions;

    const player = gameSpace.getPlayerGameState();
    const playersInMap = Object.values(
      game.getPlayersInMap(gameSpace.mapId)
    ).map(({ x, y, name }) => ({ x, y, name }));

    const [x, y] = dimensions;

    canvas.height = y * ratio;
    canvas.width = x * ratio;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    collisions.forEach((line, y) => {
      line.forEach((col, x) => {
        ctx.fillStyle = col
          ? minimapState.MAP_COLLISION_COLOR
          : minimapState.MAP_WALKABLE_COLOR;
        ctx.fillRect(x * ratio, y * ratio, ratio, ratio);
      });
    });

    /* ---------------------------- draw ALL players ---------------------------- */
    playersInMap.forEach(({ x, y }) => {
      drawPlayer(
        ctx,
        { x, y },
        ratio,
        "yellow",
        minimapState.PLAYER_SCALING_FACTOR
      );
    });

    /* ---------------------------- draw MAIN player ---------------------------- */
    drawPlayer(
      ctx,
      { x: player.x, y: player.y },
      ratio,
      minimapState.PLAYER_COLOR,
      minimapState.PLAYER_SCALING_FACTOR
    );

    if (minimapState.debug) {
      collisions.forEach((line, y) => {
        line.forEach((col, x) => drawCoords(ctx, { x, y }, ratio));
      });
    }
  }

  function drawPlayer(context, position, ratio, color = "white", scaling = 1) {
    const radius = ratio * scaling;
    context.beginPath();
    context.fillStyle = color;
    context.arc(
      position.x * ratio + ratio / 2,
      position.y * ratio + ratio / 2,
      radius,
      0,
      2 * Math.PI,
      false
    );
    context.fill();
  }

  function drawCoords(context, position, ratio) {
    context.strokeStyle = "green";
    context.strokeRect(position.x * ratio, position.y * ratio, ratio, ratio);
    context.font = `${ratio - 2}px Arial`;
    context.fillStyle = "red";
    context.textAlign = "center";
    context.fillText(
      `${position.x}`,
      position.x * ratio + ratio / 2,
      position.y * ratio + ratio * 0.9
    );
  }

  //todo consider adding this to a web worker (can it be on the same file / code?)
  setInterval(() => {
    if (window?.gameSpace?.mapId) {
      if (!minimapState.initialized) {
        minimapState.init();
      }
    } else {
      if (minimapState.initialized) {
        console.log(
          "MINIMAP EXTENSION: Minimap absent. Destroying current map."
        );
        return minimapState.destroy();
      }
    }
  }, 200);
})();
