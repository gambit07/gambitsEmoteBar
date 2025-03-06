import * as animations from './animations.js';

function getPickedTokens(button) {
  if (!canvas.tokens.controlled || canvas.tokens.controlled.length === 0) {
    ui.notifications.warn("Please select at least one token.");
    toggleEmoteButton(button, false);
    return [];
  }
  const tokens = canvas.tokens.controlled.filter(token =>
    token.document.testUserPermission(game.user, "OWNER") || game.user.isGM
  );
  if (tokens.length === 0) {
    ui.notifications.warn("You do not have permission to use the emote tool on the selected token(s).");
    toggleEmoteButton(button, false);
  }
  return tokens;
}

function setupTooltip(button) {
  button.addEventListener('mouseenter', () => {
    const tooltipText = button.getAttribute('data-tooltip');
    game.tooltip.activate(button, { text: tooltipText, direction: "UP" });
  });
  button.addEventListener('mouseleave', () => {
    game.tooltip.deactivate();
  });
}

function animateTitleBar(dialog) {
  const titleBackground = dialog?.element?.querySelector('.window-header');
  if (!titleBackground) return;
  
  const duration = 5000;
  let startTime = null;
  
  titleBackground.style.border = "2px solid";
  titleBackground.style.borderImageSlice = 1;
  
  const baseColor = "#5DADE2";
  const highlightColor = "#1A5276";
  
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

function setupEmoteButton(button, state) {
  button.dataset.active = "false";
  button.addEventListener('click', async (e) => {
    const emote = button.dataset.emote;
    const currentState = button.dataset.active === "true";
    if (currentState) {
      toggleEmoteButton(button, false, state);
      await handleEmoteClick({ emote, pickedTokens: getPickedTokens(button) });
    } else {
      if (!e.shiftKey && state.active && state.active !== button) {
        ui.notifications.warn("Hold Shift to select multiple emotes IF YOU DARE.");
        return;
      }
      toggleEmoteButton(button, true, state);
      if (!e.shiftKey) state.active = button;
      await handleEmoteClick({ emote, pickedTokens: getPickedTokens(button) });
      if (emote === "slap") {
        toggleEmoteButton(button, false, state);
      }
    }
  });
}

function toggleEmoteButton(button, active, state) {
  if (active) {
    button.dataset.active = "true";
    button.style.backgroundColor = "rgba(181, 99, 69, 0.80)";
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

function getEmoteDialogHTML() {
  return `
    <form>
      <div style="display: flex; flex-direction: column; align-items: center; width: fit-content; margin: auto;">
        <div class="emote-buttons" style="
            display: grid;
            grid-template-columns: repeat(2, 55px);
            grid-template-rows: repeat(4, 55px);
            gap: 2px;
            width: fit-content;
            margin: auto;">
          <button type="button" id="laugh" class="emote-btn" style="padding: 2px; width: 55px; height: 55px;" data-tooltip="Laugh" data-emote="laugh">
            <i class="fas fa-laugh-beam" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="angry" class="emote-btn" style="padding: 2px; width: 55px; height: 55px;" data-tooltip="Angry" data-emote="angry">
            <i class="fas fa-angry" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="surprised" class="emote-btn" style="padding: 2px; width: 55px; height: 55px;" data-tooltip="Surprised" data-emote="surprised">
            <i class="fas fa-surprise" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="shout" class="emote-btn" style="padding: 2px; width: 55px; height: 55px;" data-tooltip="Shout" data-emote="shout">
            <i class="fas fa-bullhorn" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="drunk" class="emote-btn" style="padding: 2px; width: 55px; height: 55px;" data-tooltip="Drunk" data-emote="drunk">
            <i class="fas fa-wine-glass" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="soul" class="emote-btn" style="padding: 2px; width: 55px; height: 55px;" data-tooltip="Soul" data-emote="soul">
            <i class="fas fa-ghost" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="slap" class="emote-btn" style="padding: 2px; width: 55px; height: 55px;" data-tooltip="Slap" data-emote="slap">
            <i class="fas fa-hand-paper" style="font-size: 2rem;"></i>
          </button>
        </div>
      </div>
    </form>
  `;
}

export async function generateEmotes() {
  if (game.gambitsEmoteBar.dialogOpen) return;
  game.gambitsEmoteBar.dialogOpen = true;

  const userFlags = game.user.getFlag("gambitsEmoteBar", "dialog-position-generateEmotes");
  const htmlContent = getEmoteDialogHTML();
  const state = { active: null };

  const emoteDialog = await foundry.applications.api.DialogV2.wait({
    window: { title: `Emote Bar`, minimizable: true },
    content: htmlContent,
    buttons: [{
      action: "close",
      label: `<i class='fas fa-times' style='margin-right: 5px;'></i>`,
      default: true
    }],
    render: (event) => {
      let dialog = event.target;
      game.gambitsEmoteBar.dialogInstance = dialog;
      animateTitleBar(dialog);
      let dialogElement = dialog?.element;
      if (userFlags) {
        dialog.setPosition({ top: userFlags.top, left: userFlags.left });
      }
      const buttons = dialogElement.querySelectorAll('.emote-btn');
      buttons.forEach(button => {
        setupTooltip(button);
        setupEmoteButton(button, state);
      });
    },
    close: (event) => {
      const dialog = event.target;
      const { top, left } = dialog.position;
      game.user.setFlag("gambitsEmoteBar", "dialog-position-generateEmotes", { top, left });
      game.gambitsEmoteBar.dialogOpen = false;
      game.gambitsEmoteBar.dialogInstance = null;
    },
    rejectClose: false
  });

  return emoteDialog;
}

async function handleEmoteClick({ emote, pickedTokens }) {
  for (let token of pickedTokens) {
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
        break;
      default:
        console.warn("No effect defined for emote:", emote);
    }
  }
}