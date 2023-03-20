<script setup lang="ts">
import { ref, reactive, queuePostFlushCb } from "vue";
import type { Ref } from "vue";
import titleText from "./titleText.vue";

type LIST = {
  item : string
  isFinished: boolean
}

const Ref_count = ref(0);
const Ref_prop = ref("(empty)");

const Ref_text = ref(null);
const Ref_list: Ref<LIST[]> = ref([]);




function up() {
  Ref_count.value++;
}

function down() {
  --(Ref_count.value);
}

function change() {
  Ref_prop.value = Ref_count.value.toString();
}

function add() {
  Ref_list.value.push({
    item: Ref_text.value!,
    isFinished: false
  });
}

function rm() {
  Ref_list.value.pop();
}

function fin(e: Event, index: number) {

  Ref_list.value[index].isFinished = Ref_list.value[index].isFinished ? false : true;

}

function rmCompleted() {
  let yet_list = Ref_list.value.filter(todo => !todo.isFinished);
  Ref_list.value = yet_list.slice();
}

</script>

<template>
  <titleText :prop_1="Ref_prop"/>
  <p>now count is {{ Ref_count }}</p>
  <button @click="up()">up!</button>
  <br>
  <button @click="down()">down!</button>
  <br>
  <button @click="change()">change prop</button>
  <br>
  <br>
  <h3>add list</h3>
  <input type="text" v-model="Ref_text" @keydown.enter="add()">  
  <button @click="add()">add</button>
  <button @click="rm()">pop</button>
  <button @click="rmCompleted()">remove complated</button>
  <ul>
    <li v-for="i, index in Ref_list" :key="i.item" :style="Ref_list[index].isFinished ? {textDecoration: 'line-through'} : { textDecoration: 'none' }">{{ index }}: {{ i.item }} <input type="checkbox" @input="fin($event, index)"></li>
  </ul>
</template>

<style scoped>
.fin {
  text-decoration: line-through;
}
</style>
