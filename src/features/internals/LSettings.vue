<!--
    Settings tab, registered with `makePlugin({ settings: [{ component, icon, label }] })`.

    The editor shows each tab in the plugin's configuration popup (the plugin button in the
    editor header). A tab is an ordinary Vue component with no props, so it edits the reactive
    `internals` object directly and the editor persists the changes.

    Use `@luna-park/design` components so the UI matches the editor. That package is provided by
    the editor at runtime: never import it from runtime/server code.
    Stories: wrap this component in `LSettingsStoryWrapper` (from `@luna-park/plugin`) to preview
    it at the real size in Histoire.
-->
<template>
    <div class="settings">
        <h2>General</h2>
        <span class="description">
            Values stored in the plugin's internals. They are saved with the project.
        </span>
        <LInput
            v-model="internals.signature"
            label="Signature"
            placeholder="Sent from Luna Park"
        />

        <h2>Secret</h2>
        <span class="description">
            At build time this key goes to the generated <code>.env</code> file. It is never written into the code.
        </span>
        <LInput
            v-model="internals.apiKey"
            label="API key"
            placeholder="sk_..."
            type="password"
        />

        <h2>Categories</h2>
        <span class="description">
            Used as a dynamic dropdown by the "Pick category" node.
        </span>
        <div
            v-for="category in internals.categories"
            :key="category.id"
            class="row"
        >
            <LInput
                v-model="category.label"
                label="Label"
            />
            <LButton
                :icon="faTrash"
                small
                square
                title="Remove category"
                @click="removeCategory(category.id)"
            />
        </div>
        <LButton
            :icon="faPlus"
            small
            @click="addCategory"
        >
            Add category
        </LButton>
    </div>
</template>

<script setup lang="ts">
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { LButton, LInput } from "@luna-park/design";

import { internals } from "@/features/internals/internals.ts";

function addCategory() {
    const id = crypto.randomUUID();
    internals.categories[id] = { id, label: "New category" };
}

function removeCategory(id: string) {
    delete internals.categories[id];
}
</script>

<style scoped>
/* The editor's design tokens (--length-*, --font-size-*, --color-*) are available in the editor. */
.settings {
    padding: var(--length-s);
    display: flex;
    flex-direction: column;
    gap: var(--length-xs);

    h2 {
        font-size: var(--font-size-xs);
        text-transform: uppercase;
        font-weight: 600;
        color: var(--color-content-liter);
        margin: var(--length-s) 0 0;

        &:first-child {
            margin-top: 0;
        }
    }

    .description {
        color: var(--color-content-litest);
        font-size: var(--font-size-s);
    }

    .row {
        display: flex;
        align-items: flex-end;
        gap: var(--length-xs);

        &:deep(.input) {
            flex: 1 1 auto;
        }
    }
}
</style>
