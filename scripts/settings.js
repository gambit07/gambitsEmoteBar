import { packageId } from './constants.js';

export function registerSettings() {
    game.settings.register(packageId, "emoteSoundPaths", {
        name: "Emote File Paths",
        scope: "world",
        config: false,
        type: Object,
        default: {}
    });

    game.settings.register(packageId, "emoteSoundEnable", {
        name: "Enable Emote Sounds",
        hint: "Emote sounds are configurable within the Emote Bar and the GM can set default paths.",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(packageId, "emoteSoundEnablePerUser", {
        name: "Enable Emote Sounds Per User",
        hint: "With this setting enabled, users are able to customize emote sound paths on a per-user basis which will take precedence over the GM's path.",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(packageId, "emoteSoundDefaultPath", {
        name: "Default Sounds Path",
        hint: "If set, the FilePicker will use this default path for audio files instead of the root.",
        scope: "world",
        config: true,
        restricted: true,
        type: String,
        default: "/"
    });

    game.settings.register(packageId, "customEmotes", {
        name: "Custom Emotes",
        scope: "world",
        config: false,
        type: Object,
        default: {}
    });

    game.settings.register(packageId, "emoteTriggers", {
        name: "Emote Triggers",
        scope: "world",
        config: false,
        type: Object,
        default: {}
    });

    game.settings.register(packageId, "timedEmotesEnabled", {
        name: "Timed Emotes Enabled",
        scope: "client",
        config: false,
        type: Boolean,
        default: false
    });

    game.settings.register(packageId, "timedEmotesDuration", {
        name: "Timed Emotes Duration",
        scope: "client",
        config: false,
        type: Number,
        default: 5
    });

    game.settings.register(packageId, "disableTokenControls", {
        name: game.i18n.format("gambitsEmoteBar.settings.disableTokenControls.name"),
        hint: game.i18n.format("gambitsEmoteBar.settings.disableTokenControls.hint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        requiresReload: true
    });

    game.settings.registerMenu(packageId, 'patreonSupport', {
        name: "Patreon Support",
        label: "Gambit's Lounge",
        hint: "If you'd like to support me, Gambit! Subscribing helps support development of this and my other free modules, and also gets you access to my premium modules Gambit's FXMaster+, Gambit's Asset Previewer, and Gambit's Image Viewer!",
        icon: "fas fa-card-spade",
        scope: 'world',
        config: true,
        type: PatreonSupportMenu,
        restricted: true
    });

    game.settings.register(packageId, "releaseMessage", {
        name: "releaseMessage",
        scope: "world",
        config: false,
        type: String,
        default: ""
    });
}

class PatreonSupportMenu extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "gambits-patreon-support",
      title: "Patreon Support",
      template: "templates/blank.hbs",
      width: 1,
      height: 1,
      popOut: false
    });
  }

  render(force = false, options = {}) {
    window.open("https://www.patreon.com/GambitsLounge/membership", "_blank", "noopener,noreferrer");
    return this;
  }
}