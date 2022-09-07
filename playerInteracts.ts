//todo ASSESS SPECIFIC USER ROLE...
interface CustomWindow extends Window {
  game?: Game;
  interactionStorage?: InteractionStorage;
}

interface CallbackFn {
  (data: any, context: any): any;
}
interface Game {
  getObject(id: string): { obj: GameObject };
  subscribeToEvent(evt: "playerInteracts", callback: CallbackFn);
  getKnownPartialMaps(): string[];
}

interface GameObject {
  x: number;
  y: number;
  id: string;
  templateId: string;
}

interface PlayerInteractsData {
  playerInteracts: {
    encId: number;
    mapId: string;
    objId: string;
  };
}

interface PlayerInteractsCtx {
  playerId: string;
  spaceId: string;
}

interface InteractionLog {
  playerId: string;
  time: string;
  objectPosition: {
    x: number;
    y: number;
  };
}

interface InteractionStorage {
  [key: string]: {
    [key: string]: InteractionLog[];
  };
}

(function () {
  let window: CustomWindow = this;
  const game: Game = window.game as Game;

  const storage = setupGlobalVariable();

  function setupGlobalVariable(): InteractionStorage {
    const interactionStorage: InteractionStorage = {};
    const mapNames = game.getKnownPartialMaps();
    mapNames.forEach((map) => {
      interactionStorage[map] = {};
    });
    window.interactionStorage = interactionStorage;
    return interactionStorage;
  }

  game.subscribeToEvent(
    "playerInteracts",
    ({ playerInteracts }, context: PlayerInteractsCtx) => {
      const currentMap: { [key: string]: InteractionLog[] } =
        storage[playerInteracts.mapId];
      const {
        obj: { x, y }
      } = game.getObject(playerInteracts.objId);

      const interaction: InteractionLog = {
        playerId: context.playerId,
        time: new Date().toISOString(),
        objectPosition: { x, y }
      };

      currentMap[playerInteracts.objId] = currentMap[playerInteracts.objId]
        ? [...currentMap[playerInteracts.objId], interaction]
        : [interaction];
    }
  );
})();
