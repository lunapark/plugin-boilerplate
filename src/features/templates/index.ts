/**
 * FEATURE: project templates (`editor.templates`).
 *
 * A template is a ready-made folder of files (components, logic, stores, ...) that users can
 * add from the editor's templates window. Each one has:
 * - `name`: title in the templates window;
 * - `preview`: image URL. Imported image files become data URIs or URLs through Vite;
 * - `template`: the folder in **export format** (`TFile<true>`, without runtime ids).
 *
 * The easiest way to get the JSON is to build the folder in the editor and export it. Templates
 * can use your plugin's components (`"element": "plugin/<pluginId>"`,
 * `"target": "<pluginId>><component name>"`) and tokens (`"token": "plugin/<pluginId>/<id>"`).
 *
 * Docs: docs/13-files-and-templates.md
 */
import type { TTemplate } from "@luna-park/plugin";

import demoTemplate from "@/features/templates/demo.json";
import demoPreview from "@/features/templates/preview.svg";

export const templates = [
    {
        name: "Boilerplate demo",
        preview: demoPreview,
        template: demoTemplate as unknown as TTemplate["template"]
    }
] satisfies Array<TTemplate>;
