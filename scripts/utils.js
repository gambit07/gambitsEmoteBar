import { packageId } from "./constants.js";

/**
 * Sequencer's EffectManager will throw if you query effects for a canvas object
 * which no longer exists (common during token deletion where `controlToken`
 * fires while the TokenDocument is being removed).
 *
 * These helpers make UI highlighting and cleanup logic resilient.
 */
export function isLiveToken(token) {
  const id = token?.document?.id ?? token?.id;
  if (!id) return false;

  if (canvas?.scene && !canvas.scene.tokens?.get?.(id)) return false;

  if (token?.destroyed) return false;

  return true;
}

export function safeGetSequencerEffects(query) {
  try {
    return Sequencer?.EffectManager?.getEffects?.(query) ?? [];
  } catch (_err) {
    return [];
  }
}

export async function setOffsets(token) {
    const capturedMirrored = getTokenIsMirrored(token);

    let leftEyeCrosshair = await Sequencer.Crosshair.show({
        t: "circle",
        distance: 0.15 * token.document.width,
        borderColor: "#FF0000",
        fillColor: "#FF0000",
        gridHighlight: false,
        snap: { position: 0 },
        label: { text: game.i18n.format("gambitsEmoteBar.selector.sequencer.leftEye"), dx: -50, dy: -50 }
    });

    let rightEyeCrosshair = await Sequencer.Crosshair.show({
        t: "circle",
        distance: 0.15 * token.document.width,
        borderColor: "#FF0000",
        fillColor: "#FF0000",
        gridHighlight: false,
        snap: { position: 0 },
        label: { text: game.i18n.format("gambitsEmoteBar.selector.sequencer.rightEye"), dx: -50, dy: -50 }
    });

    let mouthCrosshair = await Sequencer.Crosshair.show({
        t: "circle",
        distance: 0.2*token.document.width,
        borderColor: "#FF0000",
        fillColor: "#FF0000",
        gridHighlight:false,
        snap:{position:0},
        label: { text: game.i18n.format("gambitsEmoteBar.selector.sequencer.mouth"), dx: -50, dy: -50 }
    })

    let noseCrosshair = await Sequencer.Crosshair.show({
        t: "circle",
        distance: 0.2*token.document.width,
        borderColor: "#FF0000",
        fillColor: "#FF0000",
        gridHighlight:false,
        snap:{position:0},
        label: { text: game.i18n.format("gambitsEmoteBar.selector.sequencer.nose"), dx: -50, dy: -50 }
    })

    let leftEyeScale = leftEyeCrosshair.distance / token.document.width;
    let rightEyeScale = rightEyeCrosshair.distance / token.document.width;

    let leftEyeOffset = {
        x: (leftEyeCrosshair.x / canvas.grid.size) - (token.center.x / canvas.grid.size),
        y: (leftEyeCrosshair.y / canvas.grid.size) - (token.center.y / canvas.grid.size)
    };
    let rightEyeOffset = {
        x: (rightEyeCrosshair.x / canvas.grid.size) - (token.center.x / canvas.grid.size),
        y: (rightEyeCrosshair.y / canvas.grid.size) - (token.center.y / canvas.grid.size)
    };

    let mouthOffset = {
        x:(mouthCrosshair.x/canvas.grid.size) - (token.center.x/canvas.grid.size),
        y:(mouthCrosshair.y/canvas.grid.size) - (token.center.y/canvas.grid.size)
    };

    let noseOffset = {
        x:(noseCrosshair.x/canvas.grid.size) - (token.center.x/canvas.grid.size),
        y:(noseCrosshair.y/canvas.grid.size) - (token.center.y/canvas.grid.size)
    };

    await token.document.setFlag(packageId, "offsets", {
        leftEyeOffset,
        rightEyeOffset,
        leftEyeScale,
        rightEyeScale,
        mouthOffset,
        noseOffset,
        capturedMirrored
    });

    return { leftEyeOffset, rightEyeOffset, leftEyeScale, rightEyeScale, mouthOffset, noseOffset, capturedMirrored };
}

/**
 * Flip an offset's X coordinate when the token's current mirrored state differs
 * from the mirrored state at the time the offsets were captured.
 */
export function applyCapturedMirrorToOffset(token, offset, capturedMirrored = false) {
  const currentMirrored = getTokenIsMirrored(token);
  const shouldFlip = currentMirrored !== capturedMirrored;
  return {
    x: shouldFlip ? -offset.x : offset.x,
    y: offset.y
  };
}

