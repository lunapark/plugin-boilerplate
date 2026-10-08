/**
 * RUNTIME helpers for the node examples (browser only).
 *
 * The editor imports them directly (node methods). Generated frontends import them from
 * `<package>/runtime` (`build.imports` in ./codegen.ts). Both run the same code, which keeps
 * the editor preview and the exported app consistent.
 */
import { onScopeDispose, ref } from "vue";

export function slugify(text: string) {
    return text
        .normalize("NFKD")
        .replaceAll(/[̀-ͯ]/g, "")
        .toLowerCase()
        .trim()
        .replaceAll(/[^a-z0-9]+/g, "-")
        .replaceAll(/^-|-$/g, "");
}

/**
 * A reactive window width. Meant to be wrapped in `this.instance(...)` (editor) or
 * `useInstances()` (generated code), so one listener is created per node instance and cleaned up
 * with it.
 */
export function useWindowWidth() {
    const width = ref(typeof window === "undefined" ? 0 : window.innerWidth);

    function update() {
        width.value = window.innerWidth;
    }

    if (typeof window !== "undefined") {
        window.addEventListener("resize", update);
        onScopeDispose(() => window.removeEventListener("resize", update));
    }

    return width;
}
