import { generateEmotes } from './emotePreview.js';

Hooks.once('init', async function() {
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

Hooks.once('ready', async function() {
	await game.user.unsetFlag("gambitsEmoteBar", "dialogOpen");
});