export function animateTitleBar(dialog) {
    const titleBackground = dialog?.element?.querySelector('.window-header');
    if (!titleBackground) return;

    const duration = 5000;
    let startTime = null;

    titleBackground.style.border = "2px solid";
    titleBackground.style.borderImageSlice = 1;

    const { baseColor, highlightColor } = getDialogColors();

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = (elapsed % duration) / duration;

        const angle = 360 * progress;

        titleBackground.style.borderImage = `linear-gradient(${angle}deg, ${baseColor}, ${highlightColor}, ${baseColor}) 1`;

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

function getDialogColors() {
  const rgbColor = getCssVarValue("--color-warm-2");
  const rgbColorHighlight = getCssVarValue("--color-warm-3");
  let baseColor = addAlphaToRgb(rgbColor, 1);
  let highlightColor = addAlphaToRgb(rgbColorHighlight, 1);

  return { baseColor, highlightColor };
}

function getCssVarValue(varName) {
  const tempEl = document.createElement("div");
  tempEl.style.color = `var(${varName})`;
  tempEl.style.display = "none";
  document.body.appendChild(tempEl);

  const computedColor = getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);
  return computedColor;
}

function addAlphaToRgb(rgbString, alpha) {
  const match = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (match) {
    return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
  }
  return rgbString;
}

export async function endEmoteEffects(emote, tokens) {
  tokens = (tokens ?? []).filter(isLiveToken);
  if (tokens.length === 0) return;

  const stopLoopingEmote = async (token, emoteId) => {
    const userId = game.gambitsEmoteBar?.dialogUser ?? game.user.id;
    if (emoteId === "Love" && game.gambitsEmoteBar.loveActive) game.gambitsEmoteBar.loveActive.set?.(token.id, false);
    if (emoteId === "Suspicious" && game.gambitsEmoteBar.suspiciousActive) game.gambitsEmoteBar.suspiciousActive.set?.(token.id, false);

    if (!token?.document) return;

    try {
      if (game.user.isGM) {
        await token.document.unsetFlag(packageId, `loopActive.${emoteId}`);
        return;
      }

      await token.document.setFlag(packageId, `loopActive.${emoteId}.${userId}`, false);
    } catch (_err) {
    }
  };

  if (emote === "Love" || emote === "Suspicious") {
    for (const token of tokens) await stopLoopingEmote(token, emote);
  }

  const isCustom = typeof emote === "object";
  if (isCustom) emote = emote.name;

  for (const token of tokens) {
    if (game.user.isGM) {
      const names = getAllEmoteEffectNames(emote, token);
      if (names.length) {
        for (const name of names) {
          try { Sequencer.EffectManager.endEffects({ name, object: token }); } catch (_) {}
        }
        continue;
      }
    }

    try {
      Sequencer.EffectManager.endEffects({
        name: `emoteBar${emote}_${token.id}_${game.gambitsEmoteBar.dialogUser}`,
        object: token
      });
    } catch (_) {}
  }
}

export async function endAllEmoteEffects(tokens, { skipFlags = false } = {}) {
  const emotes = game.gambitsEmoteBar.dialogEmotes ?? [];
  if (!tokens) tokens = getOwnedTokens() ?? [];
  tokens = (tokens ?? []).filter(isLiveToken);
  if (tokens.length === 0) return;

  for(let emote of emotes) {
    if (emote === "Love" || emote === "Suspicious") {
      for (const token of tokens) {
        if (emote === "Love" && game.gambitsEmoteBar.loveActive) game.gambitsEmoteBar.loveActive.set(token.id, false);
        if (emote === "Suspicious" && game.gambitsEmoteBar.suspiciousActive) game.gambitsEmoteBar.suspiciousActive.set(token.id, false);
        if (!skipFlags && token?.document) {
          try {
            if (game.user.isGM) await token.document.unsetFlag(packageId, `loopActive.${emote}`);
            else await token.document.setFlag(packageId, `loopActive.${emote}.${game.gambitsEmoteBar.dialogUser}`, false);
          } catch (_err) {
          }
        }
      }
    }

    tokens.forEach(token => {
      if (game.user.isGM) {
        const names = getAllEmoteEffectNames(emote, token);
        if (names.length) {
          for (const name of names) {
            try { Sequencer.EffectManager.endEffects({ name, object: token }); } catch (_) {}
          }
          return;
        }
      }
      try {
        Sequencer.EffectManager.endEffects({ name: `emoteBar${emote}_${token.id}_${game.gambitsEmoteBar.dialogUser}`, object: token });
      } catch (_) {}
    });
  }

  const customEmotes = game.settings.get(packageId, "customEmotes") || {};
  if (customEmotes) {
    for (const emoteName of Object.keys(customEmotes)) {
      tokens.forEach(token => {
        if (game.user.isGM) {
          const names = getAllEmoteEffectNames(emoteName, token);
          if (names.length) {
            for (const name of names) {
              try { Sequencer.EffectManager.endEffects({ name, object: token }); } catch (_) {}
            }
            return;
          }
        }
        try {
          Sequencer.EffectManager.endEffects({ name: `emoteBar${emoteName}_${token.id}_${game.gambitsEmoteBar.dialogUser}`, object: token });
        } catch (_) {}
      });
    }
  }
}

