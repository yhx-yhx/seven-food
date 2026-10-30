<template>
  <div class="page">
    <div class="grain"></div>

    <!-- 背景里的 Hello Kitty 水印 -->
    <div class="bg-kitty bg-kitty-a" aria-hidden="true"><HelloKitty /></div>
    <div class="bg-kitty bg-kitty-b" aria-hidden="true"><HelloKitty /></div>
    <div class="bg-bow" aria-hidden="true"><BowMark /></div>

    <div class="page-inner">
      <!-- 顶部 -->
      <div class="topbar">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true">
            <div class="brand-kitty"><HelloKitty /></div>
          </div>
          <div class="brand-text">
            <span class="eyebrow">Sweet Choice</span>
            <h1 class="title">今天吃什么</h1>
          </div>
        </div>
        <div class="icon-btn" role="button" tabindex="0" aria-label="编辑菜单" @click="openEditor" @keydown.enter="openEditor">
          <svg class="icon-edit" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
              d="M4.9 19.1l1.1-4.1L16.7 4.3a2.35 2.35 0 0 1 3.3 3.3L9.3 18.3 4.9 19.1z"
              stroke="#8A6296"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
            <path d="M15 6.2l3.1 3.1" stroke="#8A6296" stroke-width="1.6" stroke-linecap="round" />
            <path d="M4.9 19.1l1.1-4.1 3 3-4.1 1.1z" fill="#EB9AB9" />
          </svg>
        </div>
      </div>
      <div
        class="lede-row"
        role="button"
        tabindex="0"
        aria-label="编辑今日提示"
        @click="openPromptEditor"
        @keydown.enter="openPromptEditor"
      >
        <Transition name="prompt-fade" mode="out-in">
          <span :key="promptText" class="lede-text">{{ promptText }} <span class="lede-heart">♡</span></span>
        </Transition>
        <span class="lede-edit" aria-hidden="true">
          <svg class="lede-pencil" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 19l1-4L16.7 4.3a2.3 2.3 0 0 1 3.3 3.3L9 18l-4 1z" stroke="#A57AB4" stroke-width="1.8" stroke-linejoin="round" />
            <path d="M15 6l3 3" stroke="#A57AB4" stroke-width="1.8" stroke-linecap="round" />
            <path d="M5 19l1-4 3 3-4 1z" fill="#EB9AB9" />
          </svg>
        </span>
      </div>

      <!-- 转盘 -->
      <div class="wheel-section">
        <div class="meta-pill">
          <span class="spark">✦</span>
          <span>今日宜</span>
          <div class="sep"></div>
          <span class="pill-strong">大吃一顿</span>
        </div>

        <div
          class="wheel-stage"
          :style="{ width: wheelSize + 'px', height: wheelSize + 'px' }"
        >
          <div class="halo"></div>
          <div class="wheel-shell">
            <div
              class="plate"
              :class="{ 'no-anim': noAnim, 'is-spinning': spinning }"
              :style="{ transform: 'rotate(' + rotation + 'deg)', background: plateBackground }"
            >
              <div class="gloss"></div>
              <span
                v-for="(item, index) in foods"
                :key="'label-' + item.id"
                class="label"
                :class="{ 'is-picked': pickedIndex === index }"
                :style="labelStyles[index]"
              >
                {{ item.short || item.name }}
              </span>
            </div>

            <div
              v-for="(pearl, index) in pearls"
              :key="'pearl-' + index"
              class="pearl"
              :style="{ left: pearl.x + '%', top: pearl.y + '%' }"
            ></div>

            <div class="hub" role="button" tabindex="0" aria-label="转动转盘，随机选一个" @click="spin" @keydown.enter="spin">
              <div class="hub-inner">
                <div class="kitty-wrap" aria-hidden="true"><HelloKitty /></div>
                <span class="go">转一转</span>
              </div>
            </div>
          </div>

          <div class="pointer" aria-hidden="true">
            <svg
              class="heart-pin"
              viewBox="0 0 64 60"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="heartPinGradient" x1="8" y1="6" x2="56" y2="54" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E8B4F2" />
                  <stop offset="0.55" stop-color="#EDA5D4" />
                  <stop offset="1" stop-color="#F08DB8" />
                </linearGradient>
              </defs>
              <path
                d="M32 55C26.5 49.8 5 37 5 21.5 5 12.5 11.5 6 20.5 6c4.8 0 9 2.7 11.5 6.7C34.5 8.7 38.7 6 43.5 6 52.5 6 59 12.5 59 21.5 59 37 37.5 49.8 32 55Z"
                fill="url(#heartPinGradient)"
                stroke="#FFFFFF"
                stroke-width="1.6"
                stroke-linejoin="round"
              />
              <path
                d="M19 14c1.8-2.8 5.2-4 8.2-3.2"
                stroke="#FFFFFF"
                stroke-width="2.2"
                stroke-linecap="round"
                opacity="0.62"
                fill="none"
              />
            </svg>
          </div>
        </div>

        <div class="spin-link" role="button" tabindex="0" aria-label="随机抽一个" @click="spin" @keydown.enter="spin">
          <span class="spin-spark">✦</span>
          <span class="spin-text">随机抽一个</span>
          <div class="spin-dot"></div>
          <span class="spin-count">{{ foods.length }} 选 1</span>
        </div>
      </div>

      <!-- 今晚菜单 -->
      <div class="menu-card">
        <div class="menu-head">
          <div class="menu-title">
            <span class="star">✦</span>
            <span>今天的菜单</span>
            <span class="menu-count">{{ foods.length }} 道</span>
          </div>
          <div class="menu-edit" role="button" tabindex="0" @click="openEditor" @keydown.enter="openEditor">
            <span>调整菜单</span>
            <span class="chev">›</span>
          </div>
        </div>
        <div class="menu-grid">
          <div v-for="item in foods" :key="'menu-' + item.id" class="menu-item">
            <span class="menu-emoji">{{ item.emoji }}</span>
            <span class="menu-name">{{ item.short || item.name }}</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <span class="footer-quote">今天也要好好吃饭 <span class="footer-heart">♡</span></span>
        <span class="signature">MADE WITH ♡ FOR INDECISIVE FOODIES</span>
      </div>
    </div>

    <!-- 自定义菜单 -->
    <div
      class="mask"
      :class="{ show: editorOpen }"
      @click="closeEditor"
    >
      <div class="sheet editor-sheet" role="dialog" aria-modal="true" aria-label="编辑菜单" @click.stop>
        <div class="grabber"></div>
        <div class="sheet-head">
          <div class="sheet-titles">
            <span class="sheet-eyebrow">My Menu</span>
            <span class="sheet-title">我的菜单</span>
            <span class="sheet-sub">留住喜欢的味道，最多 12 道</span>
          </div>
          <div class="sheet-head-actions">
            <span class="reset-link" role="button" tabindex="0" @click="requestReset" @keydown.enter="requestReset">恢复推荐</span>
            <div class="sheet-close" role="button" tabindex="0" aria-label="关闭" @click="closeEditor" @keydown.enter="closeEditor">✕</div>
          </div>
        </div>

        <div class="add-row">
          <div class="add-input-wrap">
            <span class="plus-icon">＋</span>
            <input
              enterkeyhint="done"
              autocomplete="off"
              v-model="draft"
              class="add-input"
              :maxlength="10"
              aria-label="添加想吃的食物"
              placeholder="想吃点什么？"
              @keydown.enter="addFood()"
            />
          </div>
          <button
            type="button"
            class="add-btn"
            :class="{ off: !canAdd }"
            :aria-disabled="!canAdd"
            aria-label="添加菜品"
            @click="addFood()"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div
          class="food-list"
          :style="{ height: listHeight + 'px' }"
        >
          <div v-for="(item, index) in foods" :key="'row-' + item.id" class="food-row">
            <div class="food-avatar"><span>{{ item.emoji }}</span></div>
            <span class="food-name">{{ item.name }}</span>
            <span class="food-num">{{ (index + 1 < 10 ? '0' : '') + (index + 1) }}</span>
            <div class="remove" role="button" tabindex="0" :aria-label="'删除 ' + item.name" @click.stop="removeFood(item.id)" @keydown.enter.stop="removeFood(item.id)">−</div>
          </div>
        </div>

        <div v-if="presetSuggestions.length" class="presets">
          <div class="presets-label">
            <span>灵感补给</span>
          </div>
          <div class="preset-wrap">
            <div
              v-for="preset in presetSuggestions"
              :key="'preset-' + preset.name"
              class="preset"
              role="button"
              tabindex="0"
              @click="addPreset(preset)"
              @keydown.enter="addPreset(preset)"
            >
              <span>{{ preset.emoji }} {{ preset.name }}</span>
              <span class="preset-plus">+</span>
            </div>
          </div>
        </div>

        <div class="sheet-foot">
          <div class="foot-left">
            <span class="count">已收录 <span class="count-strong">{{ foods.length }}</span> / 12</span>
          </div>
          <div class="done-btn" role="button" tabindex="0" @click="closeEditor" @keydown.enter="closeEditor">完成</div>
        </div>
      </div>
    </div>

    <!-- 今日提示设置 -->
    <div
      class="mask"
      :class="{ show: promptOpen }"
      @click="closePrompt"
    >
      <div class="sheet prompt-sheet" :style="{ bottom: promptKeyboardOffset + 'px' }" role="dialog" aria-modal="true" aria-label="编辑今日提示" @click.stop>
        <div class="grabber"></div>
        <div class="sheet-head">
          <div class="sheet-titles">
            <span class="sheet-eyebrow">Today's Note</span>
            <span class="sheet-title">今日提示</span>
            <span class="sheet-sub">写一句今天想看到的文字</span>
          </div>
          <div class="sheet-close" role="button" tabindex="0" aria-label="关闭" @click="closePrompt" @keydown.enter="closePrompt">✕</div>
        </div>

        <div class="prompt-preview">
          <span class="prompt-quote">“</span>
          <Transition name="prompt-fade" mode="out-in">
            <span :key="promptDraft" class="prompt-preview-text">{{ promptDraft || '想对自己说点什么？' }}</span>
          </Transition>
          <span class="prompt-preview-heart">♡</span>
        </div>

        <div class="prompt-modes" role="tablist" aria-label="提示文字模式">
          <button
            type="button"
            class="prompt-mode-btn"
            :class="{ active: promptDraftMode === 'random' }"
            @click="choosePromptMode('random')"
          >随机一句</button>
          <button
            type="button"
            class="prompt-mode-btn"
            :class="{ active: promptDraftMode === 'custom' }"
            @click="choosePromptMode('custom')"
          >自定义</button>
        </div>

        <div v-if="promptDraftMode === 'random'" class="prompt-random-row">
          <button type="button" class="shuffle-btn" @click="shufflePrompt">
            <span class="shuffle-spark">✦</span> 换一句
          </button>
          <span class="prompt-tip">打开或抽取后会换一句</span>
        </div>

        <div v-else class="prompt-custom">
          <input
            v-model="promptDraft"
            class="prompt-input"
            :maxlength="24"
            enterkeyhint="done"
            autocomplete="off"
            placeholder="写一句今天想看到的话"
            aria-label="自定义提示文字"
            @keydown.enter="savePrompt"
          />
          <span class="prompt-count">{{ promptDraft.length }} / 24</span>
        </div>

        <div class="prompt-actions">
          <button type="button" class="btn ghost" @click="closePrompt">取消</button>
          <button type="button" class="btn solid" @click="savePrompt">保存</button>
        </div>
      </div>
    </div>

    <!-- 抽取结果 -->
    <div
      class="mask result-mask"
      :class="{ show: showResult }"
      @click="dismissResult"
    >
      <div class="result-sheet" role="dialog" aria-modal="true" aria-label="抽取结果" @click.stop>
        <div class="result-kitty" aria-hidden="true"><HelloKitty /></div>
        <div class="grabber"></div>
        <div class="result-top">
          <span class="spark">✦</span>
          <span class="result-eyebrow">Tonight's Pick</span>
          <span class="spark">✦</span>
        </div>
        <div class="result-ring">
          <span class="result-emoji">{{ resultFood ? resultFood.emoji : '🍽️' }}</span>
        </div>
        <span class="result-name" :class="{ long: resultName.length > 6 }">{{ resultName }}</span>
        <span class="result-line">命中注定的一餐，不许反悔 ♡</span>
        <div class="result-actions">
          <div class="btn ghost" role="button" tabindex="0" @click="spinAgain" @keydown.enter="spinAgain">再转一次</div>
          <div class="btn solid" role="button" tabindex="0" @click="acceptResult" @keydown.enter="acceptResult">好，就它了</div>
        </div>
        <span class="confetti c1">♥</span>
        <span class="confetti c2">✦</span>
        <span class="confetti c3">♥</span>
        <span class="confetti c4">✦</span>
      </div>
    </div>
    <!-- 恢复推荐确认 -->
    <div v-if="confirmOpen" class="confirm-mask" role="dialog" aria-modal="true" aria-labelledby="confirm-title" @click.self="cancelReset">
      <div class="confirm-card">
        <div class="confirm-icon">✦</div>
        <div id="confirm-title" class="confirm-title">恢复推荐菜单？</div>
        <div class="confirm-desc">当前菜单会被替换为十道推荐菜，<br />已添加的内容不会保留。</div>
        <div class="confirm-actions">
          <button type="button" class="btn ghost" @click="cancelReset">再想想</button>
          <button type="button" class="btn solid" @click="doReset">恢复推荐</button>
        </div>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="toastVisible" class="toast" role="status" aria-live="polite">{{ toastText }}</div>
    </Transition>

  </div></template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import HelloKitty from './components/HelloKitty.vue'
