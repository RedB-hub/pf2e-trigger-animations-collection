import { askToEnableNewTriggersDialog } from "./enableNewTriggers";

export function setupAPI() {
  window.triggerAnimationsTrove = {
    api: {
      enableNewTriggersDialog: askToEnableNewTriggersDialog,
      enableNewAnimationsDialog: askToAddNewAnimationsDialog,
    },
  };
}
