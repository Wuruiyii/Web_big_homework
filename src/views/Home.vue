<template>
  <main class="page poetize-page">
    <section class="content poetize-home">
      <section class="poetize-banner glass-card" :style="{ '--banner-cover': `url(${activeBanner.cover})` }">
        <div class="banner-copy">
          <p class="eyebrow">{{ activeBanner.subtitle }}</p>
          <h1>{{ activeBanner.title }}</h1>
          <p>{{ activeBanner.text }}</p>
          <div class="banner-actions">
            <router-link class="primary-btn" :to="activeBanner.route">进入模块</router-link>
            <button class="soft-btn" @click="nextBanner">换一张首页封面</button>
          </div>
        </div>
        <div class="banner-switch">
          <button
            v-for="(banner, index) in heroBanners"
            :key="banner.title"
            :class="{ active: bannerIndex === index }"
            @click="bannerIndex = index"
          >
            0{{ index + 1 }}
          </button>
        </div>
      </section>

      <aside class="poetize-sidebar">
        <section class="author-card glass-card">
          <div class="author-avatar">
            <img :src="authorProfile.avatar" alt="作者头像" />
          </div>
          <h2>{{ authorProfile.name }}</h2>
          <p>{{ authorProfile.intro }}</p>
          <div class="author-stats">
            <span v-for="item in authorProfile.stats" :key="item.label">
              <b>{{ item.value }}</b>{{ item.label }}
            </span>
          </div>
          <small>{{ authorProfile.signature }}</small>
        </section>


        <section class="sidebar-card glass-card quick-router">
          <router-link v-for="tool in favoriteTools.slice(0, 5)" :key="tool.name" :to="tool.route">
            <span>{{ tool.type }}</span>
            <b>{{ tool.name }}</b>
          </router-link>
        </section>

        <section class="sidebar-card glass-card daily-scratch-card">
          <div class="section-head compact">
            <div><p class="eyebrow">DAILY SIGN</p><h2>今日回忆签</h2></div>
          </div>
          <div
            :class="['scratch-stage', { revealed: scratchRevealed }]"
            @pointerdown="startScratch"
            @pointermove="scratch"
            @pointerup="endScratch"
            @pointerleave="endScratch"
          >
            <div class="scratch-result">
              <p class="eyebrow">{{ dailyMemory.mood }}</p>
              <h3>{{ dailyMemory.title }}</h3>
              <p>{{ dailyMemory.text }}</p>
            </div>
            <canvas ref="scratchCanvas" class="scratch-canvas"></canvas>
            <div v-if="!scratchRevealed" class="scratch-hint">按住刮开今日签</div>
          </div>
          <div class="scratch-actions">
            <button class="soft-btn" @click="drawNextSign">再抽一签</button>
            <router-link class="soft-btn" to="/memory">去读回忆</router-link>
          </div>
        </section>
      </aside>

      <section class="article-feed glass-card">
        <div class="feed-head">
          <div>
            <p class="eyebrow">POETIZE STYLE POSTS</p>
            <h2>回忆文章</h2>
          </div>
          <div class="feed-tools">
            <input v-model="keyword" placeholder="搜索文章、标签或心情" />
            <button
              v-for="cat in categories"
              :key="cat"
              :class="['pill', { active: activeCategory === cat }]"
              @click="activeCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>
        <div class="article-list panel-scroll">
          <article
            v-for="article in filteredArticles"
            :key="article.id"
            :class="['post-card', { active: selectedArticle.id === article.id }]"
            @click="selectedArticle = article"
          >
            <img :src="article.cover" />
            <div>
              <span>{{ article.category }} · {{ article.date }}</span>
              <h3>{{ article.title }}</h3>
              <p>{{ article.excerpt }}</p>
              <div class="tag-row">
                <i v-for="tag in article.tags" :key="tag">#{{ tag }}</i>
              </div>
            </div>
            <button class="heart-btn" @click.stop="toggleFavorite(article.id)">
              {{ favoriteIds.includes(article.id) ? '已收藏' : '收藏' }}
            </button>
          </article>
        </div>
      </section>

      <section class="home-reader glass-card">
        <div class="reader-cover">
          <img :src="selectedArticle.cover" />
        </div>
        <div class="reader-copy">
          <p class="eyebrow">{{ selectedArticle.category }} · {{ selectedArticle.read }}</p>
          <h2>{{ selectedArticle.title }}</h2>
          <p>{{ selectedArticle.body[0] }}</p>
          <div class="reader-actions">
            <router-link class="primary-btn" to="/memory">阅读全文</router-link>
            <router-link class="soft-btn" to="/talk">问另一个“我”</router-link>
          </div>
        </div>
      </section>

    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  articles,
  authorProfile,
  categories,
  favoriteTools,
  heroBanners,
  messageSeeds
} from '../data/memorySite'