import BowMark from './components/BowMark.vue'

/* ------------------------------------------------------------------ */
/* 配置                                                               */
/* ------------------------------------------------------------------ */
const STORAGE_KEY = 'sevenfood.menu.v1'
const MAX_FOODS = 12
const MIN_FOODS = 2
const WHEEL_MAX = 330
const SPIN_MS = 4600

const PALETTE = [
  '#EEDFFA',
  '#FADDEB',
  '#F6E6F6',
  '#E5E1FC',
  '#FBE1F3',
  '#EDE5FB',
  '#F7DFF0',
  '#E4E3FC'
]

/* 十道默认菜：short 用于转盘，name 用于结果与菜单 */
const DEFAULT_FOODS = [
  { name: '斟什惠麻酱土豆粉', short: '麻酱土豆粉', emoji: '🥔' },
  { name: '夸爷拌粉', short: '夸爷拌粉', emoji: '🥢' },
  { name: '谢宝林烤肉', short: '谢宝林烤肉', emoji: '🍖' },
  { name: '刘老辈泡馍', short: '刘老辈泡馍', emoji: '🍲' },
  { name: '饸饹', short: '饸饹', emoji: '🍜' },
  { name: '彤彤麻辣烫', short: '彤彤麻辣烫', emoji: '🌶️' },
  { name: '必胜客', short: '必胜客', emoji: '🍕' },
  { name: '傣味米线', short: '傣味米线', emoji: '🍋' },
  { name: '新疆米粉', short: '新疆米粉', emoji: '🍜' },
  { name: '麻辣香锅', short: '麻辣香锅', emoji: '🌶️' },
  { name: '黄焖鸡', short: '黄焖鸡', emoji: '🍗' },
]

