'use strict';
(function exportModule(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    root.loot = root.loot || {};
    root.loot.handlePromiseError = factory(root.loot);
  }
}(this, (loot) => (error) => {
  if (!error) {
    loot.Dialog.closeProgress();
    return;
  }

  /* Error.stack seems to be Chromium-specific. */
  console.log(error.stack);  // eslint-disable-line no-console
  loot.Dialog.closeProgress();
  loot.Dialog.showMessage(loot.l10n.translate('Error'), error.message);
}));
