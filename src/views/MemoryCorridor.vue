<template>
  <main class="page poetize-page">
    <ChapterIntro index="文章归档" title="回忆文章" desc="主题、标签和时间，把旧日子整理成一排温柔的书脊。" />
    <section class="content poetize-archive memory-redesign">
      <section class="memory-hero-banner glass-card" :style="{ '--memory-cover': `url(${currentArticle.cover})` }">
        <div>
          <p class="eyebrow">MEMORY LINE</p>
          <h1>时间线</h1>
          <p>旧日子不是散乱的碎片，它们沿着一条柔软的线，慢慢走到今天的我面前。</p>
        </div>
        <div class="memory-hero-stats">
          <span><b>{{ articles.length }}</b> 篇文章</span>
          <span><b>{{ timelineNodes.length }}</b> 个节点</span>
          <span><b>{{ favoriteIds.length }}</b> 个收藏</span>
        </div>
      </section>

      <section class="poetize-memory-line glass-card">
        <div class="timeline-copy">
          <i></i>
          <div>
            <h2>时间线</h2>
            <p>The soul is walking</p>
          </div>
        </div>
        <div class="timeline-board">
          <article
            v-for="(node, index) in timelineNodes"
            :key="node.id"
            :class="['timeline-memory-card', { active: currentArticle.id === node.articleId }]"
            @click="selectTimelineNode(node)"
          >
            <button class="timeline-image-button" type="button" @click.stop="openTimelinePreview(node)">
              <img :src="node.cover" />
            </button>
            <h3>{{ node.title }}</h3>
            <p>{{ node.date }}</p>
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
          </article>
        </div>
      </section>

      <aside class="archive-left glass-card">
        <p class="eyebrow">SORT</p>
        <h1>文章分类</h1>
        <p>每篇文章都是一枚粉色邮戳，盖在认真生活过的某一天。</p>
        <div class="sort-list">
          <button
            v-for="cat in categories"
            :key="cat"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >
            <span>{{ cat }}</span>
            <b>{{ countByCategory(cat) }}</b>
          </button>
        </div>
        <div class="tag-cloud">
          <button
            v-for="tag in articleTags"
            :key="tag"
            :class="{ active: activeTag === tag }"
            @click="activeTag = activeTag === tag ? '' : tag"
          >
            #{{ tag }}
          </button>
        </div>
        <router-link class="next-link" to="/gallery">去图片墙 →</router-link>
      </aside>

      <article class="article-detail memory-feature-card glass-card">
        <button class="article-image-button memory-feature-image" type="button" @click="openArticlePreview(currentArticle)">
          <img class="article-hero-img" :src="currentArticle.cover" />
          <span>{{ currentArticle.date }}</span>
        </button>
        <div class="memory-feature-copy">
          <div class="article-detail-head">
            <div>
              <p class="eyebrow">{{ currentArticle.category }} · {{ currentArticle.read }}</p>
              <h2>{{ currentArticle.title }}</h2>
            </div>
            <button class="heart-btn large" @click="toggleFavorite(currentArticle.id)">
              {{ favoriteIds.includes(currentArticle.id) ? '已收藏' : '收藏文章' }}
            </button>
          </div>
          <p class="memory-feature-excerpt">{{ currentArticle.excerpt }}</p>
          <div class="article-body panel-scroll">
            <p v-for="paragraph in currentArticle.body" :key="paragraph">{{ paragraph }}</p>
          </div>
          <div class="article-bottom">
            <span v-for="tag in currentArticle.tags" :key="tag">#{{ tag }}</span>
            <button class="soft-btn" @click="randomArticle">随机读一篇</button>
          </div>
        </div>
      </article>

      <section class="archive-timeline glass-card">
        <div class="section-head compact">
          <div><p class="eyebrow">TIMELINE</p><h2>时间轴</h2></div>
        </div>
        <div class="timeline-rail">
          <button
            v-for="article in articles"
            :key="article.id"
            :class="{ active: currentArticle.id === article.id }"
            @click="currentArticle = article"
          >
            <i></i>
            <span>{{ article.date }}</span>
            <b>{{ article.title }}</b>
          </button>
        </div>
      </section>

      <el-dialog
        v-model="timelinePreviewOpen"
        fullscreen
        append-to-body
        class="memory-preview-dialog"
        modal-class="memory-preview-overlay"
        :show-close="false"
      >
        <div class="memory-preview-shell" v-if="previewNode">
          <button class="preview-close" @click="timelinePreviewOpen = false">×</button>
          <img :src="previewNode.cover" />
          <div>
            <p class="eyebrow">{{ previewNode.date }}</p>
            <h2>{{ previewNode.title }}</h2>
            <p>{{ previewNode.text || '点击叉号即可回到时间线，继续翻看下一段回忆。' }}</p>
          </div>
        </div>
      </el-dialog>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import ChapterIntro from '../components/ChapterIntro.vue'
