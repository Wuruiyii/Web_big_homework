<template>
  <main class="page poetize-page">
    <ChapterIntro index="留言板" title="给我留言" desc="如果你愿意，把一句话放进这只安静的粉色信箱。" />
    <section class="content poetize-message message-redesign">
      <section class="message-dialogue glass-card">
        <div class="message-barrage" aria-hidden="true">
          <span
            v-for="(item, index) in floatingMessages"
            :key="item.id"
            :style="barrageStyle(index)"
          >
            <i>{{ item.mood }}</i>{{ item.content }}
          </span>
        </div>
      </section>

      <aside class="message-left glass-card">
        <p class="eyebrow">MESSAGE</p>
        <h1>给我留言</h1>
        <p>路过这座回忆站的人，也可以留下一枚属于自己的温柔邮戳。</p>
        <div class="letter-count">
          <b>{{ letters.length }}</b>
          <span>封来信已保存</span>
        </div>
        <router-link class="next-link" to="/talk">去 AI 对话 →</router-link>
      </aside>

      <section id="write-letter" class="message-write glass-card">
        <div class="section-head compact">
          <div><p class="eyebrow">WRITE</p><h2>投递一封新来信</h2></div>
        </div>
        <div class="message-form-grid">
          <input v-model="letter.name" placeholder="你的名字 / 昵称" />
          <label class="switch-line">
            <input v-model="letter.anonymous" type="checkbox" />
            匿名
          </label>
          <textarea v-model="letter.content" placeholder="写下你想说的话……"></textarea>
          <div class="mood-chips">
            <button
              v-for="m in moods"
              :key="m"
              type="button"
              :class="['pill', { active: letter.mood === m }]"
              @click="letter.mood = m"
            >
              {{ m }}
            </button>
          </div>
          <button class="primary-btn send-letter-btn" @click="submitLetter">投入信箱</button>
        </div>
      </section>

      <section class="message-wall glass-card">
        <div class="section-head compact">
          <div><p class="eyebrow">RECEIVED</p><h2>来信信箱</h2></div>
          <span>{{ filteredLetters.length }} 封</span>
        </div>
        <div class="message-filter-inline">
          <button :class="{ active: activeMood === '全部' }" @click="activeMood = '全部'">全部</button>
          <button v-for="m in moods" :key="m" :class="{ active: activeMood === m }" @click="activeMood = m">{{ m }}</button>
        </div>
        <div class="message-card-grid panel-scroll">
          <article v-for="mail in filteredLetters" :key="mail.id" :class="{ saved: mail.saved }">
            <span>{{ mail.mood }}</span>
            <h3>来自：{{ mail.anonymous ? '一位访客' : mail.name }}</h3>
            <p>{{ mail.content }}</p>
            <button class="soft-btn" @click="toggleSaved(mail)">{{ mail.saved ? '已珍藏' : '收到这封信' }}</button>
          </article>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ChapterIntro from '../components/ChapterIntro.vue'
import { messageSeeds } from '../data/memorySite'

const moods = ['温柔', '鼓励', '怀念', '开心', '秘密']
const activeMood = ref('全部')
const storedLetters = localStorage.getItem('messageLetters')
const letters = ref(storedLetters ? JSON.parse(storedLetters) : messageSeeds)
const letter = reactive({ name: '', content: '', mood: '温柔', anonymous: false })
const driftingLetters = ref([])

const filteredLetters = computed(() => activeMood.value === '全部'
  ? letters.value
  : letters.value.filter(item => item.mood === activeMood.value))
const floatingMessages = computed(() => {
  const inboxLetters = [...driftingLetters.value, ...(letters.value.length ? letters.value : messageSeeds)]
  return inboxLetters.slice(0, 24)
})

function barrageStyle(index) {
  const laneCount = 6
  const lane = index % laneCount
  const lap = Math.floor(index / laneCount)
  const speed = 28 + (index % 5) * 4 + lap * 1.5
  const delay = -((index * 5.3) % speed)
  const start = 102 + ((index * 17) % 64)
  const float = ((index % 3) - 1) * 6

  return {
    '--row': lane,
    '--delay': `${delay}s`,
    '--speed': `${speed}s`,
    '--start': `${start}%`,
    '--float': `${float}px`
  }
}

function persist() {
  localStorage.setItem('messageLetters', JSON.stringify(letters.value))
}

function submitLetter() {
  if (!letter.name.trim() || !letter.content.trim()) return

  const nextLetter = {
    id: Date.now(),
    name: letter.name.trim(),
    content: letter.content.trim(),
    mood: letter.mood,
    anonymous: letter.anonymous,
    saved: false
  }

  letter.name = ''
  letter.content = ''
  letter.mood = '温柔'
  letter.anonymous = false
  driftingLetters.value = [nextLetter, ...driftingLetters.value].slice(0, 3)
  letters.value.unshift(nextLetter)
  persist()
}

function toggleSaved(mail) {
  mail.saved = !mail.saved
  persist()
}

</script>
