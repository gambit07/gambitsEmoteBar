import * as animations from './animations.js';
import * as utils from './utils.js';

function setupTooltip(button) {
  button.addEventListener('mouseenter', () => {
    const tooltipText = button.getAttribute('data-tooltip');
    game.tooltip.activate(button, { text: tooltipText, direction: "UP" });
  });
  button.addEventListener('mouseleave', () => {
    game.tooltip.deactivate();
  });
}

function setupEmoteButton(button, state) {
  button.dataset.active = "false";
  button.addEventListener('click', async (e) => {
    if (button.disabled) return;

    button.disabled = true;
    setTimeout(() => {
      button.disabled = false;
    }, 1000);

    const emote = button.dataset.emote;
    const tokens = utils.getPickedTokens(button);
    if (!tokens.length) return;
    
    if (utils.allEffectsActive(emote, tokens)) {
      utils.endEmoteEffects(emote, tokens);
      utils.toggleEmoteButton(button, false, state);
      if(state?.loveActive) game.gambitsEmoteBar.loveActive = false;
    } else {
      if (!e.shiftKey && state.active && state.active !== button) {
        ui.notifications.warn(game.i18n.format("gambitsEmoteBar.log.warning.selectMultiple"));
        button.disabled = false;
        return;
      }
      
      utils.toggleEmoteButton(button, true, state);
      if (!e.shiftKey) state.active = button;
      await handleEmoteClick({ emote, pickedTokens: tokens });

      if (emote === "slap") {
        utils.toggleEmoteButton(button, false, state);
      }
    }
  });
}

function setupCrosshairButton(crosshairButton) {
  if (!crosshairButton) return;

  crosshairButton.addEventListener("click", async () => {
      const tokens = utils.getPickedTokens(crosshairButton);
      if (tokens.length !== 1) {
      ui.notifications.warn(game.i18n.format("gambitsEmoteBar.log.warning.selectSingle"));
      return;
      }
      await utils.setOffsets(tokens[0]);
  });
}

function getEmoteDialogHTML() {
  return `
    <form>
      <div style="display: flex; flex-direction: column; align-items: center; width: fit-content; margin: auto;">
        <!-- Grid with 2 columns and 8 rows: 14 emote cells plus 1 row for the crosshair -->
        <div class="emote-buttons" style="
            display: grid;
            grid-template-columns: repeat(2, 55px);
            grid-template-rows: repeat(8, 55px);
            gap: 2px;
            width: fit-content;
            margin: auto;">
          <button type="button" id="laugh" class="emote-btn" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.laugh")}" 
                  data-emote="laugh" style="padding: 2px; width: 55px; height: 55px;">
            <i class="fas fa-laugh-beam" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="angry" class="emote-btn" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.angry")}" 
                  data-emote="angry" style="padding: 2px; width: 55px; height: 55px;">
            <i class="fas fa-angry" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="surprised" class="emote-btn" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.surprised")}" 
                  data-emote="surprised" style="padding: 2px; width: 55px; height: 55px;">
            <i class="fas fa-surprise" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="shout" class="emote-btn" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.shout")}" 
                  data-emote="shout" style="padding: 2px; width: 55px; height: 55px;">
            <i class="fas fa-bullhorn" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="drunk" class="emote-btn" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.drunk")}" 
                  data-emote="drunk" style="padding: 2px; width: 55px; height: 55px;">
            <i class="fas fa-wine-glass" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="soul" class="emote-btn" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.soul")}" 
                  data-emote="soul" style="padding: 2px; width: 55px; height: 55px;">
            <i class="fas fa-ghost" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="slap" class="emote-btn" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.slap")}" 
                  data-emote="slap" style="padding: 2px; width: 55px; height: 55px;">
            <i class="fas fa-hand-paper" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="cry" class="emote-btn" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.cry")}" 
                  data-emote="cry" style="padding: 2px; width: 55px; height: 55px;">
            <i class="fas fa-sad-tear" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="disgusted" class="emote-btn" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.disgusted")}" 
                  data-emote="disgusted" style="padding: 2px; width: 55px; height: 55px;">
            <i class="fas fa-face-rolling-eyes" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="giggle" class="emote-btn" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.giggle")}" 
                  data-emote="giggle" style="padding: 2px; width: 55px; height: 55px;">
            <i class="fas fa-grin-beam" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="love" class="emote-btn" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.love")}" 
                  data-emote="love" style="padding: 2px; width: 55px; height: 55px;">
            <i class="fas fa-heart" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="rofl" class="emote-btn" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.rofl")}" 
                  data-emote="rofl" style="padding: 2px; width: 55px; height: 55px;">
            <i class="fas fa-laugh-squint" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="smoking" class="emote-btn" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.smoking")}" 
                  data-emote="smoking" style="padding: 2px; width: 55px; height: 55px;">
            <i class="fas fa-smoking" style="font-size: 2rem;"></i>
          </button>
          <button type="button" id="nervous" class="emote-btn" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.nervous")}" 
                  data-emote="nervous" style="padding: 2px; width: 55px; height: 55px;">
            <i class="fas fa-frown-open" style="font-size: 2rem;"></i>
          </button>

          <button type="button" id="setOffsets" class="setOffsets" 
                  data-tooltip="${game.i18n.format("gambitsEmoteBar.menu.emote.offset")}" 
                  style="grid-column: span 2; width: 100%;">
            <i class="fas fa-bullseye" style="font-size: 1rem;"></i>
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
    window: { title: game.i18n.format("gambitsEmoteBar.controls.emoteBar.title"), minimizable: true },
    content: htmlContent,
    buttons: [{
      action: "close",
      label: `<i class='fas fa-times' style='margin-right: 5px;'></i>`,
      default: true
    }],
    render: (event) => {
      let dialog = event.target;
      game.gambitsEmoteBar.dialogInstance = dialog;
      utils.animateTitleBar(dialog);
      let dialogElement = dialog?.element;
      let crosshairButton = dialogElement.querySelector('#setOffsets');
      setupCrosshairButton(crosshairButton);

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
      default:
        console.warn(game.i18n.format("gambitsEmoteBar.log.warning.noEffect"), emote);
    }
  }
}