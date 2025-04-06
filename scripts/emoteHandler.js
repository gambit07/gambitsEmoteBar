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

export function setupEmoteButton(button, state) {
  button.dataset.active = "false";

  button.addEventListener('click', async (e) => {
    if (button.disabled) return;

    button.disabled = true;
    setTimeout(() => { button.disabled = false; }, 1000);

    let emote = button.dataset.emote;
    const tokens = utils.getPickedTokens(button);
    if (!tokens.length) return;

    const customEmotes = game.settings.get("gambitsEmoteBar", "customEmotes") || {};
    let persistentEffect = false;
    let customEmote = false;
    if (customEmotes.hasOwnProperty(emote)) {
      emote = customEmotes[emote];
      customEmote = true;
      persistentEffect = typeof emote.macro === "string" && emote.macro.includes(".persist()");
    }

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

      if (emote === "Slap" || emote === "ThunderHype" || (!persistentEffect && customEmote)) {
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
  const actionContainerClass = showFilePicker ? "gem-action-container dual-column-custom" : "gem-action-container single-column-custom";
  return `
    <html>
      <body>
        <form>
          <div class="gem-form-container">
            <!-- Scrollable Emote Buttons Container -->
            <div class="gem-emote-scroll-container">
              <div class="gem-emote-buttons" id="emoteButtonsContainer">
                <!-- Default emote buttons -->
                <button type="button" id="laugh" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.laugh')}" 
                        data-emote="Laugh" draggable="true">
                  <i class="fas fa-laugh-beam"></i>
                </button>
                <button type="button" id="angry" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.angry')}" 
                        data-emote="Angry" draggable="true">
                  <i class="fas fa-angry"></i>
                </button>
                <button type="button" id="surprised" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.surprised')}" 
                        data-emote="Surprised" draggable="true">
                  <i class="fas fa-surprise"></i>
                </button>
                <button type="button" id="shout" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.shout')}" 
                        data-emote="Shout" draggable="true">
                  <i class="fas fa-bullhorn"></i>
                </button>
                <button type="button" id="drunk" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.drunk')}" 
                        data-emote="Drunk" draggable="true">
                  <i class="fas fa-wine-glass"></i>
                </button>
                <button type="button" id="soul" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.soul')}" 
                        data-emote="Soul" draggable="true">
                  <i class="fas fa-ghost"></i>
                </button>
                <button type="button" id="slap" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.slap')}" 
                        data-emote="Slap" draggable="true">
                  <i class="fas fa-hand-paper"></i>
                </button>
                <button type="button" id="cry" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.cry')}" 
                        data-emote="Cry" draggable="true">
                  <i class="fas fa-sad-tear"></i>
                </button>
                <button type="button" id="disgusted" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.disgusted')}" 
                        data-emote="Disgusted" draggable="true">
                  <i class="fas fa-face-rolling-eyes"></i>
                </button>
                <button type="button" id="giggle" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.giggle')}" 
                        data-emote="Giggle" draggable="true">
                  <i class="fas fa-grin-beam"></i>
                </button>
                <button type="button" id="love" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.love')}" 
                        data-emote="Love" draggable="true">
                  <i class="fas fa-heart"></i>
                </button>
                <button type="button" id="rofl" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.rofl')}" 
                        data-emote="Rofl" draggable="true">
                  <i class="fas fa-laugh-squint"></i>
                </button>
                <button type="button" id="smoking" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.smoking')}" 
                        data-emote="Smoking" draggable="true">
                  <i class="fas fa-smoking"></i>
                </button>
                <button type="button" id="nervous" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.nervous')}" 
                        data-emote="Nervous" draggable="true">
                  <i class="fas fa-frown-open"></i>
                </button>
                <button type="button" id="party" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.party')}" 
                        data-emote="Party" draggable="true">
                  <i class="fas fa-birthday-cake"></i>
                </button>
                <button type="button" id="thunderHype" class="gem-emote-btn" 
                        data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.thunderHype')}" 
                        data-emote="ThunderHype" draggable="true">
                  <i class="fa-solid fa-sword"></i>
                </button>
              </div>
            </div>
            
            <!-- Fixed Bottom Buttons Container -->
            <div class="gem-fixed-action-container">
              <div class="gem-action-button-grid">
                ${ game.user.isGM ? `
                  <div class="gem-action-container register-emote">
                    <div class="gem-action-container custom-emote-register">
                      <button type="button" id="registerCustomEmote" class="gem-action-button" data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.registerDialog')}">
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                ` : "" }
                <div class="gem-action-container dual-column">
                  <button type="button" id="endAllEffects" class="gem-action-button" data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.endAll')}">
                    <i class="fas fa-eraser"></i>
                  </button>
                  <button type="button" id="hideUnhideEmotes" class="gem-action-button" data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.hideUnhideEmote')}">
                    <i class="fas fa-user-secret"></i>
                  </button>
                </div>
                <div class="${actionContainerClass}">
                  <button type="button" id="setOffsets" class="gem-action-button" data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.offset')}">
                    <i class="fas fa-bullseye"></i>
                  </button>
                  ${ showFilePicker ? `
                  <button type="button" id="openFilePicker" class="gem-action-button" data-tooltip="${game.i18n.format('gambitsEmoteBar.menu.emote.filepicker')}">
                    <i class="fas fa-file-audio"></i>
                  </button>
                  ` : "" }
                </div>
              </div>
            </div>
          </div>
        </form>
      </body>
    </html>
  `;
}

export async function generateEmotes() {
  if (game.gambitsEmoteBar.dialogOpen) return;
  game.gambitsEmoteBar.dialogOpen = true;

  const userFlags = game.user.getFlag("gambitsEmoteBar", "dialog-position-generateEmotes");
  const htmlContent = getEmoteDialogHTML();
  const state = { active: null };

  const emoteDialog = await foundry.applications.api.DialogV2.wait({
    window: { title: game.i18n.format("gambitsEmoteBar.controls.emoteBar.title"), minimizable: true, id: "gem-dialog" },
    content: htmlContent,
    buttons: [{
      action: "gem-close",
      label: `${game.i18n.format("gambitsEmoteBar.dialog.button.close")}`,
      icon: "fas fa-times",
      default: true
    }],
    render: (event) => {
      let dialog = event.target;
      utils.animateTitleBar(dialog);
      let dialogElement = dialog?.element;
      dialogElement.style.setProperty("width", "150px", "important");
      dialogElement.style.setProperty("min-width", "100px", "important");
      dialogElement.style.setProperty("padding-left", "0px", "important");
      dialogElement.style.setProperty("padding-right", "0px", "important");
      dialogElement.style.setProperty("margin-left", "0px", "important");
      dialogElement.style.setProperty("margin-right", "0px", "important");
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

      utils.updateEmoteButtons();
      utils.loadButtonOrder();
      
      const buttons = dialogElement.querySelectorAll('.gem-emote-btn');
      buttons.forEach(button => {
        utils.checkEffectsActive(button, state);
        setupTooltip(button);
        setupEmoteButton(button, state);
      });

      if (game.user.isGM) {
        const registerBtn = dialogElement.querySelector('#registerCustomEmote');
        if (registerBtn) {
          registerBtn.addEventListener("click", () => {
            utils.openCustomEmoteListDialog();
          });
        }
      }

      const hiddenBtn = dialogElement.querySelector('#hideUnhideEmotes');
      if (hiddenBtn) {
        hiddenBtn.addEventListener("click", () => {
          utils.showHideUnhideDialog();
        });
      }

      utils.initializeDragDrop();

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
        <input type="text" name="soundPath_${emote}" id="soundPath_${emote}" value="${initialValue}" placeholder="${game.i18n.format("gambitsEmoteBar.dialog.placeholder.soundFilePath")}" style="flex: 1; margin-right: 4px;" />
        <button type="button" id="browseSound_${emote}" title="${game.i18n.format("gambitsEmoteBar.dialog.heading.browseSoundFiles")}" style="width: 30px; height: 30px; padding: 2px; flex-shrink: 0;">
          <i class="fas fa-folder-open" style="font-size: 0.8rem;"></i>
        </button>
      </div>
    `;
  }
  content += `</form>`;

  const result = await foundry.applications.api.DialogV2.wait({
    window: { title: `${game.i18n.format("gambitsEmoteBar.dialog.window.emoteSoundFiles")}` },
    content: content,
    buttons: [
      {
        action: "save",
        label: `${game.i18n.format("gambitsEmoteBar.dialog.button.save")}`,
        icon: "fas fa-check",
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
        label: `${game.i18n.format("gambitsEmoteBar.dialog.button.cancel")}`,
        icon: "fas fa-times",
      }
    ],
    render: event => {
      const element = event.target.element;
      let dialog = event.target;
      utils.animateTitleBar(dialog);
      
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
  const isCustom = typeof emote === "object" && emote.macro;
  
  for (let token of pickedTokens) {
    if (isCustom) {
      try {
        await executeCustomMacro(emote.macro, token);
      } catch (err) {
        console.error(`${game.i18n.format("gambitsEmoteBar.log.warning.handleEmoteClick")}`, err);
      }
    } else {
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
        default:
          console.warn(game.i18n.format("gambitsEmoteBar.log.warning.noEffect"), emote);
      }
    }
  }
}

async function executeCustomMacro(macroCode, token) {
  try {
    const func = new Function("token", macroCode);
    await func(token);
  } catch (error) {
    console.error(`${game.i18n.format("gambitsEmoteBar.log.warning.handleEmoteClick")}`, error);
  }
}