const bannerIndex = ref(0)
const activeBanner = computed(() => heroBanners[bannerIndex.value])
const keyword = ref('')
const activeCategory = ref('全部')
const selectedArticle = ref(articles[0])
const storedFavorites = localStorage.getItem('memoryPostFavorites')
const favoriteIds = ref(storedFavorites ? JSON.parse(storedFavorites) : [])
const scratchCanvas = ref(null)
const scratchRevealed = ref(false)
const scratching = ref(false)
const dailySignIndex = ref(Math.floor(Date.now() / 86400000) % (articles.length + messageSeeds.length))

const dailySignPool = computed(() => [
  ...articles.map(article => ({
    mood: article.category,
    title: article.title,
    text: article.excerpt
  })),
  ...messageSeeds.map(item => ({
    mood: item.mood,
    title: '来自信箱的一句话',
    text: item.content
  }))
])
const dailyMemory = computed(() => dailySignPool.value[dailySignIndex.value % dailySignPool.value.length])

const filteredArticles = computed(() => {
  const key = keyword.value.trim()
  return articles.filter(article => {
    const categoryMatch = activeCategory.value === '全部' || article.category === activeCategory.value
    const text = `${article.title}${article.excerpt}${article.category}${article.tags.join('')}`
    return categoryMatch && (!key || text.includes(key))
  })
})

function nextBanner() {
  bannerIndex.value = (bannerIndex.value + 1) % heroBanners.length
}

function prepareScratchCanvas() {
  nextTick(() => {
    const canvas = scratchCanvas.value
    const stage = canvas?.parentElement
    if (!canvas || !stage) return

    const rect = stage.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.max(1, Math.round(rect.width * dpr))
    canvas.height = Math.max(1, Math.round(rect.height * dpr))
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.globalCompositeOperation = 'source-over'

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height)
    gradient.addColorStop(0, '#fff2b8')
    gradient.addColorStop(0.46, '#e8c16f')
    gradient.addColorStop(1, '#fff8da')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, rect.width, rect.height)

    ctx.fillStyle = 'rgba(115, 78, 24, .82)'
    ctx.font = '700 17px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('刮开今日回忆签', rect.width / 2, rect.height / 2 - 8)
    ctx.font = '12px sans-serif'
    ctx.fillText('scratch here', rect.width / 2, rect.height / 2 + 18)

    ctx.fillStyle = 'rgba(255,255,255,.24)'
    for (let i = 0; i < 70; i += 1) {
      ctx.beginPath()
      ctx.arc(Math.random() * rect.width, Math.random() * rect.height, Math.random() * 2 + 1, 0, Math.PI * 2)
      ctx.fill()
    }

    scratchRevealed.value = false
  })
}

function scratchAt(event) {
  if (scratchRevealed.value) return
  const canvas = scratchCanvas.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const ctx = canvas.getContext('2d')
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(x, y, 24, 0, Math.PI * 2)
  ctx.fill()
  checkScratchProgress()
}

function checkScratchProgress() {
  const canvas = scratchCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let cleared = 0
  for (let i = 3; i < data.length; i += 16) {
    if (data[i] < 30) cleared += 1
  }
  if (cleared / (data.length / 16) > 0.34) {
    scratchRevealed.value = true
  }
}

function startScratch(event) {
  scratching.value = true
  event.currentTarget.setPointerCapture?.(event.pointerId)
  scratchAt(event)
}

function scratch(event) {
  if (!scratching.value) return
  scratchAt(event)
}

function endScratch() {
  scratching.value = false
}

function drawNextSign() {
  dailySignIndex.value = (dailySignIndex.value + 1) % dailySignPool.value.length
  prepareScratchCanvas()
}

function toggleFavorite(id) {
  favoriteIds.value = favoriteIds.value.includes(id)
    ? favoriteIds.value.filter(item => item !== id)
    : [...favoriteIds.value, id]
  localStorage.setItem('memoryPostFavorites', JSON.stringify(favoriteIds.value))
}

onMounted(() => {
  prepareScratchCanvas()
  window.addEventListener('resize', prepareScratchCanvas)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', prepareScratchCanvas)
})
</script>
