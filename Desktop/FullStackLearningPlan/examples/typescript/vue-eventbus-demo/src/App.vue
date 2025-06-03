<template>
  <div class="app-container">
    <h1>Vue 3 EventBus Demo</h1>
    <EventDemo />
  </div>
</template>

<script setup lang="ts">
import EventDemo from './components/EventDemo.vue';
</script>

<style>
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>