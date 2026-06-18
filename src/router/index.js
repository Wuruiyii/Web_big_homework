import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MemoryCorridor from '../views/MemoryCorridor.vue'
import LightGallery from '../views/LightGallery.vue'
import TalkToMe from '../views/TalkToMe.vue'
import MessageBoard from '../views/MessageBoard.vue'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { music: 'home' } },
  { path: '/memory', alias: ['/sort', '/article'], name: 'MemoryCorridor', component: MemoryCorridor, meta: { music: 'memory' } },
  { path: '/gallery', alias: ['/travel', '/picture'], name: 'LightGallery', component: LightGallery, meta: { music: 'gallery' } },
  { path: '/talk', name: 'TalkToMe', component: TalkToMe, meta: { hideMusic: true } },
  { path: '/letters', alias: ['/message', '/letter'], name: 'MessageBoard', component: MessageBoard, meta: { music: 'home' } },
  { path: '/garden', alias: ['/favorite', '/about'], redirect: '/' }
]

export default createRouter({ history: createWebHashHistory(), routes })
