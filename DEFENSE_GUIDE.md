# 项目答辩讲解稿

## 一句话介绍

这个项目是一个基于 Vue 3 和 Vite 开发的个人回忆网站，主题是“过往来信”。它把文章、照片、留言、音乐、视频和 AI 对话整合成一个带有仪式感的交互式站点。用户可以浏览回忆文章、整理照片墙、观看视频、玩记忆翻牌小游戏、提交留言，并通过 Coze 智能体进行站内对话。

## 技术栈

| 技术 | 作用 |
| --- | --- |
| Vue 3 | 页面组件开发和响应式数据管理 |
| Vue Router | 管理首页、记忆页、照片墙、留言页、AI 对话页之间的路由切换 |
| Vite | 项目开发服务器、资源打包、代理接口转发 |
| Element Plus | 提供输入框、按钮、弹窗等 UI 组件 |
| localStorage | 在浏览器本地保存收藏、留言、照片拖拽位置、小游戏最佳记录等数据 |
| Canvas | 实现首页“今日回忆签”的刮刮卡效果 |
| Pointer Events | 实现刮卡、拖拽拍立得照片等交互 |
| Node http server | 作为 Coze API 的后端代理，避免前端直接暴露 Token |
| Coze API | 生成 AI 对话页面中的回复 |

## 项目整体结构

| 文件 | 作用 |
| --- | --- |
| `src/main.js` | Vue 应用入口，挂载 App、路由和 Element Plus |
| `src/App.vue` | 全站外壳，控制开场动画、导航栏、音乐播放器、页面出口 |
| `src/router/index.js` | 路由配置，定义每个页面路径和音乐显示规则 |
| `src/data/memorySite.js` | 全站核心数据，包含文章、照片、首页轮播、留言种子、分类、标签等 |
| `src/components/NavBar.vue` | 顶部导航组件 |
| `src/components/MusicPlayer.vue` | 全局背景音乐组件 |
| `src/components/IntroGate.vue` | 首页首次进入时的信封开场动画 |
| `src/components/ChapterIntro.vue` | 页面进入时的章节提示动画 |
| `src/views/Home.vue` | 首页，包含首页封面、作者卡片、文章列表、刮刮卡 |
| `src/views/MemoryCorridor.vue` | 记忆文章页，包含分类、标签、时间线、文章详情 |
| `src/views/LightGallery.vue` | 照片墙页，包含照片筛选、拍立得拖拽、视频、小游戏 |
| `src/views/MessageBoard.vue` | 留言页，包含弹幕、留言表单、来信列表 |
| `src/views/TalkToMe.vue` | AI 对话页，调用后端代理请求 Coze |
| `server.js` | Coze 后端代理服务 |
| `vite.config.js` | Vite 配置和 `/api` 代理 |
| `src/styles.css` | 全站样式、布局、动画、响应式适配 |

## 启动流程

1. 浏览器加载 `index.html`，其中的 `#app` 是 Vue 挂载点。
2. `src/main.js` 创建 Vue 应用，注册路由和 Element Plus，再挂载到 `#app`。
3. `App.vue` 作为全站根组件，决定是否显示首页开场动画。
4. 当用户点击导航时，`vue-router` 根据路径切换对应页面组件。
5. 如果页面不是 AI 对话页，`App.vue` 会显示全局音乐播放器。
6. 如果用户使用 AI 对话页，前端请求 `/api/coze/chat`，Vite 将请求代理到本地 `server.js`，再由 `server.js` 请求 Coze。

## `src/main.js`

这个文件是前端入口文件，代码很短，但非常关键。

主要逻辑：

| 代码点 | 说明 |
| --- | --- |
| `createApp(App)` | 创建 Vue 应用实例 |
| `.use(router)` | 注册路由系统，让页面可以根据 URL 切换 |
| `.use(ElementPlus)` | 注册 Element Plus，项目里才能使用 `el-input`、`el-button`、`el-dialog` |
| `import './styles.css'` | 引入全局样式 |
| `.mount('#app')` | 把 Vue 应用挂载到 HTML 的 `#app` 节点 |

答辩可以这样说：

> `main.js` 是项目启动入口，它负责创建 Vue 应用，并把路由、Element Plus 和全局样式注册进去，最后挂载到页面根节点。

## `src/router/index.js`

这个文件负责页面路由。

路由说明：

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/` | `Home.vue` | 首页 |
| `/memory` | `MemoryCorridor.vue` | 记忆文章页 |
| `/sort`、`/article` | `MemoryCorridor.vue` | 记忆页别名 |
| `/gallery` | `LightGallery.vue` | 照片墙 |
| `/travel`、`/picture` | `LightGallery.vue` | 照片页别名 |
| `/talk` | `TalkToMe.vue` | AI 对话页 |
| `/letters` | `MessageBoard.vue` | 留言页 |
| `/message`、`/letter` | `MessageBoard.vue` | 留言页别名 |
| `/garden`、`/favorite`、`/about` | 重定向到首页 | 旧路径兼容 |

关键逻辑：

| 代码点 | 说明 |
| --- | --- |
| `createWebHashHistory()` | 使用 Hash 路由，URL 中会带 `#`，部署静态网站时不需要额外服务器配置 |
| `meta.music` | 给不同页面指定背景音乐类型 |
| `meta.hideMusic` | AI 对话页隐藏音乐播放器 |
| `alias` | 让多个路径指向同一个页面，提升兼容性 |

答辩可以这样说：

> 我使用 Vue Router 管理单页应用的页面切换，并使用 Hash 模式降低部署难度。每个路由还通过 `meta` 字段控制背景音乐，比如对话页需要安静，所以设置了 `hideMusic`。

## `src/App.vue`

`App.vue` 是全站总壳。

模板结构：

