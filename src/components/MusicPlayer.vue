<template>
  <div class="music-player">
    <audio ref="audioRef" :src="currentSrc" loop></audio>
    <button class="music-disc" @click="toggle" :class="{ playing }">{{ playing ? 'Ⅱ' : '♪' }}</button>
    <div>
      <small>Background</small>
      <span>{{ labels[currentKey] }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import home from '../assets/music/home.wav'
import memory from '../assets/music/memory.wav'
import gallery from '../assets/music/gallery.wav'

const route = useRoute()
const audioRef = ref(null)
const playing = ref(false)
const srcMap = { home, memory, gallery }
const labels = { home: '未拆封的来信', memory: '时光回廊', gallery: '光影收藏室' }
const currentKey = computed(() => (route.meta.music && srcMap[route.meta.music]) ? route.meta.music : 'home')
const currentSrc = computed(() => srcMap[currentKey.value])

const toggle = async () => {
  if (!audioRef.value) return
  if (playing.value) {
    audioRef.value.pause()
    playing.value = false
  } else {
    await audioRef.value.play().catch(() => {})
    playing.value = true
  }
}

watch(currentSrc, async () => {
  await nextTick()
  if (audioRef.value) {
    audioRef.value.load()
    if (playing.value) audioRef.value.play().catch(() => {})
  }
})
</script>
