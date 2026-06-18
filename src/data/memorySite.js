import articleCover1 from '../assets/images/article-cover-1.jpg'
import articleCover2 from '../assets/images/article-cover-2.jpg'
import articleCover3 from '../assets/images/article-cover-3.jpg'
import articleCover4 from '../assets/images/article-cover-4.jpg'
import articleCover5 from '../assets/images/article-cover-5.jpg'
import articleCover6 from '../assets/images/article-cover-6.jpg'
import authorAvatar from '../assets/images/author-avatar.jpg'
import gallery1 from '../assets/images/gallery1.jpg'
import gallery2 from '../assets/images/gallery2.jpg'
import gallery3 from '../assets/images/gallery3.jpg'
import gallery4 from '../assets/images/gallery4.jpg'
import gallery5 from '../assets/images/gallery5.jpg'
import heroCover1 from '../assets/images/hero-cover-1.jpg'
import heroCover2 from '../assets/images/hero-cover-2.jpg'
import heroCover3 from '../assets/images/hero-cover-3.jpg'
import memory1 from '../assets/images/memory1.jpg'
import memory2 from '../assets/images/memory2.jpg'
import memory3 from '../assets/images/memory3.jpg'
import memory4 from '../assets/images/memory4.jpg'
import memory5 from '../assets/images/memory5.jpg'
import memory6 from '../assets/images/memory6.jpg'
import photoWall1 from '../assets/images/photo-wall-1.jpg'
import photoWall2 from '../assets/images/photo-wall-2.jpg'
import photoWall3 from '../assets/images/photo-wall-3.jpg'
import photoWall4 from '../assets/images/photo-wall-4.jpg'
import photoWall5 from '../assets/images/photo-wall-5.jpg'
import photoWall6 from '../assets/images/photo-wall-6.jpg'
import photoWall7 from '../assets/images/photo-wall-7.jpg'
import photoWall8 from '../assets/images/photo-wall-8.jpg'
import photoWall9 from '../assets/images/photo-wall-9.jpg'

export const authorProfile = {
  name: '过往来信',
  subtitle: 'A pink memory weblog',
  avatar: authorAvatar,
  intro: '欢迎你来到我的世界！无论如何，都要用力地感受世界，请相信，上天自有安排',
  signature: '愿每一张照片背后的普通日子，都能被认真看见。',
  stats: [
    { label: '回忆文章', value: 6 },
    { label: '照片收藏', value: 20 },
    { label: '心动留言', value: 18 }
  ]
}

export const categories = ['全部', '成长札记', '旧日相册', '情绪手帐', '生活碎片']

export const articleTags = ['记录', '成长', '照片', '勇气', '温柔', '朋友', '未来']

export const heroBanners = [
  {
    title: '这次，崭新的开端',
    subtitle: 'CERTIFICATES / TICKETS / MEMORY',
    text: '我终于走进了新的世界，青春正好，风华正茂',
    cover: heroCover3,
    route: '/memory'
  },
  {
    title: '友谊将一切照亮',
    subtitle: 'SUNLIGHT / HANDS / AFTERNOON',
    text: '朋友们一起举起手指，对着刺眼的光比出小小的形状，像在给青春盖一个会发亮的章。',
    cover: heroCover2,
    route: '/gallery'
  },
  {
    title: '红歌会，青春群像',
    subtitle: 'FIELD / STAGE / BRAVERY',
    text: '是我，是我们，是青春，是美好，是一切',
    cover: heroCover1,
    route: '/memory'
  }
]

