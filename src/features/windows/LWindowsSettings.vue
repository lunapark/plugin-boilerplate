<!--
    Workspace section that opens the "Callback" window as a popup and shows what it sends back.
    It is a second entry in `workspace.sections`: a plugin can have as many sections as it needs.
-->
<template>
    <LCard>
        <LSettingRow
            description="Opens the plugin's Callback window in a popup. The window sends its URL parameters back with postMessage."
            title="Callback window"
        >
            <LButton
                :icon="faUpRightFromSquare"
                small
                @click="open"
            >
                Open
            </LButton>
        </LSettingRow>
        <pre
            v-if="received"
            class="received"
        >{{ received }}</pre>
    </LCard>
</template>

<script setup lang="ts">
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { LButton, LCard, LSettingRow } from "@luna-park/design";
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
.received {
    margin: 0;
    padding: var(--length-xs) var(--length-s);
    border-top: 1px solid var(--color-background-2);
    font-size: var(--font-size-xs);
    color: var(--color-content-lite);
}
</style>
