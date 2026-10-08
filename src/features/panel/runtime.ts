/**
 * RUNTIME: the `v-highlight` directive applied by the element panel.
 *
 * The same directive object runs in the editor canvas (`directive.value`) and in exported apps,
 * which import it from `<package>/runtime` (`directive.build`). Its binding value is the
 * panel's values, `{ color, style, pulse, intensity }`.
 *
 * A directive only touches the element's DOM. Keep it idempotent: `updated` can run often.
 */
import type { Directive } from "vue";

export type THighlightOptions = {
    color?: string;
    intensity: number;
    pulse?: boolean;
    style: "outline" | "glow";
};

function apply(element: HTMLElement, options: THighlightOptions) {
    const color = options.color || "var(--bp-color-accent, #ff6600)";
    const size = Math.max(1, options.intensity);

    element.style.outline = options.style === "outline" ? `${ size }px solid ${ color }` : "";
    element.style.boxShadow = options.style === "glow" ? `0 0 ${ size * 4 }px ${ color }` : "";
    element.style.animation = options.pulse ? "bp-highlight-pulse 1.2s ease-in-out infinite alternate" : "";
}

function clear(element: HTMLElement) {
    element.style.outline = "";
    element.style.boxShadow = "";
    element.style.animation = "";
}

export const vHighlight: Directive<HTMLElement, THighlightOptions> = {
    mounted: (element, { value }) => apply(element, value),
    unmounted: (element) => clear(element),
    updated: (element, { value }) => apply(element, value)
};

/** Used by the panel action: briefly flashes the selected elements. */
export function flashElements(elements: Array<HTMLElement>) {
    for (const element of elements) {
        element.animate([{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }], { duration: 400 });
    }
}
