<template>
    <div class="box">
    <button @click="$emit('addCode', '+')">+</button>
    <button @click="$emit('addCode', '-')">-</button>
    <button @click="$emit('addCode', '<')">&lt;</button>
    <button @click="$emit('addCode', '>')">&gt;</button>
    <button @click="$emit('addCode', '[')">[</button>
    <br>
    <button @click="$emit('addCode', ']')">]</button>
    <button @click="$emit('addCode', '.')">.</button>
    <button @click="$emit('addCode', ',')">,</button>
    <button @click="$emit('addCode', 'del')" class="b">一字<br>削除</button>
    <button @click="$emit('addCode', '\n')" class="n">改行</button>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
div.box {
    display: inline-block;
}

button {
    background-color: rgb(89, 89, 89);
    border: 0;
    margin-right: 5px;
    color: white;
    font-weight: bold;
    margin-bottom: 8px;
    width:40px;
    height: 30px;
}

button.n {
    font-size: 15px;
}

button.b {
    font-size:10px;
    margin-top: 3px;
}

button:hover {
background-color: rgb(181, 181, 181);
}
</style>