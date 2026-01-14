import { GemBaseFormV2 } from "../base-form.js";
import { packageId } from "../constants.js";
import { EmoteBarApp } from "./emote-bar.js";

export class EmoteSoundConfigApp extends GemBaseFormV2 {
  constructor(options = {}) {
    super(options);
    EmoteSoundConfigApp.instance = this;
  }

  static DEFAULT_OPTIONS = {
    id: "gem-emote-sound-config",
    tag: "section",
    classes: ["gem", "gem-emote-sound-config", "form-v2"],
    window: { title: "gambitsEmoteBar.dialog.window.emoteSoundFiles", minimizable: false, resizable: true },
    position: { width: 520, height: 600, zIndex: 103 },
    actions: {
      browseSound: EmoteSoundConfigApp.browseSound,
      save: EmoteSoundConfigApp.save,
      cancel: EmoteSoundConfigApp.cancel,
    },
  };

  static PARTS = [
    { template: `modules/${packageId}/templates/gem-emote-sound-config.hbs` },
  ];

  async _prepareContext() {
    const baseEmotes = game.gambitsEmoteBar?.dialogEmotes || [];
    const customEmotes = game.settings.get(packageId, "customEmotes") || {};
    const mapping = game.gambitsEmoteBar?.defaultEmoteMapping || {};
    const getLabel = (emoteId) => mapping?.[emoteId]?.label || emoteId;
    const emotes = [...baseEmotes, ...Object.keys(customEmotes)]
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .sort((a, b) => getLabel(a).localeCompare(getLabel(b), undefined, { sensitivity: "base" }));

    const moduleDefaults = game.settings.get(packageId, "emoteSoundPaths") || {};
    const userOverrides = game.user.getFlag(packageId, "emoteSoundOverrides") || {};

    const rows = emotes.map(emoteId => {
      const value = game.user.isGM
        ? (moduleDefaults[emoteId] || "")
        : (userOverrides[emoteId] || moduleDefaults[emoteId] || "");
      return { emoteId, value };
    });

    return {
      isGM: game.user.isGM,
      enablePerUser: game.settings.get(packageId, "emoteSoundEnablePerUser"),
      defaultSoundPath: game.settings.get(packageId, "emoteSoundDefaultPath") || "/",
      rows,
    };
  }

  static open() {
    const inst = EmoteSoundConfigApp.instance ?? new EmoteSoundConfigApp();
    inst.render(true);
    return inst;
  }

  static async cancel(_event, _button) {
    const inst = EmoteSoundConfigApp.instance;
    await inst?.close();
  }

  static async browseSound(_event, button) {
    const inst = EmoteSoundConfigApp.instance;
    if (!inst) return;
    const emoteId = button?.dataset?.emote;
    if (!emoteId) return;

    const input = inst.element?.querySelector(`input[name="soundPath_${CSS.escape(emoteId)}"]`);
    const defaultPath = game.settings.get(packageId, "emoteSoundDefaultPath") || "/";
    const startingPath = input?.value || defaultPath;

    new FilePicker({
      type: "audio",
      current: startingPath,
      callback: (path) => {
        if (input) input.value = path;
      },
    }).render(true);
  }

  static async save(_event, _button) {
    const inst = EmoteSoundConfigApp.instance;
    if (!inst?.element) return;

    const baseEmotes = game.gambitsEmoteBar?.dialogEmotes || [];
    const customEmotes = game.settings.get(packageId, "customEmotes") || {};
    const mapping = game.gambitsEmoteBar?.defaultEmoteMapping || {};
    const getLabel = (emoteId) => mapping?.[emoteId]?.label || emoteId;
    const emotes = [...baseEmotes, ...Object.keys(customEmotes)]
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .sort((a, b) => getLabel(a).localeCompare(getLabel(b), undefined, { sensitivity: "base" }));
    const soundPaths = {};

    for (const emoteId of emotes) {
      const input = inst.element.querySelector(`input[name="soundPath_${CSS.escape(emoteId)}"]`);
      soundPaths[emoteId] = input?.value || "";
    }

    if (game.user.isGM) {
      await game.settings.set(packageId, "emoteSoundPaths", soundPaths);
    } else {
      await game.user.setFlag(packageId, "emoteSoundOverrides", soundPaths);
    }

    EmoteBarApp.instance?.render(true);

    await inst.close();
  }
}
