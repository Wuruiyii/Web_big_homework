<template>
  <header class="nav-wrap">
    <router-link class="brand" to="/">
      <span class="brand-mark">✦</span> 过往来信
    </router-link>
    <nav>
      <router-link v-for="item in navs" :key="item.path" :to="item.path">
        <span>{{ item.index }}</span>{{ item.name }}
      </router-link>
    </nav>
  </header>
</template>

<script setup>
const navs = [
  { index: '01', name: '首页', path: '/' },
  { index: '02', name: '记忆', path: '/sort' },
  { index: '03', name: '相片', path: '/travel' },
  { index: '04', name: '留言', path: '/message' },
  { index: '05', name: '对话', path: '/talk' }
]
</script>
