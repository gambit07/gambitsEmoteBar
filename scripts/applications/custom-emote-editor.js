import { GemBaseFormV2 } from "../base-form.js";
import { packageId } from "../constants.js";
import * as BuiltInAnimations from "../animations.js";
import { EmoteBarApp } from "./emote-bar.js";
import { CustomEmoteListApp } from "./custom-emote-list.js";
import { IconPickerApp } from "./icon-picker.js";
import { TriggerListApp } from "./trigger-list.js";

export class CustomEmoteEditorApp extends GemBaseFormV2 {
  constructor(options = {}) {
    super(options);
    CustomEmoteEditorApp.instance = this;
    this.emoteId = options.emoteId ?? null;

    this._nameLocked = false;
    this._posLoaded = false;
  }

  static DEFAULT_OPTIONS = {
    id: "gem-custom-emote-editor",
    tag: "section",
    classes: ["gem", "gem-custom-emote-editor", "form-v2"],
    window: { title: "gambitsEmoteBar.dialog.window.registerCustomEmote", minimizable: false, resizable: true },

    position: { width: 700, height: 780, zIndex: 104 },
    actions: {
      pickIcon: CustomEmoteEditorApp.pickIcon,
      openTriggers: CustomEmoteEditorApp.openTriggers,
      save: CustomEmoteEditorApp.save,
      cancel: CustomEmoteEditorApp.cancel,
    },
  };

  static PARTS = [
    { template: `modules/${packageId}/templates/gem-custom-emote-editor.hbs` },
  ];

  async _prepareContext() {
    const customEmotes = game.settings.get(packageId, "customEmotes") || {};
    const data = this.emoteId ? (customEmotes[this.emoteId] || {}) : {};

    const emoteId = this.emoteId ?? "";
    const tooltip = data.tooltip ?? "";
    const icon = data.icon ?? "";
    const macro = data.macro ?? "";

    const macroField = new foundry.data.fields.JavaScriptField({ required: false, blank: true });

    const builtInPresets = (game.gambitsEmoteBar?.dialogEmotes || [])
      .filter(id => !["Love", "Suspicious"].includes(id))
      .map(id => {
        const meta = game.gambitsEmoteBar?.defaultEmoteMapping?.[id] || {};
        return { id, label: meta.label || id };
      })
      .sort((a, b) => (a.label || a.id).localeCompare((b.label || b.id), undefined, { sensitivity: "base" }));

    const generatedName = emoteId
      ? `.name(\`emoteBar${emoteId}_\${token.id}_\${game.gambitsEmoteBar?.dialogUser}\`)`
      : "";

    return {
      isEdit: Boolean(this.emoteId),
      emoteId,
      tooltip,
      icon,
      iconClass: icon ? `fas ${icon}` : "",
      macro,
      macroField,
      generatedName,
      builtInPresets,
    };
  }

