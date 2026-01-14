import { GemBaseFormV2 } from "../base-form.js";
import { packageId } from "../constants.js";
import { EmoteBarApp } from "./emote-bar.js";
import { CustomEmoteEditorApp } from "./custom-emote-editor.js";

export class CustomEmoteListApp extends GemBaseFormV2 {
  constructor(options = {}) {
    super(options);
    CustomEmoteListApp.instance = this;
    this._posLoaded = false;
  }

  static DEFAULT_OPTIONS = {
    id: "gem-custom-emote-list",
    tag: "section",
    classes: ["gem", "gem-custom-emote-list", "form-v2"],
    window: { title: "gambitsEmoteBar.dialog.window.customEmoteMacros", minimizable: false, resizable: true },
    position: { width: 520, height: 620, zIndex: 103 },
    actions: {
      add: CustomEmoteListApp.add,
      edit: CustomEmoteListApp.edit,
      del: CustomEmoteListApp.del,
    },
  };

  static PARTS = [
    { template: `modules/${packageId}/templates/gem-custom-emote-list.hbs` },
  ];

  async _prepareContext() {
    const customEmotes = game.settings.get(packageId, "customEmotes") || {};
    const entries = Object.entries(customEmotes).map(([id, data]) => ({
      id,
      iconClass: `fas ${data.icon || "fa-comment"}`,
      tooltip: data.tooltip || id,
    }));

    entries.sort((a, b) => a.id.localeCompare(b.id));

    return {
      isGM: game.user.isGM,
      entries,
    };
  }

  static open() {
    if (!game.user.isGM) return;
    const inst = CustomEmoteListApp.instance ?? new CustomEmoteListApp();
    inst.render(true);
    return inst;
  }

  static POS_FLAG = "dialog-position-customEmoteList";

  _onRender(options) {
    super._onRender(options);

    if (!this._posLoaded) {
      this._posLoaded = true;
      const pos = game.user.getFlag(packageId, CustomEmoteListApp.POS_FLAG);
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
      await game.user.setFlag(packageId, CustomEmoteListApp.POS_FLAG, { top, left, width, height });
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
    if (!game.user.isGM) return;
    await CustomEmoteListApp.instance?._persistPosition();
    CustomEmoteEditorApp.open(null);
  }

  static async edit(_event, button) {
    if (!game.user.isGM) return;
    const id = button?.dataset?.id;
    if (!id) return;
    await CustomEmoteListApp.instance?._persistPosition();
    CustomEmoteEditorApp.open(id);
  }

  static async del(_event, button) {
    if (!game.user.isGM) return;
    const id = button?.dataset?.id;
    if (!id) return;

    const confirm = await foundry.applications.api.DialogV2.wait({
      window: { title: "Confirm Delete", minimizable: false },
      content: `<p>Are you sure you want to delete custom emote <strong>${id}</strong>?</p>`,
      buttons: [
        { action: "yes", label: game.i18n.format("gambitsEmoteBar.dialog.button.delete"), icon: "fas fa-trash", default: true },
        { action: "no", label: game.i18n.format("gambitsEmoteBar.dialog.button.cancel"), icon: "fas fa-times" },
      ],
      rejectClose: false,
    });

    if (confirm !== "yes") return;

    const customEmotes = game.settings.get(packageId, "customEmotes") || {};
    delete customEmotes[id];
    await game.settings.set(packageId, "customEmotes", customEmotes);

    const triggers = game.settings.get(packageId, "emoteTriggers") || {};
    if (triggers[id]) {
      delete triggers[id];
      await game.settings.set(packageId, "emoteTriggers", triggers);
    }

    EmoteBarApp.instance?.render(true);
    CustomEmoteListApp.instance?.render(true);
  }
}
