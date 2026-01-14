import { GemBaseFormV2 } from "../base-form.js";
import { packageId } from "../constants.js";
import { EmoteBarApp } from "./emote-bar.js";
import { getEskieModules } from "../utils.js";

export class EmoteVisibilityManagerApp extends GemBaseFormV2 {
  constructor(options = {}) {
    super(options);
    EmoteVisibilityManagerApp.instance = this;
  }

  static DEFAULT_OPTIONS = {
    id: "gem-emote-visibility",
    tag: "section",
    classes: ["gem", "gem-emote-visibility", "form-v2"],
    window: { title: "gambitsEmoteBar.dialog.window.manageHidingEmotes", minimizable: false, resizable: true },
    position: { width: 520, height: 650, zIndex: 103 },
    actions: {
      toggle: EmoteVisibilityManagerApp.toggle,
      close: EmoteVisibilityManagerApp.close,
    },
  };

  static PARTS = [
    { template: `modules/${packageId}/templates/gem-emote-visibility-manager.hbs` },
  ];

  async _prepareContext() {
    const hidden = new Set(game.user.getFlag(packageId, "hiddenEmotes") || []);
    const dialogEmotes = game.gambitsEmoteBar?.dialogEmotes || [];
    const mapping = game.gambitsEmoteBar?.defaultEmoteMapping || {};
    const allDefaultEmotes = [
      ...dialogEmotes,
      ...Object.keys(mapping).filter(k => !dialogEmotes.includes(k)),
    ];

    const eskie = getEskieModules();
    const hasJB2APatreon = game.modules.get("jb2a-patreon")?.active === true || game.modules.get("jb2a_patreon")?.active === true;
    const eskiePatreonOnlyEmotes = new Set(["ThankYou", "Wink", "Smug", "Huh", "Confused", "Whistle"]);
    const custom = game.settings.get(packageId, "customEmotes") || {};

    const defaults = allDefaultEmotes
      .map(emoteId => {
      const meta = mapping?.[emoteId] || {};
      const icon = meta.icon || "fa-comment";
      const iconClass = emoteId === "ThunderHype" ? `fa-solid ${icon}` : `fas ${icon}`;

      let isAvailable = true;
      let unavailableTooltip = "";
      if (emoteId === "ThunderHype" && !hasJB2APatreon) {
        isAvailable = false;
        unavailableTooltip = game.i18n.localize("gambitsEmoteBar.dialog.tooltip.requiresJB2APatreon");
      } else if (eskiePatreonOnlyEmotes.has(emoteId) && !eskie.hasPatreon) {
        isAvailable = false;
        unavailableTooltip = game.i18n.localize("gambitsEmoteBar.dialog.tooltip.requiresEskiePatreon");
      }

        return {
        emoteId,
        label: meta.label || emoteId,
        iconClass,
        isHidden: hidden.has(emoteId),
        type: "default",
        isAvailable,
        unavailableTooltip,
        };
      })
      .sort((a, b) => (a.label || a.emoteId).localeCompare((b.label || b.emoteId), undefined, { sensitivity: "base" }));

    const customs = Object.entries(custom)
      .map(([emoteId, data]) => ({
        emoteId,
        label: emoteId,
        iconClass: `fas ${data.icon || "fa-comment"}`,
        isHidden: hidden.has(emoteId),
        type: "custom",
      }))
      .sort((a, b) => a.emoteId.localeCompare(b.emoteId, undefined, { sensitivity: "base" }));

    return {
      defaults,
      customs,
    };
  }

  static open() {
    const inst = EmoteVisibilityManagerApp.instance ?? new EmoteVisibilityManagerApp();
    inst.render(true);
    return inst;
  }

  static async close(_event, _button) {
    const inst = EmoteVisibilityManagerApp.instance;
    await inst?.close();
  }

  static async toggle(_event, button) {
    const inst = EmoteVisibilityManagerApp.instance;
    if (!inst) return;

    if (button?.disabled || button?.dataset?.available === "false") return;

    const emoteId = button?.dataset?.emote;
    if (!emoteId) return;

    let hidden = game.user.getFlag(packageId, "hiddenEmotes") || [];
    hidden = Array.isArray(hidden) ? hidden.slice() : [];

    const wantsHide = button.dataset.mode === "hide";
    if (wantsHide) {
      if (!hidden.includes(emoteId)) hidden.push(emoteId);
    } else {
      hidden = hidden.filter(e => e !== emoteId);
    }

    await game.user.setFlag(packageId, "hiddenEmotes", hidden);

    EmoteBarApp.instance?.render(true);
    inst.render(true);
  }
}