const PRESETS = [
  { name: '兰州拉面', emoji: '🍜' },
  { name: '黄焖鸡', emoji: '🍗' },
  { name: '酸菜鱼', emoji: '🐟' },
  { name: '螺蛳粉', emoji: '🍲' },
  { name: '麻辣香锅', emoji: '🌶️' },
  { name: '日料', emoji: '🍣' },
  { name: '烧烤', emoji: '🍢' },
  { name: '奶茶', emoji: '🧋' },
  { name: '饺子', emoji: '🥟' },
  { name: '冰淇淋', emoji: '🍦' }
]

const PROMPT_STORAGE_KEY = 'sevenfood.prompt.v1'
const PROMPT_POOL = [
  '别纠结啦，把选择交给一点点好运',
  '今天也要好好吃饭',
  '胃和心，总有一个要先被填满',
  '选择困难的时候，就让转盘替你决定',
  '想吃的太多，先选一个最想的',
  '认真吃饭，是今天最小也最确定的幸福',
  '让 Kitty 替你选，选到什么都算赚到',
  '慢慢来，先从一顿喜欢的饭开始',
  '把胃交给好运气，把快乐留给自己'
]

const EMOJI_MAP = [
  [/土豆粉|拌粉|米粉|米线|饸饹|粉/, '🍜'],
  [/麻辣烫|麻辣香锅|麻辣/, '🌶️'],
  [/烤肉|烧烤/, '🍖'],
  [/泡馍|馍|汤/, '🍲'],
  [/必胜客|披萨/, '🍕'],
  [/寿司|日料|刺身/, '🍣'],
  [/面/, '🍜'],
  [/饭/, '🍚'],
  [/汉堡/, '🍔'],
  [/沙拉|轻食/, '🥗'],
  [/甜品|蛋糕/, '🍰'],
  [/冰|淇淋/, '🍦'],
  [/奶茶|咖啡|饮/, '🧋'],
  [/饺|包/, '🥟'],
  [/鸡/, '🍗'],
  [/牛|排/, '🥩'],
  [/烤|串/, '🍢'],
  [/面包/, '🥐'],
  [/水果/, '🍓'],
  [/鱼/, '🐟']
]
const FALLBACK_EMOJI = ['🍽️', '😋', '🍴', '🥢', '🧁', '🍡', '🍩', '🥘']

/* ------------------------------------------------------------------ */
/* 工具                                                               */
/* ------------------------------------------------------------------ */
function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function cloneDefaults() {
  return DEFAULT_FOODS.map((item) => ({ ...item, id: makeId() }))
}

function shortFor(name) {
  const text = String(name || '').trim()
  return text.length > 6 ? text.slice(0, 6) : text
}

function emojiFor(name) {
  for (const [rule, emoji] of EMOJI_MAP) {
    if (rule.test(name)) return emoji
  }
  const total = Array.from(name).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return FALLBACK_EMOJI[total % FALLBACK_EMOJI.length]
}

function normalizeFood(item) {
  const name = String(item && item.name ? item.name : '').trim().slice(0, 10)
  if (!name) return null
  return {
    id: item.id || makeId(),
    name,
    short: item.short || shortFor(name),
    emoji: item.emoji || emojiFor(name)
  }
}

function loadFoods() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      if (Array.isArray(saved)) {
        const list = []
        const seen = new Set()
        saved.forEach((item) => {
          const food = normalizeFood(item)
          if (food && !seen.has(food.name)) {
            seen.add(food.name)
            list.push(food)
          }
        })
        if (list.length >= MIN_FOODS) return list.slice(0, MAX_FOODS)
      }
    }
  } catch (e) {
    /* 隐私模式或数据损坏时使用推荐菜单 */
  }
  return cloneDefaults()
}

function pickPrompt(exclude) {
  if (!PROMPT_POOL.length) return ''
  let next = PROMPT_POOL[randomInt(PROMPT_POOL.length)]
  let guard = 0
  while (next === exclude && guard < 8) {
    next = PROMPT_POOL[randomInt(PROMPT_POOL.length)]
    guard += 1
  }
  return next
}

function loadPrompt() {
  try {
    const raw = localStorage.getItem(PROMPT_STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data && data.mode === 'custom' && typeof data.custom === 'string' && data.custom.trim()) {
        return { mode: 'custom', text: data.custom.trim().slice(0, 24) }
      }
    }
  } catch (e) {
    /* 读取失败时使用随机提示 */
  }
  return { mode: 'random', text: pickPrompt() }
}

function vibrate(ms = 8) {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(ms)
    }
  } catch (e) {
    /* 部分浏览器不支持震动 */
  }
}

function randomInt(max) {
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const buffer = new Uint32Array(1)
      crypto.getRandomValues(buffer)
      return buffer[0] % max
    }
  } catch (e) {
    /* fallback */
  }
  return Math.floor(Math.random() * max)
}

function getWindowSize() {
  if (typeof window === 'undefined') return { width: 375, height: 812 }
  return { width: window.innerWidth, height: window.innerHeight }
}

/* ------------------------------------------------------------------ */
/* 状态                                                               */
/* ------------------------------------------------------------------ */
const initialSize = getWindowSize()
const initialPrompt = loadPrompt()
const windowWidth = ref(initialSize.width || 375)
const windowHeight = ref(initialSize.height || 812)
const foods = ref(loadFoods())
const draft = ref('')
const editorOpen = ref(false)
const showResult = ref(false)
const confirmOpen = ref(false)
const promptOpen = ref(false)
const spinning = ref(false)
const rotation = ref(0)
const noAnim = ref(false)
const pickedIndex = ref(-1)
const resultFood = ref(null)
const toastVisible = ref(false)
const toastText = ref('')
const promptMode = ref(initialPrompt.mode)
const promptText = ref(initialPrompt.text)
const promptDraftMode = ref(initialPrompt.mode)
const promptDraft = ref(initialPrompt.text)
const promptKeyboardOffset = ref(0)

let spinTimer = null
let applyTimer = null
let resetTimer = null
let againTimer = null
let toastTimer = null

const wheelSize = computed(() => {
  return Math.max(250, Math.min(Math.round(windowWidth.value * 0.86), WHEEL_MAX))
})

