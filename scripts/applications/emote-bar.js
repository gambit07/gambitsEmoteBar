import { GemBaseFormV2 } from "../base-form.js";
import { packageId } from "../constants.js";
import * as utils from "../utils.js";
import { handleEmoteClick } from "../emote-logic.js";
import { EmoteSoundConfigApp } from "./emote-sound-config.js";
import { EmoteVisibilityManagerApp } from "./emote-visibility-manager.js";
import { CustomEmoteListApp } from "./custom-emote-list.js";
import { TriggerListApp } from "./trigger-list.js";

export class EmoteBarApp extends GemBaseFormV2 {
  constructor(options = {}) {
    super(options);
    EmoteBarApp.instance = this;
    this._state = { active: null };
    this._posLoaded = false;
    this._sizeAdjusted = false;
    this._highlightInterval = null;
    this._controlTokenHookId = null;
    this._timedEndTimers = new Map();

    try {
      const available = Number(globalThis?.window?.innerHeight) || 0;
      const desired = Math.floor(available * 0.7);
      if (desired > 0) {
        this.options.position ??= {};
        this.options.position.height = desired;
        this.options.position.minHeight = desired;
        this.options.position.maxHeight = desired;
        this.position.height = desired;
      }
    } catch (_) {}
  }

  static DEFAULT_OPTIONS = {
    id: "gem-emote-bar",
    tag: "section",
    classes: ["gem", "gem-emote-bar", "form-v2"],
    window: {
      title: "gambitsEmoteBar.controls.emoteBar.title",
      minimizable: true,
      resizable: false,
      controls: [
        {
          icon: "fas fa-sort-alpha-down",
          label: "gambitsEmoteBar.controls.emoteBar.resetOrderAZ",
          action: "resetOrderAZ",
          visible: () => true,
        },
      ],
    },
    position: { width: 106, height: 500, zIndex: 102 },
    actions: {
      endAll: EmoteBarApp.endAll,
      openVisibility: EmoteBarApp.openVisibility,
      openSoundConfig: EmoteBarApp.openSoundConfig,
      setOffsets: EmoteBarApp.setOffsets,
      openCustomEmotes: EmoteBarApp.openCustomEmotes,
      resetOrderAZ: EmoteBarApp.resetOrderAZ,
    },
  };

  static async resetOrderAZ() {
    try {

      const defaultEmotes = (game.gambitsEmoteBar?.dialogEmotes || []).slice();
      const customEmotes = game.settings.get(packageId, "customEmotes") || {};
      const ids = [...defaultEmotes, ...Object.keys(customEmotes)];

      ids.sort((a, b) => String(a).localeCompare(String(b), undefined, { sensitivity: "base", numeric: true }));
      await game.user.setFlag(packageId, "buttonOrder", ids);

      const inst = EmoteBarApp.instance;
      if (inst?.rendered) inst.render(true);

      ui.notifications.info(game.i18n.localize("gambitsEmoteBar.controls.emoteBar.resetOrderAZDone"));
    } catch (err) {
      console.error("gambitsEmoteBar | resetOrderAZ failed", err);
      ui.notifications.error("gambitsEmoteBar | Unable to reset emote order.");
    }
  }

  static PARTS = [
    { template: `modules/${packageId}/templates/gem-emote-bar.hbs` },
  ];