export function toggleEmoteButton(button, active, state) {
    if (active) {
      button.dataset.active = "true";
      button.style.backgroundColor = getDialogColors().baseColor;

      if (state && !state.active) {
        state.active = button;
      }
    } else {
      button.dataset.active = "false";
      button.style.backgroundColor = "";
      if (state && state.active === button) {
        state.active = null;
      }
    }
}

export function getPickedTokens(button) {
    if (!canvas.tokens.controlled || canvas.tokens.controlled.length === 0) {
      ui.notifications.warn(game.i18n.format("gambitsEmoteBar.log.warning.pleaseSelectOneToken"));
      toggleEmoteButton(button, false);
      return [];
    }
    const tokens = (canvas.tokens.controlled ?? []).filter(token =>
      isLiveToken(token) && (token.document.testUserPermission(game.user, "OWNER") || game.user.isGM)
    );
    if (tokens.length === 0) {
      ui.notifications.warn(game.i18n.format("gambitsEmoteBar.log.warning.noPermission"));
      toggleEmoteButton(button, false);
    }
    return tokens;
}

export function getOwnedTokens() {
  const tokens = (canvas.tokens.placeables ?? []).filter(token =>
    isLiveToken(token) && (token.document.testUserPermission(game.user, "OWNER") || game.user.isGM)
  );
  if (tokens.length === 0) return;
  return tokens;
}

/**
 * Tokens used for UI highlighting:
 * - If exactly one token is controlled, highlight based on that token.
 * - If no token is controlled OR multiple tokens are controlled, highlight any emote
 *   currently active (across tokens the user can own/control; GM sees all scene tokens).
 */
export function getHighlightTokens() {
  const controlled = (canvas.tokens.controlled ?? []).filter(isLiveToken);
  if (controlled.length === 1) return controlled;

  if (game.user.isGM) return (canvas.tokens.placeables ?? []).filter(isLiveToken);
  return getOwnedTokens() || [];
}

/**
 * Get all Sequencer effect names for a given emote/token across *all* users.
 *
 * Most emotes are persisted with a name that includes a user suffix:
 * `emoteBar${emoteId}_${token.id}_${userId}`.
 *
 * When multiple users apply emotes to the same token, a GM should be able to
 * end *all* variants regardless of who started them.
 */
export function getAllEmoteEffectNames(emoteId, token) {
  if (!isLiveToken(token)) return [];
  const prefix = `emoteBar${emoteId}_${token.id}_`;
  const effects = safeGetSequencerEffects({ object: token });

  return effects
    .map(e => e?.data?.name ?? e?.name ?? null)
    .filter(n => typeof n === "string" && n.startsWith(prefix));
}

export function allEffectsActive(emote, tokens) {
  const isCustom = typeof emote === "object";
  if(isCustom) emote = emote.name;

  return tokens.every(token => {

    if (!isLiveToken(token)) return false;

    if (game.user.isGM) {
      return getAllEmoteEffectNames(emote, token).length > 0;
    }

    const effectName = `emoteBar${emote}_${token.id}_${game.gambitsEmoteBar.dialogUser}`;
    const effects = safeGetSequencerEffects({ name: effectName, object: token });
    return effects.length > 0;
  });
}

