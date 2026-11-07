/**
 * FEATURE: standalone windows (`windows`).
 *
 * `windows` maps a key to a Vue component. Luna Park renders it full page at
 * `/plugin?plugin=<target>&window=<key>`. Use it for popups and redirect targets (OAuth
 * callbacks, payment returns, device pairing, ...).
 *
 * Docs: docs/09-config-internals-settings-windows.md
 */
import { faWindowRestore } from "@fortawesome/free-solid-svg-icons";
import type { TPluginWorkspaceSection } from "@luna-park/plugin";
import type { Component } from "vue";
import { markRaw } from "vue";

import LCallbackWindow from "@/features/windows/LCallbackWindow.vue";
import LWindowsSettings from "@/features/windows/LWindowsSettings.vue";

export const windows: Record<string, Component> = {
    Callback: markRaw(LCallbackWindow)
};

export const windowsSections: Array<TPluginWorkspaceSection> = [
    {
        id: "windows",
        component: LWindowsSettings,
        description: "Standalone pages opened outside the editor, such as OAuth or payment callbacks.",
        icon: faWindowRestore,
        title: "Windows"
    }
];
