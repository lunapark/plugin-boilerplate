<!--
    Standalone plugin window, registered in `makePlugin({ windows: { Callback: LCallbackWindow } })`.

    Luna Park serves it at:
        https://luna-park.app/plugin?plugin=<package name or URL>&window=Callback
    The page loads only your plugin module and renders this component, full page. There is
    no project, no `env` and no lifecycle, and only `vue`, `vue-router` and `@luna-park/design`
    are available.

    Typical use: an OAuth redirect URI. The provider redirects here, and the window sends the
    query params back to the editor with `postMessage` and closes (see the Users plugin).
-->
<template>
    <div class="callback-window">
        {{ status }}
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { WINDOW_MESSAGE_TYPE } from "@/features/windows/url.ts";

const status = ref("Loading…");

onMounted(() => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search));

    if (!window.opener) {
        status.value = "This window must be opened from the Luna Park editor.";
        return;
    }

    // Only ever post to the editor's origin
    window.opener.postMessage({ params, type: WINDOW_MESSAGE_TYPE }, window.location.origin);
    status.value = "Done. You can close this window.";
    window.close();
});
</script>

<style scoped>
.callback-window {
    padding: var(--length-l, 16px);
    font-family: sans-serif;
}
</style>
