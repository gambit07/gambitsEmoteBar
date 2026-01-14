import * as animations from "./animations.js";

/**
 * Execute a custom emote macro.
 * The macro receives a single argument: token (Token placeable).
 */
export async function executeCustomMacro(macroCode, token) {
  try {
    const AsyncFunction = foundry?.utils?.AsyncFunction ?? Object.getPrototypeOf(async function () {}).constructor;
    const func = new AsyncFunction("token", macroCode);
    return await func(token);
  } catch (error) {
    console.error("gambitsEmoteBar | Error executing custom emote macro:", error);
    throw error;
  }
}

/**
 * Play an emote for a set of tokens.
 * Supports default emotes (string id) or custom emote objects containing a macro.
 */
export async function handleEmoteClick({ emote, tokens }) {
  const isCustom = typeof emote === "object" && emote?.macro;

  for (const token of tokens) {
    if (isCustom) {
      await executeCustomMacro(emote.macro, token);
      continue;
    }

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
        animations.performSuspicious(token);
        break;
      default:
        console.warn("gambitsEmoteBar | Unrecognized emote:", emote);
    }
  }
}