export const articles = [
  {
    id: 1,
    title: '靠近镜头时，也靠近了真实的自己',
    category: '情绪手帐',
    date: '2026.04.12',
    read: '4 min read',
    cover: articleCover1,
    tags: ['记录', '温柔', '成长'],
    excerpt: '一张近到能看清眼神的自拍，记录的是不再急着躲开的自己。',
    body: [
      '这张照片没有复杂的背景，只剩下脸、眼睛和轻轻点在脸颊上的手指。它像一封很安静的自我介绍，告诉后来的人：那天的我正在认真看向镜头。',
      '以前总觉得自拍一定要找到最完美的角度，可这张照片更像是一个停顿。头发有一点乱，表情也没有刻意摆得很完整，但正因为这样，它保留了真实的呼吸感。',
      '我喜欢它的原因，是它没有把情绪藏起来。它像在说，普通的一天、普通的脸、普通的心情，也值得被放进回忆文章里。'
    ]
  },
  {
    id: 2,
    title: '两个胜利手势，给今天加一点可爱',
    category: '生活碎片',
    date: '2025.10.10',
    read: '5 min read',
    cover: articleCover2,
    tags: ['照片', '朋友', '记录'],
    excerpt: '戴着眼镜比出双手剪刀，像把校园日常轻轻贴上了一个快乐标签。',
    body: [
      '镜头里的双手比着 V，眼镜后面的表情认真又有一点俏皮。它不是盛大的纪念照，却很像下课后突然被喊住时留下的瞬间。',
      '有些照片可贵的地方就在这里：没有提前排练，没有宏大的背景，只是想把此刻的好心情留下，于是就举起手、看向镜头、按下快门。',
      '后来再看这张照片，会想起那种不需要理由的开心。它像一句轻快的旁白：今天也请奖励自己一点点可爱。'
    ]
  },
  {
    id: 3,
    title: '元旦晚会的精彩亮相',
    category: '成长札记',
    date: '2025.12.28',
    read: '6 min read',
    cover: articleCover3,
    tags: ['勇气', '成长', '未来'],
    excerpt: '黑色上衣、红色外套和抬起的手臂，把自信定格成一格画面。',
    body: [
      '这张照片里有一种很直接的力量感。黑色和红色撞在一起，动作也没有收着，像是在对镜头说：我可以站出来，也可以被看见。',
      '练习的过程通常不浪漫，更多时候是重复、出汗、调整动作和继续来一次。但照片把这些辛苦压缩成了一个抬手的瞬间，让人想起所有不愿放弃的小坚持。',
      '它被放进“成长札记”，因为成长有时候不是变得温顺，而是终于敢把自己的棱角亮出来。'
    ]
  },
  {
    id: 4,
    title: '红旗掠过镜头，风也变得很热烈',
    category: '旧日相册',
    date: '2025.07.28',
    read: '4 min read',
    cover: articleCover4,
    tags: ['照片', '勇气', '记录'],
    excerpt: '墨镜、红旗和风里的碎发，让这张近景自拍多了一点电影感。',
    body: [
      '我欲于群山之巅俯视平庸的沟壑。旗帜在旁边晃动，墨镜把表情藏起一半，整张图像一帧被风吹乱的旅行片段。',
      '它的特别之处不在于摆拍，而在于画面有速度。背景在动，旗子在动，头发也在动，只有按下快门的那一刻被稳稳留下。',
      '这张照片像一段热烈的脚注：去过、看过、在人群和阳光里站过，所以那一天值得被记住。'
    ]
  },
  {
    id: 5,
    title: '耳机、墨镜和一束想象中的聚光灯',
    category: '情绪手帐',
    date: '2025.05.18',
    read: '5 min read',
    cover: articleCover5,
    tags: ['勇气','照片'],
    excerpt: '站在深色背景前张开手臂，像给自己开了一场小型演唱会。',
    body: [
      '这张照片很有舞台感。墨镜挡住眼神，耳机挂在脖子上，手臂向外伸展，像是音乐响起后刚好被灯光捕捉到的一秒。',
      '不是每个舞台都需要真的有观众。很多时候，只要愿意站在画面中央，愿意把姿态打开，那一小块空间就已经属于自己。',
      '它提醒我，生活里也可以有一些夸张的、闪亮的、自我奖励式的瞬间。那些瞬间不一定完美，但足够鲜活。'
    ]
  },
  {
    id: 6,
    title: '雪景前的笑容，把冬天照亮了一点',
    category: '生活碎片',
    date: '2025.12.12',
    read: '4 min read',
    cover: articleCover6,
    tags: ['温柔', '记录', '成长'],
    excerpt: '雪白背景和校服外套之间，藏着一个安静又明亮的冬日瞬间。',
    body: [
      '照片里的背景像一场被放大的雪。人站在前面，笑得很轻，黑色外套和白色雪景形成了干净的对比。',
      '冬天总会让很多声音变小，可这张照片没有冷下去。它把雪、光和笑容放在一起，让那天显得像一个很柔软的章节。',
      '我把它放在生活碎片里，因为它不是为了证明什么，只是在说：原来普通冬日也可以这样亮。'
    ]
  }
]