| 模块 | 作用 |
| --- | --- |
| `.app-shell` | 全站最外层容器 |
| `.ambient-layer` | 背景氛围层 |
| `IntroGate` | 首页首次进入时显示的信封开场动画 |
| `NavBar` | 顶部导航 |
| `MusicPlayer` | 背景音乐播放器 |
| `router-view` | 当前路由页面的显示出口 |

脚本逻辑：

| 变量或函数 | 作用 |
| --- | --- |
| `route` | 获取当前路由信息 |
| `introEntered` | 记录用户是否已经进入首页 |
| `showIntroGate` | 只有当前路径是首页并且还没进入过时，才显示开场动画 |
| `enterIntro()` | 用户点击开场信封后，把 `introEntered` 改为 `true` |
| `watch(route.path)` | 如果用户进入了非首页页面，就认为已经通过开场 |

答辩可以这样说：

> `App.vue` 统一控制全站公共区域。它通过响应式变量判断是否显示首页开场动画，并通过路由 `meta.hideMusic` 判断是否显示音乐播放器。真正的页面内容由 `router-view` 动态渲染。

## `src/data/memorySite.js`

这是整个项目的数据中心。

主要数据：

| 数据名 | 用途 |
| --- | --- |
| `authorProfile` | 首页作者卡片的信息，包括头像、简介、统计数字 |
| `categories` | 文章分类，如全部、成长札记、旧日相册等 |
| `articleTags` | 文章标签，如记录、成长、照片、勇气 |
| `heroBanners` | 首页顶部封面轮播数据 |
| `articles` | 记忆文章数据，包括标题、分类、日期、封面、标签、正文 |
| `photos` | 照片墙数据，包括标题、类型、地点、日期、图片、描述 |
| `favoriteTools` | 首页快捷入口 |
| `friends` | 友好描述类数据，目前可作为扩展展示 |
| `messageSeeds` | 留言页初始留言 |
| `poems` | 诗句类文案，目前可作为扩展展示 |

实现特点：

| 特点 | 说明 |
| --- | --- |
| 图片通过 `import` 引入 | Vite 会在打包时处理图片路径，避免线上路径错误 |
| 数据集中管理 | 页面组件只负责展示和交互，内容统一在数据文件里维护 |
| 每张照片有独立文案 | 首页、文章、照片墙中的图片和文字可以保持对应关系 |

答辩可以这样说：

> 我把文章、照片、留言等内容抽离到单独的数据文件中，这样页面组件不需要写死大量内容，后期替换图片或修改文案时只需要维护这个数据文件。

## `NavBar.vue`

这是顶部导航栏组件。

主要逻辑：

| 代码点 | 说明 |
| --- | --- |
| `navs` 数组 | 定义导航项的编号、名称和路径 |
| `v-for` | 根据数组自动生成导航链接 |
| `router-link` | Vue Router 提供的路由跳转组件 |

答辩可以这样说：

> 导航栏使用数组驱动渲染，后续如果要新增页面，只需要在 `navs` 里加一项，不需要重复写 HTML。

## `MusicPlayer.vue`

这是背景音乐组件。

模板结构：

| 模块 | 作用 |
| --- | --- |
| `<audio>` | 真正播放音乐的 HTML 元素 |
| `.music-disc` | 播放/暂停按钮 |
| 文本区域 | 显示当前音乐名称 |

脚本逻辑：

| 变量或函数 | 作用 |
| --- | --- |
| `srcMap` | 把页面音乐类型映射到音频文件 |
| `labels` | 显示给用户看的音乐名称 |
| `currentKey` | 根据当前路由的 `meta.music` 决定播放哪首 |
| `currentSrc` | 根据 `currentKey` 得到真实音频路径 |
| `playing` | 标记当前是否播放 |
| `toggle()` | 点击按钮时播放或暂停 |
| `watch(currentSrc)` | 页面切换导致音乐变化时，重新加载音频，如果之前在播放则继续播放 |

答辩可以这样说：

> 音乐播放器不是每个页面单独写，而是作为全局组件存在。它根据路由的 `meta.music` 自动切换音乐，实现了页面氛围和内容的联动。

## `IntroGate.vue`

这是首页开场信封动画。

主要逻辑：

| 变量或函数 | 作用 |
| --- | --- |
| `lines` | 开场时逐行出现的文字 |
| `ready` | 控制按钮是否可以点击，5 秒后变为可点击 |
| `opening` | 控制信封打开动画 |
| `readyTimer` | 延迟允许打开信封 |
| `enterTimer` | 播放开场动画后通知父组件进入首页 |
| `defineEmits(['enter'])` | 子组件向 `App.vue` 发送进入事件 |
| `onBeforeUnmount` | 组件销毁时清理定时器，避免内存泄漏 |

答辩可以这样说：

> 开场页通过定时器控制节奏，先展示文字，再允许用户打开信封。点击后子组件用 `emit` 通知父组件隐藏开场页，进入正式首页。

## `ChapterIntro.vue`

这是页面进入时的章节提示组件。

主要逻辑：

| 代码点 | 说明 |
| --- | --- |
| `defineProps` | 接收章节编号、标题、描述、显示时间 |
| `show` | 控制提示卡片是否显示 |
| `onMounted` | 页面挂载后设置定时器，到时间自动隐藏 |
| `<transition>` | 给进入和离开过程加动画 |

答辩可以这样说：

> 这个组件是可复用的章节提示，不同页面只需要传入不同的标题和描述，就能保持统一的入场体验。

## `Home.vue`

首页是项目的总入口，包含封面展示、作者信息、快捷入口、今日回忆签、文章列表和文章预览。

主要区域：

| 区域 | 功能 |
| --- | --- |
| `poetize-banner` | 首页封面轮播 |
| `author-card` | 作者头像、简介和统计信息 |
| `quick-router` | 快捷入口 |
| `daily-scratch-card` | 今日回忆签刮刮卡 |
| `article-feed` | 首页文章列表、搜索和分类筛选 |
| `home-reader` | 当前选中文章的预览 |

