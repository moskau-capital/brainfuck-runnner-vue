<template>
  <div :class="dark_mode">
  <header>
  <h2>braifu*k editor runner</h2>
  <toggle labelText="ダークモード" class="toggle" :pushed="dark_mode == 'dark'" @clicked="toggleMode()"></toggle>
  </header>
  <p>このサイトでは、web上でbrainfu*kを実行することができます。</p>
  <br>
  <br>
  <br>
  <p>コード</p>
  <textarea cols="30" rows="10" v-model="code_ref">
  </textarea>
  <button @click="exec()">実行</button>
  <br>
  
  <br>
  <p>出力</p>
  <textarea cols="30" rows="5" class="terminal" v-model="stdOut" readonly></textarea>

  <p>pointer: {{ pointer_ref }}</p>
  <ul>
    <li v-for="bit, index in memory_ref" :key="index" :class="pointer_ref == index ? 'highlight' : '' ">[{{ bit }}]</li>
  </ul>

  </div>

</template>




<script setup lang="ts">
import todo from "./components/todo.vue";
import toggle from "./components/toggle.vue";
import { ref, watch } from "vue";
import { sleep } from "sleep-ts";
import type { Ref } from "vue";



const code_ref: Ref<string> = ref("");
let memory_ref: Ref<number[]> = ref(new Array(20).fill(0));
let pointer_ref = ref(0);
let stdOut = ref("");

let dark_mode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");

//bodyはvueの管轄範囲外なのでqueryselector。
if (dark_mode.value == "dark") {
  document.querySelector("body")!.setAttribute("style", "background-color: #2b2b2b;");
} else {
  document.querySelector("body")!.setAttribute("style", "background-color: white;");
}

//watchで監視。
watch(dark_mode, (newMode) => {
  if (newMode == "dark") {
    document.querySelector("body")!.setAttribute("style", "background-color: #2b2b2b;");
  } else {
    document.querySelector("body")!.setAttribute("style", "background-color: white;");
  }

});

const exec = async (): Promise<any> => {
  //init
  pointer_ref.value = 0;
  memory_ref.value.fill(0);
  stdOut.value = "";

  const code_splited = code_ref.value.split("");  

  let code_pointer = 0;
  let current_mem_value: number;
  let temp: string[];
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
        break;
      default:
        break;
    }

    if (code_pointer + 1 == code_splited.length) {
      break;
    }

    code_pointer++;

    await sleep(100);

  }
  
}

const toggleMode = () => {
  dark_mode.value = dark_mode.value === "dark" ? "light" : "dark";

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
  background-color: #cecdcd;
  border: none;
  outline: none;
  display: block;
}

ul {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
}
li {
  margin-right: 1em;
}
.terminal {
  font-family: 'Mulish', sans-serif;
;
}
* {
  font-family: 'Murecho', sans-serif;
}
button {
  background-color: rgb(5, 214, 5);
  border: none;
  font-weight: light;
  padding: 0.5em 1em;
  border-radius: 5px;
  margin-left: 2.3%;
}

button:hover {
  background-color: rgb(6, 246, 6);
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
  .highlight {
    background-color: gray;
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

  button {
    background-color: green;  
    color: white;
    transition: $mode-transition;
  }

  button:hover {
    background-color: rgb(1, 182, 1);
  }

  .highlight {
    background-color: gray;
  }

}

</style>

