<template>
  <main class="page poetize-page">
    <ChapterIntro index="图片墙" title="光影图片墙" desc="照片、路线、音乐和视频，在同一束粉色光里慢慢放映。" />
    <section class="content poetize-gallery">
      <aside class="gallery-left glass-card">
        <p class="eyebrow">TRAVEL / PHOTO</p>
        <h1>图片墙</h1>
        <p>有些瞬间太轻了，只能让照片、声音和一小段影像替我保存。</p>
        <div class="gallery-filter">
          <button
            v-for="type in photoTypes"
            :key="type"
            :class="{ active: activeType === type }"
            @click="activeType = type"
          >
            {{ type }}
          </button>
        </div>
        <router-link class="next-link" to="/message">去留言 →</router-link>
      </aside>

      <section class="photo-projector glass-card">
        <div class="section-head compact">
          <div><p class="eyebrow">{{ selectedPhoto.place }} · {{ selectedPhoto.date }}</p><h2>{{ selectedPhoto.title }}</h2></div>
          <button class="soft-btn" @click="previewOpen = true">全屏查看</button>
        </div>
        <div class="projector-screen" :style="{ backgroundImage: `url(${selectedPhoto.src})` }" @click="previewOpen = true">
          <button class="projector-nav left" type="button" @click.stop="movePhoto(-1)">‹</button>
          <button class="projector-nav right" type="button" @click.stop="movePhoto(1)">›</button>
          <div>
            <h3>{{ selectedPhoto.title }}</h3>
            <p>{{ selectedPhoto.text }}</p>
          </div>
        </div>
      </section>

      <section class="photo-wall glass-card">
        <div class="section-head compact">
          <div><p class="eyebrow">ALBUM DESK</p><h2>整理拍立得</h2></div>
          <span>{{ filteredPhotos.length }} 张</span>
        </div>
        <div class="polaroid-desk">
          <article
            v-for="photo in filteredPhotos"
            :key="photo.id"
            :class="['polaroid-card', { active: selectedPhoto.id === photo.id, flipped: flippedPhotoIds.includes(photo.id), dragging: draggingPhotoId === photo.id }]"
            :style="polaroidStyle(photo)"
            @pointerdown="startPhotoDrag($event, photo)"
            @pointermove="dragPhoto"
            @pointerup="endPhotoDrag"
            @pointercancel="endPhotoDrag"
          >
            <div class="polaroid-inner" @click="togglePolaroid(photo)">
              <div class="polaroid-face polaroid-front">
                <img :src="photo.src" />
                <span>{{ photo.title }}</span>
              </div>
              <div class="polaroid-face polaroid-back">
                <b>{{ photo.place }}</b>
                <p>{{ photo.text }}</p>
                <small>{{ photo.date }}</small>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="travel-map glass-card">
        <div class="section-head compact">
          <div><p class="eyebrow">TRAVEL MAP</p><h2>旅拍路线</h2></div>
        </div>
        <div class="travel-rail">
          <button
            v-for="photo in photos"
            :key="photo.id"
            :class="{ active: selectedPhoto.id === photo.id }"
            @click="selectedPhoto = photo"
          >
            <i></i>
            <b>{{ photo.place }}</b>
            <span>{{ photo.title }}</span>
          </button>
        </div>
      </section>

      <section class="media-console glass-card">
        <div class="memory-game-entry">
          <p class="eyebrow">MINI GAME</p>
          <h2>记忆翻牌</h2>
          <p>从照片墙抽出 6 段回忆，翻开卡片找出相同的一对。步数越少、速度越快，回忆越亮。</p>
          <div class="memory-game-preview" aria-hidden="true">
            <img v-for="photo in gamePreviewPhotos" :key="photo.id" :src="photo.src" />
          </div>
          <button class="primary-btn" @click="openGame">进入小游戏</button>
        </div>
      </section>

      <section class="video-showcase glass-card">
        <div class="video-preview">
          <video muted loop playsinline :src="videoSrc"></video>
          <button @click="videoOpen = true">PLAY</button>
        </div>
        <div class="video-copy">
          <p class="eyebrow">VIDEO MEMORY</p>
          <h2>视频记忆盒</h2>
          <p>把会动的片段放大，让它像一间真正的放映室，而不是挤在角落里的小按钮。</p>
          <button class="primary-btn" @click="videoOpen = true">打开视频</button>
        </div>
      </section>

      <el-dialog
        v-model="previewOpen"
        fullscreen
        append-to-body
        class="memory-preview-dialog"
        modal-class="memory-preview-overlay"
        :show-close="false"
      >
        <div class="memory-preview-shell" v-if="selectedPhoto">
          <button class="preview-close" @click="previewOpen = false">×</button>
          <img :src="selectedPhoto.src" />
          <div>
            <p class="eyebrow">{{ selectedPhoto.type }} · {{ selectedPhoto.place }}</p>
            <h2>{{ selectedPhoto.title }}</h2>
            <p>{{ selectedPhoto.text }}</p>
          </div>
        </div>
      </el-dialog>

      <el-dialog v-model="videoOpen" title="一段会动的回忆" width="82vw" class="pink-dialog">
        <video class="video" controls :src="videoSrc"></video>
      </el-dialog>

      <el-dialog v-model="gameOpen" title="记忆翻牌" width="780px" class="pink-dialog memory-game-dialog" @closed="pauseGame">
        <div class="memory-match-game">
          <div class="match-game-head">
            <span>步数 <b>{{ gameMoves }}</b></span>
            <span>用时 <b>{{ gameSeconds }}</b>s</span>
            <span>最佳 <b>{{ bestRecordText }}</b></span>
          </div>

          <div class="match-board">
            <button
              v-for="card in gameDeck"
              :key="card.id"
              type="button"
              :class="['match-card', { open: isCardOpen(card), matched: matchedPairs.includes(card.pairId) }]"
              @click="flipCard(card)"
            >
              <span class="match-card-face match-card-back">?</span>
              <span class="match-card-face match-card-front">
                <img :src="card.src" />
                <b>{{ card.title }}</b>
              </span>
            </button>
          </div>

          <div class="match-game-actions">
            <p>{{ gameTip }}</p>
            <button class="soft-btn" @click="resetGame">重新洗牌</button>
          </div>
        </div>
      </el-dialog>
    </section>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ChapterIntro from '../components/ChapterIntro.vue'
