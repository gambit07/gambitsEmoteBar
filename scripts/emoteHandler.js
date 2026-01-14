import { EmoteBarApp } from "./applications/emote-bar.js";
import { handleEmoteClick } from "./emote-logic.js";
import { checkEffectsActive, getOwnedTokens } from "./utils.js";

/**
 * Legacy helper used by older code paths to wire up an emote button.
 *
 * In the ApplicationV2 refactor, EmoteBarApp binds events itself. This export
 * remains so existing macros/integrations that call it do not break.
 */
export function setupEmoteButton(button, state = {}) {
  if (!button) return;

  const st = (state && typeof state === "object") ? state : {};
  if (!Object.prototype.hasOwnProperty.call(st, "active")) st.active = null;

  const onEnter = () => {
    try {
      checkEffectsActive(button, st, getOwnedTokens());
    } catch (_) {
    }
  };

  const onClick = async (event) => {
    const tokens = getOwnedTokens();
    if (!tokens?.length) return;

    const emoteId = button?.dataset?.emote;
    if (!emoteId) return;

    const customEmotes = game.settings.get("gambitsEmoteBar", "customEmotes") || {};
    const emote = Object.prototype.hasOwnProperty.call(customEmotes, emoteId)
      ? customEmotes[emoteId]
      : emoteId;

    await handleEmoteClick({ emote, tokens });
  };

  button.addEventListener("mouseenter", onEnter);
  button.addEventListener("click", onClick);
}

/**
 * Legacy entry point: previously opened the DialogV2 emote bar.
 * Now opens the ApplicationV2 EmoteBarApp.
 */
export async function generateEmotes() {
  return EmoteBarApp.open();
}