import { animateTitleBar } from "./utils.js";

const Base = foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.api.ApplicationV2,
);

/**
 * Base class for GEM ApplicationV2 windows that share common behaviors.
 */
export class GemBaseFormV2 extends Base {
  static DEFAULT_OPTIONS = {};

  /**
   * @override
   */
  _onRender(options) {
    super._onRender?.(options);
    animateTitleBar(this);
  }
}