  _onRender(options) {
    super._onRender(options);

    if (!this._posLoaded) {
      this._posLoaded = true;
      try {
        const saved = game.user.getFlag(packageId, "dialog-position-customEmoteEditor");
        if (saved && typeof saved === "object") {
          const top = Number(saved.top);
          const left = Number(saved.left);
          const width = Number(saved.width);
          const height = Number(saved.height);

          const pos = {};
          if (Number.isFinite(top)) pos.top = top;
          if (Number.isFinite(left)) pos.left = left;

          if (Number.isFinite(width)) pos.width = Math.max(520, width);
          if (Number.isFinite(height)) pos.height = Math.max(520, height);

          if (Object.keys(pos).length) this.setPosition(pos);
        }
      } catch (_) {}
    }

    try {
      if (this.emoteId) this.window.title = `Edit Custom Emote: ${this.emoteId}`;
      else this.window.title = "Register Custom Emote";
      this._setWindowTitle?.();
    } catch (_) {}

    const idInput = this.element?.querySelector('input[name="emoteId"]');
    const genInput = this.element?.querySelector('input[name="generatedName"]');

    if (idInput && !this.emoteId) {
      idInput.addEventListener("input", () => {
        const cleaned = String(idInput.value || "").replace(/[^A-Za-z0-9_-]/g, "");
        if (cleaned !== idInput.value) idInput.value = cleaned;
      });
    }

    if (idInput && genInput && !this.emoteId) {
      const update = () => {
        const v = String(idInput.value || "").trim();
        genInput.value = v
          ? `.name(\`emoteBar${v}_\${token.id}_\${game.gambitsEmoteBar?.dialogUser}\`)`
          : "";
      };
      idInput.addEventListener("input", update);
      update();
    }

    const presetSelect = this.element?.querySelector('select[name="presetEmote"]');
    const macroArea = this.element?.querySelector('[name="macro"]');
    const emoteIdInput = this.element?.querySelector('input[name="emoteId"]');

    if (emoteIdInput && !this.emoteId) {
      emoteIdInput.addEventListener("blur", () => {
        const hasName = String(emoteIdInput.value || "").trim().length > 0;
        if (hasName) {
          this._nameLocked = true;
          emoteIdInput.readOnly = true;
        }
      });
    }

    const updatePresetLock = () => {
      if (!presetSelect || !emoteIdInput) return;
      const presetId = String(presetSelect.value || "").trim();
      const hasName = String(emoteIdInput.value || "").trim().length > 0;

      emoteIdInput.readOnly = Boolean(this._nameLocked) || Boolean(this.emoteId) || Boolean(presetId && hasName);
    };

    updatePresetLock();

    if (presetSelect && macroArea) {
      presetSelect.addEventListener("change", async () => {
        const presetId = String(presetSelect.value || "").trim();
        if (!presetId) {
          updatePresetLock();
          return;
        }

        const emoteId = String(this.element?.querySelector('input[name="emoteId"]')?.value || "").trim();
        if (!emoteId) {
          ui.notifications.error("You must enter an emote name before applying a preset.");
          presetSelect.value = "";
          return;
        }

        try {
          const macro = await CustomEmoteEditorApp._buildPresetMacro({ presetId, emoteId });
          if (macro && "value" in macroArea) macroArea.value = macro;
          updatePresetLock();
        } catch (err) {
          console.error("gambitsEmoteBar | Failed building preset macro", err);
          ui.notifications.error("Failed to generate preset macro code. See console for details.");
        }
      });
    }
  }

  async _onClose(options) {
    try {
      const { top, left, width, height } = this.position ?? {};
      await game.user.setFlag(packageId, "dialog-position-customEmoteEditor", { top, left, width, height });
    } catch (_) {}

    return super._onClose?.(options);
  }

  /**
   * Build a custom-emote macro based on a built-in emote implementation.
   *
   * This generates a macro that:
   * - Uses the user's custom emoteId for Sequencer .name(...) so End/Toggle works.
   * - Uses the user's custom emoteId for sound key lookups.
   * - Copies the built-in emote code (as a starting point) so users can edit freely.
   */
  static async _buildPresetMacro({ presetId, emoteId }) {
    const presetToFn = {
      Laugh: "performLaugh",
      Angry: "performAngry",
      Surprised: "performSurprised",
      Shout: "performShout",
      Drunk: "performDrunk",
      Soul: "performSoul",
      Slap: "performSlap",
      Cry: "performCry",
      Disgusted: "performDisgusted",
      Giggle: "performGiggle",
      Rofl: "performROFL",
      Smoking: "performSmoking",
      Nervous: "performNervous",
      Party: "performParty",
      ThunderHype: "performThunderHype",
      ThankYou: "performThankYou",
      Wink: "performWink",
      Smug: "performSmug",
      Huh: "performHuh",
      Confused: "performConfused",
      Whistle: "performWhistle",
      Bloodied: "performBloodied",
    };

    const fnName = presetToFn[presetId];
    if (!fnName) throw new Error(`No preset function mapping for ${presetId}`);

    const fn = BuiltInAnimations?.[fnName];
    if (typeof fn !== "function") throw new Error(`Missing animation function: ${fnName}`);

    const src = fn.toString();
    const start = src.indexOf("{");
    const end = src.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) throw new Error(`Unable to parse source for ${fnName}`);

    let body = src.slice(start + 1, end).trim();

    {
      const bodyLines = body.split("\n");
      const rest = bodyLines.slice(1);
      const prefixes = rest
        .filter((l) => l.trim().length)
        .map((l) => (l.match(/^[\t ]+/)?.[0] ?? ""))
        .filter(Boolean);

      if (prefixes.length) {

        let common = prefixes[0];
        for (const p of prefixes.slice(1)) {
          let i = 0;
          const max = Math.min(common.length, p.length);
          while (i < max && common[i] === p[i]) i++;
          common = common.slice(0, i);
          if (!common) break;
        }

        if (common) {
          body = [
            bodyLines[0],
            ...rest.map((l) => (l.startsWith(common) ? l.slice(common.length) : l)),
          ].join("\n");
        }
      }

      body = body.trim();
    }