import { photos } from '../data/memorySite'
import videoSrc from '../assets/videos/memory-video.mp4'

const activeType = ref('全部')
const selectedPhoto = ref(photos[0])
const previewOpen = ref(false)
const videoOpen = ref(false)
const gameOpen = ref(false)
const gameRunning = ref(false)
const gameFinished = ref(false)
const gameMoves = ref(0)
const gameSeconds = ref(0)
const gameDeck = ref([])
const flippedCards = ref([])
const matchedPairs = ref([])
const checkingPair = ref(false)
const bestRecord = ref(JSON.parse(localStorage.getItem('memoryMatchBest') || 'null'))
const gamePreviewPhotos = photos.slice(0, 3)
const flippedPhotoIds = ref([])
const draggingPhotoId = ref(null)
const dragState = ref(null)
const photoPositions = ref(loadPhotoPositions())
const photoTypes = computed(() => ['全部', ...new Set(photos.map(photo => photo.type))])
const filteredPhotos = computed(() => activeType.value === '全部' ? photos : photos.filter(photo => photo.type === activeType.value))
const bestRecordText = computed(() => bestRecord.value ? `${bestRecord.value.moves}步/${bestRecord.value.seconds}s` : '--')
const gameTip = computed(() => {
  if (gameFinished.value) return `完成啦！你用了 ${gameMoves.value} 步、${gameSeconds.value} 秒翻完这组回忆。`
  if (!gameRunning.value && !gameMoves.value) return '点击任意卡片开始计时，找出两张相同的照片。'
  if (flippedCards.value.length === 1) return '已经翻开一张了，再找找它的另一半。'
  return '记住每张照片的位置，少走一步就多一点默契。'
})
let carouselTimer = 0
let gameTimer = 0

function selectPhoto(photo, open = false) {
  selectedPhoto.value = photo
  if (open) previewOpen.value = true
}

function defaultPolaroidPosition(photo) {
  const index = photos.findIndex(item => item.id === photo.id)
  return {
    x: 8 + (index % 3) * 30 + (index % 2) * 2,
    y: 8 + Math.floor(index / 3) * 22,
    rotate: ((index % 5) - 2) * 3
  }
}

function loadPhotoPositions() {
  try {
    return JSON.parse(localStorage.getItem('polaroidPositions') || '{}')
  } catch {
    return {}
  }
}

function savePhotoPositions() {
  localStorage.setItem('polaroidPositions', JSON.stringify(photoPositions.value))
}

function polaroidPosition(photo) {
  return photoPositions.value[photo.id] || defaultPolaroidPosition(photo)
}

function polaroidStyle(photo) {
  const position = polaroidPosition(photo)
  return {
    '--x': `${position.x}%`,
    '--y': `${position.y}%`,
    '--r': `${position.rotate}deg`
  }
}

function togglePolaroid(photo) {
  if (dragState.value?.moved) return
  selectedPhoto.value = photo
  flippedPhotoIds.value = flippedPhotoIds.value.includes(photo.id)
    ? flippedPhotoIds.value.filter(id => id !== photo.id)
    : [...flippedPhotoIds.value, photo.id]
}

