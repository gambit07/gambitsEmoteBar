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
      utils.checkEffectsActive(button, state);
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

function setupEndAllButton(endAllButton) {
  if (!endAllButton) return;

  endAllButton.addEventListener("click", async () => {
      utils.endAllEmoteEffects();

      let dialog = game.gambitsEmoteBar.dialogInstance;
      const { top, left } = dialog.position;
      await game.user.setFlag("gambitsEmoteBar", "dialog-position-generateEmotes", { top, left });
      game.gambitsEmoteBar.dialogOpen = false;
      game.gambitsEmoteBar.dialogInstance = null;
      await dialog.close();

      await generateEmotes();
  });
}

function getEmoteDialogHTML() {
  const showFilePicker = game.user.isGM || game.settings.get("gambitsEmoteBar", "emoteSoundEnablePerUser");
  const actionContainerClass = showFilePicker ? "action-container with-filepicker" : "action-container no-filepicker";
  return `
    <form>
      <div class="form-container">
        <div class="emote-buttons">
          <button type="button" id="laugh" class="emote-btn" 
                  data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.laugh')}" 
                  data-emote="laugh">
            <i class="fas fa-laugh-beam"></i>
          </button>
          <button type="button" id="angry" class="emote-btn" 
                  data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.angry')}" 
                  data-emote="angry">
            <i class="fas fa-angry"></i>
          </button>
          <button type="button" id="surprised" class="emote-btn" 
                  data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.surprised')}" 
                  data-emote="surprised">
            <i class="fas fa-surprise"></i>
          </button>
          <button type="button" id="shout" class="emote-btn" 
                  data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.shout')}" 
                  data-emote="shout">
            <i class="fas fa-bullhorn"></i>
          </button>
          <button type="button" id="drunk" class="emote-btn" 
                  data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.drunk')}" 
                  data-emote="drunk">
            <i class="fas fa-wine-glass"></i>
          </button>
          <button type="button" id="soul" class="emote-btn" 
                  data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.soul')}" 
                  data-emote="soul">
            <i class="fas fa-ghost"></i>
          </button>
          <button type="button" id="slap" class="emote-btn" 
                  data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.slap')}" 
                  data-emote="slap">
            <i class="fas fa-hand-paper"></i>
          </button>
          <button type="button" id="cry" class="emote-btn" 
                  data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.cry')}" 
                  data-emote="cry">
            <i class="fas fa-sad-tear"></i>
          </button>
          <button type="button" id="disgusted" class="emote-btn" 
                  data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.disgusted')}" 
                  data-emote="disgusted">
            <i class="fas fa-face-rolling-eyes"></i>
          </button>
          <button type="button" id="giggle" class="emote-btn" 
                  data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.giggle')}" 
                  data-emote="giggle">
            <i class="fas fa-grin-beam"></i>
          </button>
          <button type="button" id="love" class="emote-btn" 
                  data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.love')}" 
                  data-emote="love">
            <i class="fas fa-heart"></i>
          </button>
          <button type="button" id="rofl" class="emote-btn" 
                  data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.rofl')}" 
                  data-emote="rofl">
            <i class="fas fa-laugh-squint"></i>
          </button>
          <button type="button" id="smoking" class="emote-btn" 
                  data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.smoking')}" 
                  data-emote="smoking">
            <i class="fas fa-smoking"></i>
          </button>
          <button type="button" id="nervous" class="emote-btn" 
                  data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.nervous')}" 
                  data-emote="nervous">
            <i class="fas fa-frown-open"></i>
          </button>

          <div class="action-button-grid">
            <div class="action-container end-all">
              <button type="button" id="endAllEffects" class="action-button" data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.endAll')}">
                <i class="fas fa-eraser"></i>
              </button>
            </div>
            
            <div class="${actionContainerClass}">
              <button type="button" id="setOffsets" class="action-button" data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.offset')}">
                <i class="fas fa-bullseye"></i>
              </button>
              ${ showFilePicker ? `
              <button type="button" id="openFilePicker" class="action-button" data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.filepicker')}">
                <i class="fas fa-file-audio"></i>
              </button>
              ` : "" }
            </div>
          </div>
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
      label: `<i class='fas fa-times'></i>`,
      default: true
    }],
    render: (event) => {
      let dialog = event.target;
      utils.animateTitleBar(dialog);
      let dialogElement = dialog?.element;
      let crosshairButton = dialogElement.querySelector('#setOffsets');
      setupCrosshairButton(crosshairButton);
      let endAllButton = dialogElement.querySelector('#endAllEffects');
      setupEndAllButton(endAllButton);
      
      const fileSelectButton = dialogElement.querySelector('#openFilePicker');
      if (fileSelectButton) {
        fileSelectButton.addEventListener("click", () => {
          openSoundSelectionDialog();
        });
      }

      if (userFlags) {
        dialog.setPosition({ top: userFlags.top, left: userFlags.left });
      }
      
      const buttons = dialogElement.querySelectorAll('.emote-btn');
      buttons.forEach(button => {
        utils.checkEffectsActive(button, state);
        setupTooltip(button);
        setupEmoteButton(button, state);
      });

      game.gambitsEmoteBar.dialogInstance = dialog;
    },
    close: async (event) => {
      const dialog = event.target;
      const { top, left } = dialog.position;
      await game.user.setFlag("gambitsEmoteBar", "dialog-position-generateEmotes", { top, left });
      game.gambitsEmoteBar.dialogOpen = false;
      game.gambitsEmoteBar.dialogInstance = null;
    },
    rejectClose: false
  });

  return emoteDialog;
}

async function openSoundSelectionDialog() {
  const emotes = game.gambitsEmoteBar.dialogEmotes;

  const moduleDefaults = game.settings.get("gambitsEmoteBar", "emoteSoundPaths") || {};
  const userOverrides = game.user.getFlag("gambitsEmoteBar", "emoteSoundOverrides") || {};

  let content = `<form>`;
  for (const emote of emotes) {
    const initialValue = game.user.isGM
      ? (moduleDefaults[emote] || "")
      : (userOverrides[emote] || moduleDefaults[emote] || "");
    content += `
      <div style="display: flex; align-items: center; margin-bottom: 4px;">
        <label for="soundPath_${emote}" style="width: 80px;">${emote}:</label>
        <input type="text" name="soundPath_${emote}" id="soundPath_${emote}" value="${initialValue}" placeholder="Enter sound file path…" style="flex: 1; margin-right: 4px;" />
        <button type="button" id="browseSound_${emote}" title="Browse sound files" style="width: 30px; height: 30px; padding: 2px; flex-shrink: 0;">
          <i class="fas fa-folder-open" style="font-size: 0.8rem;"></i>
        </button>
      </div>
    `;
  }
  content += `</form>`;

  const result = await foundry.applications.api.DialogV2.wait({
    window: { title: "Select Emote Sound Files" },
    content: content,
    buttons: [
      {
        action: "confirm",
        label: `<i class='fas fa-check'></i> Confirm`,
        callback: async (event, button, dialog) => {
          const soundPaths = {};
          const form = button.form;
          for (const emote of emotes) {
            soundPaths[emote] = form?.elements[`soundPath_${emote}`]?.value || "";
          }
          return soundPaths;
        },
        default: true
      },
      {
        action: "cancel",
        label: `<i class='fas fa-times'></i> Cancel`
      }
    ],
    render: event => {
      const element = event.target.element;
      for (const emote of emotes) {
        const browseButton = element.querySelector(`#browseSound_${emote}`);
        if (browseButton) {
          browseButton.addEventListener("click", () => {
            const inputEl = element.querySelector(`#soundPath_${emote}`);
            const defaultSoundPath = game.settings.get("gambitsEmoteBar", "emoteSoundDefaultPath") || "/";
            const startingPath = (inputEl && inputEl.value) ? inputEl.value : defaultSoundPath;
            new FilePicker({
              type: "audio",
              current: startingPath,
              callback: path => {
                if (inputEl) inputEl.value = path;
              }
            }).render(true);
          });
        }
      }
    },
    close: event => {
      return;
    },
    rejectClose: false
  });

  if (result && result !== "cancel") {
    if (game.user.isGM) {
      await game.settings.set("gambitsEmoteBar", "emoteSoundPaths", result);
    } else {
      await game.user.setFlag("gambitsEmoteBar", "emoteSoundOverrides", result);
    }
  }

  return result;
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