const listHeight = computed(() => {
  const available = Math.min(Math.max(Math.round(windowHeight.value * 0.34), 168), 300)
  const rows = Math.max(3, Math.floor(available / 50))
  return rows * 50
})

const canAdd = computed(() => {
  return draft.value.trim().length > 0 && foods.value.length < MAX_FOODS
})

const resultName = computed(() => (resultFood.value ? resultFood.value.name : ''))

const presetSuggestions = computed(() => {
  const names = new Set(foods.value.map((item) => item.name))
  return PRESETS.filter((item) => !names.has(item.name)).slice(0, 6)
})

const plateBackground = computed(() => {
  const count = foods.value.length || 1
  const step = 360 / count
  const stops = []
  foods.value.forEach((item, index) => {
    const start = Number((index * step).toFixed(3))
    const end = Number(((index + 1) * step).toFixed(3))
    const edge = Number((end - 0.85).toFixed(3))
    stops.push(`${PALETTE[index % PALETTE.length]} ${start}deg ${edge}deg`)
    stops.push(`rgba(255,255,255,.92) ${edge}deg ${end}deg`)
  })
  return `conic-gradient(from 0deg, ${stops.join(', ')})`
})

const labelStyles = computed(() => {
  const count = foods.value.length || 1
  const step = 360 / count
  const fontSize = count <= 8 ? 12 : count <= 10 ? 11 : 10
  const radius = 35.2
  const counterRotation = -rotation.value
  return foods.value.map((item, index) => {
    const mid = (index + 0.5) * step
    const rad = ((mid - 90) * Math.PI) / 180
    return {
      left: (50 + radius * Math.cos(rad)).toFixed(3) + '%',
      top: (50 + radius * Math.sin(rad)).toFixed(3) + '%',
      fontSize: fontSize + 'px',
      transform: `translate(-50%, -50%) rotate(${counterRotation}deg)`
    }
  })
})

const pearls = Array.from({ length: 22 }, (_, index) => {
  const angle = (index / 22) * Math.PI * 2 - Math.PI / 2
  return {
    x: Number((50 + 47.6 * Math.cos(angle)).toFixed(3)),
    y: Number((50 + 47.6 * Math.sin(angle)).toFixed(3))
  }
})

/* ------------------------------------------------------------------ */
/* 交互                                                               */
/* ------------------------------------------------------------------ */
function showToast(message) {
  toastText.value = message
  toastVisible.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 1800)
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foods.value))
  } catch (e) {
    /* 忽略存储异常 */
  }
}

function clearTimers() {
  clearTimeout(spinTimer)
  clearTimeout(applyTimer)
  clearTimeout(resetTimer)
  clearTimeout(againTimer)
  spinTimer = null
  applyTimer = null
  resetTimer = null
  againTimer = null
}

function resetWheel() {
  clearTimers()
  spinning.value = false
  noAnim.value = true
  rotation.value = 0
  pickedIndex.value = -1
  resultFood.value = null
  showResult.value = false
  resetTimer = setTimeout(() => {
    noAnim.value = false
  }, 80)
}

function spin() {
  if (spinning.value || editorOpen.value || showResult.value || confirmOpen.value) return
  const count = foods.value.length
  if (count < MIN_FOODS) {
    showToast('至少需要两道美味哦')
    return
  }
  toastVisible.value = false

  let index = randomInt(count)
  if (count > 1 && index === pickedIndex.value) {
    index = (index + 1 + randomInt(count - 1)) % count
  }

  const step = 360 / count
  const center = (index + 0.5) * step
  const jitter = (Math.random() - 0.5) * step * 0.55
  const targetMod = ((-center + jitter) % 360 + 360) % 360
  const currentMod = ((rotation.value % 360) + 360) % 360
  const delta = ((targetMod - currentMod) % 360 + 360) % 360
  const turns = 5 + randomInt(2)
  const target = rotation.value + turns * 360 + delta

  spinning.value = true
  pickedIndex.value = -1
  noAnim.value = false
  vibrate(8)

  clearTimeout(applyTimer)
  clearTimeout(spinTimer)

  nextTick(() => {
    applyTimer = setTimeout(() => {
      rotation.value = target
    }, 40)
  })

  spinTimer = setTimeout(() => {
    spinning.value = false
    pickedIndex.value = index
    resultFood.value = foods.value[index]
    showResult.value = true
    if (promptMode.value === 'random') {
      promptText.value = pickPrompt(promptText.value)
    }
    vibrate(14)
  }, SPIN_MS + 180)
}

function dismissResult() {
  showResult.value = false
}

function acceptResult() {
  showResult.value = false
  showToast('好耶，开饭啦 ♡')
}

function spinAgain() {
  showResult.value = false
  clearTimeout(againTimer)
  againTimer = setTimeout(spin, 340)
}

function openEditor() {
  if (spinning.value) return
  toastVisible.value = false
  draft.value = ''
  editorOpen.value = true
}

function closeEditor() {
  editorOpen.value = false
}

function addFood(presetEmoji) {
  if (foods.value.length >= MAX_FOODS) {
    showToast('最多只能收录 12 道美味')
    return
  }
  const name = String(draft.value || '').trim()
  if (!name) {
    showToast('先写下想吃的味道')
    return
  }
  if (foods.value.some((item) => item.name === name)) {
    showToast('这道已经在菜单里啦')
    return
  }

  foods.value.push({
    id: makeId(),
    name,
    short: shortFor(name),
    emoji: presetEmoji || emojiFor(name)
  })
  draft.value = ''
  persist()
  resetWheel()
  showToast(`已加入「${name}」`)
}

function addPreset(preset) {
  draft.value = preset.name
  addFood(preset.emoji)
}

function removeFood(id) {
  if (foods.value.length <= MIN_FOODS) {
    showToast('至少保留两道美味')
    return
  }
  foods.value = foods.value.filter((item) => item.id !== id)
  persist()
  resetWheel()
}

function requestReset() {
  toastVisible.value = false
  confirmOpen.value = true
}

function cancelReset() {
  confirmOpen.value = false
}

function doReset() {
  foods.value = cloneDefaults()
  draft.value = ''
  persist()
  resetWheel()
  confirmOpen.value = false
  showToast('已恢复推荐菜单')
}

function openPromptEditor() {
  toastVisible.value = false
  promptDraftMode.value = promptMode.value
  promptDraft.value = promptText.value
  promptOpen.value = true
}

function closePrompt() {
  promptOpen.value = false
}

function choosePromptMode(mode) {
  if (mode === promptDraftMode.value) return
  promptDraftMode.value = mode
  if (mode === 'random' && !PROMPT_POOL.includes(promptDraft.value)) {
    promptDraft.value = pickPrompt(promptText.value)
  }
  if (mode === 'custom' && !promptDraft.value.trim()) {
    promptDraft.value = promptText.value
  }
}

function shufflePrompt() {
  promptDraft.value = pickPrompt(promptDraft.value)
}

