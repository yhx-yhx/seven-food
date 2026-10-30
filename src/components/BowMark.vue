<template>
  <svg
    class="bow-mark"
    viewBox="0 0 76 70"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
    <linearGradient :id="gradientId" x1="16" y1="6" x2="60" y2="54" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFC7DD" />
      <stop offset="0.55" stop-color="#F5A5C6" />
      <stop offset="1" stop-color="#EE8DB6" />
    </linearGradient>
    <filter id="bowShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="5" stdDeviation="4.5" flood-color="#B96C94" flood-opacity="0.28" />
    </filter>
  </defs>
  <g filter="url(#bowShadow)">
    <path d="M36 28C22 12 5 10 6 22c1 13 18 14 30 6z" :fill="'url(#' + gradientId + ')'" stroke="#E37FA8" stroke-width="1.6" stroke-linejoin="round" />
    <path d="M40 28c14-16 31-18 30-6-1 13-18 14-30 6z" :fill="'url(#' + gradientId + ')'" stroke="#E37FA8" stroke-width="1.6" stroke-linejoin="round" />
    <circle cx="38" cy="29" r="8" fill="#FFD9E8" stroke="#E37FA8" stroke-width="1.6" />
    <path d="M33.5 35.5l-7.5 18 7-2.8 2.6 7 4.6-20.6z" :fill="'url(#' + gradientId + ')'" stroke="#E37FA8" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M42.5 35.5l7.5 18-7-2.8-2.6 7-4.6-20.6z" :fill="'url(#' + gradientId + ')'" stroke="#E37FA8" stroke-width="1.5" stroke-linejoin="round" />
    <circle cx="38" cy="29" r="3" fill="#FFF1F7" opacity="0.8" />
  </g>
  </svg>
</template>

<script>
let bowSeed = 0

export default {
  name: 'BowMark',
  data() {
    return {
      gradientId: `bow-gradient-${++bowSeed}`
    }
  }
}
</script>

<style scoped>
.bow-mark {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
