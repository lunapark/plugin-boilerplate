<!--
    A plain Vue 3 component. Nothing in it is Luna Park specific: the Luna Park description of
    its props and slots is in ./card.ts.

    Styling rules for plugin components:
    - use scoped styles (they are bundled into index.js for the editor and runtime.js for apps);
    - read plugin CSS variables (`--bp-*`, see features/tokens/tokens.css) with fallbacks;
    - don't depend on editor-only variables (`--color-content`, ...): apps don't have them.
-->
<template>
    <div
        class="bp-card"
        :class="[variant, { elevated }]"
        :style="{ padding, '--accent': color }"
    >
        <div
            v-if="title"
            class="title"
        >
            {{ title }}
        </div>
        <div class="content">
            <slot />
        </div>
        <div
            v-if="$slots.footer"
            class="footer"
        >
            <slot name="footer" />
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    color?: string;
    elevated?: boolean;
    padding?: string;
    title?: string;
    variant?: "outline" | "soft" | "solid";
}>(), {
    color: undefined,
    elevated: false,
    padding: "var(--bp-spacing, 8px)",
    title: "",
    variant: "outline"
});
</script>

<style scoped>
.bp-card {
    display: flex;
    flex-direction: column;
    gap: var(--bp-spacing, 8px);
    border-radius: var(--bp-radius, 8px);

    &.outline {
        border: 1px solid var(--accent, var(--bp-color-accent, #ff6600));
    }

    &.soft {
        background-color: color-mix(in srgb, var(--accent, var(--bp-color-accent, #ff6600)) 12%, transparent);
    }

    &.solid {
        background-color: var(--accent, var(--bp-color-accent, #ff6600));
        color: #ffffff;
    }

    &.elevated {
        box-shadow: 0 4px 16px rgb(0 0 0 / 20%);
    }

    .title {
        font-weight: 600;
    }

    .footer {
        opacity: 0.7;
        font-size: 0.875em;
    }
}
</style>
