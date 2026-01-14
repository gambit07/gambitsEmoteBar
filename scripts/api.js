import * as animations from './animations.js';
import { packageId } from "./constants.js";
import { executeCustomMacro } from "./emote-logic.js";

/**
 * Plays an emote animation for each provided token.
 *
 * @param {string} emote - The emote to play. Valid emotes are: "laugh", "angry", "surprised", "shout", "drunk", "soul", "slap", "cry", "disgusted", "giggle", "love", "rofl", "smoking", "nervous".
 * @param {Array} [tokens=[]] - An array of token objects on which to play the emote.
 * @param {number|null} [duration=null] - (Optional) The duration in seconds after which the emote effect will be automatically cleared, default 10.
 * @returns {Promise<boolean>} Returns a promise that resolves to true if the emote is played successfully.
 *
 * @example
 *
 * game.gambitsEmoteBar.playEmote({ emote: "laugh", tokens: canvas.tokens.controlled, duration: 5 });
 */

export async function playEmote({ emote, tokens = [], duration = null }) {
  if (!game.user.isGM)
    return ui.notifications.warn("GM level permissions are required to use the emote api.");
  if (!tokens.length)
    return ui.notifications.warn("No tokens passed to the api.");

  const normalizedEmote = typeof emote === "string" ? emote.trim() : "";
  const emoteKey = normalizedEmote
    ? normalizedEmote.charAt(0).toUpperCase() + normalizedEmote.slice(1)
    : normalizedEmote;

  const userId = game.user.id;

  const customEmotes = game.settings.get(packageId, "customEmotes") || {};

  if (Object.prototype.hasOwnProperty.call(customEmotes, emoteKey)) {
    const customEmoteData = customEmotes[emoteKey];
    const persistentEffect = typeof customEmoteData.macro === "string" && customEmoteData.macro.includes(".persist(");
    for (let token of tokens) {
      try {
        await executeCustomMacro(customEmoteData.macro, token);
      } catch (error) {
        console.error(`Error executing custom emote macro for "${emoteKey}":`, error);
        ui.notifications.error(`Error executing custom emote macro for "${emoteKey}". Check the console for details.`);
      }
    }

    if (!persistentEffect) return true;

    if (duration) {
      setTimeout(() => {
        tokens.forEach(token => {
          Sequencer.EffectManager.endEffects({
            name: `emoteBar${emoteKey}_${token.id}_${userId}`,
            object: token
          });
        });
      }, duration * 1000);
    }
    return true;
  }

  for (let token of tokens) {
    switch (emoteKey) {
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
        break;
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
      case "ThankYou":
        await animations.performThankYou(token);
        break;
      case "Wink":
        await animations.performWink(token);
        break;
      case "Smug":
        await animations.performSmug(token);
        break;
      case "Huh":
        await animations.performHuh(token);
        break;
      case "Confused":
        await animations.performConfused(token);
        break;
      case "Whistle":
        await animations.performWhistle(token);
        break;
      case "Bloodied":
        await animations.performBloodied(token);
        break;
      case "Suspicious":
        if (!duration) duration = 10;
        animations.performSuspicious(token);
        break;
      default:
        return ui.notifications.warn(`Emote "${emote}" not recognized. Valid emotes are: ${game.gambitsEmoteBar.dialogEmotes.join(", ")}`);
    }
  }

  if (duration) {
    if (emoteKey === "Slap" || emoteKey === "ThunderHype") return true;
    setTimeout(() => {
      if (emoteKey === "Love") {
        tokens.forEach(token => {
          if (game.gambitsEmoteBar.loveActive)
            game.gambitsEmoteBar.loveActive.set(token.id, false);
        });
      }
      if (emoteKey === "Suspicious") {
        tokens.forEach(token => {
          if (game.gambitsEmoteBar.suspiciousActive)
            game.gambitsEmoteBar.suspiciousActive.set(token.id, false);
        });
      }
      tokens.forEach(token => {
        Sequencer.EffectManager.endEffects({
          name: `emoteBar${emoteKey}_${token.id}_${userId}`,
          object: token
        });
      });
    }, duration * 1000);
  }
  return true;
}