核心响应式变量：

| 变量 | 作用 |
| --- | --- |
| `bannerIndex` | 当前首页封面索引 |
| `activeBanner` | 当前显示的封面数据 |
| `keyword` | 文章搜索关键词 |
| `activeCategory` | 当前文章分类 |
| `selectedArticle` | 当前选中的文章 |
| `favoriteIds` | 已收藏文章 ID |
| `scratchCanvas` | 刮刮卡 Canvas 元素引用 |
| `scratchRevealed` | 刮刮卡是否已经刮开 |
| `scratching` | 当前是否正在刮 |
| `dailySignIndex` | 今日回忆签的当前索引 |

首页封面逻辑：

| 函数 | 说明 |
| --- | --- |
| `nextBanner()` | 让 `bannerIndex` 加一，并用取模方式循环切换封面 |

文章筛选逻辑：

| 代码点 | 说明 |
| --- | --- |
| `filteredArticles` | 根据分类和关键词筛选文章 |
| `categoryMatch` | 判断分类是否匹配 |
| `text.includes(key)` | 判断标题、摘要、分类、标签中是否包含关键词 |

收藏逻辑：

| 函数 | 说明 |
| --- | --- |
| `toggleFavorite(id)` | 如果已经收藏就取消，否则加入收藏 |
| `localStorage.setItem` | 把收藏结果保存到浏览器本地 |

刮刮卡逻辑：

| 函数 | 说明 |
| --- | --- |
| `prepareScratchCanvas()` | 初始化 Canvas 尺寸，绘制金色遮罩、文字和装饰点 |
| `scratchAt(event)` | 根据鼠标或触摸位置擦除 Canvas 遮罩 |
| `checkScratchProgress()` | 读取 Canvas 像素透明度，判断刮开的比例 |
| `startScratch(event)` | 开始刮卡，并捕获指针 |
| `scratch(event)` | 指针移动时持续擦除 |
| `endScratch()` | 停止刮卡 |
| `drawNextSign()` | 切换下一张回忆签并重新生成遮罩 |

刮刮卡的技术点：

| 技术点 | 说明 |
| --- | --- |
| `canvas.getContext('2d')` | 获取 2D 绘图上下文 |
| `devicePixelRatio` | 适配高分屏，避免 Canvas 模糊 |
| `globalCompositeOperation = 'destination-out'` | 实现“擦除遮罩”的效果 |
| `getImageData` | 获取像素数据，计算已经刮开的面积 |
| `pointerdown/pointermove` | 同时支持鼠标和触摸操作 |

答辩可以这样说：

> 首页最主要的交互是今日回忆签。它底层用 Canvas 画一层遮罩，用户拖动时把对应区域设置为透明。当透明区域达到一定比例后，就认为刮卡完成，显示下方的回忆内容。

## `MemoryCorridor.vue`

这是记忆文章页，重点是文章分类、标签筛选、时间线和文章详情阅读。

主要区域：

| 区域 | 功能 |
| --- | --- |
| `ChapterIntro` | 页面进入提示 |
| `memory-hero-banner` | 顶部信息和统计 |
| `poetize-memory-line` | 时间线卡片 |
| `archive-left` | 分类和标签筛选 |
| `article-detail` | 当前文章详情 |
| `archive-timeline` | 文章日期轴 |
| `el-dialog` | 图片或文章预览弹窗 |

核心响应式变量：

| 变量 | 作用 |
| --- | --- |
| `activeCategory` | 当前分类 |
| `activeTag` | 当前标签 |
| `keyword` | 搜索关键词，当前保留了逻辑 |
| `currentArticle` | 当前展示的文章 |
| `timelinePreviewOpen` | 时间线预览弹窗是否打开 |
| `previewNode` | 弹窗中展示的数据 |
| `favoriteIds` | 已收藏文章 ID |

文章筛选逻辑：

| 代码点 | 说明 |
| --- | --- |
| `filteredArticles` | 根据分类、标签和关键词筛选文章 |
| `categoryMatch` | 分类匹配 |
| `tagMatch` | 标签匹配 |
| `text.includes(key)` | 搜索匹配 |

时间线逻辑：

| 代码点 | 说明 |
| --- | --- |
| `articleNodes` | 把文章转换成时间线节点 |
| `photoNodes` | 把部分照片也转换成时间线节点 |
| `parseMemoryDate()` | 把日期字符串转换成时间戳 |
| `.sort()` | 按日期排序，日期相同再按类型和 ID 排序 |

核心函数：

| 函数 | 作用 |
| --- | --- |
| `parseMemoryDate(value)` | 解析 `2026.04.12` 或类似格式的日期 |
| `countByCategory(category)` | 统计每个分类有多少篇文章 |
| `randomArticle()` | 从当前筛选结果里随机选一篇文章 |
| `toggleFavorite(id)` | 收藏或取消收藏文章 |
| `selectTimelineNode(node)` | 点击时间线节点时切换文章 |
| `openTimelinePreview(node)` | 打开时间线预览弹窗 |
| `openArticlePreview(article)` | 打开文章图片预览 |

`watch(filteredArticles)` 的作用：

当用户切换分类或标签后，如果当前文章不在筛选结果中，就自动切换到筛选后的第一篇文章，避免页面右侧详情区域还显示不属于当前分类的内容。

答辩可以这样说：

> 记忆文章页采用“左侧筛选、右侧详情、上方时间线”的结构。筛选结果通过 `computed` 自动计算，当前文章通过 `ref` 管理。当筛选条件变化时，我用 `watch` 保证详情区和筛选结果保持一致。

## `LightGallery.vue`

这是照片墙页面，也是交互最多的页面之一，包含照片筛选、主图放映、拍立得拖拽整理、翻面查看文字、视频弹窗和记忆翻牌小游戏。

主要区域：

