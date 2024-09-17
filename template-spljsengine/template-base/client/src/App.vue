<script setup>
import Main from "./components/Main.vue";
import packageJson from "../../package.json";

import modules from "../../splModules.json";

const name = packageJson.name;
const version = packageJson.version;
</script>

<template>
  <Main :title="name + ' ' + version" :modules="modules" />
</template>
