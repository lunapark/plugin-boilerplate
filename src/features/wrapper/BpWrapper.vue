<!--
    App wrapper: wraps the whole app (the canvas in the editor, `<RouterView/>` in exported apps).

    Use it for app-level concerns: providers (`provide()`), a theme root, portals, global
    listeners. It must render its default slot.
    This one sets a `data-density` attribute that plugin CSS can target, and adds no visible UI.
-->
<template>
    <div
        class="bp-wrapper"
        :data-density="density ?? boilerplateConfig.density"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { boilerplateConfig } from "@/features/config/runtime.ts";

defineProps<{
    density?: string;
}>();
</script>

<style scoped>
.bp-wrapper {
    display: contents;
}
</style>
