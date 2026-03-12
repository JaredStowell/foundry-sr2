const SR2_ACTOR_CREATE_DIALOG_HOOKS_KEY = "__sr2ActorCreateDialogHooksInstalled";

export function registerActorCreateDialogHooks(enhanceActorCreateDialog) {
  if (globalThis[SR2_ACTOR_CREATE_DIALOG_HOOKS_KEY]) return;
  if (typeof enhanceActorCreateDialog !== "function") return;

  globalThis[SR2_ACTOR_CREATE_DIALOG_HOOKS_KEY] = true;
  Hooks.on("renderDialog", enhanceActorCreateDialog);
  Hooks.on("renderDocumentCreateDialog", enhanceActorCreateDialog);
  Hooks.on("renderDocumentCreationDialog", enhanceActorCreateDialog);
  Hooks.on("renderActorCreateDialog", enhanceActorCreateDialog);
}

export function installActorCreateDialogObserver(enhanceActorCreateDialog) {
  if (typeof enhanceActorCreateDialog !== "function") return;

  const key = "__sr2eActorCreateDialogObserver";
  if (globalThis[key]) return;

  let scheduled = false;
  const scan = () => {
    const forms = document.querySelectorAll("form");
    for (const form of forms) {
      enhanceActorCreateDialog(null, form);
    }
  };

  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      scan();
    }, 0);
  });

  observer.observe(document.body, { childList: true, subtree: true });
  globalThis[key] = observer;

  scan();
}
