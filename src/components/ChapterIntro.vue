<template>
  <transition name="chapter-soft">
    <section v-if="show" class="chapter-intro">
      <div class="chapter-card">
        <p class="chapter-index">{{ index }}</p>
        <h1>{{ title }}</h1>
        <p>{{ desc }}</p>
        <span class="intro-line"></span>
      </div>
    </section>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps({ index: String, title: String, desc: String, duration: { type: Number, default: 520 } })
const show = ref(true)
onMounted(() => setTimeout(() => (show.value = false), props.duration))
</script>
