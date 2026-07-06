import { askToAddNewAnimationsDialog } from "./enableNewAnimations.js";
import { setupSettings } from "./settings.js";

export const MODULE_ID = "pf2e-trigger-animations-trove";

const triggerEngineTriggersPath = `modules/${MODULE_ID}/triggers.json`;

Hooks.once("init", async function () {
  setupSettings();
  Hooks.once("triggerEngine.registerTriggers", (registerTriggers) => {
    registerTriggers("trigger-engine", "pf2e-trigger", triggersOrFilePath);
  });
});

Hooks.once("ready", async function () {
  updateModulesEnabledSettings();

  if (
    game.user.isGM &&
    !game.settings.get(MODULE_ID, "disable-trigger-enable-spam")
  ) {
    reminderActivateAllTriggers();
  }

  if (
    game.user.isGM &&
    foundry.utils.isNewerVersion(
      game.modules.get(MODULE_ID).version,
      game.settings.get(MODULE_ID, "last-updated-settings"),
    )
  ) {
    await askToAddNewAnimationsDialog();
  }
});

function reminderActivateAllTriggers() {
  ui.notifications.warn(
    "pf2e-trigger-animations-trove.module-settings.disable-trigger-enable-spam.message",
    { permanent: true, localize: true },
  );
}

function updateModulesEnabledSettings() {
  const isJb2aPatreonActive = game.modules.get("jb2a_patreon")?.active;
  game.settings.set(
    MODULE_ID,
    "module-active.jb2a-patreon",
    isJb2aPatreonActive,
  );
}