import { articles, articleTags, categories, photos } from '../data/memorySite'

const activeCategory = ref('全部')
const activeTag = ref('')
const keyword = ref('')
const currentArticle = ref(articles[0])
const timelinePreviewOpen = ref(false)
const previewNode = ref(null)
const storedFavorites = localStorage.getItem('memoryPostFavorites')
const favoriteIds = ref(storedFavorites ? JSON.parse(storedFavorites) : [])

const filteredArticles = computed(() => {
  const key = keyword.value.trim()
  return articles.filter(article => {
    const categoryMatch = activeCategory.value === '全部' || article.category === activeCategory.value
    const tagMatch = !activeTag.value || article.tags.includes(activeTag.value)
    const text = `${article.title}${article.excerpt}${article.body.join('')}${article.tags.join('')}`
    return categoryMatch && tagMatch && (!key || text.includes(key))
  })
})

const timelineNodes = computed(() => {
  const articleNodes = articles.map(article => ({
    id: `article-${article.id}`,
    articleId: article.id,
    title: article.title,
    date: article.date,
    rawDate: article.date,
    cover: article.cover,
    order: 0
  }))
  const photoNodes = photos.slice(0, 6).map((photo, index) => ({
    id: `photo-${photo.id}`,
    articleId: articles[index % articles.length].id,
    title: photo.title,
    date: `${photo.date} · ${photo.place}`,
    rawDate: photo.date,
    cover: photo.src,
    order: 1
  }))
  return [...articleNodes, ...photoNodes].sort((a, b) => {
    const dateDelta = parseMemoryDate(a.rawDate) - parseMemoryDate(b.rawDate)
    return dateDelta || a.order - b.order || a.id.localeCompare(b.id)
  })
})

function parseMemoryDate(value) {
  const match = String(value || '').match(/^(\d{4})[.-](\d{1,2})[.-](\d{1,2})/)
  if (!match) return Number.MAX_SAFE_INTEGER
  const [, year, month, day] = match
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
}

function countByCategory(category) {
  return category === '全部' ? articles.length : articles.filter(article => article.category === category).length
}

function randomArticle() {
  const pool = filteredArticles.value.length ? filteredArticles.value : articles
  currentArticle.value = pool[Math.floor(Math.random() * pool.length)]
}

function toggleFavorite(id) {
  favoriteIds.value = favoriteIds.value.includes(id)
    ? favoriteIds.value.filter(item => item !== id)
    : [...favoriteIds.value, id]
  localStorage.setItem('memoryPostFavorites', JSON.stringify(favoriteIds.value))
}

function selectTimelineNode(node) {
  currentArticle.value = articles.find(article => article.id === node.articleId) || articles[0]
}

function openTimelinePreview(node) {
  previewNode.value = node
  timelinePreviewOpen.value = true
}

function openArticlePreview(article) {
  previewNode.value = {
    date: `${article.category} · ${article.date}`,
    title: article.title,
    cover: article.cover,
    text: article.excerpt
  }
  timelinePreviewOpen.value = true
}

watch(filteredArticles, list => {
  if (list.length && !list.some(article => article.id === currentArticle.value.id)) {
    currentArticle.value = list[0]
  }
})
</script>
