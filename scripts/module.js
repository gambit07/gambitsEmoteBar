import { EmoteBarApp } from './applications/emote-bar.js';
import { registerSettings } from './settings.js';
import { playEmote } from './api.js';
import { registerHooks } from './hooks.js';
import * as utils from './utils.js';
import { packageId } from './constants.js';

export { packageId };

const isV13 = foundry.utils.isNewerVersion(game.version, "13.0.0");

Hooks.once('init', async function() {
	registerSettings();

	game.keybindings.register(packageId, "toggleBar", {
		name: game.i18n.format("gambitsEmoteBar.keybinds.toggleEmoteBar.name"),
		hint: game.i18n.format("gambitsEmoteBar.keybinds.toggleEmoteBar.hint"),
		editable: [{
			key: "KeyE",
			modifiers: ["Control"]
		}],
		onDown: async (event) => {
			await EmoteBarApp.toggle();
			return true;
		},
		onUp: () => { return; },
		precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
	});

	Hooks.on("getSceneControlButtons", (controls) => {
		if (game.settings.get(packageId, "disableTokenControls")) return;
		
		const tokensControl = isV13 ? controls.tokens : controls.find(control => control.name === "token");
		if (!tokensControl) return;
		
		if (isV13) {
			tokensControl.tools["emote-bar"] = {
				name: "emote-bar",
				title: game.i18n.format("gambitsEmoteBar.controls.emoteBar.title"),
				icon: "fas fa-face-smile",
				order: 7,
				onChange: async () => EmoteBarApp.toggle(),
				button: true
			};
		} else {
			tokensControl.tools.push({
				name: "emote-bar",
				title: game.i18n.format("gambitsEmoteBar.controls.emoteBar.title"),
				icon: "fas fa-face-smile",
				onClick: async () => EmoteBarApp.toggle(),
				button: true
			});
		}
	});
});

Hooks.once('ready', async function() {
	if (!game.gambitsEmoteBar) {
		const eskie = utils.getEskieModules();
		const hasJB2APatreon = game.modules.get("jb2a-patreon")?.active === true || game.modules.get("jb2a_patreon")?.active === true;
		const eskiePatreonOnlyEmotes = ["ThankYou", "Wink", "Smug", "Huh", "Confused", "Whistle"];

		game.gambitsEmoteBar = {
			packageId,
			utils,
			dialogOpen: false,
			dialogInstance: null,
			loveActive: new Map(),
			suspiciousActive: new Map(),
			dialogUser: game.user.id,
			dialogEmotes: [
				"Laugh",
				"Angry",
				"Surprised",
				"Shout",
				"Drunk",
				"Soul",
				"Slap",
				"Cry",
				"Disgusted",
				"Giggle",
				"Love",
				"Rofl",
				"Smoking",
				"Nervous",
				"Party",
				...(hasJB2APatreon ? ["ThunderHype"] : []),
				"Bloodied",
				"Suspicious",
				...(eskie.hasPatreon ? eskiePatreonOnlyEmotes : []),
			],
			isV13,
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
				"Suspicious": { icon: "fa-eyes", label: game.i18n.format("gambitsEmoteBar.menu.emote.suspicious") },
				"ThankYou": { icon: "fa-hands-helping", label: game.i18n.format("gambitsEmoteBar.menu.emote.thankYou") },
				"Wink": { icon: "fa-grin-wink", label: game.i18n.format("gambitsEmoteBar.menu.emote.wink") },
				"Smug": { icon: "fa-grin", label: game.i18n.format("gambitsEmoteBar.menu.emote.smug") },
				"Huh": { icon: "fa-question", label: game.i18n.format("gambitsEmoteBar.menu.emote.huh") },
				"Confused": { icon: "fa-question-circle", label: game.i18n.format("gambitsEmoteBar.menu.emote.confused") },
				"Whistle": { icon: "fa-music", label: game.i18n.format("gambitsEmoteBar.menu.emote.whistle") },
			}
		};
	}
	registerHooks();

	const version = game.modules.get(packageId).version;
	console.log(version)
	if (game.settings.get(packageId, "releaseMessage") !== version) {
      const content = `
        <div class="gem-announcement" style="border:4px solid #4A90E2; border-radius:6px; padding:12px;">
          <h3 style="margin:0;">🎉Welcome to Gambit's Emote Bar V3.0.0!</h3>
            <p style="font-size: 1em;">This release is a <b>HUGE</b> overhaul to Emote Bar. Please check out the full <a href= "https://github.com/gambit07/gambitsEmoteBar/releases/latest" target="_blank" style="color: #dd6b20; text-decoration: none; font-weight: bold;">Release Notes</a> for more detail.</p>
			<p style="font-size: 1em;">Eskie provided a ton of new emote designs! For users of his Free module, you will see updated designs for many existing emotes. If you are a Eskie Patreon supporter, you will see some new emotes in the bar! If you'd like to support Eskie's work and get access to the new emotes, checkout his <a href= "https://www.patreon.com/EskieEffects" target="_blank" style="color: #dd6b20; text-decoration: none; font-weight: bold;">Patreon</a>.</p>
            <p style="font-size: 1em;">If you'd like to support my development time on Emote Bar and get access to the <b>Gambit's FXMaster+</b>, <b>Gambit's Asset Previewer</b>, and <b>Gambit's Image Viewer</b> modules, please consider supporting the project on <a href="https://patreon.com/GambitsLounge" target="_blank" style="color: #dd6b20; text-decoration: none; font-weight: bold;">Patreon</a>.</p>If you have any questions about the module or want to share custom emotes you've done, feel free to join the <a href= "https://discord.gg/BA7SQKqMpa" target="_blank" style="color: #4e5d94; text-decoration: none; font-weight: bold;">Discord</a>!
          </div>
      `;
		ChatMessage.create({ content });
		game.settings.set(packageId, "releaseMessage", version);
	}
});