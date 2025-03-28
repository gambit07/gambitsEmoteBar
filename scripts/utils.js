export async function setOffsets(token) {
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
        fillColor: "FF0000",
        gridHighlight:false,
        snap:{position:0},
        label: { text: game.i18n.format("gambitsEmoteBar.selector.sequencer.mouth"), dx: -50, dy: -50 }
    })

    let noseCrosshair = await Sequencer.Crosshair.show({
        t: "circle",
        distance: 0.2*token.document.width,
        borderColor: "#FF0000",
        fillColor: "FF0000",
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

    await token.document.setFlag("gambitsEmoteBar", "offsets", {
        leftEyeOffset,
        rightEyeOffset,
        leftEyeScale,
        rightEyeScale,
        mouthOffset,
        noseOffset
    });

    return { leftEyeOffset, rightEyeOffset, leftEyeScale, rightEyeScale, mouthOffset, noseOffset };
}

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function animateTitleBar(dialog) {
    const titleBackground = dialog?.element?.querySelector('.window-header');
    if (!titleBackground) return;

    const duration = 5000;
    let startTime = null;

    titleBackground.style.border = "2px solid";
    titleBackground.style.borderImageSlice = 1;

    let baseColor = getDialogColors().baseColor;
    let highlightColor = getDialogColors().highlightColor;

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

export function endEmoteEffects(emote, tokens) {
  if (emote === "love") {
      tokens.forEach(token => {
        if (game.gambitsEmoteBar.loveActive) {
          game.gambitsEmoteBar.loveActive.set(token.id, false);
        }
      });
  }
  tokens.forEach(token => {
      Sequencer.EffectManager.endEffects({ name: `emoteBar${capitalize(emote)}_${token.id}_${game.gambitsEmoteBar.dialogUser}`, object: token });
  });
}

export function endAllEmoteEffects() {
  let emotes = game.gambitsEmoteBar.dialogEmotes;
  let tokens = getOwnedTokens();

  for(let emote of emotes) {
    if (emote === "love") {
      tokens.forEach(token => {
        if (game.gambitsEmoteBar.loveActive) {
          game.gambitsEmoteBar.loveActive.set(token.id, false);
        }
      });
    }

    tokens.forEach(token => {
      Sequencer.EffectManager.endEffects({ name: `emoteBar${capitalize(emote)}_${token.id}_${game.gambitsEmoteBar.dialogUser}`, object: token });
    });
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
    const tokens = canvas.tokens.controlled.filter(token =>
      token.document.testUserPermission(game.user, "OWNER") || game.user.isGM
    );
    if (tokens.length === 0) {
      ui.notifications.warn(game.i18n.format("gambitsEmoteBar.log.warning.noPermission"));
      toggleEmoteButton(button, false);
    }
    return tokens;
}

export function getOwnedTokens() {
  const tokens = canvas.tokens.placeables.filter(token =>
    token.document.testUserPermission(game.user, "OWNER") || game.user.isGM
  );
  if (tokens.length === 0) return;
  return tokens;
}

export function allEffectsActive(emote, tokens) {
  return tokens.every(token => {
    const effectName = `emoteBar${capitalize(emote)}_${token.id}_${game.gambitsEmoteBar.dialogUser}`;
    const effects = Sequencer.EffectManager.getEffects({ name: effectName, object: token });
    return effects.length > 0;
  });
}

export function checkEffectsActive(button, state) {
  let tokens = getOwnedTokens();
  if(tokens.length === 0 || !tokens) return;

  tokens.some(token => {
    const effectName = `emoteBar${capitalize(button.dataset.emote)}_${token.id}_${game.gambitsEmoteBar.dialogUser}`;
    const effect = Sequencer.EffectManager.getEffects({ name: effectName, object: token });
    if (effect && effect.length > 0) {
      toggleEmoteButton(button, true, state);
      return true;
    }
    toggleEmoteButton(button, false, state);
    return false;
  });
}

export function getTokenImage(token) {
  return token?.document?.ring?.enabled
      ? token?.document?.ring?.subject?.texture ?? token?.document?.texture?.src
      : token.document?.texture?.src || "icons/svg/cowled.svg";
}

export function applyEmoteSound(sequence, emote) {
  if (!game.settings.get("gambitsEmoteBar", "emoteSoundEnable")) {
    return sequence;
  }
  
  const moduleSoundPaths = game.settings.get("gambitsEmoteBar", "emoteSoundPaths") || {};
  let soundPath = moduleSoundPaths[emote] || "";

  if (!game.user.isGM && game.settings.get("gambitsEmoteBar", "emoteSoundEnablePerUser")) {
    const userOverrides = game.user.getFlag("gambitsEmoteBar", "emoteSoundOverrides") || {};
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