export function checkEffectsActive(button, state, tokens) {

  if (button?.dataset?.persistent === "false") {
    toggleEmoteButton(button, false, state);
    return;
  }

  if (!tokens || tokens?.length === 0) tokens = getHighlightTokens();
  if (tokens?.length === 0 || !tokens) {
    toggleEmoteButton(button, false, state);
    return;
  }

  const emoteId = button.dataset.emote;
  const userId  = game.gambitsEmoteBar.dialogUser;

  const anyActive = tokens.some(token => {

    if (!isLiveToken(token)) return false;

    if (game.user.isGM) {
      return getAllEmoteEffectNames(emoteId, token).length > 0;
    }

    const effectName = `emoteBar${emoteId}_${token.id}_${userId}`;
    const effect = safeGetSequencerEffects({ name: effectName, object: token });
    return Array.isArray(effect) && effect.length > 0;
  });

  toggleEmoteButton(button, anyActive, state);
}

export function getTokenImage(token) {
  return token?.document?.ring?.enabled
      ? token?.document?.ring?.subject?.texture ?? token?.document?.texture?.src
      : token.document?.texture?.src || "icons/svg/cowled.svg";
}

export function applyEmoteSound(sequence, emote) {
  if (!game.settings.get(packageId, "emoteSoundEnable")) {
    return sequence;
  }

  const moduleSoundPaths = game.settings.get(packageId, "emoteSoundPaths") || {};
  let soundPath = moduleSoundPaths[emote] || "";

  if (!game.user.isGM && game.settings.get(packageId, "emoteSoundEnablePerUser")) {
    const userOverrides = game.user.getFlag(packageId, "emoteSoundOverrides") || {};
    soundPath = userOverrides[emote] || soundPath;
  }

  if (soundPath && soundPath.trim() !== "") {
    sequence.sound()
      .file(soundPath)
      .fadeInAudio(500)
      .fadeOutAudio(500);
  }

  return sequence;
}

export function getTokenRotation(token) {
  let rotationEnabled = token.document.lockRotation;
  rotationEnabled ? rotationEnabled = false : rotationEnabled = true;
  return rotationEnabled;
}

export function getEskieModules() {
  const hasPatreon = game.modules.get("eskie-effects")?.active === true;
  const hasFree = game.modules.get("eskie-effects-free")?.active === true;
  return { hasPatreon, hasFree, active: hasPatreon || hasFree };
}

/**
 * Helper used by Eskie Patreon-only emotes.
 * @returns {boolean} True if Eskie Effects (Patreon) is active.
 */
export function requireEskiePatreon() {
  const eskie = getEskieModules();
  if (!eskie?.hasPatreon) {
    ui.notifications.warn("Eskie Effects (Patreon) is not active.");
    return false;
  }
  return true;
}

/**
 * Resolve a Sequencer database key for Eskie Effects (Patreon/Free).
 * @param {string} patreonKey
 * @param {string} freeKey
 * @returns {string|null}
 */
export function resolveEskieFile(patreonKey, freeKey) {
  const { hasPatreon, hasFree } = getEskieModules();
  if (hasPatreon) return patreonKey;
  if (hasFree) return freeKey;
  return null;
}

/**
 * Drag/drop is now handled inside EmoteBarApp.
 * This function is kept for legacy callers and intentionally does nothing.
 */
export function initializeDragDrop() {}

/**
 * Persist the current emote button order to a user flag.
 * EmoteBarApp calls this directly; legacy callers may also use it.
 */
export async function saveButtonOrder(containerEl = null) {
  const container = containerEl ?? document.getElementById('emoteButtonsContainer');
  if (!container) return;
  const order = Array.from(container.children)
    .map(el => el?.id)
    .filter(Boolean);
  await game.user.setFlag(packageId, 'buttonOrder', order);
}

/**
 * Apply a saved emote button order from a user flag.
 */
export async function loadButtonOrder(containerEl = null) {
  const container = containerEl ?? document.getElementById('emoteButtonsContainer');
  if (!container) return;

  const savedOrder = await game.user.getFlag(packageId, 'buttonOrder');
  if (!savedOrder || !Array.isArray(savedOrder) || !savedOrder.length) return;

  const map = new Map(Array.from(container.children).map(el => [el.id, el]));
  for (const id of savedOrder) {
    const el = map.get(id);
    if (el) container.appendChild(el);
  }
}

/**
 * Re-render the Emote Bar (legacy helper).
 */
export async function updateEmoteButtons() {
  try {
    const mod = await import('./applications/emote-bar.js');
    mod.EmoteBarApp?.instance?.render(true);
  } catch (err) {
    console.warn(`${packageId} | updateEmoteButtons failed`, err);
  }
}

