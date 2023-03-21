<template>
    <footer :class="mode">
    <span class="author">
    <h>作者：umipro_web</h>
    <br>
    <a href="https://github.com/umipro-web-dev" target="_blank" rel="noopener noreferrer"><img src="/github.png" alt="github" width="30"></a>
    <a href="https://zenn.dev/umipro_web" target="_blank" rel="noopener noreferrer"><img src="/zenn.png" alt="zenn" width="30"></a>
    </span>
    <a href="https://ja.vuejs.org/" class="by image" target="_blank" rel="noopener noreferrer"><img src="/vue.png" alt="Vue.js" width="50"></a>
    <div class="by"><h><span>このサイトは<a href="https://ja.vuejs.org/" class="by" id="vue-text" target="_blank" rel="noopener noreferrer">Vue.js</a>を</span><br/>使用して作成されました。</h></div>
    </footer>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps(["mode"]);
</script>

<style scoped lang="scss">

footer {
    display: flex;
    flex-wrap: wrap;
    padding-top: 1em;
    padding-bottom: 1em;
}

footer.light {
    background-color: rgb(167, 224, 249);
}

footer.dark {
    background-color: rgb(4, 113, 160);

    #vue-text {
        color: rgb(39, 39, 254);
    }

    #vue-text:hover {
        color: rgb(134, 134, 249);
    }

}

div {
    margin-left: 1em;
}

h {
    font-size: 14px;
}

$by-margin: 9px;

.by {
    margin-top: $by-margin;
}

.by.image {
    margin: 0 0 0 auto;
    margin-top: $by-margin;
}

@media screen and (max-width: 420px) {
    .by.image {
        width: 10%;
        height: auto;
    }
}

.author {

    margin-left: 1em;
    

    a {
        text-align: center;
    }
    
    a  > img {
        margin-top: 7px;
    }

    a  {
        margin-left: 1em;
    }
}

</style>