<template>
  <div :class="dark_mode">
  <header>
  <h2>braifu*k web runner</h2>
  <toggle labelText="ダークモード" class="toggle" :pushed="dark_mode == 'dark'" @clicked="toggleMode()"></toggle>
  </header>
  <p>このサイトでは、web上でbrainfu*kを実行することができます。</p>
  <br>
  <div class="speedConfig">
  <p>実行速度設定</p>
  <br>
  <label>
  <input type="number" class="speed" :disabled="no_wait" v-model="speed"/>文字/秒
  </label>
  <p>※数字を大きくするほど速くなります。</p>
  <br>
  <label>
  即時実行　<input type="checkbox" v-model="no_wait" checked style="border-radius: 10px;">
  </label>
  </div>
  <br>
  <br>
  <br>
  <p>コード</p>
  <textarea placeholder="command + enter もしくは ctrl + enter で実行" cols="30" rows="10" v-model="code_ref" @keydown.ctrl.enter="exec()" @keydown.meta.enter="exec()" @keydown.ctrl.c="exit()">
  </textarea>
  <button @click="exec()" class="exec">実行</button><button @click="exit()" class="exit" :disabled="!execution_inProgress">強制終了</button><keyBoard v-if="showKeyBoard" class="keyBoard" @addCode="addCode"></keyBoard>
  <br>
  <p>入力</p>
  <textarea cols="30" rows="3" class="terminal" v-model="input"></textarea>
  <br>
  <p>出力</p>
  <textarea cols="30" rows="5" class="terminal" v-model="stdOut" readonly></textarea>
  <br>
  <h>メモリ</h>
  <br>
  <ul>
    <span v-for="bit, index in memory_ref" :key="index" ><li :class="pointer_ref == index ? 'highlight' : ''">[{{ bit }}]</li></span>
  </ul>
  <descpiption class="desc" :mode="dark_mode"></descpiption>
  </div>

</template>




<script setup lang="ts">
//components
import todo from "./components/todo.vue";
import toggle from "./components/toggle.vue";
import keyBoard from "./components/keyBoard.vue";
import descpiption from "./components/description.vue";

import { ref, watch } from "vue";
import { sleep } from "sleep-ts";
import type { Ref } from "vue";



const code_ref: Ref<string> = ref("");
let memory_ref: Ref<number[]> = ref(new Array(40).fill(0));
let pointer_ref = ref(0);
let stdOut = ref("");
let input = ref("");
let input_pointer_ref = ref(0);
let showKeyBoard: boolean = false;

let execution_inProgress = ref(false);

let no_wait = ref(true);

let speed: Ref<number> = ref(0);

let will_exit: boolean = false;

type MODE = "dark" | "light";

