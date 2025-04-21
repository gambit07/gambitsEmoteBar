import { handleHook } from './utils.js';

export function registerHooks() {
  // Pre-hook to stash previous Combat state: started, round, turn
  Hooks.on("preUpdateCombat", (combat, update, options) => {
    foundry.utils.setProperty(options, "flags.gambitsEmoteBar.prevStarted", combat.started);
    foundry.utils.setProperty(options, "flags.gambitsEmoteBar.prevRound", combat.round ?? 0);
    foundry.utils.setProperty(options, "flags.gambitsEmoteBar.prevTurn", combat.turn  ?? 0);
  });

  // Detect combat start/end, round and turn
  Hooks.on("updateCombat", (combat, update, options) => {
    if (!game.user.isGM) return;

    const prevStarted = foundry.utils.getProperty(options, "flags.gambitsEmoteBar.prevStarted");
    const prevRound = foundry.utils.getProperty(options, "flags.gambitsEmoteBar.prevRound");
    const prevTurn = foundry.utils.getProperty(options, "flags.gambitsEmoteBar.prevTurn");

    // combat start/end
    if (combat.started && !prevStarted) handleHook("combatStart", combat);
    if (!combat.started && prevStarted) handleHook("combatEnd", combat);

    // round start
    if (typeof update.round === "number" && update.round !== prevRound) {
      handleHook("roundStart", combat);
    }

    // turn start
    if (typeof update.turn === "number" && update.turn !== prevTurn) {
      handleHook("turnStart", combat);
    }
  });

  // A new combatant enters an ongoing combat
  Hooks.on("createCombatant", (combatant, options, userId) => {
    if (!game.user.isGM) return;
    if (game.combat?.started) handleHook("combatantEnter", combatant);
  });

  Hooks.on("dnd5e.restCompleted", (actor, restData) => {
    if (restData.type === "long") {
      handleHook("restLong", actor);
    }
    else if (restData.type === "short") {
      handleHook("restShort", actor);
    }
  });
}