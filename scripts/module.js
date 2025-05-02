import { generateEmotes } from './emoteHandler.js';
import { registerSettings } from './settings.js';
import { playEmote } from './api.js';
import { registerHooks } from './hooks.js';
import { displayNewVersionDialog } from './utils.js';
export const MODULE_ID = "gambitsEmoteBar";

Hooks.once('init', async function() {
	registerSettings();

	game.keybindings.register(MODULE_ID, "toggleBar", {
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

	Hooks.on("getSceneControlButtons", (controls) => {
		const isV13 = !foundry.utils.isNewerVersion("13.0.0", game.version);
		
		const tokensControl = isV13 ? controls.tokens : controls.find(control => control.name === "token");
		if (!tokensControl) return;
		
		if (isV13) {
			tokensControl.tools["emote-bar"] = {
				name: "emote-bar",
				title: game.i18n.format("gambitsEmoteBar.controls.emoteBar.title"),
				icon: "fas fa-face-smile",
				order: 7,
				onChange: async () => {
					await generateEmotes();
				},
				button: true
			};
		} else {
			tokensControl.tools.push({
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
});

Hooks.once('ready', async function() {
	if (!game.gambitsEmoteBar) {
		game.gambitsEmoteBar = {
			dialogOpen: false,
			dialogInstance: null,
			loveActive: new Map(),
			suspiciousActive: new Map(),
			dialogUser: game.user.id,
			dialogEmotes: ["Laugh","Angry","Surprised","Shout","Drunk","Soul","Slap","Cry","Disgusted","Giggle","Love","Rofl","Smoking","Nervous","Party","ThunderHype","Bloodied","Suspicious"],
			isV13: foundry.utils.isNewerVersion(game.version, "13.0.0"),
			playEmote,
			defaultEmoteMapping: {
				"Laugh": { icon: "fa-laugh-beam", label: game.i18n.format("gambitsEmoteBar.menu.emote.laugh") },
				"Angry": { icon: "fa-angry", label: game.i18n.format("gambitsEmoteBar.menu.emote.angry") },
				"Surprised": { icon: "fa-surprise", label: game.i18n.format("gambitsEmoteBar.menu.emote.surprised") },
				"Shout": { icon: "fa-bullhorn", label: game.i18n.format("gambitsEmoteBar.menu.emote.shout") },
				"Drunk": { icon: "fa-wine-glass", label: game.i18n.format("gambitsEmoteBar.menu.emote.drunk") },
				"Soul": { icon: "fa-ghost", label: game.i18n.format("gambitsEmoteBar.menu.emote.soul") },
				"Slap": { icon: "fa-hand-paper", label: game.i18n.format("gambitsEmoteBar.menu.emote.slap") },
				"Cry": { icon: "fa-sad-tear", label: game.i18n.format("gambitsEmoteBar.menu.emote.cry") },
				"Disgusted": { icon: "fa-face-rolling-eyes", label: game.i18n.format("gambitsEmoteBar.menu.emote.disgusted") },
				"Giggle": { icon: "fa-grin-beam", label: game.i18n.format("gambitsEmoteBar.menu.emote.giggle") },
				"Love": { icon: "fa-heart", label: game.i18n.format("gambitsEmoteBar.menu.emote.love") },
				"Rofl": { icon: "fa-laugh-squint", label: game.i18n.format("gambitsEmoteBar.menu.emote.rofl") },
				"Smoking": { icon: "fa-smoking", label: game.i18n.format("gambitsEmoteBar.menu.emote.smoking") },
				"Nervous": { icon: "fa-frown-open", label: game.i18n.format("gambitsEmoteBar.menu.emote.nervous") },
				"Party": { icon: "fa-birthday-cake", label: game.i18n.format("gambitsEmoteBar.menu.emote.party") },
				"ThunderHype": { icon: "fa-sword", label: game.i18n.format("gambitsEmoteBar.menu.emote.thunderHype") },
				"Bloodied": { icon: "fa-user-injured", label: game.i18n.format("gambitsEmoteBar.menu.emote.bloodied") },
				"Suspicious": { icon: "fa-eyes", label: game.i18n.format("gambitsEmoteBar.menu.emote.suspicious") }
			}
		};
	}
	registerHooks();
	await displayNewVersionDialog();
});