export const photos = [
  {
    id: 1,
    title: '舞蹈定格',
    type: '校园',
    place: '排练教室',
    date: '2025.03.29',
    src: gallery1,
    text: '站在教室前方摆出动作，像把课堂临时改造成了小舞台。'
  },
  {
    id: 2,
    title: '逆光里的树影自拍',
    type: '日常',
    place: '校园日常',
    date: '2025.03.18',
    src: gallery2,
    text: '阳光从手指缝里落下来，脸被逆光包住，整张照片带着午后散步的温度。'
  },
  {
    id: 3,
    title: '朋友合影',
    type: '朋友',
    place: '活动现场',
    date: '2026.04.13',
    src: gallery3,
    text: '一群人站在室内灯光下，有人拘谨有人放松，却都被同一个镜头收进了这段相遇。'
  },
  {
    id: 4,
    title: '发卡贴纸的夸张双人自拍',
    type: '朋友',
    place: '教学楼下',
    date: '2026.04.23',
    src: gallery4,
    text: '粉色发卡、圆框贴纸和故意放大的表情，让这张合照像一枚很会捣蛋的快乐徽章。'
  },
  {
    id: 5,
    title: '举起拳头的晴天小英雄',
    type: '日常',
    place: '街角广场',
    date: '2026.01.18',
    src: gallery5,
    text: '站在蓝天下举起拳头，贴纸遮住表情，却遮不住那种“今天我很有气势”的好玩劲。'
  },
  {
    id: 6,
    title: '横屏自拍里的随意一刻',
    type: '日常',
    place: '休息间隙',
    date: '2026.03.20',
    src: memory1,
    text: '镜头横过来，脸也跟着歪进画面里，像是无聊时突然按下快门留下的小插曲。'
  },
  {
    id: 7,
    title: '柳树和湖边的背影',
    type: '风景',
    place: '湖边栈道',
    date: '2024.07.31',
    src: memory2,
    text: '白色外套站在湖边，柳枝垂下来挡住一点天空，背影比正脸更适合讲那天的安静。'
  },
  {
    id: 8,
    title: '操场音乐节',
    type: '校园',
    place: '操场旁',
    date: '2026.05.20',
    src: memory3,
    text: '动感的舞蹈，青春正好，肆意美好'
  },
  {
    id: 9,
    title: '生日眼镜下的许愿表情',
    type: '日常',
    place: '生日房间',
    date: '2026.04.22',
    src: memory4,
    text: '带着生日装饰眼镜比出手势，背景里有彩带和灯光，像把愿望悄悄夹进了自拍里。'
  },
  {
    id: 10,
    title: '人工智能学院墙前',
    type: '校园',
    place: '学院门厅',
    date: '2026.05.29',
    src: memory5,
    text: '站在“人工智能与计算机学院”的字样前，像给自己的专业生活拍下一张正式又骄傲的签到照。'
  },
  {
    id: 11,
    title: '金色头发和大框眼镜',
    type: '日常',
    place: '室内窗边',
    date: '2025.12.18',
    src: memory6,
    text: '浅金色头发铺在脸侧，大框眼镜让目光显得更近，这是一张很适合慢慢看的安静近照。'
  },

  {
    id: 12,
    title: '天空下的手印展板',
    type: '校园',
    place: '校园草坪',
    date: '2024.06.22',
    src: photoWall1,
    text: '展板立在户外，手印、年份和云层一起出现，像把集体活动的热闹留在了风里。'
  },
  {
    id: 13,
    title: '帽檐下面的眨眼近景',
    type: '日常',
    place: '树荫下',
    date: '2024.09.21',
    src: photoWall2,
    text: '帽子压低了一点，镜头离得很近，鼓起的表情让这张自拍带着一点调皮的学生气。'
  },
  {
    id: 14,
    title: '圆框眼镜里的认真目光',
    type: '日常',
    place: '室内角落',
    date: '2024.09.21',
    src: photoWall3,
    text: '低头靠近镜头，圆框眼镜和明亮眼神占满画面，像一张突然闯进相册的可爱特写。'
  },
  {
    id: 15,
    title: '迷彩服里的军训合照',
    type: '朋友',
    place: '训练场',
    date: '2024.09.27',
    src: photoWall4,
    text: '大家穿着迷彩服挤在一起，表情贴纸挡住了疲惫，却挡不住军训结束后那种共同经历过的亲近。'
  },
  {
    id: 16,
    title: '猫耳滤镜的双人贴贴',
    type: '朋友',
    place: '室内灯下',
    date: '2024.08.29',
    src: photoWall5,
    text: '两个人靠得很近，黑色猫耳和大框眼镜滤镜把合照变得软乎乎，像一颗甜味很重的糖。'
  },
  {
    id: 17,
    title: '围成一圈看向天空',
    type: '朋友',
    place: '操场中央',
    date: '2024.10.29',
    src: photoWall6,
    text: '朋友们围成圆，从下往上看向镜头，天空被大家的笑脸分成一小块一小块的蓝。'
  },
  {
    id: 18,
    title: '小狗滤镜的双人合照',
    type: '朋友',
    place: '粉色房间',
    date: '2024.08.16',
    src: photoWall7,
    text: '小狗耳朵、眼镜和比耶手势同时出现，画面很满，也很像聊天记录里会被反复翻出来的一张。'
  },
  {
    id: 19,
    title: '灯光前的猫猫自拍',
    type: '日常',
    place: '活动后台',
    date: '2024.09.5',
    src: photoWall8,
    text: '猫须和爱心贴纸落在脸上，身后的灯光有点晕开，让自拍多了一层舞台边缘的闪亮感。'
  },
  {
    id: 20,
    title: '夜晚操场的大合影',
    type: '朋友',
    place: '体育场',
    date: '2024.09.05',
    src: photoWall9,
    text: '一大群人站在操场中央，灯光把队伍照亮，毕业季和活动结束后的不舍都被装进这一张里。'
  }
]

