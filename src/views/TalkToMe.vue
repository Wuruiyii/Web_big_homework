<template>
  <main class="page talk-immersive-page">
    <ChapterIntro
      index="第四章节"
      title="与我对话"
      desc="这里使用站内聊天框，回复由 Coze 智能体生成。"
    />

    <section class="content talk-immersive-stage">
      <div class="chat-ambient-title">
        <h1>与“我”对话</h1>
        <p>欢迎你走进我的世界，请你倾听独属于我的声音。</p>
      </div>

      <section class="immersive-chat-shell glass-card coze-api-shell">
        <div class="persona-orbit">
          <div class="moon-ring"></div>
          <div class="persona-core">
            <span>ME</span>
          </div>
          <span v-for="item in orbitWords" :key="item" class="orbit-chip static">{{ item }}</span>
        </div>

        <div class="chat-theater">
          <div class="chat-theater-head">
            <div>
              <p class="eyebrow">MEMORY CHAT</p>
              <h2>我正在听</h2>
            </div>
            <button class="soft-btn" @click="resetChat">清空本页对话</button>
          </div>

          <div ref="chatBox" class="immersive-chat-body panel-scroll">
            <div v-for="message in messages" :key="message.id" :class="['bubble', message.role, { sparkle: message.pending }]">
              <span v-if="message.role === 'ai'" class="bubble-mark">{{ message.pending ? '…' : '✦' }}</span>
              {{ message.text }}
            </div>
          </div>

          <div v-if="errorText" class="coze-error">
            {{ errorText }}
          </div>

          <div class="chat-input immersive-input">
            <el-input
              v-model="chatText"
              :disabled="loading"
              placeholder="告诉我你的想法"
              @keyup.enter="sendChat"
            />
            <el-button type="danger" :loading="loading" @click="sendChat">发送</el-button>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import ChapterIntro from '../components/ChapterIntro.vue'

const orbitWords = ['Listen', 'Memory', 'Company', 'Answer']
const userId = getOrCreateUserId()
const messages = ref([
  {
    id: 1,
    role: 'ai',
    text: '你好，感谢遇见。写下一句话，我们就在这里开始。',
    pending: false
  }
])
const chatText = ref('')
const chatBox = ref(null)
const loading = ref(false)
const errorText = ref('')

function getOrCreateUserId() {
  const stored = localStorage.getItem('cozeMemoryUserId')
  if (stored) return stored
  const next = crypto.randomUUID ? crypto.randomUUID() : `memory-${Date.now()}-${Math.random()}`
  localStorage.setItem('cozeMemoryUserId', next)
  return next
}

function scrollToBottom() {
  nextTick(() => {
    if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight
  })
}

async function sendChat() {
  const text = chatText.value.trim()
  if (!text || loading.value) return

  errorText.value = ''
  messages.value.push({ id: Date.now(), role: 'user', text, pending: false })
  chatText.value = ''
  loading.value = true

  const pendingId = Date.now() + 1
  messages.value.push({ id: pendingId, role: 'ai', text: '正在向 Coze 发送……', pending: true })
  scrollToBottom()

  try {
    const response = await fetch('/api/coze/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, userId })
    })
    const raw = await response.text()
    let data = {}
    try {
      data = raw ? JSON.parse(raw) : {}
    } catch {
      data = { error: raw || '接口没有返回 JSON，请确认 Coze 后端代理已启动。' }
    }

    if (!response.ok) {
      throw new Error(data.error || `Coze 请求失败：HTTP ${response.status}`)
    }

    messages.value = messages.value.map(message =>
      message.id === pendingId
        ? { ...message, text: data.answer || 'Coze 没有返回文本内容。', pending: false }
        : message
    )
  } catch (error) {
    errorText.value = error.message || 'Coze 请求失败，请检查后端服务和 Token。'
    messages.value = messages.value.filter(message => message.id !== pendingId)
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

function resetChat() {
  messages.value = [
    {
      id: Date.now(),
      role: 'ai',
      text: '对话已经清空。我们从这一句重新开始。',
      pending: false
    }
  ]
  errorText.value = ''
  scrollToBottom()
}
</script>
