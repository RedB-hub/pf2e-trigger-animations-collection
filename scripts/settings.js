import { MODULE_ID } from "./module.js";

export function setupSettings() {
  game.settings.register(MODULE_ID, "last-updated-settings", {
    name: "",
    hint: "",
    scope: "world",
    config: false,
    type: String,
    default: "0.0.0",
  });

  game.settings.register(MODULE_ID, "module-active.jb2a-patreon", {
    name: "",
    hint: "",
    scope: "world",
    config: false,
    type: Boolean,
    default: false,
  });
}