export const favoriteTools = [
  { name: '回忆文章', type: 'POST', route: '/memory' },
  { name: '相片', type: 'PHOTO', route: '/gallery' },
  { name: '来信信箱', type: 'MAIL', route: '/message' },
  { name: '与我对话', type: 'TALK', route: '/talk' },
  { name: '首页封面', type: 'HOME', route: '/' }
]

export const friends = [
  { name: '同桌的风', desc: '总能把普通日子讲成很好笑的故事。' },
  { name: '操场的灯', desc: '见过夜晚训练，也见过散场后的合照。' },
  { name: '湖边的柳', desc: '负责收藏安静、背影和一点点想念。' }
]

export const messageSeeds = [
  { id: 1, name: '路过的朋友', mood: '温柔', content: '每张照片都像有自己的小天气，希望你一直把这些瞬间好好存着。', saved: true },
  { id: 2, name: '操场晚风', mood: '鼓励', content: '你站在镜头中央的时候真的很亮，以后也要继续大胆一点。', saved: false },
  { id: 3, name: '同频的人', mood: '开心', content: '看到猫耳、生日眼镜和朋友合影，感觉整个相册都在笑。', saved: true },
  { id: 4, name: '旧日邮差', mood: '怀念', content: '学院墙、手印板、操场合照，这些普通地方以后都会变成很珍贵的坐标。', saved: false },
  { id: 5, name: '湖边树影', mood: '秘密', content: '背影那张最安静，但它好像藏了很多没说出口的话。', saved: false },
  { id: 6, name: '小小观众', mood: '鼓励', content: '练习服和舞台感照片都很有力量，请继续把锋利和可爱一起带着走。', saved: true },
  { id: 7, name: '粉色信纸', mood: '温柔', content: '愿你每次翻到这些照片，都能重新想起当时的光。', saved: false },
  { id: 8, name: '生日蜡烛', mood: '开心', content: '生日眼镜那张太可爱了，像愿望自己跑进了镜头。', saved: true },
  { id: 9, name: '树下同学', mood: '怀念', content: '军训合照和朋友圆圈照，有一种大家真的一起走过一段路的感觉。', saved: false },
  { id: 10, name: '未来的你', mood: '秘密', content: '如果某天累了，就回来看看这些照片，它们会替过去的你抱抱现在的你。', saved: false },
  { id: 11, name: '晴天剪影', mood: '开心', content: '阳光下举起手的照片很像青春在说“我来过”。', saved: true },
  { id: 12, name: '相册管理员', mood: '温柔', content: '请继续拍很多很多照片，不用完美，只要真实就很好。', saved: false }
]

export const poems = [
  '把票根夹进书页，把风声留给操场。',
  '照片替我们记住了来不及说完整的那一天。',
  '如果回忆有颜色，大概会是阳光落在手指上的粉金色。'
]
