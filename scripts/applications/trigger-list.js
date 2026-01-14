import { GemBaseFormV2 } from "../base-form.js";
import { packageId } from "../constants.js";
import { TriggerEditorApp } from "./trigger-editor.js";

export class TriggerListApp extends GemBaseFormV2 {
  constructor(options = {}) {
    super(options);
    TriggerListApp.instance = this;
    this.emoteId = options.emoteId;
    this._posLoaded = false;
  }

  static DEFAULT_OPTIONS = {
    id: "gem-trigger-list",
    tag: "section",
    classes: ["gem", "gem-trigger-list", "form-v2"],
    window: { title: "gambitsEmoteBar.dialog.window.manageTriggers", minimizable: false, resizable: true },
    position: { width: 760, height: 620, zIndex: 105 },
    actions: {
      add: TriggerListApp.add,
      edit: TriggerListApp.edit,
      del: TriggerListApp.del,
    },
  };

  static PARTS = [
    { template: `modules/${packageId}/templates/gem-trigger-list.hbs` },
  ];

  static POS_FLAG = "dialog-position-triggerList";

  async _prepareContext() {
    const all = game.settings.get(packageId, "emoteTriggers") || {};
    const triggers = (all[this.emoteId] || []).slice();

    const view = triggers.map(t => {
      const tokenNames = Array.isArray(t.tokenIds) && t.tokenIds.length
        ? t.tokenIds.map(id => canvas.tokens.get(id)?.name || id).join(", ")
        : "";
      return {
        id: t.id,
        hook: t.hook,
        target: t.target,
        duration: t.duration,
        threshold: t.threshold,
        tokenNames,
      };
    });

    return {
      emoteId: this.emoteId,
      triggers: view,
    };
  }

  static open(emoteId) {
    if (!game.user.isGM) return;
    const inst = TriggerListApp.instance ?? new TriggerListApp({ emoteId });
    inst.emoteId = emoteId;
    inst.render(true);
    return inst;
  }

  _onRender(options) {
    super._onRender(options);

    if (!this._posLoaded) {
      this._posLoaded = true;
      const pos = game.user.getFlag(packageId, TriggerListApp.POS_FLAG);
      if (pos && (pos.top != null || pos.left != null)) {
        try {
          this.setPosition({
            top: pos.top,
            left: pos.left,
            width: pos.width ?? this.position.width,
            height: pos.height ?? this.position.height,
          });
        } catch (_) {}
      }
    }

    this._autoGrowToFit();
  }

  async _onClose(options) {
    await this._persistPosition();
    return super._onClose?.(options);
  }

  async _persistPosition() {
    try {
      const { top, left, width, height } = this.position;
      await game.user.setFlag(packageId, TriggerListApp.POS_FLAG, { top, left, width, height });
    } catch (_) {}
  }

  _autoGrowToFit() {
    const el = this.element;
    if (!el) return;
    const scroller = el.querySelector(".gem-list-scroll");
    if (!scroller) return;

    const needs = scroller.scrollHeight - scroller.clientHeight;
    if (needs <= 0) return;

    const maxH = Math.min(window.innerHeight - 60, 900);
    const current = Number(this.position.height) || 0;
    if (!current || current >= maxH) return;

    const bump = Math.min(needs + 40, maxH - current);
    if (bump <= 0) return;

    try {
      this.setPosition({ height: current + bump, width: this.position.width });
    } catch (_) {}
  }

  static async add(_event, _button) {
    const inst = TriggerListApp.instance;
    if (!inst?.emoteId) return;
    await inst._persistPosition();
    TriggerEditorApp.open(inst.emoteId, null);
  }

  static async edit(_event, button) {
    const inst = TriggerListApp.instance;
    if (!inst?.emoteId) return;
    const id = button?.dataset?.id;
    if (!id) return;
    await inst._persistPosition();
    TriggerEditorApp.open(inst.emoteId, id);
  }

  static async del(_event, button) {
    const inst = TriggerListApp.instance;
    if (!inst?.emoteId) return;
    const id = button?.dataset?.id;
    if (!id) return;

    const confirm = await foundry.applications.api.DialogV2.wait({
      window: { title: "Confirm Delete", minimizable: false },
      content: `<p>Delete this trigger?</p>`,
      buttons: [
        { action: "yes", label: game.i18n.format("gambitsEmoteBar.dialog.button.delete"), icon: "fas fa-trash", default: true },
        { action: "no", label: game.i18n.format("gambitsEmoteBar.dialog.button.cancel"), icon: "fas fa-times" },
      ],
      rejectClose: false,
    });

    if (confirm !== "yes") return;

    const all = game.settings.get(packageId, "emoteTriggers") || {};
    all[inst.emoteId] = (all[inst.emoteId] || []).filter(t => t.id !== id);
    await game.settings.set(packageId, "emoteTriggers", all);
    inst.render(true);
  }
}