| 区域 | 功能 |
| --- | --- |
| `gallery-left` | 页面说明和照片类型筛选 |
| `photo-projector` | 主图放映区域 |
| `photo-wall` | 拍立得桌面，可以拖拽和翻面 |
| `travel-map` | 旅拍路线 |
| `media-console` | 小游戏入口 |
| `video-showcase` | 视频记忆盒 |
| `el-dialog previewOpen` | 图片全屏查看 |
| `el-dialog videoOpen` | 视频播放 |
| `el-dialog gameOpen` | 记忆翻牌小游戏 |

核心响应式变量：

| 变量 | 作用 |
| --- | --- |
| `activeType` | 当前照片类型 |
| `selectedPhoto` | 当前选中的照片 |
| `previewOpen` | 图片全屏弹窗开关 |
| `videoOpen` | 视频弹窗开关 |
| `gameOpen` | 小游戏弹窗开关 |
| `gameRunning` | 小游戏是否正在计时 |
| `gameFinished` | 小游戏是否结束 |
| `gameMoves` | 小游戏步数 |
| `gameSeconds` | 小游戏用时 |
| `gameDeck` | 小游戏卡牌数组 |
| `flippedCards` | 当前翻开的卡牌 ID |
| `matchedPairs` | 已匹配成功的照片 ID |
| `checkingPair` | 是否正在等待两张牌的匹配结果 |
| `bestRecord` | 本地保存的最佳记录 |
| `flippedPhotoIds` | 照片墙中已经翻面的拍立得 ID |
| `draggingPhotoId` | 当前正在拖拽的拍立得 ID |
| `dragState` | 拖拽过程中的起始坐标和位置 |
| `photoPositions` | 拍立得照片位置，保存到 localStorage |

照片筛选和轮播：

| 代码点 | 说明 |
| --- | --- |
| `photoTypes` | 从照片数据中提取所有类型，并加上“全部” |
| `filteredPhotos` | 根据当前类型过滤照片 |
| `movePhoto(delta)` | 上一张或下一张照片 |
| `startCarousel()` | 每 5 秒自动切换照片 |
| `stopCarousel()` | 清除轮播定时器 |

拍立得拖拽逻辑：

| 函数 | 作用 |
| --- | --- |
| `defaultPolaroidPosition(photo)` | 根据照片索引生成默认散落位置和旋转角度 |
| `loadPhotoPositions()` | 从 localStorage 读取用户上次整理的位置 |
| `savePhotoPositions()` | 保存用户拖拽后的照片位置 |
| `polaroidPosition(photo)` | 获取当前照片位置，没有保存过就使用默认位置 |
| `polaroidStyle(photo)` | 把位置转换成 CSS 变量 `--x`、`--y`、`--r` |
| `togglePolaroid(photo)` | 点击照片时翻面或翻回正面 |
| `startPhotoDrag(event, photo)` | 记录拖拽起点和照片原始位置 |
| `dragPhoto(event)` | 根据鼠标移动距离更新照片位置 |
| `endPhotoDrag()` | 拖拽结束后保存位置 |

拖拽的技术点：

| 技术点 | 说明 |
| --- | --- |
| `Pointer Events` | 统一处理鼠标、触控笔、触摸屏 |
| `setPointerCapture` | 保证拖拽时指针不会丢失 |
| 百分比坐标 | 让照片位置能随容器大小相对适配 |
| `Math.min/Math.max` | 限制照片不会被拖出桌面太远 |
| `localStorage` | 用户整理后的照片位置刷新后仍然保留 |

记忆翻牌小游戏逻辑：

| 函数 | 作用 |
| --- | --- |
| `openGame()` | 打开小游戏弹窗 |
| `resetGame()` | 重置状态，选取 6 张照片并复制成 12 张牌 |
| `createGameCard(photo, copy)` | 根据照片创建一张卡牌 |
| `shuffle(list)` | 打乱卡牌顺序 |
| `startGameClock()` | 第一次翻牌时开始计时 |
| `flipCard(card)` | 翻开卡牌 |
| `checkPair()` | 判断两张牌是否匹配 |
| `isCardOpen(card)` | 判断卡片当前是否应该显示正面 |
| `finishGame()` | 游戏结束并保存最佳记录 |
| `pauseGame()` | 暂停计时器 |

小游戏规则：

| 规则 | 说明 |
| --- | --- |
| 选取 6 张照片 | 每张复制两份，组成 12 张牌 |
| 每次翻两张 | 如果 `pairId` 相同，说明匹配成功 |
| 不同则延迟翻回 | 给用户短暂记忆时间 |
| 全部匹配后结束 | 停止计时，并比较是否刷新最佳记录 |

答辩可以这样说：

> 照片墙不是单纯展示图片，而是设计成可以整理的拍立得桌面。每张照片的位置用百分比和旋转角度控制，拖动后会保存到 localStorage。小游戏则是把照片数据复用成卡牌数据，通过 `pairId` 判断是否匹配。

## `MessageBoard.vue`

这是留言页，包含漂流弹幕、留言表单和来信列表。

主要区域：

| 区域 | 功能 |
| --- | --- |
| `message-dialogue` | 弹幕展示区域 |
| `message-left` | 页面说明和留言数量 |
| `message-write` | 留言输入表单 |
| `message-wall` | 留言列表 |
| `message-filter-inline` | 按心情筛选留言 |

核心响应式变量：

| 变量 | 作用 |
| --- | --- |
| `moods` | 心情分类 |
| `activeMood` | 当前筛选心情 |
| `letters` | 所有留言 |
| `letter` | 当前表单输入内容 |
| `driftingLetters` | 新提交后优先出现在弹幕中的留言 |

核心计算属性：

| 计算属性 | 作用 |
| --- | --- |
| `filteredLetters` | 根据当前心情筛选留言 |
| `floatingMessages` | 取新留言和已有留言的前 24 条作为弹幕 |

核心函数：

