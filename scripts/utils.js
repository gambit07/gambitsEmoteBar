import { setupEmoteButton } from './emoteHandler.js';

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
  if (emote === "Love") {
      tokens.forEach(token => {
        if (game.gambitsEmoteBar.loveActive) {
          game.gambitsEmoteBar.loveActive.set(token.id, false);
        }
      });
  }
  const isCustom = typeof emote === "object";
  if(isCustom) emote = emote.name;
  
  tokens.forEach(token => {
      Sequencer.EffectManager.endEffects({ name: `emoteBar${emote}_${token.id}_${game.gambitsEmoteBar.dialogUser}`, object: token });
  });
}

export function endAllEmoteEffects() {
  let emotes = game.gambitsEmoteBar.dialogEmotes;
  let tokens = getOwnedTokens();

  for(let emote of emotes) {
    if (emote === "Love") {
      tokens.forEach(token => {
        if (game.gambitsEmoteBar.loveActive) {
          game.gambitsEmoteBar.loveActive.set(token.id, false);
        }
      });
    }

    tokens.forEach(token => {
      Sequencer.EffectManager.endEffects({ name: `emoteBar${emote}_${token.id}_${game.gambitsEmoteBar.dialogUser}`, object: token });
    });
  }

  const customEmotes = game.settings.get("gambitsEmoteBar", "customEmotes") || {};
  if (customEmotes) {
    for (const [emoteName, emoteData] of Object.entries(customEmotes)) {
      tokens.forEach(token => {
        Sequencer.EffectManager.endEffects({ name: `emoteBar${emoteName}_${token.id}_${game.gambitsEmoteBar.dialogUser}`, object: token });
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
  const isCustom = typeof emote === "object";
  if(isCustom) emote = emote.name;
  return tokens.every(token => {
    const effectName = `emoteBar${emote}_${token.id}_${game.gambitsEmoteBar.dialogUser}`;
    const effects = Sequencer.EffectManager.getEffects({ name: effectName, object: token });
    return effects.length > 0;
  });
}

export function checkEffectsActive(button, state) {
  let tokens = getOwnedTokens();
  if(tokens.length === 0 || !tokens) return;

  tokens.some(token => {
    const effectName = `emoteBar${button.dataset.emote}_${token.id}_${game.gambitsEmoteBar.dialogUser}`;
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

// ===================
// Drag & Drop Functions
// ===================

let dragSrcEl = null;

// Event handler for when dragging starts
function handleDragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', this.id);
  this.classList.add('dragging');
}

// Event handler to allow a dragged element to be dropped
function handleDragOver(e) {
  if (e.preventDefault) e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}

// Event handler for when a dragged element enters a drop target
function handleDragEnter(e) {
  this.classList.add('over');
}

// Event handler for when a dragged element leaves a drop target
function handleDragLeave(e) {
  this.classList.remove('over');
}

// Event handler for when a drop occurs
function handleDrop(e) {
  if (e.stopPropagation) e.stopPropagation();
  const draggedId = e.dataTransfer.getData('text/plain');
  const draggedEl = document.getElementById(draggedId);
  if (draggedEl !== this) {
    const container = document.getElementById('emoteButtonsContainer');
    container.insertBefore(draggedEl, this);
    saveButtonOrder();
  }
  return false;
}

// Event handler to clean up after dragging ends
function handleDragEnd(e) {
  this.classList.remove('dragging');
  const items = document.querySelectorAll('#emoteButtonsContainer .gem-emote-btn');
  items.forEach(item => item.classList.remove('over'));
}

// Attach all the drag-and-drop event listeners to an element
function addDnDHandlers(item) {
  item.addEventListener('dragstart', handleDragStart, false);
  item.addEventListener('dragenter', handleDragEnter, false);
  item.addEventListener('dragover', handleDragOver, false);
  item.addEventListener('dragleave', handleDragLeave, false);
  item.addEventListener('drop', handleDrop, false);
  item.addEventListener('dragend', handleDragEnd, false);
}

/**
 * Initializes drag-and-drop functionality for the emote buttons
 * Called in the render callback after the dialog content is in the DOM
 */
export function initializeDragDrop() {
  const container = document.getElementById('emoteButtonsContainer');
  if (!container) return;
  const items = container.querySelectorAll('.gem-emote-btn');
  items.forEach(item => addDnDHandlers(item));
  loadButtonOrder();
}

/**
 * Saves the current order of emote buttons persistently using Foundry's flag API.
 */
export function saveButtonOrder() {
  const container = document.getElementById('emoteButtonsContainer');
  const order = Array.from(container.children).map(btn => btn.id);
  game.user.setFlag('gambitsEmoteBar', 'buttonOrder', order);
}

/**
 * Loads the saved emote button order and reorders the buttons accordingly.
 */
export async function loadButtonOrder() {
  const container = document.getElementById('emoteButtonsContainer');
  const savedOrder = await game.user.getFlag('gambitsEmoteBar', 'buttonOrder');
  if (savedOrder && Array.isArray(savedOrder)) {
    savedOrder.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) container.appendChild(btn);
    });
  }
}

export async function openIconPicker() {
  const fonts = await loadFontList();
  
  function formatIconName(icon) {
    if (!icon) return "";
    const words = icon.replace(/^fa-/, "").split("-");
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }
  
  let content = `
    <div style="display:flex; flex-direction: column; gap: 10px;">
      <input type="text" id="iconSearch" placeholder="${game.i18n.format("gambitsEmoteBar.dialog.placeholder.openIconPicker")}" style="padding: 5px; font-size: 14px;" />
      <div id="iconGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(50px, 1fr)); gap: 5px; max-height: 400px; overflow-y: auto;">
  `;
  
  for (let icon of fonts) {
    const tooltip = formatIconName(icon);
    content += `
      <div class="icon-option" data-icon="${icon}" data-tooltip="${tooltip}" style="cursor: pointer; text-align: center; border: 1px solid var(--color-warm-2); border-radius: 5px; padding: 5px;">
        <i class="fas ${icon}" style="font-size: 24px;"></i>
      </div>`;
  }
  
  content += `</div></div>`;
  
  let selectedIcon = null;
  
  const pickerDialog = await foundry.applications.api.DialogV2.wait({
    window: { title: `${game.i18n.format("gambitsEmoteBar.dialog.window.pickIcon")}`, id: "iconPickerDialog", minimizable: false },
    content: content,
    buttons: [
      {
        action: "select",
        label: `${game.i18n.format("gambitsEmoteBar.dialog.button.select")}`,
        icon: "fas fa-check",
        callback: () => selectedIcon,
        default: true
      },
      {
        action: "cancel",
        label: `${game.i18n.format("gambitsEmoteBar.dialog.button.cancel")}`,
        icon: "fas fa-times"
      }
    ],
    render: (event) => {
      const element = event.target.element;
      let dialog = event.target;
      animateTitleBar(dialog);
      const grid = element.querySelector("#iconGrid");
      const searchInput = element.querySelector("#iconSearch");
      
      searchInput.addEventListener("keyup", (e) => {
        const term = e.target.value.toLowerCase();
        grid.querySelectorAll(".icon-option").forEach(opt => {
          const text = opt.getAttribute("data-tooltip").toLowerCase();
          opt.style.display = text.includes(term) ? "" : "none";
        });
      });
      
      grid.querySelectorAll(".icon-option").forEach(opt => {
        opt.addEventListener("click", () => {
          grid.querySelectorAll(".icon-option").forEach(o => o.style.backgroundColor = "");
          opt.style.backgroundColor = "var(--color-warm-2)";
          selectedIcon = opt.getAttribute("data-icon");
        });
      });
    },
    close: () => {},
    rejectClose: false
  });
  
  return pickerDialog;
}

/**
 * Loads the full list of Font Awesome icon classes from a JSON file.
 * Expects the JSON file to contain an array of strings.
 * @returns {Promise<Array<string>>} The array of icon classes.
 */
export async function loadFontList() {
  const url = "modules/gambitsEmoteBar/assets/icons.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ${url}`);
    }
    const data = await response.json();
    // If the JSON is an object with a "fonts" property, return that array.
    if (data && Array.isArray(data.fonts)) {
      return data.fonts;
    }
    // Otherwise, if it's already an array, return it.
    if (Array.isArray(data)) {
      return data;
    }
    console.error("Unexpected format for icons JSON:", data);
    return [];
  } catch (error) {
    console.error("Error loading font list:", error);
    return [];
  }
}

export function updateEmoteButtons() {
  const container = document.getElementById('emoteButtonsContainer');
  if (!container) return;

  container.innerHTML = "";

  const hiddenEmotes = game.user.getFlag("gambitsEmoteBar", "hiddenEmotes") || [];
  const defaultEmotes = game.gambitsEmoteBar.dialogEmotes || [];

  defaultEmotes.forEach(emoteName => {
    if (hiddenEmotes.includes(emoteName)) return;

    const btn = document.createElement('button');
    btn.type = "button";
    btn.id = emoteName;
    btn.classList.add('gem-emote-btn', 'default-emote');

    btn.setAttribute('data-tooltip', game.gambitsEmoteBar.defaultEmoteMapping[emoteName]?.label);
    btn.setAttribute('data-emote', emoteName);
    btn.setAttribute('draggable', 'true');

    const iconClass = game.gambitsEmoteBar.defaultEmoteMapping[emoteName]?.icon || "fa-comment";
    btn.innerHTML = `<i class="fas ${iconClass}"></i>`;

    container.appendChild(btn);
  });

  const customEmotes = game.settings.get("gambitsEmoteBar", "customEmotes") || {};
  for (const [emoteName, data] of Object.entries(customEmotes)) {

    if (hiddenEmotes.includes(emoteName)) continue;

    const btn = document.createElement('button');
    btn.type = "button";
    btn.id = emoteName;
    btn.classList.add('gem-emote-btn', 'custom-emote');
    btn.setAttribute('data-tooltip', data.tooltip);
    btn.setAttribute('data-emote', `${emoteName}`);
    btn.setAttribute('draggable', 'true');
    btn.innerHTML = `<i class="fas ${data.icon}"></i>`;
    container.appendChild(btn);
  }

  const state = { active: null };
  container.querySelectorAll(".gem-emote-btn").forEach(btn => {
    setupEmoteButton(btn, state);
  });
}

/**
 * Opens the dialog for registering (or editing) a custom emote.
 * If an emoteId is passed, the dialog is in edit mode.
 */
export async function openRegisterCustomEmoteDialog(emoteId = null) {
  if(!game.user.isGM) return;
  // Load existing custom emotes from settings.
  let customEmotes = game.settings.get("gambitsEmoteBar", "customEmotes") || {};
  let data = emoteId ? customEmotes[emoteId] : { tooltip: "", icon: "", macro: "" };

  // Use a <div> wrapper instead of a <form> to avoid auto-submit behavior.
  const content = `
    <div id="registerCustomEmoteForm">
      <div style="margin-bottom: 8px;">
        <label for="emoteId"><strong>${game.i18n.format("gambitsEmoteBar.dialog.field.uniqueEmoteName")}</strong></label><br />
        <input type="text" id="emoteId" name="emoteId" value="${emoteId || ""}" ${emoteId ? "readonly" : ""} required pattern="^\\S+$" style="width: 100%;" placeholder="${game.i18n.format("gambitsEmoteBar.dialog.placeholder.emoteName")}"/>
      </div>

      <div style="margin-bottom: 8px;">
        <label for="tooltipText"><strong>${game.i18n.format("gambitsEmoteBar.dialog.field.emoteTooltipText")}</strong></label><br />
        <input type="text" id="tooltipText" name="tooltipText" value="${data.tooltip}" required style="width: 100%;" placeholder="${game.i18n.format("gambitsEmoteBar.dialog.placeholder.emoteTooltipText")}"/>
      </div>

      <div style="margin-bottom: 8px;">
        <label><strong>${game.i18n.format("gambitsEmoteBar.dialog.field.emoteIcon")}</strong></label><br />
        <div style="display: flex; align-items: center; gap: 10px;">
          <button type="button" id="pickIconBtn">Pick Emote Icon</button>
          <span id="selectedIconPreview">${ data.icon ? `<i class="fas ${data.icon}" style="font-size: 24px;"></i>` : "" }</span>
        </div>
        <input type="hidden" id="iconSelect" name="iconSelect" value="${data.icon}" />
      </div>

      <div style="margin-bottom: 8px;">
        <label><strong>${game.i18n.format("gambitsEmoteBar.dialog.field.macro")}</strong></label><br />
        <button type="button" id="editMacroBtn" data-tooltip="${game.i18n.format("gambitsEmoteBar.dialog.tooltip.openEmoteEditor")}">${game.i18n.format("gambitsEmoteBar.dialog.button.openEmoteEditor")}</button>
        <textarea id="macroCode" name="macroCode" style="display: none;">${data.macro}</textarea>
      </div>

      <div style="margin-bottom: 8px;">
        <label for="generatedName" data-tooltip="${game.i18n.format("gambitsEmoteBar.dialog.tooltip.generatedName")}"><strong>${game.i18n.format("gambitsEmoteBar.dialog.field.generatedName")}</strong></label><br />
        <input type="text" id="generatedName" style="width: 100%;" data-tooltip="${game.i18n.format("gambitsEmoteBar.dialog.tooltip.generatedName")}"/>
      </div>
    </div>
  `;

  const result = await foundry.applications.api.DialogV2.wait({
    window: { title: emoteId ? "Edit Custom Emote" : "Register Custom Emote", id: "registerCustomEmoteDialog" },
    content: content,
    buttons: [
      {
        action: "gem-wide-save",
        label: `${game.i18n.format("gambitsEmoteBar.dialog.button.saveEmote")}`,
        icon: "fas fa-save",
        close: false // Prevent auto-closing on button click.
      },
      {
        action: "gem-wide-close",
        label: `${game.i18n.format("gambitsEmoteBar.dialog.button.cancel")}`,
        icon: "fas fa-times",
        callback: async () => { openCustomEmoteListDialog(); }
      }
    ],
    render: (event, dialogRef) => {
      const element = event.target.element;
      animateTitleBar(event.target);

      // Update the generated name field in real time.
      const emoteIdInput = element.querySelector("#emoteId");
      const generatedNameInput = element.querySelector("#generatedName");
      if (emoteIdInput && generatedNameInput) {
        emoteIdInput.addEventListener("input", (e) => {
          const value = e.target.value.trim();
          generatedNameInput.value = !value ? "" : `.name(\`emoteBar${value}_\${token.id}_\${game.gambitsEmoteBar.dialogUser}\`)`;
        });
      }

      // Pick Icon button handler.
      element.querySelector('#pickIconBtn').addEventListener("click", async () => {
        const icon = await openIconPicker();
        if (icon) {
          element.querySelector('#iconSelect').value = icon;
          element.querySelector('#selectedIconPreview').innerHTML = `<i class="fas ${icon}" style="font-size:24px;"></i>`;
        }
      });

      // Macro Editor button handler.
      element.querySelector('#editMacroBtn').addEventListener("click", async () => {
        const currentEmoteId = element.querySelector(`#emoteId`).value;
        if (!currentEmoteId) {
          ui.notifications.error("You must enter your emote name before adding a macro.");
          return;
        }
        const macroTextarea = element.querySelector('#macroCode');
        const currentCode = macroTextarea.value;

        const macroEditorContent = `
          <form id="macroEditorForm">
            <div style="margin-bottom: 8px;">
              <label for="macroInput"><strong>${game.i18n.format("gambitsEmoteBar.dialog.field.macroCode")}</strong></label>
            </div>
            <div>
              <textarea id="macroInput" name="macroInput" style="width:100%; height:600px;">${currentCode}</textarea>
            </div>
          </form>
        `;

        await foundry.applications.api.DialogV2.wait({
          window: { title: `${game.i18n.format("gambitsEmoteBar.dialog.window.editMacroCode")}`, id: "macroEditorDialog", minimizable: false },
          content: macroEditorContent,
          buttons: [
            {
              action: "gem-ultrawide-save",
              label: `${game.i18n.format("gambitsEmoteBar.dialog.button.save")}`,
              icon: "fas fa-save",
              callback: (event, button, dialog) => {
                const newCode = button.form?.elements["macroInput"]?.value;
                macroTextarea.value = newCode;
                return newCode;
              },
              default: true
            },
            {
              action: "gem-ultrawide-close",
              label: `${game.i18n.format("gambitsEmoteBar.dialog.button.cancel")}`,
              icon: "fas fa-times"
            }
          ],
          rejectClose: false
        });
      });

      // Remove any built-in callback on the Save button so it doesn't auto-close.
      const saveButton = element.querySelector('button[data-action="gem-wide-save"]');
      if (saveButton) {
        // Remove any attached click listeners by cloning the node.
        const newSaveButton = saveButton.cloneNode(true);
        saveButton.parentNode.replaceChild(newSaveButton, saveButton);

        newSaveButton.addEventListener("click", async (event) => {
          event.preventDefault();
          event.stopPropagation();
          // Instead of using FormData (which expects a <form> element), grab the values directly.
          const newEmoteId = element.querySelector("#emoteId")?.value.trim();
          const tooltip = element.querySelector("#tooltipText")?.value.trim();
          const icon = element.querySelector("#iconSelect")?.value.trim();
          const macro = element.querySelector("#macroCode")?.value.trim();

          if (!newEmoteId || !/^\S+$/.test(newEmoteId)) {
            ui.notifications.error(`${game.i18n.format("gambitsEmoteBar.error.uniqueEmoteNameNoSpaces")}`);
            element.querySelector("#emoteId")?.focus();
            return;
          }
          if (!newEmoteId || !tooltip || !icon || !macro) {
            ui.notifications.error(`${game.i18n.format("gambitsEmoteBar.error.fillAllFields")}`);
            return;
          }

          const lowerNewEmoteId = newEmoteId.toLowerCase();
          const customExists = Object.keys(customEmotes).some(key => key.toLowerCase() === lowerNewEmoteId);
          const defaultExists = game.gambitsEmoteBar.dialogEmotes.some(emote => emote.toLowerCase() === lowerNewEmoteId);

          if (!emoteId && (customExists || defaultExists)) {
            ui.notifications.error(`${game.i18n.format("gambitsEmoteBar.error.emoteNameExists")}`);
            return;
          }

          // Save the new custom emote.
          customEmotes[newEmoteId] = { name: newEmoteId, tooltip, icon, macro };
          await game.settings.set("gambitsEmoteBar", "customEmotes", customEmotes);

          updateEmoteButtons();
          openCustomEmoteListDialog();
          dialogRef.close();
        });
      }
    },
    rejectClose: false
  });

  return result;
}

export async function showHideUnhideDialog() {
  let hiddenEmotes = game.user.getFlag("gambitsEmoteBar", "hiddenEmotes") || [];
  const customEmotes = game.settings.get("gambitsEmoteBar", "customEmotes") || {};
  const defaultEmotes = game.gambitsEmoteBar.dialogEmotes || [];

  let content = `<div style="display: flex; flex-direction: column; gap: 10px; max-height: 600px; overflow-y: auto;">`;

  if (defaultEmotes.length) {
    content += `<h3 style="margin: 0;">${game.i18n.format("gambitsEmoteBar.dialog.heading.defaultEmotes")}</h3>`;
    defaultEmotes.forEach(emoteName => {
      const isHidden = hiddenEmotes.includes(emoteName);
      const toggleIconHTML = `<i class="fas fa-user-secret"></i>`;
      content += `
        <div style="display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--color-warm-2); border-radius: 5px; padding: 5px;">
          <span>${game.gambitsEmoteBar.defaultEmoteMapping[emoteName]?.label}</span>
          <div style="display: flex; align-items: center; gap: 5px;">
            <i class="fas ${game.gambitsEmoteBar.defaultEmoteMapping[emoteName]?.icon}" style="font-size: 24px;"></i>
            <button data-emote="${emoteName}" data-type="default" data-toggle="${isHidden ? "unhide" : "hide"}" style="background: none; border: none; cursor: pointer;">
              ${toggleIconHTML}
            </button>
          </div>
        </div>
      `;
    });
  } else {
    content += `<p>${game.i18n.format("gambitsEmoteBar.dialog.message.noDefaultEmotes")}</p>`;
  }
  
  if (Object.keys(customEmotes).length) {
    content += `<h3 style="margin: 0;">${game.i18n.format("gambitsEmoteBar.dialog.heading.customEmotes")}</h3>`;
    for (const [emoteName, data] of Object.entries(customEmotes)) {
      const isHidden = hiddenEmotes.includes(emoteName);
      const toggleIconHTML = `<i class="fas fa-user-secret"></i>`;
      content += `
        <div style="display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--color-warm-2); border-radius: 5px; padding: 5px;">
          <span>${emoteName}</span>
          <div style="display: flex; align-items: center; gap: 5px;">
            <i class="fas ${data.icon}" style="font-size: 24px;"></i>
            <button data-emote="${emoteName}" data-type="custom" data-toggle="${isHidden ? "unhide" : "hide"}" style="background: none; border: none; cursor: pointer;">
              ${toggleIconHTML}
            </button>
          </div>
        </div>
      `;
    }
  } else {
    content += `<p>${game.i18n.format("gambitsEmoteBar.dialog.message.noCustomEmotes")}</p>`;
  }
  content += `</div>`;

  await foundry.applications.api.DialogV2.wait({
    window: { title: `${game.i18n.format("gambitsEmoteBar.dialog.window.manageHidingEmotes")}`, id: "emotesManagerDialog" },
    content: content,
    buttons: [
      {
        action: "gem-ultrawide-close",
        label: `${game.i18n.format("gambitsEmoteBar.dialog.button.close")}`,
        icon: "fas fa-times"
      }
    ],
    render: (event, dialogRef) => {
      const element = event.target.element;
      let dialog = event.target;
      animateTitleBar(dialog);
      
      element.querySelectorAll('button[data-emote]').forEach(btn => {
        btn.addEventListener("click", async () => {
          const emoteName = btn.getAttribute("data-emote");
          const toggleType = btn.getAttribute("data-toggle");
          if (toggleType === "hide") {
            if (!hiddenEmotes.includes(emoteName)) {
              hiddenEmotes.push(emoteName);
              await game.user.setFlag("gambitsEmoteBar", "hiddenEmotes", hiddenEmotes);
            }
          } else {
            hiddenEmotes = hiddenEmotes.filter(name => name !== emoteName);
            await game.user.setFlag("gambitsEmoteBar", "hiddenEmotes", hiddenEmotes);
          }

          updateEmoteButtons()
          await dialogRef.close();
          showHideUnhideDialog();
        });

        const state = {};
        const toggleType = btn.getAttribute("data-toggle");
        if (toggleType === "unhide") {
          toggleEmoteButton(btn, true, state);
        } else {
          toggleEmoteButton(btn, false, state);
        }
      });
    },
    rejectClose: false
  });
}

/**
 * Opens a dialog listing the current custom emotes.
 * Each emote entry has Edit and Delete buttons.
 * A plus button allows adding a new custom emote.
 * This dialog is restricted to GM users.
 */
export async function openCustomEmoteListDialog() {
  if(!game.user.isGM) return;
  let customEmotes = game.settings.get("gambitsEmoteBar", "customEmotes") || {};
  let listHtml = `<div id="customEmoteList">`;
  
  for (const [id, data] of Object.entries(customEmotes)) {
    listHtml += `
      <div class="custom-emote-item" style="margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--color-warm-2); border-radius: 5px; padding: 5px;">
          <div style="flex: 1; display: flex; align-items: center; gap: 6px;">
            <strong>${id}</strong>
            <i class="fas ${data.icon}" style="font-size: 1.2rem;"></i>
          </div>
          <div style="display: flex; gap: 6px;">
            <button data-action="edit" data-id="${id}">${game.i18n.format("gambitsEmoteBar.dialog.button.edit")}</button>
            <button data-action="delete" data-id="${id}">${game.i18n.format("gambitsEmoteBar.dialog.button.delete")}</button>
          </div>
        </div>
      </div>
    `;
  }
  
  listHtml += `
    </div>
    <div style="margin-top:10px; text-align: center;">
      <button id="addCustomEmote" style="font-size: 1.5rem; padding: 5px 10px;">+</button>
    </div>
  `;

  const result = await foundry.applications.api.DialogV2.wait({
    window: { title: `${game.i18n.format("gambitsEmoteBar.dialog.window.customEmoteMacros")}`, id: "customEmoteListDialog" },
    content: listHtml,
    buttons: [{
      action: "gem-ultrawide-close",
      label: `${game.i18n.format("gambitsEmoteBar.dialog.button.close")}`,
      icon: "fas fa-times",
      default: true
    }],
    render: (event) => {
      const element = event.target.element;
      let dialog = event.target;
      animateTitleBar(dialog);

      element.querySelectorAll('button[data-action="edit"]').forEach(btn => {
        btn.addEventListener("click", (ev) => {
          const id = btn.getAttribute("data-id");
          openRegisterCustomEmoteDialog(id);
        });
      });

      element.querySelectorAll('button[data-action="delete"]').forEach(btn => {
        btn.addEventListener("click", async (ev) => {
          const id = btn.getAttribute("data-id");
          let customEmotes = game.settings.get("gambitsEmoteBar", "customEmotes") || {};
          delete customEmotes[id];
          await game.settings.set("gambitsEmoteBar", "customEmotes", customEmotes);
          openCustomEmoteListDialog();
          updateEmoteButtons();
        });
      });

      element.querySelector('#addCustomEmote').addEventListener("click", () => {
        openRegisterCustomEmoteDialog();
      });
    },
    rejectClose: false
  });
  return result;
}