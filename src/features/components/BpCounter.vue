<template>
    <div class="bp-counter">
        <button
            type="button"
            @click="add(-step)"
        >
            −
        </button>
        <span class="value">{{ value }}</span>
        <button
            type="button"
            @click="add(step)"
        >
            +
        </button>
        <button
            class="reset"
            type="button"
            @click="reset"
        >
            Reset
        </button>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    step?: number;
}>(), {
    step: 1
});

const emits = defineEmits<{
    change: [value: number];
    reset: [];
}>();

// `v-model` in the generated app, two-way binding in the editor (declared in `models`)
const value = defineModel<number>({ default: 0 });

function add(delta: number) {
    value.value += delta;
    emits("change", value.value);
}

function reset() {
    value.value = 0;
    emits("reset");
}
</script>

<style scoped>
.bp-counter {
    display: inline-flex;
    align-items: center;
    gap: var(--bp-spacing, 8px);

    button {
        border: 1px solid var(--bp-color-accent, #ff6600);
        border-radius: var(--bp-radius, 8px);
        background: none;
        color: inherit;
        padding: 2px 10px;
        cursor: pointer;
    }

    .value {
        min-width: 2ch;
        text-align: center;
        font-variant-numeric: tabular-nums;
    }
}
</style>