  async _prepareContext() {
    const hiddenEmotes = (game.user.getFlag(packageId, "hiddenEmotes") || []).slice();
    const customEmotes = game.settings.get(packageId, "customEmotes") || {};
    const defaultEmotes = game.gambitsEmoteBar?.dialogEmotes || [];

    const buttons = [];

    for (const emoteId of defaultEmotes) {
      if (hiddenEmotes.includes(emoteId)) continue;
      const meta = game.gambitsEmoteBar?.defaultEmoteMapping?.[emoteId] || {};
      const icon = meta.icon || "fa-comment";
      const tooltip = meta.label || emoteId;
      const iconClass = emoteId === "ThunderHype" ? `fa-solid ${icon}` : `fas ${icon}`;
      const persistent = !["Slap", "ThunderHype"].includes(emoteId);
      buttons.push({
        id: emoteId,
        emoteId,
        tooltip,
        iconClass,
        isCustom: false,
        persistent: String(persistent),
      });
    }

    for (const [id, data] of Object.entries(customEmotes)) {
      if (hiddenEmotes.includes(id)) continue;
      const persistent = typeof data?.macro === "string" && data.macro.includes(".persist(");
      buttons.push({
        id,
        emoteId: id,
        tooltip: data.tooltip || id,
        iconClass: `fas ${data.icon || "fa-comment"}`,
        isCustom: true,
        persistent: String(persistent),
      });
    }

    const savedOrder = await game.user.getFlag(packageId, "buttonOrder");
    if (Array.isArray(savedOrder) && savedOrder.length) {
      const map = new Map(buttons.map(b => [b.id, b]));
      const ordered = [];
      for (const id of savedOrder) {
        const btn = map.get(id);
        if (btn) {
          ordered.push(btn);
          map.delete(id);
        }
      }
      for (const btn of map.values()) ordered.push(btn);
      buttons.length = 0;
      buttons.push(...ordered);
    }

    const showFilePicker = game.user.isGM || game.settings.get(packageId, "emoteSoundEnablePerUser");

    const timedEmotesEnabled = Boolean(game.settings.get(packageId, "timedEmotesEnabled"));
    let timedEmotesDuration = Number(game.settings.get(packageId, "timedEmotesDuration"));
    if (!Number.isFinite(timedEmotesDuration)) timedEmotesDuration = 5;
    timedEmotesDuration = Math.clamp ? Math.clamp(timedEmotesDuration, 5, 60) : Math.max(5, Math.min(60, timedEmotesDuration));

    return {
      isGM: game.user.isGM,
      isV13: game.gambitsEmoteBar?.isV13,
      showFilePicker,
      actionContainerClass: showFilePicker ? "gem-action-container dual-column-custom" : "gem-action-container single-column-custom",
      timedEmotesEnabled,
      timedEmotesDuration,
      buttons,
    };
  }

  _onRender(options) {
    super._onRender(options);

    try {
      const h = Number(this.position?.height) || Number(this.options?.position?.height) || 0;
      const el = this.element;
      if (el && h > 0) {
        el.style.setProperty("height", `${h}px`, "important");
        el.style.setProperty("max-height", `${h}px`, "important");
      }
    } catch (_) {}

    if (!this._posLoaded) {
      this._posLoaded = true;
      const userFlags = game.user.getFlag(packageId, "dialog-position-generateEmotes");
      if (userFlags?.top != null && userFlags?.left != null) {
        try { this.setPosition({ top: userFlags.top, left: userFlags.left }); } catch (_) {}
      }
    }

    const el = this.element;
    if (!el) return;
    el.style.setProperty("min-width", "106px", "important");
    el.style.setProperty("padding-left", "0px", "important");
    el.style.setProperty("padding-right", "0px", "important");

    this._bindPlayModeControls(el);
    this._bindEmoteButtons(el);
    this._bindDragDrop(el);

    this._startHighlightWatcher();

    this._updateEndAllTooltip();

    el.querySelectorAll(".gem-emote-btn").forEach(btn => utils.checkEffectsActive(btn, this._state));

    game.gambitsEmoteBar.dialogOpen = true;
    game.gambitsEmoteBar.dialogInstance = this;
  }

  async _onClose(options) {
    try {
      if (this._highlightInterval) {
        clearInterval(this._highlightInterval);
        this._highlightInterval = null;
      }
      if (this._controlTokenHookId) {
        Hooks.off("controlToken", this._controlTokenHookId);
        this._controlTokenHookId = null;
      }
    } catch (_) {}

    try { this._clearTimedEndTimers(); } catch (_) {}

    try {
      const { top, left } = this.position;
      await game.user.setFlag(packageId, "dialog-position-generateEmotes", { top, left });
    } catch (_) {}

    game.gambitsEmoteBar.dialogOpen = false;
    game.gambitsEmoteBar.dialogInstance = null;

    return super._onClose?.(options);
  }

  _startHighlightWatcher() {
    if (!this._controlTokenHookId) {
      this._controlTokenHookId = Hooks.on("controlToken", () => this._refreshHighlights());
    }

    if (!this._highlightInterval) {
      this._highlightInterval = setInterval(() => this._refreshHighlights(), 500);
    }
  }

  _refreshHighlights() {
    if (!this.rendered) return;
    const el = this.element;
    if (!el) return;
    el.querySelectorAll(".gem-emote-btn").forEach(btn => utils.checkEffectsActive(btn, this._state));

    this._updateEndAllTooltip();
  }

  _updateEndAllTooltip() {
    const el = this.element;
    if (!el) return;

    const btn = el.querySelector('[data-action="endAll"]');
    if (!btn) return;

    const controlled = canvas.tokens.controlled ?? [];
    const tooltip = controlled.length
      ? (game.i18n.localize("gambitsEmoteBar.menu.emote.endAllSelected") || game.i18n.localize("gambitsEmoteBar.menu.emote.endAll"))
      : (game.i18n.localize("gambitsEmoteBar.menu.emote.endAllAll") || game.i18n.localize("gambitsEmoteBar.menu.emote.endAll"));

    btn.dataset.tooltip = tooltip;
  }