| 函数 | 作用 |
| --- | --- |
| `barrageStyle(index)` | 为每条弹幕计算轨道、速度、延迟、起始位置和上下浮动 |
| `persist()` | 把留言保存到 localStorage |
| `submitLetter()` | 校验表单、创建新留言、插入列表、保存本地 |
| `toggleSaved(mail)` | 切换留言是否珍藏 |

弹幕实现：

| 技术点 | 说明 |
| --- | --- |
| `v-for` | 遍历留言生成弹幕 |
| CSS 变量 | 每条弹幕拥有不同速度、延迟、轨道 |
| `@keyframes barrageMove` | 控制弹幕横向滚动 |
| `aria-hidden="true"` | 弹幕只是视觉装饰，不干扰读屏 |

答辩可以这样说：

> 留言页的数据保存在浏览器本地。用户提交留言后，留言会立即加入列表，也会进入弹幕队列，让提交动作更有反馈和仪式感。弹幕的位置和速度通过 JS 计算后传给 CSS 变量。

## `TalkToMe.vue`

这是 AI 对话页，使用站内聊天框，不再跳转到 Coze 网页。

主要区域：

| 区域 | 功能 |
| --- | --- |
| `persona-orbit` | 视觉上的人格核心装饰 |
| `chat-theater` | 聊天主体 |
| `immersive-chat-body` | 消息列表 |
| `coze-error` | 接口错误提示 |
| `el-input` | 用户输入框 |
| `el-button` | 发送按钮 |

核心响应式变量：

| 变量 | 作用 |
| --- | --- |
| `orbitWords` | 环绕关键词 |
| `userId` | 当前浏览器用户 ID |
| `messages` | 聊天消息列表 |
| `chatText` | 输入框内容 |
| `chatBox` | 聊天列表 DOM 引用 |
| `loading` | 是否正在请求 AI |
| `errorText` | 错误信息 |

核心函数：

| 函数 | 作用 |
| --- | --- |
| `getOrCreateUserId()` | 从 localStorage 读取用户 ID，没有就生成一个 |
| `scrollToBottom()` | 新消息出现后滚动到底部 |
| `sendChat()` | 发送用户消息，请求后端代理，更新 AI 回复 |
| `resetChat()` | 清空当前页面消息，重新开始对话 |

AI 对话流程：

1. 用户输入文字并点击发送。
2. `sendChat()` 校验内容是否为空，防止重复发送。
3. 前端先把用户消息加入 `messages`。
4. 再添加一条临时 AI 消息，显示“正在向 Coze 发送……”。
5. 前端请求 `/api/coze/chat`。
6. 如果请求成功，把临时消息替换为 Coze 返回的答案。
7. 如果请求失败，删除临时消息并显示错误提示。
8. 最后取消 `loading`，滚动到底部。

为什么不直接在前端请求 Coze：

| 原因 | 说明 |
| --- | --- |
| Token 不能暴露 | 如果把 Coze Token 写在前端，打包后任何人都能看到 |
| 解决跨域 | 通过本地后端代理和 Vite 代理减少跨域问题 |
| 统一错误处理 | 后端可以把 Coze 的复杂错误转成前端更容易显示的信息 |

答辩可以这样说：

> AI 对话页使用前后端分离的方式。前端只负责展示聊天界面并请求本地 `/api/coze/chat`，真正的 Coze Token 放在后端代理里，避免泄露。

## `server.js`

这是 Coze API 的本地后端代理。

主要配置：

| 变量 | 作用 |
| --- | --- |
| `COZE_PROXY_PORT` | 后端代理端口 |
| `COZE_API_BASE` | Coze API 地址，默认 `https://api.coze.cn` |
| `COZE_API_TOKEN` | Coze 访问令牌 |
| `COZE_BOT_ID` | 智能体 ID |

核心函数：

| 函数 | 作用 |
| --- | --- |
| `loadEnv(file)` | 手动读取 `.env.server` 配置 |
| `sendJson(res, status, data)` | 统一返回 JSON，并设置 CORS 头 |
| `readJson(req)` | 读取请求体并解析 JSON |
| `cozeFetch(path, options)` | 封装请求 Coze API 的逻辑 |
| `waitForAnswer(chatId, conversationId)` | 轮询 Coze 聊天状态，直到拿到回答 |
| `handleChat(req, res)` | 处理前端聊天请求 |

Coze 请求流程：

1. 前端请求 `POST /api/coze/chat`。
2. `server.js` 读取用户消息和 `userId`。
3. 后端检查 `COZE_API_TOKEN` 是否存在。
4. 后端请求 Coze `/v3/chat` 创建对话。
5. Coze 返回 `chat_id` 和 `conversation_id`。
6. 后端用这两个 ID 调用 `/v3/chat/retrieve` 轮询状态。
7. 当状态为 `completed` 时，再请求 `/v3/chat/message/list` 获取回答。
8. 后端把回答以 `{ answer }` 的形式返回给前端。

错误处理：

| 场景 | 处理方式 |
| --- | --- |
| 没有 Token | 返回 500 和错误提示 |
| 用户消息为空 | 返回 400 |
| Coze 没返回 `chat_id` 或 `conversation_id` | 返回 502 |
| Coze 状态失败 | 抛出错误并返回给前端 |
| 超过轮询次数 | 返回超时错误 |

答辩可以这样说：

> `server.js` 的作用是保护 Coze Token，并把 Coze 的异步对话流程封装成前端容易调用的接口。前端只需要提交一句话，后端负责创建对话、轮询状态、获取最终回复。

## `vite.config.js`

这是 Vite 配置文件。

主要逻辑：

| 配置 | 说明 |
| --- | --- |
| `plugins: [vue()]` | 启用 Vue 单文件组件支持 |
| `server.host = '0.0.0.0'` | 允许局域网访问 |
| `proxy['/api']` | 把前端 `/api` 请求转发到本地后端代理 |
| `target: 'http://127.0.0.1:3003'` | 代理目标地址 |
| `changeOrigin: true` | 修改请求来源，减少代理问题 |

