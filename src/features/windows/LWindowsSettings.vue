<!--
    Settings tab that opens the "Callback" window as a popup and shows what it sends back.
    It is a second entry in the `settings` array: a plugin can have as many tabs as it needs.
-->
<template>
    <div class="windows-settings">
        <span class="description">
            Opens the plugin's <code>Callback</code> window in a popup. The window sends its URL
            parameters back with <code>postMessage</code>.
        </span>
        <LButton
            :icon="faUpRightFromSquare"
            small
            @click="open"
        >
            Open callback window
        </LButton>
        <pre v-if="received">{{ received }}</pre>
    </div>
</template>

<script setup lang="ts">
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { LButton } from "@luna-park/design";
import { onBeforeUnmount, ref } from "vue";

import { getWindowUrl, WINDOW_MESSAGE_TYPE } from "@/features/windows/url.ts";

const received = ref("");

function onMessage(event: MessageEvent) {
    // Always check the origin and shape of messages
    if (event.origin !== window.location.origin || event.data?.type !== WINDOW_MESSAGE_TYPE) {
        return;
    }

    received.value = JSON.stringify(event.data.params, null, 2);
}

function open() {
    window.addEventListener("message", onMessage);
    window.open(getWindowUrl("Callback", undefined, { hello: "world" }), "boilerplate-callback", "width=480,height=320");
}

onBeforeUnmount(() => window.removeEventListener("message", onMessage));
</script>

<style scoped>
.windows-settings {
    padding: var(--length-s);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--length-xs);

    .description {
        color: var(--color-content-litest);
        font-size: var(--font-size-s);
    }
}
</style>
