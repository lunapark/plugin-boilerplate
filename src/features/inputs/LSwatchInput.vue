<!--
    Custom property input, registered in `editor.inputs` (editor only).

    The editor renders it in place of its default input for any schema with
    `options: { input: "<pluginId>/<key>" }`. Its contract:
    - `v-model` (`modelValue` / `update:modelValue`): the property value;
    - `schema` prop: the full schema, so you can read your own options from `schema.options`.
-->
<template>
    <div class="swatches">
        <button
            v-for="color in colors"
            :key="color"
            class="swatch"
            :class="{ selected: color === value }"
            :style="{ backgroundColor: color }"
            :title="color"
            type="button"
            @click="value = color"
        />
    </div>
</template>

<script setup lang="ts">
import type { TSchema } from "@luna-park/plugin";
import { computed } from "vue";

const props = defineProps<{
    schema: TSchema;
}>();

const value = defineModel<string>();

const defaultColors = ["#ff6600", "#e11d48", "#7c3aed", "#2563eb", "#059669", "#1a1a2e"];

// Options read from the schema, e.g. `options: { input: "boilerplate/swatch", colors: [...] }`
const colors = computed(() => (props.schema.options?.colors as Array<string> | undefined) ?? defaultColors);
</script>

<style scoped>
.swatches {
    display: flex;
    flex-wrap: wrap;
    gap: var(--length-xxs);
}

.swatch {
    width: 20px;
    height: 20px;
    padding: 0;
    border: 2px solid transparent;
    border-radius: var(--length-radius-m);
    cursor: pointer;

    &.selected {
        border-color: var(--color-content);
    }
}
</style>
