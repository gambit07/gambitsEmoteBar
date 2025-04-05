import * as animations from './animations.js';

/**
 * Plays an emote animation for each provided token.
 *
 * @param {string} emote - The emote to play. Valid emotes are: "laugh", "angry", "surprised", "shout", "drunk", "soul", "slap", "cry", "disgusted", "giggle", "love", "rofl", "smoking", "nervous".
 * @param {Array} [tokens=[]] - An array of token objects on which to play the emote.
 * @param {number|null} [duration=null] - (Optional) The duration in seconds after which the emote effect will be automatically cleared, default 10.
 * @returns {Promise<boolean>} Returns a promise that resolves to true if the emote is played successfully.
 *
 * @example
 * // Play the "laugh" emote on all controlled tokens for 5 seconds:
 * game.gambitsEmoteBar.playEmote({ emote: "laugh", tokens: canvas.tokens.controlled, duration: 5 });
 */

export async function playEmote({ emote, tokens = [], duration = null }) {
  if (!game.user.isGM)
    return ui.notifications.warn("GM level permissions are required to use the emote api.");
  if (!tokens.length)
    return ui.notifications.warn("No tokens passed to the api.");

  const userId = game.user.id;

  const customEmotes = game.settings.get("gambitsEmoteBar", "customEmotes") || {};

  if (customEmotes.hasOwnProperty(emote)) {
    const customEmoteData = customEmotes[emote];
      let persistentEffect = typeof emote.macro === "string" && customEmoteData.macro.includes(".persist()");
    for (let token of tokens) {
      try {
        const macroFunction = new Function("token", customEmoteData.macro);
        await macroFunction(token);
      } catch (error) {
        console.error(`Error executing custom emote macro for "${emote}":`, error);
        ui.notifications.error(`Error executing custom emote macro for "${emote}". Check the console for details.`);
      }
    }

    if(!persistentEffect) return;

    if (duration) {
      setTimeout(() => {
        tokens.forEach(token => {
          Sequencer.EffectManager.endEffects({
            name: `emoteBar${emote.name}_${token.id}_${userId}`,
            object: token
          });
        });
      }, duration * 1000);
    }
    return true;
  }

  // If not a custom emote, use built-in handling.
  for (let token of tokens) {
    switch (emote) {
      case "Laugh":
        await animations.performLaugh(token);
        break;
      case "Angry":
        await animations.performAngry(token);
        break;
      case "Surprised":
        await animations.performSurprised(token);
        break;
      case "Shout":
        await animations.performShout(token);
        break;
      case "Drunk":
        await animations.performDrunk(token);
        break;
      case "Soul":
        await animations.performSoul(token);
        break;
      case "Slap":
        await animations.performSlap(token);
        // For some effects, you may want to return early.
        return;
      case "Cry":
        await animations.performCry(token);
        break;
      case "Disgusted":
        await animations.performDisgusted(token);
        break;
      case "Giggle":
        await animations.performGiggle(token);
        break;
      case "Love":
        if (!duration) duration = 10;
        animations.performLove(token);
        break;
      case "Rofl":
        await animations.performROFL(token);
        break;
      case "Smoking":
        await animations.performSmoking(token);
        break;
      case "Nervous":
        await animations.performNervous(token);
        break;
      case "Party":
        await animations.performParty(token);
        break;
      case "ThunderHype":
        await animations.performThunderHype(token);
        break;
      default:
        return ui.notifications.warn(`Emote "${emote}" not recognized. Valid emotes are: ${game.gambitsEmoteBar.dialogEmotes.join(", ")}`);
    }
  }

  // Handle clearing persistent effects after the duration if needed.
  if (duration) {
    if (emote === "Slap" || emote === "ThunderHype")
      return true;
    setTimeout(() => {
      if (emote === "Love") {
        tokens.forEach(token => {
          if (game.gambitsEmoteBar.loveActive)
            game.gambitsEmoteBar.loveActive.set(token.id, false);
        });
      }
      tokens.forEach(token => {
        Sequencer.EffectManager.endEffects({
          name: `emoteBar${emote}_${token.id}_${userId}`,
          object: token
        });
      });
    }, duration * 1000);
  }
  return true;
}