  _bindPlayModeControls(root) {
    const toggle = root.querySelector('[data-action="togglePlayMode"]');
    if (toggle) {
      toggle.addEventListener("click", async () => {
        const next = !Boolean(game.settings.get(packageId, "timedEmotesEnabled"));
        await game.settings.set(packageId, "timedEmotesEnabled", next);
        this.render(true);
      });
    }

    const range = root.querySelector('input[name="timedEmotesDurationRange"]');
    const number = root.querySelector('input[name="timedEmotesDurationNumber"]');

    const clamp = (v) => {
      const n = Number(v);
      if (!Number.isFinite(n)) return 5;
      return Math.max(5, Math.min(60, Math.round(n)));
    };

    const sync = (value) => {
      if (range) range.value = String(value);
      if (number) number.value = String(value);
    };

    if (range) {
      range.addEventListener("input", () => sync(clamp(range.value)));
      range.addEventListener("change", async () => {
        const v = clamp(range.value);
        sync(v);
        await game.settings.set(packageId, "timedEmotesDuration", v);
      });
    }

    if (number) {
      number.addEventListener("input", () => sync(clamp(number.value)));
      number.addEventListener("change", async () => {
        const v = clamp(number.value);
        sync(v);
        await game.settings.set(packageId, "timedEmotesDuration", v);
      });
    }
  }

  _clearTimedEndTimers({ emoteId = null, tokens = null } = {}) {
    const tokenIds = tokens ? new Set(tokens.map(t => t.id)) : null;

    for (const [key, tId] of this._timedEndTimers.entries()) {
      const [tokenId, eId] = key.split("|");
      if (tokenIds && !tokenIds.has(tokenId)) continue;
      if (emoteId && eId !== emoteId) continue;
      clearTimeout(tId);
      this._timedEndTimers.delete(key);
    }

  }

  _scheduleTimedEnd({ emoteId, tokens, seconds }) {
    this._clearTimedEndTimers({ emoteId, tokens });

    const delay = Math.max(1, Math.floor(seconds)) * 1000;

    for (const token of tokens) {
      const key = `${token.id}|${emoteId}`;
      const timeoutId = setTimeout(async () => {
        try {
          await utils.endEmoteEffects(emoteId, [token]);
          if (emoteId === "Love" && game.gambitsEmoteBar?.loveActive?.set) game.gambitsEmoteBar.loveActive.set(token.id, false);
          if (emoteId === "Suspicious" && game.gambitsEmoteBar?.suspiciousActive?.set) game.gambitsEmoteBar.suspiciousActive.set(token.id, false);
        } catch (err) {
          console.warn("gambitsEmoteBar | Timed end failed", err);
        } finally {
          this._timedEndTimers.delete(key);
          try { this._refreshHighlights(); } catch (_) {}
        }
      }, delay);

      this._timedEndTimers.set(key, timeoutId);
    }

  }

