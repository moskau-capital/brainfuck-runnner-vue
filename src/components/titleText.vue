<template>
    <div>
    <p class="title">count upper</p>
    <p>prop is: {{ prop_1 }}</p>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps(["prop_1"]);
</script>

<style scoped>
div {
    text-align: center;
}
.title {
    font-size: 30px;
    
}
</style>