注意：

当前 `server.js` 默认端口是 `3001`，但是 `vite.config.js` 代理目标是 `3003`。如果 `.env.server` 里设置了 `COZE_PROXY_PORT=3003`，则两者一致；如果没有设置，就需要统一端口。

答辩可以这样说：

> Vite 代理让前端可以直接请求 `/api/coze/chat`，开发环境下由 Vite 转发给本地 Node 服务。这样前端代码不需要写死完整后端地址。

## `src/styles.css`

这是全站样式文件，主要负责视觉风格和响应式布局。

主要内容：

| 类型 | 作用 |
| --- | --- |
| 全局变量 | 定义主题色、阴影、圆角、背景等 |
| 公共布局 | `.page`、`.content`、`.glass-card`、`.panel-scroll` |
| 导航和音乐 | 顶部导航、音乐播放器样式 |
| 页面布局 | 首页、记忆页、照片墙、留言页、AI 对话页的网格布局 |
| 交互样式 | 刮刮卡、拍立得翻面、弹幕、小游戏卡牌、弹窗 |
| 动画 | 入场动画、信封动画、弹幕滚动、卡牌翻转等 |
| 响应式 | 针对不同屏幕宽度和高度调整布局 |

答辩可以这样说：

> 样式文件里大量使用 CSS Grid、Flex、CSS 变量和动画来完成页面布局。比如照片墙的拍立得位置通过 CSS 变量控制，留言弹幕的速度和轨道也通过 CSS 变量传入。

## 主要数据流

### 文章数据流

1. `memorySite.js` 定义 `articles`。
2. 首页和记忆页导入 `articles`。
3. 页面通过 `computed` 根据分类、标签、关键词计算筛选结果。
4. 用户点击文章后，`selectedArticle` 或 `currentArticle` 更新。
5. 页面自动重新渲染文章图片、标题、摘要、正文。
6. 收藏结果写入 `localStorage`。

### 照片数据流

1. `memorySite.js` 定义 `photos`。
2. 照片墙页面导入 `photos`。
3. `photoTypes` 从照片数据中动态生成类型按钮。
4. `filteredPhotos` 根据类型筛选照片。
5. 用户点击、拖拽、翻面都会更新对应响应式状态。
6. 拖拽位置写入 `localStorage`。

### 留言数据流

1. 页面优先从 `localStorage` 读取 `messageLetters`。
2. 如果没有本地留言，就使用 `messageSeeds` 作为初始数据。
3. 用户提交留言后，新留言进入 `letters` 和 `driftingLetters`。
4. `filteredLetters` 控制下方列表显示。
5. `floatingMessages` 控制上方弹幕显示。
6. 每次提交和珍藏都会调用 `persist()` 保存。

### AI 对话数据流

1. 用户在 `TalkToMe.vue` 输入消息。
2. 前端把消息 POST 到 `/api/coze/chat`。
3. Vite 代理把请求转发给 `server.js`。
4. `server.js` 带 Token 请求 Coze API。
5. 后端等待 Coze 完成并获取回答。
6. 前端收到 `answer` 后更新聊天气泡。

## 项目亮点总结

| 亮点 | 说明 |
| --- | --- |
| 情绪化主题设计 | 页面围绕“来信、回忆、照片、粉色氛围”统一设计 |
| 组件复用 | 导航、音乐、章节入场、开场动画都是独立组件 |
| 数据集中管理 | 文章、照片、留言等内容统一放在 `memorySite.js` |
| 多种交互 | 刮刮卡、拖拽照片、拍立得翻面、弹幕、翻牌小游戏 |
| 本地持久化 | 收藏、留言、照片位置、游戏记录都能保存在浏览器 |
| AI 接入 | 通过 Node 代理安全接入 Coze 智能体 |
| 响应式布局 | 使用 CSS Grid/Flex 和媒体查询适配不同屏幕 |

## 答辩时可以重点讲的创新点

| 创新点 | 讲法 |
| --- | --- |
| 今日回忆签 | 不是普通卡片，而是用 Canvas 做刮刮卡，增强仪式感 |
| 拍立得照片墙 | 用户可以拖拽整理照片，翻面看到背后的文字 |
| 记忆翻牌小游戏 | 把照片数据复用成小游戏卡牌，让展示变成互动 |
| 漂流弹幕留言 | 新留言不仅进列表，还会以弹幕形式出现 |
| Coze 站内对话 | 用自己的聊天界面接入智能体，而不是跳转外部网页 |

## 老师可能问的问题和回答要点

### 项目基础类

| 问题 | 回答要点 |
| --- | --- |
| 你的项目主要实现了什么？ | 这是一个个人回忆展示网站，包含文章、照片、留言、音乐、视频和 AI 对话，强调情感化和交互式体验。 |
| 为什么选择 Vue？ | Vue 适合组件化开发，响应式数据和模板语法能快速实现交互页面。 |
| 为什么使用 Vite？ | Vite 启动快、热更新快、打包配置简单，适合 Vue 3 项目。 |
| 为什么用 Element Plus？ | 它提供成熟的输入框、按钮、弹窗等组件，可以减少基础 UI 的开发成本。 |
| 项目是单页应用吗？ | 是。它通过 Vue Router 在前端完成页面切换，不需要刷新整个页面。 |
| 为什么使用 Hash 路由？ | Hash 模式部署简单，静态服务器不需要配置 URL 重写。 |

### 组件设计类

