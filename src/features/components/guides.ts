/**
 * GUIDES: shared Markdown for the AI assistant (top-level `guides`).
 *
 * A component's `llm` explains that component alone. A guide explains how several components
 * fit together (nesting, which slot holds what), so it isn't repeated on each of them:
 * - declare it here, keyed by a stable name, with a one-line `description` of what it covers;
 * - list its name in the `guides` of every component it covers (./card.ts, ./list.ts).
 *
 * The assistant sees the names and descriptions in `listPlugins`, the names on each component
 * in `getComponents`, and reads the content once per conversation through `documentation`.
 *
 * Docs: docs/05-components.md
 */
import type { TPluginGuide } from "@luna-park/plugin";

import cards from "@/features/components/cards.md?raw";

export const guides: Record<string, TPluginGuide> = {
    cards: {
        content: cards,
        description: "How Card, List and Counter fit together"
    }
};
