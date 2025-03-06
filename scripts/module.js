import { generateEmotes } from './emoteHandler.js';

Hooks.once('init', async function() {
	if (!game.gambitsEmoteBar) {
		game.gambitsEmoteBar = { dialogOpen: false, dialogInstance: null };
	  }

	game.keybindings.register("gambitsEmoteBar", "toggleBar", {
		name: "Toggle Emote Bar",
		hint: "Press this key to open/close the emote bar",
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
		title: "Emote Bar",
		icon: "fas fa-face-smile",
		onClick: async () => {
			await generateEmotes();
		},
		button: true
		});
	}
	});
});