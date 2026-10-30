/**
 * 菜单分享码
 * 把菜单压成一段「SF1 + base64url」的短码，可以直接发链接，也可以只发短码。
 * 没有后端，导入时完全在本地解析。
 */
const PREFIX = 'SF1'
const MAX_ITEMS = 12
const MIN_ITEMS = 2

function toBase64Url(bytes) {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(text) {
  const normalized = text.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 ? '='.repeat(4 - (normalized.length % 4)) : ''
  const binary = atob(normalized + padding)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function shortFor(name) {
  return name.length > 6 ? name.slice(0, 6) : name
}

export function encodeMenu(foods) {
  const list = (Array.isArray(foods) ? foods : [])
    .slice(0, MAX_ITEMS)
    .map((item) => [String(item.name || '').slice(0, 10), String(item.emoji || '🍽️')])
  const bytes = new TextEncoder().encode(JSON.stringify({ v: 1, m: list }))
  return PREFIX + toBase64Url(bytes)
}

export function decodeMenu(input) {
  const raw = String(input || '').trim()
  if (!raw) return null

  const start = raw.indexOf(PREFIX)
  if (start < 0) return null

  const body = raw
    .slice(start + PREFIX.length)
    .split(/[&#?\s"'<>]/)[0]
    .trim()
  if (!body) return null

  let parsed
  try {
    const text = new TextDecoder().decode(fromBase64Url(body))
    parsed = JSON.parse(text)
  } catch (e) {
    return null
  }
  if (!parsed || !Array.isArray(parsed.m)) return null

  const seen = new Set()
  const list = []
  for (const entry of parsed.m) {
    if (!Array.isArray(entry)) continue
    const name = String(entry[0] || '').trim().slice(0, 10)
    if (!name || seen.has(name)) continue
    seen.add(name)
    const emoji = String(entry[1] || '🍽️').slice(0, 8) || '🍽️'
    list.push({ id: makeId(), name, short: shortFor(name), emoji })
    if (list.length >= MAX_ITEMS) break
  }

  if (list.length < MIN_ITEMS) return null
  return list
}

export function buildShareLink(code) {
  const base =
    typeof location !== 'undefined' ? location.origin + location.pathname : ''
  return `${base}#m=${code}`
}
