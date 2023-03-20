<template>
    <label>
        <div class="switch">
            <input type="checkbox" @input="$emit('clicked')" :checked="pushed"/>
            <div class="circle"></div>
            <div class="base"></div>
        </div>
        <span class="title">{{ labelText }}</span>
    </label>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps(["labelText", "pushed"]);

</script>

<style scoped>
label {
    position: relative;
    display: flex;
    align-items: center;
    width: fit-content;
}

input {
    position: absolute;
    width: 0;
    height: 0;
    display: none;
}

.title {
    margin-left: 4px;
    font-size: 0.8em;
}

.base {
    width: 56px;
    border-radius: 16px;
    height: 32px;
    background-color: #fbc5c5;
}

input:checked~.base {
    background-color: black;
    transition: 0.5s;
}

.circle {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background-color: gray;
}

.switch {
    position: relative;
}


input:checked~.circle {
    transform: translateX(100%);
    background-color: white;
    transition: 0.5s;
}

input:not(checked)~.circle {
    transform: translateX(0);
    transition: 0.5s;
}
</style>