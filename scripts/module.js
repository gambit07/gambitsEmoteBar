import { generateEmotes } from './emoteHandler.js';

Hooks.once('init', async function() {
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
});