  _bindEmoteButtons(root) {
    const buttons = root.querySelectorAll(".gem-emote-btn");
    for (const button of buttons) {
      button.dataset.active ??= "false";

      button.addEventListener("mouseenter", () => {
        const baseText = button.getAttribute("data-tooltip") || "";
        if (game.user.isGM) {
          const emoteId = button.dataset.emote;
          const triggersMap = game.settings.get(packageId, "emoteTriggers") || {};
          const count = (triggersMap[emoteId] || []).length;
          const suffix = count
            ? ` (${count} ${count === 1 ? game.i18n.format("gambitsEmoteBar.dialog.tooltip.trigger") : game.i18n.format("gambitsEmoteBar.dialog.tooltip.triggers")})`
            : "";
          game.tooltip.activate(button, { text: `${baseText}${suffix}`, direction: "UP" });
        } else {
          game.tooltip.activate(button, { text: baseText, direction: "UP" });
        }
      });
      button.addEventListener("mouseleave", () => game.tooltip.deactivate());

      button.addEventListener("click", (e) => this._onEmoteButtonClick(e, button));

      button.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!game.user.isGM) return;
        TriggerListApp.open(button.dataset.emote);
      });
    }
  }

  async _onEmoteButtonClick(e, button) {
    if (button.disabled) return;

    button.disabled = true;
    setTimeout(() => { button.disabled = false; }, 1000);

    const tokens = utils.getPickedTokens(button);
    if (!tokens.length) return;

    let emoteId = button.dataset.emote;
    const customEmotes = game.settings.get(packageId, "customEmotes") || {};

    let emote = emoteId;
    let customEmote = false;
    let persistentEffect = false;

    if (Object.prototype.hasOwnProperty.call(customEmotes, emoteId)) {
      emote = customEmotes[emoteId];
      customEmote = true;
      persistentEffect = typeof emote.macro === "string" && emote.macro.includes(".persist(");
    }

    const isEphemeral = ["Slap", "ThunderHype"].includes(emoteId) || (customEmote && !persistentEffect);

    if (utils.allEffectsActive(emoteId, tokens)) {
      try { this._clearTimedEndTimers({ emoteId, tokens }); } catch (_) {}
      await utils.endEmoteEffects(emoteId, tokens);

      setTimeout(() => utils.checkEffectsActive(button, this._state, tokens), 150);

      return;
    }

    if (this._state.active && !(this.element?.contains?.(this._state.active))) this._state.active = null;

    if (!e.shiftKey && this._state.active && this._state.active !== button) {
      ui.notifications.warn(game.i18n.format("gambitsEmoteBar.log.warning.selectMultiple"));
      button.disabled = false;
      return;
    }

    if (!isEphemeral) {
      utils.toggleEmoteButton(button, true, this._state);
      if (!e.shiftKey) this._state.active = button;
    }

    try {
      await handleEmoteClick({ emote, tokens });

      const timed = Boolean(game.settings.get(packageId, "timedEmotesEnabled"));
      if (timed && !isEphemeral) {
        const seconds = Number(game.settings.get(packageId, "timedEmotesDuration")) || 5;
        this._scheduleTimedEnd({ emoteId, tokens, seconds });
      }
    } catch (err) {
      console.error("gambitsEmoteBar | Error handling emote click:", err);
    }

    let attempt = 0;
    const tries = 3;
    const recheck = () => {
      utils.checkEffectsActive(button, this._state, tokens);
      if (++attempt < tries) setTimeout(recheck, 75);
    };
    setTimeout(recheck, 150);
  }

  _bindDragDrop(root) {
    const container = root.querySelector("#emoteButtonsContainer");
    if (!container) return;

    const addHandlers = (item) => {
      item.addEventListener("dragstart", (e) => {
        EmoteBarApp._dragSrcEl = item;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", item.id);
        item.classList.add("dragging");
      });
      item.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });
      item.addEventListener("dragenter", () => item.classList.add("over"));
      item.addEventListener("dragleave", () => item.classList.remove("over"));
      item.addEventListener("drop", (e) => {
        e.stopPropagation();
        const draggedId = e.dataTransfer.getData("text/plain");
        const draggedEl = container.querySelector(`#${CSS.escape(draggedId)}`);
        if (draggedEl && draggedEl !== item) {
          container.insertBefore(draggedEl, item);
          this._saveButtonOrder(container);
        }
      });
      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
        container.querySelectorAll(".gem-emote-btn").forEach(b => b.classList.remove("over"));
      });
    };

    container.querySelectorAll(".gem-emote-btn").forEach(addHandlers);
  }

  async _saveButtonOrder(container) {
    const order = Array.from(container.children).map(btn => btn.id);
    try {
      await game.user.setFlag(packageId, "buttonOrder", order);
    } catch (err) {
      console.warn("gambitsEmoteBar | Failed saving button order", err);
    }
  }

  static async endAll(_event, _button) {
    const inst = EmoteBarApp.instance;
    if (!inst) return;
    const controlled = canvas.tokens.controlled ?? [];

    const tokens = controlled.length
      ? controlled
      : (game.user.isGM ? (canvas.tokens.placeables ?? []) : (utils.getOwnedTokens() || []));

    try { inst._clearTimedEndTimers({ tokens }); } catch (_) {}
    await utils.endAllEmoteEffects(tokens);
    inst.render(true);
  }

  static async openVisibility(_event, _button) {
    EmoteVisibilityManagerApp.open();
  }

  static async openSoundConfig(_event, _button) {
    EmoteSoundConfigApp.open();
  }

  static async setOffsets(_event, _button) {
    const tokens = canvas.tokens.controlled;
    if (!tokens || tokens.length !== 1) {
      ui.notifications.warn(game.i18n.format("gambitsEmoteBar.log.warning.selectSingle"));
      return;
    }
    await utils.setOffsets(tokens[0]);
  }

  static async openCustomEmotes(_event, _button) {
    CustomEmoteListApp.open();
  }

  /**
   * Toggle the emote bar (open if closed, close if open).
   */
  static async toggle() {
    const inst = EmoteBarApp.instance;
    if (inst && inst.rendered) {
      await inst.close();
      return;
    }
    const app = inst ?? new EmoteBarApp();
    app.render(true);
  }

  static async open() {
    const inst = EmoteBarApp.instance ?? new EmoteBarApp();
    inst.render(true);
    return inst;
  }
}
