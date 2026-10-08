<!--
    Constant editor of the "Money" interface (`TInterface.constant.editor`), editor only.

    It appears wherever the user types a constant Money value: an unconnected node pin, a
    variable default, a property... Props are `TInterfaceEditorProps`:
    - `modelValue`: the serialisable constant (a string such as "12.50 EUR");
    - `schema`: the interface schema (`schema.className === "Money"`);
    - `anchor`: true when rendered inside a node pin (compact styling);
    - `placeholder`.
    The editor turns the constant into a real instance with `constant.parse`.
-->
<template>
    <LInput
        v-model="value"
        :border="anchor"
        :placeholder="placeholder ?? '0 EUR'"
        small
        :transparent="anchor"
    />
</template>

<script setup lang="ts">
import { LInput } from "@luna-park/design";
import type { TInterfaceEditorProps } from "@luna-park/plugin";

defineProps<Omit<TInterfaceEditorProps, "modelValue">>();

const value = defineModel<string>();
</script>
