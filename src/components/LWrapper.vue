<template>
    <div class="wrapper">
        <div class="title">
            This is a wrapper for the whole app
        </div>
        <div class="content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.wrapper {
    margin: var(--bp-length-l);
    border: 1px solid #990000;
    display: flex;
    flex-direction: column;

    .title {
        flex: 0 0 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #990000;
        color: #ffffff;
    }

    .content {
        flex: 1 1 auto;
        padding: var(--bp-length-l);
    }
}
</style>