| 问题 | 回答要点 |
| --- | --- |
| 你是怎么拆分组件的？ | 公共部分拆成 `NavBar`、`MusicPlayer`、`IntroGate`、`ChapterIntro`，页面部分放在 `views` 下。 |
| 为什么要有 `ChapterIntro`？ | 不同页面都需要统一的入场提示，用组件复用可以减少重复代码。 |
| `App.vue` 的作用是什么？ | 它是全站外壳，控制开场动画、导航、音乐和当前路由页面。 |
| 导航栏怎么实现页面跳转？ | 使用 Vue Router 的 `router-link`，点击后更新路由并渲染对应页面。 |
| 音乐为什么可以随页面变化？ | 路由里设置了 `meta.music`，音乐组件根据当前路由计算要播放的音频。 |

### 数据管理类

| 问题 | 回答要点 |
| --- | --- |
| 文章和照片数据存在哪里？ | 存在 `src/data/memorySite.js`，页面组件通过 import 引入。 |
| 为什么不直接写在页面里？ | 数据和展示分离，后期维护更方便，替换图片和文案不需要改页面结构。 |
| 收藏数据怎么保存？ | 使用浏览器 `localStorage` 保存收藏文章 ID。 |
| 留言数据怎么保存？ | 使用 `localStorage` 保存提交后的留言数组。 |
| 这样保存有什么缺点？ | 数据只存在当前浏览器，换设备或清理缓存会丢失。如果要多人共享，需要接入后端数据库。 |
| 为什么不用数据库？ | 本项目更偏前端展示和交互，localStorage 可以满足单机演示和答辩场景，后续可以扩展数据库。 |

### 首页交互类

| 问题 | 回答要点 |
| --- | --- |
| 首页封面怎么切换？ | 用 `bannerIndex` 记录当前封面，点击按钮后索引加一并取模循环。 |
| 文章搜索怎么实现？ | 通过 `computed` 根据关键词和分类过滤 `articles` 数组。 |
| 今日回忆签怎么实现？ | 用 Canvas 画遮罩，拖动时擦除遮罩，刮开一定比例后显示内容。 |
| 为什么要用 Canvas？ | Canvas 可以直接操作像素和透明度，适合做刮刮卡这种效果。 |
| 怎么判断刮开了多少？ | 使用 `getImageData` 读取像素透明度，统计透明像素比例。 |
| 手机上能刮吗？ | 使用 Pointer Events，理论上同时支持鼠标和触摸操作。 |

### 记忆文章页类

| 问题 | 回答要点 |
| --- | --- |
| 文章分类怎么实现？ | `activeCategory` 保存当前分类，`filteredArticles` 根据分类过滤文章。 |
| 标签筛选怎么实现？ | `activeTag` 保存当前标签，筛选时判断文章 tags 是否包含它。 |
| 时间线怎么生成？ | 把文章和部分照片转换成统一的节点对象，再按日期排序。 |
| 日期排序怎么做？ | 用正则解析年月日，再转换成时间戳比较。 |
| 为什么需要 `watch(filteredArticles)`？ | 当筛选条件变化时，确保当前文章仍然在筛选结果中，否则自动切换第一篇。 |
| 随机文章怎么实现？ | 从当前筛选结果中随机取一个，如果筛选结果为空就从全部文章中取。 |

### 照片墙类

| 问题 | 回答要点 |
| --- | --- |
| 照片类型按钮怎么来的？ | 用 `new Set` 从照片数据中提取所有类型，再加上“全部”。 |
| 主图怎么切换？ | `selectedPhoto` 保存当前照片，点击照片或路线节点时更新它。 |
| 自动轮播怎么实现？ | 使用 `setInterval` 每 5 秒调用 `movePhoto(1)`。 |
| 为什么弹窗打开时不轮播？ | 避免用户全屏查看或看视频时主图自动变化影响体验。 |
| 拍立得拖拽怎么实现？ | 记录指针起点和照片原始位置，移动时计算偏移并更新 CSS 变量。 |
| 拖拽后为什么刷新还在原位？ | 拖拽结束后把位置保存到 localStorage。 |
| 翻面效果怎么做？ | 点击照片切换 `flippedPhotoIds`，CSS 根据 `flipped` 类做 3D 翻转。 |
| 为什么用百分比保存位置？ | 百分比更适合响应式布局，容器变化时位置相对稳定。 |

### 小游戏类

| 问题 | 回答要点 |
| --- | --- |
| 记忆翻牌游戏怎么生成卡牌？ | 选取 6 张照片，每张复制两份，组成 12 张牌。 |
| 怎么判断两张牌是否一样？ | 每张卡有 `pairId`，两张卡的 `pairId` 相同就是匹配成功。 |
| 为什么要设置 `checkingPair`？ | 防止两张牌还没判断完时用户继续点击，导致状态混乱。 |
| 计时怎么做？ | 第一次翻牌时启动 `setInterval`，每秒增加 `gameSeconds`。 |
| 最佳记录怎么保存？ | 游戏完成后比较步数和时间，如果更好就写入 localStorage。 |
| 为什么匹配失败要延迟翻回？ | 给用户短暂记忆时间，也让动画体验更自然。 |

### 留言页类

| 问题 | 回答要点 |
| --- | --- |
| 留言提交后发生什么？ | 创建新留言对象，加入留言列表和弹幕队列，然后保存到 localStorage。 |
| 为什么要求名字和内容不能为空？ | 避免生成无意义留言。 |
| 匿名怎么实现？ | 留言对象里有 `anonymous` 字段，展示时根据它决定显示真实昵称还是“一位访客”。 |
| 弹幕怎么实现？ | 根据留言数组渲染多个 span，再通过 CSS 动画从右向左移动。 |
| 弹幕为什么看起来分散？ | 每条弹幕的轨道、速度、延迟和起点都通过 `barrageStyle` 单独计算。 |
| 珍藏按钮怎么实现？ | 切换留言对象的 `saved` 字段，并重新保存到 localStorage。 |

### AI 对话类