let dark_mode: Ref<MODE> = ref(window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");

let body_dom_vanila = document.querySelector("body")!;

//bodyはvueの管轄範囲外なのでqueryselector。
if (dark_mode.value == "dark") {
  body_dom_vanila.setAttribute("style", "background-color: #2b2b2b;");
} else {
  body_dom_vanila.setAttribute("style", "background-color: white;");
}


//watchで監視。
watch(dark_mode, (newMode) => {
  if (newMode == "dark") {
    body_dom_vanila.setAttribute("style", "background-color: #2b2b2b;");
  } else {
    body_dom_vanila.setAttribute("style", "background-color: white;");
  }

});

//入力ボタンをモバイル,タブレットに表示
let ua = navigator.userAgent;
if (ua.includes("Android") || ua.includes("iPhone") || ua.includes("iPad")) {
  showKeyBoard = true;
}



const exec = async (): Promise<any> => {

  if (execution_inProgress.value) {
    return;
  }

  execution_inProgress.value  = true;
  //init
  pointer_ref.value = 0;
  memory_ref.value.fill(0);
  stdOut.value = "";
  input_pointer_ref.value = 0;

  const code_splited = code_ref.value.split("");  

  let code_pointer = 0;
  let current_mem_value: number;
  let temp: string[];
  let input_ascii: number;
  while (true) {
    current_mem_value = memory_ref.value[pointer_ref.value];
    switch (code_splited[code_pointer]) {
      case "+":
        memory_ref.value.splice(pointer_ref.value, 1, current_mem_value + 1);
        if (current_mem_value > 255) {
          memory_ref.value.splice(pointer_ref.value, 1, 0);
        };
        break;
      case "-":
        current_mem_value = memory_ref.value[pointer_ref.value];

        memory_ref.value.splice(pointer_ref.value, 1, current_mem_value - 1);
        if (current_mem_value < 0) {
          memory_ref.value.splice(pointer_ref.value, 1, 255);
        };
        break;
      case "<":
        pointer_ref.value = pointer_ref.value - 1;
        if (pointer_ref.value < 0) {
          stdOut.value = "Range Error";
          pointer_ref.value = 0;
          return;
        }
        break;
      case ">":
        pointer_ref.value += 1;
        if (pointer_ref.value >= memory_ref.value.length) {
          stdOut.value = "Range Error";
          pointer_ref.value -= 1
          return;
        }
        break;
      case "[":
        break;
      case "]":
        if (current_mem_value != 0) {
          temp = code_splited.slice(0, code_pointer);
          let turnIndex = temp.lastIndexOf("[");
          code_pointer = turnIndex;
        }
        break;
      case ".":
        stdOut.value += String.fromCharCode(memory_ref.value[pointer_ref.value]);
        break;
      case ",": 
        input_ascii = input.value.charCodeAt(input_pointer_ref.value);
        if (isNaN(input_ascii)) {
          input_ascii = 0;
        }
        memory_ref.value.splice(pointer_ref.value, 1, input_ascii);
        input_pointer_ref.value += 1;
        break;
      default:
        break;
    }

    if (code_pointer + 1 == code_splited.length) {
      break;
    }

    if (will_exit) {
      will_exit = false;
      break;
    }

    code_pointer++;

    if (!no_wait.value) {
      await sleep(1 / speed.value * 1000);
    }

    

  }

  execution_inProgress.value = false;
  
}

const toggleMode = () => {

  dark_mode.value = dark_mode.value === "dark" ? "light" : "dark";

}

const addCode = (letter: string) => {
  if (letter === "del") {
    code_ref.value = code_ref.value.slice(0, -1);
    return;
  }
  code_ref.value += letter
}

const exit = () => {
  will_exit = true;
}


</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Murecho&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Mulish&display=swap');

header {
  background-color: rgb(167, 224, 249);
  margin: 0%;
  padding: 0.1%;
  display: flex;
  justify-content: space-between;
}

header h2 {
  font-weight: normal;
  margin-left: 10px;
  
}

@media screen and (max-width:450px) {
  header h2 {
    font-size: 1.2em;
  }

  
}


textarea {
  resize: none;
  margin: 0 auto;
  width: 95%;
  border: none;
  outline: none;
  display: block;
}


ul {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  width: 90%;
  margin-bottom: 2em;
  margin-left: 0;
  margin-right: 100px;


  li {

    margin-right: 1em;
    margin-bottom: 0.5em;
    font-size: 1.6vw;
    margin-top: 0.8em;

  }


}

@media screen and (max-width:700px) {
  ul > span > li {
    font-size: 2vw;
  }
}


.keyBoard {
  margin-left: calc(100% - 15em);
  margin-top: 10px;
}


.br-enter {
  width: 100%;
}

.terminal {
  font-family: 'Mulish', sans-serif;
;
}
* {
  font-family: 'Murecho', sans-serif;
}
button.exec {
  background-color: rgb(5, 214, 5);
  border: none;
  font-weight: light;
  padding: 0.5em 1em;
  border-radius: 5px;
  margin-left: 2.3%;
}

button.exec:hover {
  background-color: rgb(6, 246, 6);
}

button.exit {
  border: none;
  font-weight: light;
  padding: 0.5em 1em;
  border-radius: 5px;
  margin-left: 2.3%;
  background-color: red;
  color: white;
}
button.exit:hover:not(:disabled) {
  background-color: rgb(253, 65, 65);
}

button:disabled {
  background-color: rgb(254, 133, 133);
}

.toggle {
  margin-right: 0.5em;
}



$mode-transition: 0.2s;

.light {
  background-color: #f1f1f1;
  height: 100%;
  transition: $mode-transition;
  width: 100%;

  textarea {
    background-color: #dcdada;
  }
  .highlight {
    background-color: rgb(164, 164, 164);
  }

}

/* Dark Mode*/

.dark {

  background-color: #1a1a1a;
  color: white;
  height: 100%;
  transition: $mode-transition;
  width: 100%;

  header {
    background-color: rgb(4, 113, 160);
    transition: $mode-transition;
  }

  textarea {
    color: white;
    background-color: #242424;
    transition: $mode-transition;
  }

  button.exec {
    background-color: green;  
    color: white;
    transition: $mode-transition;
  }

  button.exec:hover {
    background-color: rgb(1, 210, 1);
  }

  .highlight {
    background-color: rgb(135, 134, 134);
  }

}

.speed::-webkit-inner-spin-button,
.speed::-webkit-outer-spin-button {
  -webkit-appearance: none; 
  margin: 0;
}
.speed {
  -moz-appearance:textfield; 
  width: 4em;
}

.speedConfig {
  margin: 0 auto;
}

.desc {
  margin-top: 18vw;
  width: 100%;
}

</style>

