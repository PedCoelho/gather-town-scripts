const COLLIDERS = {
  left: {
    topLeft: [-2, -1],
    bottomRight: [-1, 1],
  },
  right: {
    topLeft: [1, -1],
    bottomRight: [2, 1],
  },
  up: {
    topLeft: [-1, -2],
    bottomRight: [1, -1],
  },
  down: {
    topLeft: [-1, 1],
    bottomRight: [1, 2],
  },
};

const DIRECTIONS = {
  5: "left",
  6: "left",
  7: "right",
  8: "right",
  4: "up",
  3: "up",
  2: "down",
  1: "down",
};

const cooldowns = {};

checkCol = (player) => {
  const area = COLLIDERS[DIRECTIONS[player.direction]];
  const topLeft = [player.x + area.topLeft[0], player.y + area.topLeft[1]];
  const bottomRight = [
    player.x + area.bottomRight[0],
    player.y + area.bottomRight[1],
  ];
  console.log(area, topLeft, bottomRight);

  const isInsideArea = (somePlayer) =>
    somePlayer.x >= topLeft[0] &&
    somePlayer.y >= topLeft[1] &&
    somePlayer.x <= bottomRight[0] &&
    somePlayer.y <= bottomRight[1];

  const hits = Object.values(game.players).filter(isInsideArea);
  return hits.length ? hits : undefined;
};

game.subscribeToEvent("playerShootsConfetti", (data, ctx) => {
  const lastHitTime = cooldowns[ctx.player.id] || 0;
  if (Date.now() - lastHitTime < 20000) {
    return; // cooldown active
  }
  cooldowns[ctx.player.id] = Date.now();

  const hits = checkCol(ctx.player);
  console.log(hits);
  if (!hits) return;
  game.notify(
    `🎉${hits.length > 1 ? "Players" : "Player"} ${hits
      .map((x) => x.name)
      .join(", ")} got HIT with Confetti by player ${ctx.player.name}`
  );
});
