<!--
    Workspace section, registered with `makePlugin({ workspace: { sections: [{ id, component, icon, title }] } })`.

    The editor shows each section in the plugin's workspace (opened from the plugin button in the
    editor header). A section is an ordinary Vue component with no props, so it edits the reactive
    `internals` object directly and the editor persists the changes.

    Use `@luna-park/design` components so the UI matches the editor. That package is provided by
    the editor at runtime: never import it from runtime/server code.
    `LCard` groups rows into a bordered block, and `LSettingRow` lays out a title, a description
    and a control, like the editor's own workspaces.
-->
<template>
    <div class="settings">
        <LCard>
            <LSettingRow
                description="Stored in the plugin's internals and saved with the project."
                title="Signature"
            >
                <LInput
                    v-model="internals.signature"
                    placeholder="Sent from Luna Park"
                    small
                />
            </LSettingRow>
            <LSettingRow
                description="At build time this key goes to the generated .env file. It is never written into the code."
                title="API key"
            >
                <LInput
                    v-model="internals.apiKey"
                    placeholder="sk_..."
                    small
                    type="password"
                />
            </LSettingRow>
        </LCard>

        <LCard>
            <LSettingRow
                description="Used as a dynamic dropdown by the Pick category node."
                title="Categories"
            >
                <LButton
                    :icon="faPlus"
                    small
                    @click="addCategory"
                >
                    Add
                </LButton>
            </LSettingRow>
            <div
                v-for="category in internals.categories"
                :key="category.id"
                class="category"
            >
                <LInput
                    v-model="category.label"
                    class="label"
                    small
                />
                <LButton
                    :icon="faTrash"
                    small
                    square
                    title="Remove category"
                    transparent
                    @click="removeCategory(category.id)"
                />
            </div>
        </LCard>
    </div>
</template>

<script setup lang="ts">
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { LButton, LCard, LInput, LSettingRow } from "@luna-park/design";

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
    display: flex;
    flex-direction: column;
    gap: var(--length-s);

    .category {
        display: flex;
        align-items: center;
        gap: var(--length-xs);
        padding: var(--length-xxs) var(--length-s);
        border-top: 1px solid var(--color-background-2);

        .label {
            flex: 1 1 auto;
        }
    }
}
</style>
