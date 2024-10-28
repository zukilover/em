import { page } from '../setup'

/** Hides the first Node that matches the selector from the DOM by setting display: none. Do nothing if the selector is empty. */
const hide = async (selector: string) => {
  return page.evaluate((selector: string) => {
    const el = document.querySelector(selector) as HTMLElement | undefined
    if (!el) return
    el.style.display = 'none'
  }, selector)
}

/** Hides the heads-up-display (header, footer, menu, navbar, and toolbar) so that only the thoughts are shown. */
const hideHUD = async () => {
  await hide('[aria-label="footer"]')
  await hide('[aria-label="menu"]')
  await hide('[aria-label="nav"]')
  // Must hide toolbar rather than removing it completely, otherwise the distractionFreeTyping unmount can interfere and cause the test to fail with "Failed to execute 'removeChild' on 'Node'"
  await hide('[aria-label="toolbar"]')
}

export default hideHUD