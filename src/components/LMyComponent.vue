<template>
    <div
        class="component"
        :class="{ [props.color]: true}"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    color?: "red" | "green" | "blue";
}>(), {
    color: "red"
});
</script>

<style scoped>
.component {
    border: 1px solid;
    margin: var(--bp-length-m);
    padding: var(--bp-length-m);

    &.red {
        border-color: red;
    }

    &.green {
        border-color: green;
    }

    &.blue {
        border-color: blue;
    }
}
</style>
