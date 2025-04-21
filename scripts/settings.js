import { MODULE_ID } from "./module.js";

export function registerSettings() {
    game.settings.register(MODULE_ID, "emoteSoundPaths", {
        name: "Emote File Paths",
        scope: "world",
        config: false,
        type: Object,
        default: {}
    });

    game.settings.register(MODULE_ID, "emoteSoundEnable", {
        name: "Enable Emote Sounds",
        hint: "Emote sounds are configurable within the Emote Bar and the GM can set default paths.",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_ID, "emoteSoundEnablePerUser", {
        name: "Enable Emote Sounds Per User",
        hint: "With this setting enabled, users are able to customize emote sound paths on a per-user basis which will take precedence over the GM's path.",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(MODULE_ID, "emoteSoundDefaultPath", {
        name: "Default Sounds Path",
        hint: "If set, the FilePicker will use this default path for audio files instead of the root.",
        scope: "world",
        config: true,
        restricted: true,
        type: String,
        default: "/"
    });

    game.settings.register(MODULE_ID, "customEmotes", {
        name: "Custom Emotes",
        scope: "world",
        config: false,
        type: Object,
        default: {}
    });

    game.settings.register(MODULE_ID, "emoteTriggers", {
        name: "Emote Triggers",
        scope: "world",
        config: false,
        type: Object,
        default: {}
    });

    game.settings.register(MODULE_ID, 'lastViewedVersion', {
        name: 'Last Viewed Version',
        scope: 'client',
        config: false,
        type: String,
        default: ''
      });
}