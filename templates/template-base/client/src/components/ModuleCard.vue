<script setup>
defineProps({
  module: Object,
});
</script>

<template>
  <div>
    <h2>{{ module.name }}</h2>
    <p>{{ module.nameProject }}</p>
    <p>{{ module.main || false }}</p>
  </div>
</template>