function startPhotoDrag(event, photo) {
  if (event.button !== 0) return
  const desk = event.currentTarget.parentElement
  const rect = desk.getBoundingClientRect()
  const position = polaroidPosition(photo)

  draggingPhotoId.value = photo.id
  dragState.value = {
    id: photo.id,
    startX: event.clientX,
    startY: event.clientY,
    baseX: position.x,
    baseY: position.y,
    rect,
    moved: false
  }
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

function dragPhoto(event) {
  if (!dragState.value) return
  const dx = ((event.clientX - dragState.value.startX) / dragState.value.rect.width) * 100
  const dy = ((event.clientY - dragState.value.startY) / dragState.value.rect.height) * 100
  const moved = Math.abs(event.clientX - dragState.value.startX) + Math.abs(event.clientY - dragState.value.startY) > 6

  dragState.value.moved = dragState.value.moved || moved
  photoPositions.value = {
    ...photoPositions.value,
    [dragState.value.id]: {
      x: Math.min(72, Math.max(2, dragState.value.baseX + dx)),
      y: Math.min(72, Math.max(2, dragState.value.baseY + dy)),
      rotate: polaroidPosition({ id: dragState.value.id }).rotate
    }
  }
}

function endPhotoDrag() {
  if (dragState.value?.moved) savePhotoPositions()
  window.setTimeout(() => {
    draggingPhotoId.value = null
    dragState.value = null
  }, 0)
}

function movePhoto(delta) {
  const pool = filteredPhotos.value
  const index = Math.max(0, pool.findIndex(photo => photo.id === selectedPhoto.value.id))
  selectedPhoto.value = pool[(index + delta + pool.length) % pool.length] || photos[0]
}

function startCarousel() {
  stopCarousel()
  carouselTimer = window.setInterval(() => {
    if (!previewOpen.value && !videoOpen.value) movePhoto(1)
  }, 5000)
}

function stopCarousel() {
  if (carouselTimer) {
    window.clearInterval(carouselTimer)
    carouselTimer = 0
  }
}

function openGame() {
  gameOpen.value = true
  if (!gameDeck.value.length || gameFinished.value) resetGame()
}

function resetGame() {
  pauseGame()
  gameFinished.value = false
  gameMoves.value = 0
  gameSeconds.value = 0
  flippedCards.value = []
  matchedPairs.value = []
  checkingPair.value = false
  const gamePhotos = photos.slice(0, 6)
  gameDeck.value = shuffle([
    ...gamePhotos.map(photo => createGameCard(photo, 'a')),
    ...gamePhotos.map(photo => createGameCard(photo, 'b'))
  ])
}

function createGameCard(photo, copy) {
  return {
    id: `${photo.id}-${copy}`,
    pairId: photo.id,
    title: photo.title,
    src: photo.src
  }
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5)
}

function startGameClock() {
  if (gameRunning.value || gameFinished.value) return
  gameRunning.value = true
  gameTimer = window.setInterval(() => {
    gameSeconds.value += 1
  }, 1000)
}

function flipCard(card) {
  if (checkingPair.value || gameFinished.value || matchedPairs.value.includes(card.pairId) || flippedCards.value.includes(card.id)) return
  startGameClock()
  flippedCards.value = [...flippedCards.value, card.id]
  if (flippedCards.value.length === 2) checkPair()
}

function checkPair() {
  checkingPair.value = true
  gameMoves.value += 1
  const [firstId, secondId] = flippedCards.value
  const first = gameDeck.value.find(card => card.id === firstId)
  const second = gameDeck.value.find(card => card.id === secondId)
  window.setTimeout(() => {
    if (first && second && first.pairId === second.pairId) {
      matchedPairs.value = [...matchedPairs.value, first.pairId]
      if (matchedPairs.value.length === 6) finishGame()
    }
    flippedCards.value = []
    checkingPair.value = false
  }, first && second && first.pairId === second.pairId ? 360 : 780)
}

function isCardOpen(card) {
  return matchedPairs.value.includes(card.pairId) || flippedCards.value.includes(card.id)
}

function finishGame() {
  pauseGame()
  gameFinished.value = true
  const nextRecord = { moves: gameMoves.value, seconds: gameSeconds.value }
  if (!bestRecord.value || nextRecord.moves < bestRecord.value.moves || (nextRecord.moves === bestRecord.value.moves && nextRecord.seconds < bestRecord.value.seconds)) {
    bestRecord.value = nextRecord
    localStorage.setItem('memoryMatchBest', JSON.stringify(nextRecord))
  }
}

function pauseGame() {
  gameRunning.value = false
  window.clearInterval(gameTimer)
  gameTimer = 0
}

watch(filteredPhotos, list => {
  if (list.length && !list.some(photo => photo.id === selectedPhoto.value.id)) {
    selectedPhoto.value = list[0]
  }
  startCarousel()
})

onMounted(startCarousel)
onBeforeUnmount(() => {
  stopCarousel()
  pauseGame()
})
</script>
