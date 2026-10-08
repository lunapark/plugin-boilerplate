/**
 * Helpers to open the plugin windows from the editor.
 *
 * The `plugin` query param is the same target the editor uses to load the plugin: the npm
 * package name, or the full URL while developing with `luna-preview`.
 */
import { PACKAGE_NAME } from "@/meta.ts";

export const WINDOW_MESSAGE_TYPE = "boilerplate:window";

export function getWindowUrl(window: string, target = PACKAGE_NAME, extra: Record<string, string> = {}) {
    const url = new URL("/plugin", globalThis.location?.origin ?? "https://luna-park.app");
    url.search = new URLSearchParams({ plugin: target, window, ...extra }).toString();
    return url.href;
}
