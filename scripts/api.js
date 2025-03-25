import * as animations from './animations.js';
import { capitalize } from './utils.js';

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

export async function playEmote({emote, tokens = [], duration = null}) {
    if(!game.user.isGM) return ui.notifications.warn("GM level permissions are required to use the emote api.");
    if (!tokens.length) return ui.notifications.warn("No tokens passed to the api.");

    let userId = game.user.id;

    for (let token of tokens) {
        if(!token.document) {
            ui.notifications.warn(`${token.name} skipped: You must pass an array of token objects.`);
            continue;
        }

        switch (emote) {
          case "laugh":
            await animations.performLaugh(token);
            break;
          case "angry":
            await animations.performAngry(token);
            break;
          case "surprised":
            await animations.performSurprised(token);
            break;
          case "shout":
            await animations.performShout(token);
            break;
          case "drunk":
            await animations.performDrunk(token);
            break;
          case "soul":
            await animations.performSoul(token);
            break;
          case "slap":
            await animations.performSlap(token);
            return;
          case "cry":
            await animations.performCry(token);
            break;
          case "disgusted":
            await animations.performDisgusted(token);
            break;
          case "giggle":
            await animations.performGiggle(token);
            break;
          case "love":
            if(!duration) duration = 10;
            animations.performLove(token);
            break;
          case "rofl":
            await animations.performROFL(token);
            break;
          case "smoking":
            await animations.performSmoking(token);
            break;
          case "nervous":
            await animations.performNervous(token);
            break;
          case "party":
            await animations.performParty(token);
            break;
          case "thunderHype":
            await animations.performThunderHype(token);
            break;
          default:
            return ui.notifications.warn(`Emote "${emote}" not recognized. Valid emotes are: ${game.gambitsEmoteBar.dialogEmotes.join(", ")}`);
        }
    }

    if (duration) {
      setTimeout(() => {
        if (emote === "love") {
          tokens.forEach(token => {
            if (game.gambitsEmoteBar.loveActive) {
              game.gambitsEmoteBar.loveActive.set(token.id, false);
            }
          });
        }

        tokens.forEach(token => { Sequencer.EffectManager.endEffects({ name: `emoteBar${capitalize(emote)}_${token.id}_${userId}`, object: token }); });
      }, duration * 1000);
    }

    return true;
  }