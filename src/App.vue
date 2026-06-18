<template>
  <div class="app-shell">
    <div class="ambient-layer" aria-hidden="true">
    </div>
    <IntroGate v-if="showIntroGate" @enter="enterIntro" />
    <template v-else>
      <NavBar />
      <MusicPlayer v-if="!route.meta.hideMusic" />
      <router-view />
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import IntroGate from './components/IntroGate.vue'
import NavBar from './components/NavBar.vue'
import MusicPlayer from './components/MusicPlayer.vue'

const route = useRoute()
const introEntered = ref(route.path !== '/')
const showIntroGate = computed(() => route.path === '/' && !introEntered.value)

onMounted(() => {
  document.documentElement.removeAttribute('data-memory-theme')
})

watch(() => route.path, path => {
  if (path !== '/') {
    introEntered.value = true
  }
})

function enterIntro() {
  introEntered.value = true
}
</script>
