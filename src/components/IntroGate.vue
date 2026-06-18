<template>
  <section :class="['intro-gate', { opening }]" aria-label="首页开场">
    <div class="intro-glow intro-glow-left"></div>
    <div class="intro-glow intro-glow-right"></div>

    <div class="intro-lines" aria-live="polite">
      <p v-for="(line, index) in lines" :key="line" :style="{ '--delay': `${index * 0.9}s` }">
        {{ line }}
      </p>
    </div>

    <button class="intro-envelope-button" type="button" :disabled="!ready" @click="openEnvelope">
      <span class="intro-envelope">
        <span class="intro-envelope-back"></span>
        <span class="intro-envelope-paper">
          <i></i>
          <b></b>
          <i></i>
        </span>
        <span class="intro-envelope-body"></span>
        <span class="intro-envelope-flap"></span>
        <span class="intro-envelope-seal"></span>
      </span>
      <span class="intro-open-text">{{ ready ? '打开这封信' : '信正在抵达' }}</span>
    </button>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits(['enter'])
const lines = ['欢迎你来到我的世界', '请你靠近我', '倾听我']
const ready = ref(false)
const opening = ref(false)
let readyTimer
let enterTimer

onMounted(() => {
  readyTimer = window.setTimeout(() => {
    ready.value = true
  }, 5000)
})

onBeforeUnmount(() => {
  window.clearTimeout(readyTimer)
  window.clearTimeout(enterTimer)
})

function openEnvelope() {
  if (!ready.value || opening.value) return
  opening.value = true
  enterTimer = window.setTimeout(() => emit('enter'), 950)
}
</script>