function savePrompt() {
  const text = promptDraft.value.trim().slice(0, 24)
  if (!text) {
    showToast('写一句今天的提示吧')
    return
  }
  promptMode.value = promptDraftMode.value
  promptText.value = text
  try {
    localStorage.setItem(
      PROMPT_STORAGE_KEY,
      JSON.stringify({
        mode: promptMode.value,
        custom: promptMode.value === 'custom' ? text : ''
      })
    )
  } catch (e) {
    /* 忽略存储异常 */
  }
  promptOpen.value = false
  showToast(promptMode.value === 'random' ? '换了一句新提示 ♡' : '提示文字已更新 ♡')
}

function handleResize() {
  const size = getWindowSize()
  windowWidth.value = size.width
  windowHeight.value = size.height
  syncPromptKeyboard()
}

function syncPromptKeyboard() {
  if (typeof window === 'undefined' || !window.visualViewport) return
  if (!promptOpen.value) {
    promptKeyboardOffset.value = 0
    return
  }
  const viewport = window.visualViewport
  const offset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
  promptKeyboardOffset.value = offset > 80 ? offset : 0
}

watch(promptOpen, (open) => {
  if (!open) promptKeyboardOffset.value = 0
})

watch([editorOpen, showResult, confirmOpen, promptOpen], (values) => {
  const locked = values.some(Boolean)
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('overlay-open', locked)
  document.body.classList.toggle('overlay-open', locked)
})

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('orientationchange', handleResize, { passive: true })
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', syncPromptKeyboard, { passive: true })
    window.visualViewport.addEventListener('scroll', syncPromptKeyboard, { passive: true })
  }
})

onBeforeUnmount(() => {
  clearTimers()
  clearTimeout(toastTimer)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('orientationchange', handleResize)
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', syncPromptKeyboard)
    window.visualViewport.removeEventListener('scroll', syncPromptKeyboard)
  }
  document.documentElement.classList.remove('overlay-open')
  document.body.classList.remove('overlay-open')
})
</script>

<style scoped>
/* ------------------------------------------------------------------ */
/* 页面与背景                                                         */
/* ------------------------------------------------------------------ */
.page {
  --ink: #573a58;
  --ink-soft: #8f6f95;
  --lav: #b98ad4;
  --rose: #b26791;
  position: relative;
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  background:
    radial-gradient(420px 330px at 84% 2%, rgba(249, 213, 235, 0.62), rgba(249, 213, 235, 0) 66%),
    radial-gradient(480px 430px at 4% 46%, rgba(226, 208, 250, 0.9), rgba(226, 208, 250, 0) 70%),
    linear-gradient(168deg, #faf5fe 0%, #f9f0fb 42%, #f5edfc 72%, #fcf5fb 100%);
}
.bg-kitty {
  position: absolute;
  z-index: 0;
  pointer-events: none;
}
.bg-kitty .hello-kitty {
  width: 100%;
  height: 100%;
}
.bg-kitty-a {
  width: 230px;
  height: 230px;
  top: 88px;
  right: -96px;
  opacity: 0.075;
  transform: rotate(12deg);
}
.bg-kitty-b {
  width: 270px;
  height: 270px;
  bottom: -56px;
  left: -92px;
  opacity: 0.065;
  transform: rotate(-10deg);
}
.bg-bow {
  position: absolute;
  z-index: 0;
  width: 112px;
  height: 102px;
  right: -30px;
  bottom: 104px;
  opacity: 0.12;
  transform: rotate(16deg);
  pointer-events: none;
}
.grain {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  opacity: 0.32;
  background-image: radial-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 1.2px);
  background-size: 7px 7px;
  -webkit-mask-image: radial-gradient(500px 500px at 50% 30%, #000, transparent 72%);
  mask-image: radial-gradient(500px 500px at 50% 30%, #000, transparent 72%);
  pointer-events: none;
}
.page-inner {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  min-height: 100dvh;
  padding-top: calc(var(--status-bar-height, 0px) + 14px);
  padding-top: calc(max(var(--status-bar-height, 0px), env(safe-area-inset-top, 0px)) + 14px);
  padding-right: 24px;
  padding-left: 24px;
  padding-bottom: calc(14px + constant(safe-area-inset-bottom, 0px));
  padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
}

/* ------------------------------------------------------------------ */
/* 顶部                                                               */
/* ------------------------------------------------------------------ */
.topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-mark {
  width: 48px;
  height: 48px;
  border-radius: 17px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.95), rgba(252, 238, 249, 0.72));
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 24px rgba(160, 112, 183, 0.16), inset 0 0 0 1px rgba(240, 219, 244, 0.6);
}
.brand-kitty {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-text {
  display: flex;
  flex-direction: column;
}
.eyebrow {
  font-size: 9px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 2.6px;
  color: #b083c4;
  text-transform: uppercase;
  margin-bottom: 3px;
}
.title {
  margin: 0;
  font-size: 26px;
  line-height: 1.15;
  letter-spacing: 0.4px;
  font-weight: 750;
  color: #4f3253;
}
.icon-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(253, 241, 249, 0.72));
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 22px rgba(150, 105, 174, 0.14), inset 0 0 0 1px rgba(243, 225, 247, 0.55);
}
.icon-edit {
  width: 19px;
  height: 19px;
  display: block;
}
.lede-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 10px;
  margin-left: 60px;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  outline: none;
}
.lede-text {
  flex: 0 1 auto;
  max-width: calc(100% - 28px);
  display: block;
  font-size: 12.5px;
  line-height: 1.65;
  letter-spacing: 0.3px;
  color: var(--ink-soft);
}
.lede-edit {
  width: 20px;
  height: 20px;
  margin-top: 1px;
  flex: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 3px 8px rgba(150, 105, 174, 0.08);
  opacity: 0.8;
}
.lede-pencil {
  width: 11px;
  height: 11px;
  display: block;
}
.lede-row:active .lede-edit {
  transform: scale(0.9);
}
.lede-row:active .lede-text {
  opacity: 0.7;
}
.lede-heart {
  color: #d190b2;
  font-size: 11px;
}

