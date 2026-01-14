import { GemBaseFormV2 } from "../base-form.js";
import { packageId } from "../constants.js";
import { TriggerListApp } from "./trigger-list.js";

export class TriggerEditorApp extends GemBaseFormV2 {
  constructor(options = {}) {
    super(options);
    TriggerEditorApp.instance = this;
    this.emoteId = options.emoteId;
    this.triggerId = options.triggerId ?? null;
  }

  static DEFAULT_OPTIONS = {
    id: "gem-trigger-editor",
    tag: "section",
    classes: ["gem", "gem-trigger-editor", "form-v2"],
    window: { title: "gambitsEmoteBar.dialog.window.newTrigger", minimizable: false, resizable: true },
    position: { width: 600, height: 360, zIndex: 106 },
    actions: {
      useSelected: TriggerEditorApp.useSelected,
      save: TriggerEditorApp.save,
      cancel: TriggerEditorApp.cancel,
    },
  };

  static PARTS = [
    { template: `modules/${packageId}/templates/gem-trigger-editor.hbs` },
  ];

  async _prepareContext() {
    const all  = game.settings.get(packageId, "emoteTriggers") || {};
    const list = all[this.emoteId] || [];

    const existing = this.triggerId ? list.find(t => t.id === this.triggerId) : null;

    const data = existing ?? {
      id: foundry.utils.randomID(),
      hook: "combatStart",
      target: "all",
      tokenIds: [],
      duration: 0,
      threshold: 50,
    };

    const tokenIdsStr = Array.isArray(data.tokenIds) ? data.tokenIds.join(", ") : (data.tokenIds ?? "");

    const hooks   = ["combatStart","combatEnd","roundStart","turnStart","restLong","restShort","combatantEnter","hpPercentage"];
    const targets = ["all","ally","enemy","neutral","selected"];

    return {
      isEdit: Boolean(existing),
      emoteId: this.emoteId,
      triggerId: data.id,
      hooks,
      targets,
      hook: data.hook,
      target: data.target,
      tokenIds: tokenIdsStr,
      duration: data.duration ?? 0,
      threshold: data.threshold ?? 50,
    };
  }

  _onRender(options) {
    super._onRender(options);

    const el = this.element;
    if (!el) return;

    const hookSelect = el.querySelector('select[name="hook"]');
    const targetSelect = el.querySelector('select[name="target"]');
    const tokenRow = el.querySelector('[data-role="tokenRow"]');
    const thresholdRow = el.querySelector('[data-role="thresholdRow"]');
    const thresholdSlider = el.querySelector('input[name="threshold"]');
    const thresholdValue = el.querySelector('[data-role="thresholdValue"]');

    const syncVisibility = () => {
      const target = targetSelect?.value;
      if (tokenRow) tokenRow.style.display = target === "selected" ? "block" : "none";
      const hook = hookSelect?.value;
      if (thresholdRow) thresholdRow.style.display = hook === "hpPercentage" ? "block" : "none";
    };

    hookSelect?.addEventListener("change", syncVisibility);
    targetSelect?.addEventListener("change", syncVisibility);
    thresholdSlider?.addEventListener("input", () => {
      if (thresholdValue) thresholdValue.textContent = thresholdSlider.value;
    });

    syncVisibility();
  }

  static open(emoteId, triggerId = null) {
    if (!game.user.isGM) return;
    const inst = new TriggerEditorApp({ emoteId, triggerId });
    inst.render(true);
    return inst;
  }

  static async cancel(_event, _button) {
    const inst = TriggerEditorApp.instance;
    if (!inst) return;
    await inst.close();
    const list = TriggerListApp.instance;
    if (list && list.rendered && list.emoteId === inst.emoteId) {
      list.render(true);
    } else {
      TriggerListApp.open(inst.emoteId);
    }
  }

  static async useSelected(_event, _button) {
    const inst = TriggerEditorApp.instance;
    if (!inst?.element) return;
    const tokens = canvas.tokens.controlled ?? [];
    const ids = tokens.map(t => t.id).filter(Boolean);
    const input = inst.element.querySelector('input[name="tokenIds"]');
    if (input) input.value = ids.join(", ");
  }

  static async save(_event, _button) {
    const inst = TriggerEditorApp.instance;
    if (!inst?.element) return;

    const hook = inst.element.querySelector('select[name="hook"]')?.value;
    const target = inst.element.querySelector('select[name="target"]')?.value;
    const tokenIdsRaw = String(inst.element.querySelector('input[name="tokenIds"]')?.value || "");
    const duration = Number(inst.element.querySelector('input[name="duration"]')?.value);
    const threshold = Number(inst.element.querySelector('input[name="threshold"]')?.value);
    const id = String(inst.element.querySelector('input[name="triggerId"]')?.value || foundry.utils.randomID());

    const tokenIds = tokenIdsRaw
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    if (!hook || !target) {
      return ui.notifications.error("Please choose a hook and target.");
    }

    if (target === "selected" && !tokenIds.length) {
      return ui.notifications.error("Target is 'selected' but no token IDs were provided.");
    }

    if (!Number.isFinite(duration) || duration < 0) {
      return ui.notifications.error("Duration must be a non-negative number.");
    }

    const trigger = {
      id,
      hook,
      target,
      tokenIds: target === "selected" ? tokenIds : [],
      duration,
      ...(hook === "hpPercentage" ? { threshold } : {}),
    };

    const all = game.settings.get(packageId, "emoteTriggers") || {};
    const list = all[inst.emoteId] || [];

    const idx = list.findIndex(t => t.id === id);
    if (idx >= 0) list[idx] = trigger;
    else list.push(trigger);

    all[inst.emoteId] = list;
    await game.settings.set(packageId, "emoteTriggers", all);

    await inst.close();
    const listApp = TriggerListApp.instance;
    if (listApp && listApp.rendered && listApp.emoteId === inst.emoteId) {
      listApp.render(true);
    } else {
      TriggerListApp.open(inst.emoteId);
    }
  }
}
