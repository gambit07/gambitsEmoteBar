import { handleHook, endEmoteEffects } from './utils.js';
import { MODULE_ID } from "./module.js";

export function registerHooks() {
  // Pre-hook to stash previous Combat state: started, round, turn
  Hooks.on("preUpdateCombat", (combat, update, options) => {
    const emoteTriggers = game.settings.get(MODULE_ID, "emoteTriggers") || {};
    const hasHook = Object.values(emoteTriggers).some(triggerList =>
      triggerList.some(trigger => trigger.hook === "combatStart" || trigger.hook === "combatEnd" || trigger.hook === "roundStart" || trigger.hook === "turnStart")
    );
    if(!hasHook) return;

    foundry.utils.setProperty(options, "flags.gambitsEmoteBar.prevStarted", combat.started);
    foundry.utils.setProperty(options, "flags.gambitsEmoteBar.prevRound", combat.round ?? 0);
    foundry.utils.setProperty(options, "flags.gambitsEmoteBar.prevTurn", combat.turn  ?? 0);
  });

  // Detect combat start/end, round and turn
  Hooks.on("updateCombat", (combat, update, options) => {
    if (!game.user.isGM) return;

    const emoteTriggers = game.settings.get(MODULE_ID, "emoteTriggers") || {};
    const hasHook = Object.values(emoteTriggers).some(triggerList =>
      triggerList.some(trigger => trigger.hook === "combatStart" || trigger.hook === "combatEnd" || trigger.hook === "roundStart" || trigger.hook === "turnStart")
    );
    if(!hasHook) return;

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

    const emoteTriggers = game.settings.get(MODULE_ID, "emoteTriggers") || {};
    const hasHook = Object.values(emoteTriggers).some(triggerList =>
      triggerList.some(trigger => trigger.hook === "combatantEnter")
    );
    if(!hasHook) return;

    if (game.combat?.started) handleHook("combatantEnter", combatant);
  });

  Hooks.on("dnd5e.restCompleted", (actor, restData) => {
    const emoteTriggers = game.settings.get(MODULE_ID, "emoteTriggers") || {};
    const hasHook = Object.values(emoteTriggers).some(triggerList =>
      triggerList.some(trigger => trigger.hook === "restLong" || trigger.hook === "restShort")
    );
    if(!hasHook) return;

    if (restData.type === "long") {
      handleHook("restLong", actor);
    }
    else if (restData.type === "short") {
      handleHook("restShort", actor);
    }
  });

  Hooks.on('updateActor', async (actor, diff, options, userID) => {
    const token = actor.getActiveTokens()?.[0];
    const emoteTriggers = game.settings.get(MODULE_ID, "emoteTriggers") || {};
    const thresholdTriggers = Object.entries(emoteTriggers).flatMap(([emoteName, triggers]) => {
      return triggers
        .filter(t => t.hook === "hpPercentage")
        .map(t => ({
          emote:     emoteName,
          threshold: t.threshold ?? 50
        }));
    });
    if (!thresholdTriggers.length) return;
  
    if (!diff.system?.attributes?.hp) return;
  
    const hpCurr    = actor.system.attributes.hp.value;
    const hpMax     = actor.system.attributes.hp.max;
    const currPct   = (hpCurr / hpMax) * 100;

    for (const { emote, threshold } of thresholdTriggers) {
      const effectName = `emoteBar${emote}_${token.id}_${game.gambitsEmoteBar.dialogUser}`;
      const effect = Sequencer.EffectManager.getEffects({ name: effectName, object: token });

      if ((currPct < threshold) && !effect.length) {
        handleHook("hpPercentage", actor);
      }
      else if ((currPct >= threshold) && effect.length > 0) {
        if (!token) continue;
        endEmoteEffects(emote, [token]);
      }
    }
  });
}