| 问题 | 回答要点 |
| --- | --- |
| Coze 是怎么接入的？ | 前端请求本地 `/api/coze/chat`，后端代理再请求 Coze API。 |
| 为什么不直接嵌入 Coze 网页？ | 网页嵌入会带外部界面和历史记录，本项目希望使用自己的站内聊天 UI。 |
| 为什么需要后端代理？ | 保护 Token，避免前端暴露密钥，同时统一处理 Coze 异步流程。 |
| `userId` 有什么用？ | 给 Coze 区分用户，同时保存在 localStorage，保证同一浏览器用户稳定。 |
| 前端如何处理接口错误？ | 先读取原始文本，再尝试 JSON 解析；如果失败就显示错误提示。 |
| 为什么有 pending 消息？ | 请求期间先显示“正在发送”，让用户知道系统在响应，成功后替换成真实回答。 |
| Coze 为什么需要轮询？ | 创建聊天后结果不一定立刻生成，需要查询状态直到 `completed`。 |
| 如果 Coze 超时怎么办？ | 后端最多轮询 30 次，超时后返回错误给前端显示。 |

### 安全与部署类

| 问题 | 回答要点 |
| --- | --- |
| Token 放在哪里？ | 放在 `.env.server` 中，由 `server.js` 读取，前端不直接接触。 |
| `.env.server` 能提交到 Git 吗？ | 不建议提交，里面有敏感 Token，应加入 `.gitignore`。 |
| 前端怎么访问后端？ | 开发环境下通过 Vite 的 `/api` 代理访问。 |
| 如果部署上线怎么办？ | 需要把前端部署到静态服务，把 `server.js` 或同等接口部署到后端服务器，并配置环境变量。 |
| 当前项目的数据能多人共享吗？ | 不能，留言和收藏存在 localStorage。如果要多人共享，需要数据库和真实后端接口。 |
| 这个项目有什么安全风险？ | 主要是 Token 泄露风险，所以通过后端代理隔离；留言目前没有服务端审核，仅适合个人演示。 |

### 样式与体验类

| 问题 | 回答要点 |
| --- | --- |
| 页面整体风格是什么？ | 粉色、玻璃质感、来信和回忆主题，强调温柔和仪式感。 |
| 为什么用大量圆角和阴影？ | 配合“信件、照片、回忆”的柔和主题，让页面不显得生硬。 |
| 滚动条为什么只放在组件内部？ | 避免某个组件内容过多把整页撑高，保持左右组件对齐。 |
| 响应式怎么做？ | 通过 CSS Grid/Flex 和媒体查询调整布局。 |
| 图片如何适配容器？ | 使用 `object-fit: cover`、固定比例和容器裁切，保证图片不溢出。 |
| 为什么有些组件使用弹窗？ | 图片、视频和小游戏都需要更大的沉浸区域，弹窗能避免破坏主页面布局。 |

### 代码质量类

| 问题 | 回答要点 |
| --- | --- |
| 你怎么减少重复代码？ | 抽离公共组件，数据集中管理，重复交互逻辑用函数封装。 |
| 你怎么处理组件卸载后的定时器？ | 在 `onBeforeUnmount` 中清除轮播和游戏计时器。 |
| 为什么使用 `computed`？ | 派生数据如筛选结果不需要手动维护，依赖变化后自动更新。 |
| 为什么使用 `ref` 和 `reactive`？ | 简单值和数组用 `ref`，表单对象用 `reactive` 更方便整体修改。 |
| 项目中哪里体现响应式思想？ | 分类、搜索、当前文章、留言列表、游戏状态变化后，模板会自动更新。 |
| 如果数据越来越多怎么办？ | 可以把数据从本地 JS 文件迁移到后端接口，再增加分页和懒加载。 |

### 项目不足与改进类

| 问题 | 回答要点 |
| --- | --- |
| 这个项目还有什么不足？ | 数据主要存在本地，缺少真实数据库；图片较多时可以继续优化加载性能。 |
| 如果继续完善，你会做什么？ | 增加后端数据库、用户登录、留言审核、图片懒加载、移动端细节优化。 |
| AI 对话还能怎么优化？ | 支持流式输出、上下文管理、更多错误提示、对话历史保存。 |
| 照片墙还能怎么优化？ | 增加重置布局、相册分组、拖拽排序保存到后端。 |
| 留言页还能怎么优化？ | 增加敏感词过滤、服务端存储、点赞和回复功能。 |

## 答辩演示顺序建议

1. 先打开首页，介绍项目主题和整体风格。
2. 展示首页封面切换、快捷入口和今日回忆签刮刮卡。
3. 进入记忆页，展示分类筛选、标签筛选、时间线和文章详情。
4. 进入照片墙，展示照片筛选、主图切换、拍立得拖拽和翻面。
5. 打开小游戏，演示记忆翻牌的基本规则。
6. 打开视频弹窗，展示视频记忆盒。
7. 进入留言页，提交一条留言，看它进入列表和弹幕。
8. 进入 AI 对话页，发送一句话，说明 Coze 通过后端代理接入。
9. 最后打开代码，重点讲 `memorySite.js`、`Home.vue`、`LightGallery.vue`、`TalkToMe.vue`、`server.js`。

## 可以直接背的总结

> 我的项目是一个基于 Vue 3 的个人回忆网站，整体围绕“过往来信”这个主题展开。它不是单纯的信息展示，而是加入了很多交互设计，比如首页的 Canvas 刮刮卡、照片墙的拍立得拖拽和翻面、照片记忆翻牌小游戏、留言弹幕以及 Coze AI 对话。项目中我把公共 UI 抽成组件，把文章和照片数据集中放在 `memorySite.js`，页面内部主要通过 `ref`、`reactive`、`computed` 和 `watch` 管理状态。AI 对话部分没有直接暴露 Token，而是通过 `server.js` 做后端代理，前端只调用本地接口。整体上，这个项目体现了组件化、响应式数据管理、本地持久化、Canvas 交互、拖拽交互和第三方 AI 接口接入。