/* ------------------------------------------------------------------ */
/* 转盘                                                               */
/* ------------------------------------------------------------------ */
.wheel-section {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.meta-pill {
  display: flex;
  align-items: center;
  gap: 7px;
  height: 31px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.92);
  box-shadow: 0 6px 18px rgba(151, 108, 173, 0.1);
  font-size: 10.5px;
  letter-spacing: 0.6px;
  color: #916c9a;
}
.meta-pill .spark {
  font-size: 11px;
  color: #d68fb5;
}
.meta-pill .sep {
  width: 1px;
  height: 10px;
  background: rgba(160, 120, 180, 0.25);
}
.meta-pill .pill-strong {
  font-size: 11.5px;
  color: #7c5290;
  font-weight: 750;
}
.wheel-stage {
  position: relative;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.halo {
  position: absolute;
  top: -34px;
  right: -34px;
  bottom: -34px;
  left: -34px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 50% 48%,
    rgba(255, 255, 255, 0.92) 0%,
    rgba(248, 231, 251, 0.55) 42%,
    rgba(248, 231, 251, 0) 70%
  );
  filter: blur(6px);
  pointer-events: none;
}
.wheel-shell {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  padding: 11px;
  background: linear-gradient(150deg, #ffffff 0%, #f7e9fb 28%, #e8d0f4 52%, #fff6fb 78%, #f2dff7 100%);
  box-shadow:
    0 26px 50px rgba(128, 80, 151, 0.22),
    0 8px 18px rgba(139, 91, 160, 0.12),
    inset 0 2px 4px rgba(255, 255, 255, 0.95),
    inset 0 -2px 5px rgba(174, 124, 197, 0.2);
}
.wheel-shell::after {
  content: '';
  position: absolute;
  top: 5px;
  right: 5px;
  bottom: 5px;
  left: 5px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.7);
  pointer-events: none;
}
.plate {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #f2e5fa 0%, #fbe6f1 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.9), inset 0 0 34px rgba(139, 92, 164, 0.14);
  transition: transform 4.6s cubic-bezier(0.12, 0.68, 0.12, 1);
  will-change: transform;
}
.plate.no-anim {
  transition: none !important;
}
.plate.no-anim .label {
  transition: none !important;
}
.plate.is-spinning .label {
  filter: blur(1.6px);
  opacity: 0.5;
}
.gloss {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 50%;
  z-index: 3;
  pointer-events: none;
  background:
    radial-gradient(circle at 50% 26%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 46%),
    radial-gradient(circle at 50% 108%, rgba(196, 142, 220, 0.14), rgba(196, 142, 220, 0) 52%);
}
.label {
  position: absolute;
  z-index: 2;
  display: block;
  transform: translate(-50%, -50%);
  transform-origin: 50% 50%;
  max-width: 68px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 650;
  line-height: 1.2;
  letter-spacing: 0.1px;
  color: #5f3d5c;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
  pointer-events: none;
  will-change: transform;
  transition:
    transform 4.6s cubic-bezier(0.12, 0.68, 0.12, 1),
    filter 0.4s ease,
    opacity 0.4s ease;
}
.label.is-picked {
  color: #a8437a;
  font-weight: 750;
}
.pearl {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, #fff 0%, #fff 42%, #f3e2f9 70%, #e4c8f1 100%);
  box-shadow: 0 1px 2px rgba(140, 90, 165, 0.2);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.hub {
  position: absolute;
  z-index: 6;
  left: 50%;
  top: 50%;
  width: 30.5%;
  height: 30.5%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  padding: 5px;
  background: linear-gradient(135deg, #f7cfe2 0%, #d9bcf0 100%);
  background: conic-gradient(from 205deg, #f7cfe2, #d9bcf0, #fbe0ee, #f7cfe2);
  box-shadow:
    0 12px 26px rgba(135, 82, 160, 0.26),
    0 3px 7px rgba(135, 82, 160, 0.14),
    0 0 0 1px rgba(255, 255, 255, 0.55);
  transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.3, 1.4);
}
.hub-press {
  transform: translate(-50%, -50%) scale(0.93);
}
.hub-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 18%, #fffdfe 0%, #f9eaf7 52%, #f3dcef 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.95),
    inset 0 -6px 12px rgba(233, 195, 237, 0.28),
    0 1px 3px rgba(255, 255, 255, 0.9);
}
.kitty-wrap {
  width: 72%;
  height: 66%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.go {
  margin-top: 3px;
  font-size: 8.5px;
  line-height: 1;
  font-weight: 750;
  letter-spacing: 1.6px;
  color: #c06793;
  padding-left: 2px;
}
.pointer {
  position: absolute;
  z-index: 8;
  top: -8px;
  left: 50%;
  width: 32px;
  height: 31px;
  transform: translateX(-50%);
  pointer-events: none;
  filter: drop-shadow(0 5px 7px rgba(181, 108, 144, 0.26));
}
.heart-pin {
  display: block;
  width: 100%;
  height: 100%;
}
.spin-link {
  margin-top: 13px;
  height: 31px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 15px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 7px 18px rgba(150, 108, 171, 0.1);
  font-size: 10.5px;
  letter-spacing: 0.5px;
  color: #8d6697;
}
.spin-spark {
  color: #d895b6;
  font-size: 10px;
}
.spin-text {
  font-weight: 650;
}
.spin-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #d6b3dc;
}
.spin-count {
  color: #bb789a;
  font-size: 9.5px;
  letter-spacing: 0.2px;
}

/* ------------------------------------------------------------------ */
/* 菜单卡片                                                           */
/* ------------------------------------------------------------------ */
.menu-card {
  width: 100%;
  margin-top: 16px;
  padding: 13px 15px;
  border-radius: 22px;
  background: linear-gradient(158deg, rgba(255, 255, 255, 0.72), rgba(255, 248, 253, 0.52));
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 14px 32px rgba(140, 96, 163, 0.09), inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}
.menu-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.menu-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #9a76a5;
}
.menu-title .star {
  color: #dc9cbd;
  font-size: 9px;
}
.menu-count {
  font-weight: 500;
  color: #bda3c5;
  letter-spacing: 0.2px;
}
.menu-edit {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: #b26791;
}
.chev {
  font-size: 13px;
  line-height: 1;
  transform: translateY(-1px);
}
.menu-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 7px;
  margin-top: 11px;
}
.menu-item {
  height: 54px;
  min-width: 0;
  padding: 4px 3px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: rgba(248, 238, 252, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 6px rgba(148, 106, 168, 0.04);
}
.menu-item:nth-child(4n + 2) {
  background: rgba(252, 239, 246, 0.85);
}
.menu-item:nth-child(4n + 3) {
  background: rgba(243, 237, 253, 0.85);
}
.menu-item:nth-child(4n + 4) {
  background: rgba(250, 241, 250, 0.85);
}
.menu-emoji {
  font-size: 16px;
  line-height: 1;
}
.menu-name {
  max-width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-all;
  text-align: center;
  font-size: 9.5px;
  line-height: 1.25;
  color: #70506d;
}
.footer {
  margin-top: auto;
  padding: 18px 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  text-align: center;
}
.footer-quote {
  font-size: 11px;
  letter-spacing: 1px;
  color: #a283ac;
}
.footer-heart {
  color: #e19ab9;
  font-size: 10px;
}
.signature {
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 2.4px;
  color: #b99ec3;
}

/* ------------------------------------------------------------------ */
/* 遮罩与面板                                                         */
/* ------------------------------------------------------------------ */
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  background: rgba(77, 47, 79, 0.26);
  -webkit-backdrop-filter: blur(8px) saturate(115%);
  backdrop-filter: blur(8px) saturate(115%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.32s ease;
}
.mask.show {
  opacity: 1;
  pointer-events: auto;
}
.sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 480px;
  margin: 0 auto;
  padding: 10px 24px calc(20px + constant(safe-area-inset-bottom, 0px));
  padding: 10px 24px calc(20px + env(safe-area-inset-bottom, 0px));
  border-radius: 34px 34px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.9);
  background: linear-gradient(180deg, #fffbfe 0%, #fbf1fa 100%);
  box-shadow: 0 -20px 50px rgba(96, 56, 109, 0.16);
  transform: translateY(103%);
  transition: transform 0.46s cubic-bezier(0.16, 0.9, 0.22, 1);
}
.mask.show .sheet {
  transform: translateY(0);
}
.grabber {
  width: 38px;
  height: 4px;
  border-radius: 3px;
  background: #e5cde9;
  margin: 0 auto 16px;
  flex: none;
}
.sheet-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex: none;
}
.sheet-titles {
  display: flex;
  flex-direction: column;
}
.sheet-eyebrow {
  margin-bottom: 3px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 2.2px;
  color: #b083c4;
  text-transform: uppercase;
}
.sheet-title {
  font-size: 20px;
  font-weight: 750;
  letter-spacing: 0.3px;
  color: #513352;
}
.sheet-sub {
  margin-top: 4px;
  font-size: 11px;
  letter-spacing: 0.3px;
  color: #a183a9;
}
.sheet-head-actions {
  flex: none;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 4px;
}
.sheet-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6ebf9;
  color: #a278ae;
  font-size: 14px;
  line-height: 1;
}
.food-list {
  margin-top: 16px;
  flex: none;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding-right: 2px;
  scrollbar-width: none;
}
.food-list::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.food-row {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(166, 127, 186, 0.11);
}
.food-row:last-child {
  border-bottom: 0;
}
.food-avatar {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  background: linear-gradient(145deg, #fff, #f8ecfb);
  box-shadow: inset 0 0 0 1px rgba(235, 214, 242, 0.8), 0 3px 8px rgba(147, 101, 168, 0.06);
}
.food-name {
  flex: 1;
  font-size: 13.5px;
  font-weight: 600;
  color: #5e3c5d;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.food-num {
  margin-right: 2px;
  font-size: 8.5px;
  letter-spacing: 0.8px;
  color: #c1a8c9;
}
.remove {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  line-height: 1;
  color: #c789a4;
  background: #fbedf3;
  box-shadow: inset 0 0 0 1px rgba(240, 202, 220, 0.55);
}
.add-row {
  display: flex;
  gap: 9px;
  margin-top: 14px;
  flex: none;
}
.add-input-wrap {
  flex: 1;
  height: 46px;
  padding: 0 14px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f0fb;
  box-shadow: inset 0 0 0 1px rgba(224, 200, 235, 0.7);
}
.plus-icon {
  flex: none;
  font-size: 15px;
  color: #b38dc1;
}
.add-input {
  flex: 1;
  height: 100%;
  border: 0;
  background: transparent;
  outline: none;
  font-size: 16px;
  color: #5e3c5d;
}
.add-btn {
  flex: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #c79ae2 0%, #ee9dc0 100%);
  box-shadow: 0 8px 16px rgba(202, 133, 181, 0.28), inset 0 0 0 1px rgba(255, 255, 255, 0.28);
}
.add-btn svg {
  width: 18px;
  height: 18px;
  display: block;
}
.add-btn.off {
  opacity: 0.4;
  box-shadow: none;
}
.presets {
  flex: none;
  margin-top: 14px;
}
.presets-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.8px;
  color: #b28ac0;
}
.reset-link {
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: #b58fc0;
  text-decoration: underline;
  text-decoration-color: rgba(181, 143, 192, 0.5);
  text-underline-offset: 2px;
}
.preset-wrap {
  display: flex;
  flex-wrap: nowrap;
  gap: 7px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  margin: 0 -24px;
  padding: 2px 24px 4px;
  scrollbar-width: none;
}
.preset-wrap::-webkit-scrollbar {
  height: 0;
}
.preset {
  flex: none;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(229, 207, 238, 0.8);
  box-shadow: 0 4px 10px rgba(146, 101, 168, 0.06);
  font-size: 11px;
  color: #7b5685;
}
.preset-plus {
  color: #d08caf;
  font-size: 11px;
  margin-left: 1px;
}
.sheet-foot {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid rgba(166, 126, 186, 0.12);
}
.foot-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.count {
  font-size: 10.5px;
  letter-spacing: 0.6px;
  color: #b193b9;
}
.count-strong {
  font-weight: 750;
  color: #8f629d;
}
.done-btn {
  min-width: 108px;
  height: 42px;
  padding: 0 26px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #fff;
  background: linear-gradient(135deg, #c493e0 0%, #ed97bc 100%);
  box-shadow: 0 10px 20px rgba(200, 130, 177, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

/* ------------------------------------------------------------------ */
/* 今日提示设置                                                       */
/* ------------------------------------------------------------------ */
.prompt-sheet {
  transition: transform 0.46s cubic-bezier(0.16, 0.9, 0.22, 1), bottom 0.25s ease;
}
.prompt-preview {
  position: relative;
  min-height: 96px;
  margin-top: 16px;
  padding: 24px 22px 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-align: center;
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.88), rgba(252, 240, 250, 0.7));
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 20px rgba(150, 106, 170, 0.07), inset 0 0 0 1px rgba(248, 232, 250, 0.55);
}
.prompt-quote {
  position: absolute;
  top: 6px;
  left: 16px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 30px;
  line-height: 1;
  color: #e5c7df;
  opacity: 0.8;
}
.prompt-preview-text {
  display: inline-block;
  max-width: 100%;
  font-size: 16px;
  line-height: 1.7;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #5e3c5d;
}
.prompt-preview-heart {
  font-size: 13px;
  color: #e19ab9;
  margin-left: 2px;
}
.prompt-modes {
  display: flex;
  gap: 4px;
  margin-top: 16px;
  padding: 4px;
  border-radius: 14px;
  background: #f6edfa;
}
.prompt-mode-btn {
  flex: 1;
  height: 36px;
  border-radius: 11px;
  font-size: 12px;
  letter-spacing: 0.3px;
  color: #9a7ba2;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}
.prompt-mode-btn.active {
  font-weight: 700;
  color: #7c5290;
  background: #fff;
  box-shadow: 0 4px 10px rgba(150, 105, 174, 0.1);
}
.prompt-random-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
}
.shuffle-btn {
  height: 38px;
  padding: 0 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.3px;
  color: #9a5f8d;
  background: linear-gradient(135deg, #f1d9fb 0%, #fbd9e8 100%);
  box-shadow: 0 6px 14px rgba(190, 140, 190, 0.16), inset 0 0 0 1px rgba(255, 255, 255, 0.55);
}
.shuffle-spark {
  font-size: 10px;
  color: #c27fa5;
}
.prompt-tip {
  font-size: 9.5px;
  letter-spacing: 0.3px;
  color: #b193b9;
}
.prompt-custom {
  position: relative;
  margin-top: 14px;
}
.prompt-input {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid rgba(224, 200, 235, 0.7);
  border-radius: 14px;
  outline: none;
  font-size: 16px;
  color: #5e3c5d;
  background: #f8f0fb;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.prompt-input:focus {
  border-color: rgba(214, 160, 222, 0.9);
  box-shadow: 0 0 0 3px rgba(229, 195, 241, 0.28);
}
.prompt-count {
  position: absolute;
  right: 14px;
  bottom: -16px;
  font-size: 9px;
  letter-spacing: 0.3px;
  color: #b193b9;
}
.prompt-actions {
  display: flex;
  gap: 9px;
  margin-top: 24px;
}
.prompt-actions .btn {
  height: 44px;
  border-radius: 14px;
  font-size: 12.5px;
  letter-spacing: 0.5px;
}
.prompt-fade-enter-active,
.prompt-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.prompt-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.prompt-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ------------------------------------------------------------------ */
/* 抽取结果                                                           */
/* ------------------------------------------------------------------ */
.result-sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 480px;
  margin: 0 auto;
  overflow: hidden;
  padding: 18px 24px calc(22px + constant(safe-area-inset-bottom, 0px));
  padding: 18px 24px calc(22px + env(safe-area-inset-bottom, 0px));
  border-radius: 36px 36px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.9);
  background:
    radial-gradient(300px 200px at 80% 0%, rgba(250, 214, 232, 0.7), transparent 70%),
    linear-gradient(180deg, #fffcfd 0%, #fbf1fa 100%);
  box-shadow: 0 -24px 60px rgba(96, 56, 109, 0.2);
  transform: translateY(105%);
  transition: transform 0.5s cubic-bezier(0.16, 0.9, 0.22, 1);
}
.mask.show .result-sheet {
  transform: translateY(0);
}
.result-sheet::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.4;
  pointer-events: none;
  background-image: radial-gradient(rgba(238, 196, 226, 0.55) 1px, transparent 1.4px);
  background-size: 34px 34px;
  -webkit-mask-image: linear-gradient(180deg, transparent, #000);
  mask-image: linear-gradient(180deg, transparent, #000);
}
.result-kitty {
  position: absolute;
  z-index: 0;
  top: 12px;
  right: 16px;
  width: 88px;
  height: 88px;
  opacity: 0.14;
  transform: rotate(10deg);
  pointer-events: none;
}
.result-top {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 2px;
}
.result-eyebrow {
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #cf83a6;
}
.result-top .spark {
  font-size: 10px;
  color: #dca0c1;
}
.result-ring {
  position: relative;
  z-index: 1;
  width: 92px;
  height: 92px;
  margin: 18px auto 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 30%, #fff 0%, #fff8fc 55%, #f9eaf6 100%);
  box-shadow:
    0 16px 30px rgba(173, 107, 153, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.95),
    inset 0 0 0 7px rgba(251, 235, 248, 0.9);
}
.result-ring::before {
  content: '';
  position: absolute;
  top: -8px;
  right: -8px;
  bottom: -8px;
  left: -8px;
  border-radius: 50%;
  border: 1px dashed rgba(233, 183, 216, 0.55);
  animation: slowspin 24s linear infinite;
}
.result-emoji {
  font-size: 42px;
  line-height: 1;
}
.result-name {
  position: relative;
  z-index: 1;
  display: block;
  text-align: center;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #4e3053;
}
.result-name.long {
  font-size: 26px;
  letter-spacing: 1px;
}
.result-line {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 9px;
  text-align: center;
  font-size: 11.5px;
  letter-spacing: 0.5px;
  color: #a17fa8;
}
.result-actions {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 10px;
  margin-top: 22px;
}
.btn {
  flex: 1;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
}
.btn.ghost {
  color: #9a6aa2;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: inset 0 0 0 1px rgba(215, 185, 228, 0.9), 0 6px 14px rgba(146, 101, 168, 0.07);
}
.btn.solid {
  color: #fff;
  background: linear-gradient(135deg, #c493e0 0%, #ed97bc 100%);
  box-shadow: 0 12px 24px rgba(198, 128, 175, 0.32), inset 0 0 0 1px rgba(255, 255, 255, 0.28);
}
.confetti {
  position: absolute;
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  font-size: 12px;
}
.mask.show .confetti {
  animation: floatUp 3.2s ease-in-out infinite;
}
.confetti.c1 {
  left: 16%;
  top: 42%;
  color: #e6a5c2;
  animation-delay: 0.2s;
}
.confetti.c2 {
  right: 16%;
  top: 38%;
  color: #b992d4;
  animation-delay: 1.1s;
}
.confetti.c3 {
  left: 25%;
  top: 24%;
  color: #d9a3cd;
  animation-delay: 1.8s;
  font-size: 9px;
}
.confetti.c4 {
  right: 24%;
  top: 26%;
  color: #efb7ce;
  animation-delay: 0.7s;
  font-size: 9px;
}

/* ------------------------------------------------------------------ */
/* 动效                                                               */
/* ------------------------------------------------------------------ */
@keyframes slowspin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes floatUp {
  0% {
    transform: translateY(8px) scale(0.9);
    opacity: 0;
  }
  25% {
    opacity: 0.9;
  }
  70% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-26px) scale(1.08);
    opacity: 0;
  }
}
/* 移动端点击手感 */
.icon-btn,
.hub,
.spin-link,
.menu-edit,
.preset,
.add-btn,
.done-btn,
.btn,
.sheet-close,
.remove,
.reset-link {
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
}
.icon-btn:active,
.spin-link:active,
.menu-edit:active,
.preset:active,
.add-btn:active,
.done-btn:active,
.btn:active,
.sheet-close:active,
.remove:active {
  transform: scale(0.95);
  opacity: 0.85;
}
.hub:active {
  transform: translate(-50%, -50%) scale(0.93);
}
.reset-link {
  display: inline-block;
}
.reset-link:active {
  opacity: 0.6;
}

/* 恢复推荐确认框 */
.confirm-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(77, 47, 79, 0.32);
  -webkit-backdrop-filter: blur(10px) saturate(115%);
  backdrop-filter: blur(10px) saturate(115%);
  animation: fadeIn 0.22s ease both;
}
.confirm-card {
  width: 84vw;
  max-width: 320px;
  padding: 24px 22px 20px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.95);
  background:
    radial-gradient(240px 160px at 85% 0%, rgba(250, 214, 232, 0.65), transparent 70%),
    linear-gradient(180deg, #fffcfd 0%, #fbf1fa 100%);
  box-shadow: 0 26px 60px rgba(96, 56, 109, 0.24);
  text-align: center;
  animation: popIn 0.3s cubic-bezier(0.16, 0.9, 0.3, 1) both;
}
.confirm-icon {
  width: 44px;
  height: 44px;
  margin: 0 auto 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b26791;
  font-size: 15px;
  background: linear-gradient(135deg, #f7d7e8 0%, #e5d2f7 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 6px 14px rgba(178, 122, 185, 0.16);
}
.confirm-title {
  font-size: 18px;
  font-weight: 750;
  letter-spacing: 0.5px;
  color: #513352;
}
.confirm-desc {
  margin-top: 8px;
  font-size: 11.5px;
  line-height: 1.7;
  letter-spacing: 0.2px;
  color: #a183a9;
}
.confirm-actions {
  display: flex;
  gap: 9px;
  margin-top: 20px;
}
.confirm-actions .btn {
  height: 44px;
  border-radius: 14px;
  font-size: 12.5px;
  letter-spacing: 0.5px;
}

/* 轻提示 */
.toast {
  position: fixed;
  z-index: 90;
  left: 50%;
  bottom: calc(96px + env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  padding: 9px 17px;
  border-radius: 999px;
  background: rgba(76, 48, 79, 0.88);
  color: #fff;
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0.2px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 8px 24px rgba(70, 40, 76, 0.18);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes popIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (min-width: 600px) {
  .page {
    box-shadow: 0 0 80px rgba(120, 80, 145, 0.14);
  }
  .page-inner {
    padding-top: 54px;
    padding-bottom: 30px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .plate,
  .label,
  .mask,
  .sheet,
  .result-sheet,
  .result-ring::before,
  .confetti,
  .confirm-mask,
  .confirm-card,
  .toast,
  .toast-enter-active,
  .toast-leave-active {
    transition: none !important;
    animation: none !important;
  }
}
</style>
