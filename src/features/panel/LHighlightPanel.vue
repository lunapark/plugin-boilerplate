<!--
    Custom UI of the element panel (`TElementPanel.component`), editor only.

    Contract (TElementPanelProps<TValues>):
    - props: `modelValue` (the panel values of the selected element), `schema` (the selected
      layout element), `getElements()` (its DOM nodes in the canvas);
    - emit `update:modelValue` with the **whole** new values object.

    The editor renders this component above the auto-generated form. Properties marked
    `options: { hidden: true }` are left out of that form, so this UI is their only editor.
-->
<template>
    <div class="row">
        <span class="title">Intensity</span>
        <div class="intensity">
            <LButton
                v-for="level in levels"
                :key="level"
                :primary="modelValue.intensity === level"
                small
                @click="update('intensity', level)"
            >
                {{ level }}
            </LButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { LButton } from "@luna-park/design";
import type { TElementPanelProps } from "@luna-park/plugin";

import type { THighlightOptions } from "@/features/panel/runtime.ts";

const props = defineProps<TElementPanelProps<THighlightOptions>>();

const emits = defineEmits<(e: "update:modelValue", value: THighlightOptions) => void>();

const levels = [1, 2, 4, 8];

function update<TKey extends keyof THighlightOptions>(key: TKey, value: THighlightOptions[TKey]) {
    emits("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>

<style scoped>
.row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--length-xxs) var(--length-xs);

    .title {
        color: var(--color-content-lite);
        font-size: var(--font-size-s);
    }

    .intensity {
        display: flex;
        gap: var(--length-xxs);
    }
}
</style>