    body = body
      .replace(/\.name\(\s*`emoteBar[^`]*`\s*\)/g, ".name(effectName)")
      .replace(/\.name\(\s*['\"]emoteBar[^'\"]*['\"]\s*\)/g, ".name(effectName)");

    body = body.replace(
      /applyEmoteSound\(\s*seq\s*,\s*([`'\"])[^`'\"]+\1\s*\)/g,
      "applyEmoteSound(seq, emoteId)"
    );

    body = body.replace(/\b_requireEskiePatreon\b/g, "requireEskiePatreon");
    const safeId = JSON.stringify(String(emoteId ?? "").trim());

    const lines = [
      "const utils = game.gambitsEmoteBar?.utils;",
      "const packageId = game.gambitsEmoteBar?.packageId;",
      "if (!utils) {",
      "  ui.notifications.error(\"gambitsEmoteBar | utils not available (is the module active?)\");",
      "  return;",
      "}",
      "",
      "const { getTokenImage, applyEmoteSound, getTokenRotation, getEskieModules, resolveEskieFile, requireEskiePatreon, getTokenFacing, getTokenMirrorFacing, getTokenIsMirrored, applyCapturedMirrorToOffset } = utils;",
      "",
      `const emoteId = ${safeId};`,
      "const userId = game.gambitsEmoteBar.dialogUser;",
      "const effectName = \"emoteBar\" + emoteId + \"_\" + token.id + \"_\" + userId;",
      "",
      "/**",
      " * DO NOT modify anything above this line. If you do, stuff will probably break.",
      " *",
      " * The Sequencer code below can be modified, with the exception of the `.name` value.",
      " *",
      " * Any `.name` added must use `effectName`.",
      " */",
      "",
      body.trim(),
    ];

    return lines.join("\n").trim();
  }

  static open(emoteId = null) {
    if (!game.user.isGM) return;
    const inst = new CustomEmoteEditorApp({ emoteId });
    inst.render(true);
    return inst;
  }

  static async cancel(_event, _button) {
    const inst = CustomEmoteEditorApp.instance;
    await inst?.close();
    const list = CustomEmoteListApp.instance;
    if (list && list.rendered) list.render(true);
    else CustomEmoteListApp.open();
  }

  static async pickIcon(_event, _button) {
    const inst = CustomEmoteEditorApp.instance;
    if (!inst?.element) return;
    const icon = await IconPickerApp.pick();
    if (!icon) return;

    const hidden = inst.element.querySelector('input[name="icon"]');
    const preview = inst.element.querySelector('[data-role="iconPreview"]');
    if (hidden) hidden.value = icon;
    if (preview) preview.innerHTML = `<i class="fas ${icon}" style="font-size:24px;"></i>`;
  }

  static async openTriggers(_event, _button) {
    const inst = CustomEmoteEditorApp.instance;
    if (!inst?.element) return;

    const emoteId = String(inst.element.querySelector('input[name="emoteId"]')?.value || "").trim();
    if (!emoteId) {
      return ui.notifications.error("You must enter your emote name before managing triggers.");
    }
    TriggerListApp.open(emoteId);
  }

  static async save(_event, _button) {
    const inst = CustomEmoteEditorApp.instance;
    if (!inst?.element) return;

    const emoteId = String(inst.element.querySelector('input[name="emoteId"]')?.value || "").trim();
    const tooltip = String(inst.element.querySelector('input[name="tooltip"]')?.value || "").trim();
    const icon = String(inst.element.querySelector('input[name="icon"]')?.value || "").trim();
    const macro = String(inst.element.querySelector('[name="macro"]')?.value || "");

    if (!emoteId || !/^\S+$/.test(emoteId)) {
      return ui.notifications.error("Emote name is required and cannot contain spaces.");
    }
    if (!tooltip) return ui.notifications.error("Tooltip text is required.");
    if (!icon) return ui.notifications.error("An icon is required.");

    const customEmotes = game.settings.get(packageId, "customEmotes") || {};

    if (!inst.emoteId && customEmotes[emoteId]) {
      return ui.notifications.error(`A custom emote named "${emoteId}" already exists.`);
    }

    customEmotes[emoteId] = { tooltip, icon, macro };
    await game.settings.set(packageId, "customEmotes", customEmotes);

    EmoteBarApp.instance?.render(true);
    CustomEmoteListApp.instance?.render(true);

    await inst.close();
    const list = CustomEmoteListApp.instance;
    if (list && list.rendered) list.render(true);
    else CustomEmoteListApp.open();
  }
}
