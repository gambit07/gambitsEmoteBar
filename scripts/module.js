import { generateEmotes } from './emoteHandler.js';

Hooks.once('init', async function() {
	game.settings.register("gambitsEmoteBar", "emoteSoundPaths", {
		name: "Emote File Paths",
		scope: "world",
		config: false,
		type: Object,
		default: {}
	});

	game.settings.register("gambitsEmoteBar", "emoteSoundEnable", {
		name: "Enable Emote Sounds",
		hint: "Emote sounds are configurable within the Emote Bar and the GM can set default paths.",
		scope: "world",
		config: true,
		type: Boolean,
		default: true
	});

	game.settings.register("gambitsEmoteBar", "emoteSoundEnablePerUser", {
		name: "Enable Emote Sounds Per User",
		hint: "With this setting enabled, users are able to customize emote sound paths on a per-user basis which will take precedence over the GM's path.",
		scope: "world",
		config: true,
		type: Boolean,
		default: false
	});

	if (!game.gambitsEmoteBar) {
		game.gambitsEmoteBar = { dialogOpen: false, dialogInstance: null, loveActive: new Map() };
	  }

	game.keybindings.register("gambitsEmoteBar", "toggleBar", {
		name: game.i18n.format("gambitsEmoteBar.keybinds.toggleEmoteBar.name"),
		hint: game.i18n.format("gambitsEmoteBar.keybinds.toggleEmoteBar.hint"),
		editable: [{
			key: "KeyE",
			modifiers: ["Control"]
		}],
		onDown: async (event) => {
			if (game.gambitsEmoteBar.dialogOpen && game.gambitsEmoteBar.dialogInstance) {
				game.gambitsEmoteBar.dialogInstance.close();
			} else {
				await generateEmotes();
			}
			return true;
		},
		onUp: () => { return; },
		precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
	});

	Hooks.on('getSceneControlButtons', (controls) => {
	const sidebarControls = controls.find(control => control.name === "token");

	if (sidebarControls) {
		sidebarControls.tools.push({
		name: "emote-bar",
		title: game.i18n.format("gambitsEmoteBar.controls.emoteBar.title"),
		icon: "fas fa-face-smile",
		onClick: async () => {
			await generateEmotes();
		},
		button: true
		});
	}
	});

	Sequence.prototype.applyEmoteSound = function(emote) {
		const moduleSoundPaths = game.settings.get("gambitsEmoteBar", "emoteSoundPaths") || {};
		let soundPath = moduleSoundPaths[emote] || "";
		
		const userOverrides = game.user.getFlag("gambitsEmoteBar", "emoteSoundOverrides") || {};
		soundPath = userOverrides[emote] || soundPath;
		
		if (soundPath && soundPath.trim() !== "") {
		  this.sound()
			.file(soundPath)
			.fadeInAudio(500)
			.fadeOutAudio(500);
		}
		return this;
	  };
});