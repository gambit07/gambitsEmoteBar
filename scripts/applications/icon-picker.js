import { GemBaseFormV2 } from "../base-form.js";
import { packageId } from "../constants.js";
import { loadFontList } from "../utils.js";

export class IconPickerApp extends GemBaseFormV2 {
  constructor(options = {}) {
    super(options);
    IconPickerApp.instance = this;
    this._selected = options.selected ?? null;
    this._resolve = options.resolve ?? null;
  }

  static DEFAULT_OPTIONS = {
    id: "gem-icon-picker",
    tag: "section",
    classes: ["gem", "gem-icon-picker", "form-v2"],
    window: { title: "gambitsEmoteBar.dialog.window.pickIcon", minimizable: false, resizable: true },
    position: { width: 720, height: 600, zIndex: 105 },
    actions: {
      choose: IconPickerApp.choose,
      cancel: IconPickerApp.cancel,
      select: IconPickerApp.select,
    },
  };

  static PARTS = [
    { template: `modules/${packageId}/templates/gem-icon-picker.hbs` },
  ];

  async _prepareContext() {
    const icons = await loadFontList();
    return {
      icons,
      selected: this._selected,
    };
  }

  _onRender(options) {
    super._onRender(options);
    const el = this.element;
    if (!el) return;

    const grid = el.querySelector("[data-role='iconGrid']");
    const search = el.querySelector("input[data-role='iconSearch']");

    const filter = () => {
      const term = String(search?.value || "").toLowerCase();
      grid?.querySelectorAll(".icon-option")?.forEach(opt => {
        const t = String(opt.dataset.tooltip || "").toLowerCase();
        opt.style.display = !term || t.includes(term) ? "" : "none";
      });
    };

    search?.addEventListener("keyup", filter);

    if (this._selected && grid) {
      const opt = grid.querySelector(`.icon-option[data-icon="${CSS.escape(this._selected)}"]`);
      if (opt) opt.classList.add("selected");
    }
  }

  static async pick(selected = null) {
    return new Promise((resolve) => {
      const app = new IconPickerApp({ selected, resolve });
      app.render(true);
    });
  }

  static async cancel(_event, _button) {
    const inst = IconPickerApp.instance;
    if (!inst) return;
    inst._resolve?.(null);
    inst._resolve = null;
    await inst.close();
  }

  static async select(_event, _button) {
    const inst = IconPickerApp.instance;
    if (!inst) return;
    inst._resolve?.(inst._selected ?? null);
    inst._resolve = null;
    await inst.close();
  }

  static async choose(_event, div) {
    const inst = IconPickerApp.instance;
    if (!inst) return;
    const icon = div?.dataset?.icon;
    if (!icon) return;

    inst._selected = icon;
    inst.element?.querySelectorAll(".icon-option")?.forEach(opt => opt.classList.remove("selected"));
    div.classList.add("selected");
  }

  async _onClose(options) {
    if (this._resolve) {
      this._resolve(null);
      this._resolve = null;
    }
    return super._onClose?.(options);
  }
}
