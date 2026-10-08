<template>
    <ul
        v-if="items.length"
        class="bp-list"
    >
        <li
            v-for="(item, index) in items"
            :key="index"
        >
            <!-- Scoped slot: the editor exposes `item` and `index` as variables inside it -->
            <slot
                :index="index"
                :item="item"
                name="item"
            >
                {{ item }}
            </slot>
        </li>
    </ul>
    <div
        v-else-if="showEmpty"
        class="bp-list-empty"
    >
        <slot name="empty">
            Nothing here.
        </slot>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    items?: Array<string>;
    showEmpty?: boolean;
}>(), {
    items: () => [],
    showEmpty: true
});
</script>

<style scoped>
.bp-list {
    margin: 0;
    padding-left: calc(var(--bp-spacing, 8px) * 2);
}

.bp-list-empty {
    opacity: 0.6;
    font-style: italic;
}
</style>
