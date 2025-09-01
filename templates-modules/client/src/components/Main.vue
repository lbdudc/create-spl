<script setup>
import { ref } from "vue";
import packageJson from "../../../package.json";
import ModuleCard from "./ModuleCard.vue";

defineProps({
  title: String,
  modules: Array,
});
</script>

<template>
  <h1>{{ title }}</h1>

  <p>
    {{ JSON.stringify(packageJson, null, 2) }}
  </p>

  <p>Modules:</p>
  <div class="modules">
    <ModuleCard
      class="module"
      v-for="module in modules"
      :key="module.name"
      :module="module"
    />
  </div>
</template>

<style scoped>
.modules {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 1rem;
  color: #333;
  padding: 1rem;
}

.module {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  border-radius: 0.5rem;
  min-height: 20vh;
  width: 20%;
  background-color: #f4f4f4;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.modules > * {
  margin: 0.5rem;
}
</style>
