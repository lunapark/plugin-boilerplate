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
import type { TBasePlugin } from "@luna-park/plugin";
import type { Component } from "vue";
import { markRaw, shallowRef } from "vue";

import LCallbackWindow from "@/features/windows/LCallbackWindow.vue";
import LWindowsSettings from "@/features/windows/LWindowsSettings.vue";

export const windows: Record<string, Component> = {
    Callback: markRaw(LCallbackWindow)
};

export const windowsSettings: NonNullable<TBasePlugin["settings"]> = [
    {
        component: shallowRef(LWindowsSettings),
        icon: faWindowRestore,
        label: "Windows"
    }
];