/**
 * Legacy icon picker opener.
 * @returns {Promise<string|null>} Font Awesome icon class (without the "fas" prefix) or null.
 */
export async function openIconPicker(selected = null) {
  const mod = await import('./applications/icon-picker.js');
  return mod.IconPickerApp.pick(selected);
}

/**
 * Load the list of FA icons for the picker.
 */
export async function loadFontList() {
  try {
    const response = await fetch(`modules/${packageId}/assets/icons.json`);
    const json = await response.json();

    const list = Array.isArray(json)
      ? json.map(obj => obj?.icon).filter(Boolean)
      : Array.isArray(json?.fonts)
        ? json.fonts.filter(Boolean)
        : [];
    return list;
  } catch (err) {
    console.error("Error loading Font Awesome icons:", err);
    return [];
  }
}

/**
 * Legacy Hide/Unhide manager opener.
 */
export async function showHideUnhideDialog() {
  const mod = await import('./applications/emote-visibility-manager.js');
  return mod.EmoteVisibilityManagerApp.open();
}

/**
 * Legacy custom emote editor opener.
 */
export async function openRegisterCustomEmoteDialog(emoteId = null) {
  const mod = await import('./applications/custom-emote-editor.js');
  return mod.CustomEmoteEditorApp.open(emoteId);
}

/**
 * Legacy custom emote list opener.
 */
export async function openCustomEmoteListDialog() {
  const mod = await import('./applications/custom-emote-list.js');
  return mod.CustomEmoteListApp.open();
}

/**
 * Legacy trigger list opener.
 */
export async function openTriggerListDialog(emoteId) {
  const mod = await import('./applications/trigger-list.js');
  return mod.TriggerListApp.open(emoteId);
}
export function resolveTokens(trigger, subject) {
  const { hook, target, tokenIds = [] } = trigger;
  let baseTokens;
  if (hook.startsWith("rest") || hook === "hpPercentage") {
    baseTokens = canvas.tokens.placeables.filter(t => t.actor?.id === subject.id);
  } else if (hook === "combatantEnter") {
    baseTokens = canvas.tokens.placeables.filter(t => t.actor?.id === subject.actorId);
  } else if (hook === "turnStart") {
    baseTokens = canvas.tokens.placeables.filter(t => t.actor?.id === subject.combatant.actorId);
  } else if (subject?.combatants) {
    baseTokens = Array.from(subject.combatants.values())
      .map(c => c.token?.object)
      .filter(t => t);
  } else {
    baseTokens = canvas.tokens.placeables;
  }

  switch (target) {
    case "all":
      return baseTokens;
    case "selected":
      if (Array.isArray(tokenIds) && tokenIds.length) {
        return tokenIds.map(u => canvas.tokens.get(u)).filter(t => t);
      }
      return [];
    case "ally":
      return baseTokens.filter(t => t.document.disposition === 1);
    case "enemy":
      return baseTokens.filter(t => t.document.disposition === -1);
    case "neutral":
      return baseTokens.filter(t => t.document.disposition === 0);
    default:
      return [];
  }
}

/**
 * Dispatch all stored triggers matching this hook.
 * @param {string} hook - The name of the fired hook (e.g. "combatStart").
 * @param {object} subject - The primary object of the hook event.
 */
export function handleHook(hook, subject) {
  const map = game.settings.get(packageId, "emoteTriggers") || {};
  for (const [emoteId, triggers] of Object.entries(map)) {
    for (const trig of triggers) {
      if (trig.hook !== hook) continue;
      const tokens = resolveTokens(trig, subject);
      if (!tokens.length) continue;
      game.gambitsEmoteBar.playEmote({ emote: emoteId, tokens, duration: trig?.duration ? trig.duration : null });
    }
  }
}

export function getTokenFacing(token) {
  const isMirrored = token.document.texture.scaleX < 0;
  const facing = isMirrored ? -1 : 1;
  return facing;
}

export function getTokenMirrorFacing(token) {
  const isMirrored = token.document.texture.scaleX < 0;
  const facing = isMirrored ? false : true;
  return facing;
}

export function getTokenMirrorSpriteRotation(token) {
  const isMirrored = token.document.texture.scaleX < 0;
  const mirrorSpriteRotation = isMirrored ? -20 : 20;
  return mirrorSpriteRotation;
}

export function getTokenIsMirrored(token) {
  const isMirrored = token.document.texture.scaleX < 0;
  return isMirrored;
}