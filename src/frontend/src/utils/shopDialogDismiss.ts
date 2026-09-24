/**
 * Buy Doka overlay dismiss. Same contract as Item Shop (`BuffShop`):
 * backdrop click and Escape close the modal; clicks on the panel do not.
 * Display / a11y only — does not start a purchase or redeem.
 */

export function shouldDismissShopDialogOnBackdrop(
  eventTarget: EventTarget | null,
  currentTarget: EventTarget | null,
): boolean {
  return eventTarget != null && eventTarget === currentTarget;
}

export function shouldDismissShopDialogOnKey(key: string): boolean {
  return key === "Escape";
}

/**
 * Overlay `onKeyDown` only fires when that node is focused. Native
 * `<dialog>.showModal()` handles Escape; these overlays are plain divs /
 * `open` dialogs, so bind the window while the overlay is mounted.
 */
export function subscribeEscapeToDismiss(
  onClose: () => void,
  target: EventTarget = window,
): () => void {
  const onKey = (event: Event) => {
    const key =
      "key" in event && typeof event.key === "string" ? event.key : "";
    if (shouldDismissShopDialogOnKey(key)) onClose();
  };
  target.addEventListener("keydown", onKey);
  return () => target.removeEventListener("keydown", onKey);
}
