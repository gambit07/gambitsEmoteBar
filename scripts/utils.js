export async function setOffsets(token) {
    let leftEyeCrosshair = await Sequencer.Crosshair.show({
        t: "circle",
        distance: 0.15 * token.document.width,
        borderColor: "#FF0000",
        fillColor: "#FF0000",
        gridHighlight: false,
        snap: { position: 0 },
        label: { text: game.i18n.format("gambitsEmoteBar.selector.sequencer.leftEye") }
    });

    let rightEyeCrosshair = await Sequencer.Crosshair.show({
        t: "circle",
        distance: 0.15 * token.document.width,
        borderColor: "#FF0000",
        fillColor: "#FF0000",
        gridHighlight: false,
        snap: { position: 0 },
        label: { text: game.i18n.format("gambitsEmoteBar.selector.sequencer.rightEye") }
    });

    let mouthCrosshair = await Sequencer.Crosshair.show({
        t: "circle",
        distance: 0.2*token.document.width,
        borderColor: "#FF0000",
        fillColor: "FF0000",
        gridHighlight:false,
        snap:{position:0},
        label: { text: game.i18n.format("gambitsEmoteBar.selector.sequencer.mouth") }
    })

    let noseCrosshair = await Sequencer.Crosshair.show({
        t: "circle",
        distance: 0.2*token.document.width,
        borderColor: "#FF0000",
        fillColor: "FF0000",
        gridHighlight:false,
        snap:{position:0},
        label: { text: game.i18n.format("gambitsEmoteBar.selector.sequencer.nose") }
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

    const hasCarolingianUI = game.modules.get("crlngn-ui")?.active;
    const duration = 5000;
    let startTime = null;

    titleBackground.style.border = "2px solid";
    titleBackground.style.borderImageSlice = 1;

    let baseColor = "rgba(255, 165, 0, 1)";
    let highlightColor = "rgba(181, 99, 69, 1)";

    if(hasCarolingianUI) {
        baseColor = "rgba(93, 173, 226, 1)";
        highlightColor = "rgba(26, 82, 118, 1)";
    }

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

export function endEmoteEffects(emote, tokens) {
    if (emote === "love") {
        tokens.forEach(token => {
          if (game.gambitsEmoteBar.loveActive) {
            game.gambitsEmoteBar.loveActive.set(token.id, false);
          }
        });
    }
    tokens.forEach(token => {
        Sequencer.EffectManager.endEffects({ name: `emoteBar${capitalize(emote)}_${token.id}`, object: token });
    });
}

export function toggleEmoteButton(button, active, state) {
    if (active) {
      button.dataset.active = "true";
      const hasCarolingianUI = game.modules.get("crlngn-ui")?.active;
      if(hasCarolingianUI) button.style.backgroundColor = "rgba(26, 82, 118, 1)";
      else button.style.backgroundColor = "rgba(181, 99, 69, 0.80)";
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

export function allEffectsActive(emote, tokens) {
  return tokens.every(token => {
    const effectName = `emoteBar${capitalize(emote)}_${token.id}`;
    const effects = Sequencer.EffectManager.getEffects({ name: effectName, object: token });
    return effects.length > 0;
  });
}