import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getSoundPref, setSoundPref, sfx } from './sound.js'

/* ============================================================
   Rootik — saytdagi yo‘riqchi robot (faqat kompyuter ekranida).
   AI emas: tayyor yo‘riqnoma va vaziyatga qarab qisqa maslahatlar.
   ============================================================ */

const W = 48
const H = 56

const store = {
  get(k) { try { return localStorage.getItem('portfolio-' + k) } catch { return null } },
  set(k, v) { try { localStorage.setItem('portfolio-' + k, v) } catch { /* ruxsat yo'q */ } },
}

export const getRobotPrefs = () => ({ hidden: store.get('robot') === 'off', quiet: store.get('robot-quiet') === '1' })

export function setRobotPref(key, val) {
  if (key === 'hidden') store.set('robot', val ? 'off' : 'on')
  else store.set('robot-quiet', val ? '1' : '0')
  window.dispatchEvent(new CustomEvent('robot-pref'))
}

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const rand = (a, b) => a + Math.random() * (b - a)
const mqDesktop = '(min-width: 900px)'
const mqReduce = '(prefers-reduced-motion: reduce)'
const mm = (q) => { try { return window.matchMedia(q).matches } catch { return false } }
const nowMs = () => performance.now()

function fmt(text) {
  return text.split('`').map((p, i) => (i % 2 ? <code key={i} className="rbt-c">{p}</code> : p))
}

/* ================== Yo‘riqnoma mavzulari ================== */
function buildTopics(projects) {
  const first = (projects[0] && projects[0].slug) || 'meetly'
  const names = projects.map((p) => p.name).join(', ') || 'loyihalar'
  return [
    { id: 'start', q: 'Bu yerda nima qilsa bo‘ladi?', a: 'Bu terminal ko‘rinishidagi portfolio: buyruq yozasiz, natija chiqadi. Boshlash uchun `help` deb yozing yoki quyidagi tugmani bosing.', acts: [{ label: 'help', cmd: 'help' }] },
    { id: 'cmds', q: 'Qanday buyruqlar bor?', a: 'Asosiylari: `ls` (fayllar), `cd <papka>` (kirish), `cd ..` (chiqish), `cat <fayl>` (o‘qish), `pwd`, `clear`, `history`. To‘liq ro‘yxat `help` da.', acts: [{ label: 'ls', cmd: 'ls' }, { label: 'help', cmd: 'help' }] },
    { id: 'about', q: 'Abdulbosit kim?', a: 'Qisqa tanishuv va texnologiyalar `about.md` faylida.', acts: [{ label: 'cat about.md', cmd: 'cat about.md' }] },
    { id: 'projects', q: 'Loyihalarni qanday ko‘raman?', a: 'Loyihalar: ' + names + '. Ro‘yxat uchun `cat projects.md`, bittasi uchun masalan `cat ' + first + '.md`.', acts: [{ label: 'cat projects.md', cmd: 'cat projects.md' }, { label: 'cat ' + first + '.md', cmd: 'cat ' + first + '.md' }] },
    { id: 'resume', q: 'Resume’ni qanday olaman?', a: 'Ko‘rish uchun `cat resume.md`. PDF variantini `cat resume.pdf` yangi oynada ochadi.', acts: [{ label: 'cat resume.md', cmd: 'cat resume.md' }, { label: 'PDF ochish', fn: 'pdf' }] },
    { id: 'mail', q: 'Xabar qanday yuboraman?', a: '`send-mail` deb yozing, ism, email va xabar matnini birma-bir so‘raydi. Bekor qilish uchun `exit` yozing.', acts: [{ label: 'send-mail', cmd: 'send-mail' }] },
    { id: 'contact', q: 'Qanday bog‘lanaman?', a: 'Barcha aloqa ma’lumotlari `contact.md` da: email, Telegram, GitHub va boshqalar.', acts: [{ label: 'cat contact.md', cmd: 'cat contact.md' }] },
    { id: 'keys', q: 'Qulay tugmalar bormi?', a: '`Tab` — nomni avtoto‘ldirish, `↑` `↓` — oldingi buyruqlar, `Ctrl+L` — ekranni tozalash, `Ctrl+C` — bekor qilish, `Ctrl+/` — buyruqlar menyusi.', acts: [{ label: 'Menyuni ochish', fn: 'palette' }] },
    { id: 'windows', q: 'Oynalar bilan qanday ishlayman?', a: 'Sarlavhadan sudrab ko‘chiring, chetlaridan o‘lchamini o‘zgartiring. Qizil tugma — yopish, sariq — kichraytirish, yashil — kattalashtirish. Yangi oyna: `new`.', acts: [{ label: 'new', cmd: 'new' }] },
    { id: 'look', q: 'Rang va effektlarni o‘zgartirsam bo‘ladimi?', a: 'Ha: `theme dracula`, `nord`, `gruvbox`, `tokyo`, `light`. Eski monitor effekti: `crt on`.', acts: [{ label: 'theme dracula', cmd: 'theme dracula' }, { label: 'crt on', cmd: 'crt on' }] },
    { id: 'fun', q: 'Qiziqarli buyruqlar?', a: '`git log` — GitHub’dagi oxirgi commit’lar, `fortune` — dasturchi hikmati, `cowsay salom`, `neofetch`.', acts: [{ label: 'git log', cmd: 'git log' }, { label: 'fortune', cmd: 'fortune' }] },
    { id: 'me', q: 'Sen kimsan?', a: 'Men Rootik, saytning yo‘riqchisiman. Meni sudrab ko‘chirishingiz mumkin. Jim turishim uchun pastdagi “Jim bo‘l”, butunlay yashirish uchun `robot off` ni bosing.', acts: [] },
  ]
}

/* ================== Robot rasmi (SVG) ================== */
function Sprite({ eyesRef, mode }) {
  const isSleep = mode === 'sleep'
  const isHappy = mode === 'hop' || mode === 'dance'
  const isSurprised = mode === 'drag' || mode === 'fall' || mode === 'peek' || mode === 'wakeup'
  const isScratch = mode === 'scratch'

  return (
    <svg className="rbt-svg" viewBox="0 0 48 56" width={W} height={H} aria-hidden="true" focusable="false">
      <g className="r-body">
        {/* Legs with cute boots */}
        <g className="r-legL">
          <rect className="r-limb" x="15" y="44.5" width="5.5" height="7" rx="2.5" />
          <path className="r-boot" d="M14 49.5 h5 l3.5 1.5 a1.5 1.5 0 0 1 1 1.4 v1.6 h-10.5 a1 1 0 0 1 -1 -1 v-2.5 a1 1 0 0 1 1 -1 z" />
        </g>
        <g className="r-legR">
          <rect className="r-limb" x="27.5" y="44.5" width="5.5" height="7" rx="2.5" />
          <path className="r-boot" d="M26.5 49.5 h5 l3.5 1.5 a1.5 1.5 0 0 1 1 1.4 v1.6 h-10.5 a1 1 0 0 1 -1 -1 v-2.5 a1 1 0 0 1 1 -1 z" />
        </g>

        {/* Neck */}
        <rect className="r-neck" x="21" y="29.5" width="6" height="3" rx="1" />

        {/* Torso */}
        <rect className="r-torso" x="11" y="31" width="26" height="16" rx="5" />
        <path className="r-mark" d="M17.5 36.5 l3.5 2.5 -3.5 2.5 M23.5 41.5 h4" />

        {/* Status LEDs on chest */}
        <g className="r-leds">
          <circle className="r-led r-led1" cx="16" cy="44" r="1.1" />
          <circle className="r-led r-led2" cx="19.5" cy="44" r="1.1" />
          <circle className="r-led r-led3" cx="23" cy="44" r="1.1" />
        </g>

        {/* Arms */}
        <g className="r-armL">
          <rect className="r-limb" x="3" y="32" width="5.5" height="11.5" rx="2.75" />
          <circle className="r-hand" cx="5.75" cy="42" r="1.8" />
        </g>
        <g className="r-armR">
          <rect className="r-limb" x="39.5" y="32" width="5.5" height="11.5" rx="2.75" />
          <circle className="r-hand" cx="42.25" cy="42" r="1.8" />
        </g>

        {/* Head & Face */}
        <g className="r-head-grp">
          {/* Antenna */}
          <g className="r-ant">
            <rect className="r-ant-base" x="22" y="8.5" width="4" height="2" rx="1" />
            <line x1="24" y1="2.5" x2="24" y2="9.5" />
            <circle className="r-tip-ring" cx="24" cy="2.5" r="4.2" />
            <circle className="r-tip" cx="24" cy="2.5" r="2.5" />
          </g>
          <rect className="r-ear r-ear-l" x="4.5" y="16.5" width="3.5" height="9" rx="1.75" />
          <rect className="r-ear r-ear-r" x="40" y="16.5" width="3.5" height="9" rx="1.75" />
          <rect className="r-head" x="7" y="10" width="34" height="21" rx="7" />
          <rect className="r-screen" x="11" y="13.5" width="26" height="14" rx="5" />
          <path className="r-screen-sheen" d="M13 15 L18 15 L14 26 L12 26 Z" />
          {isSleep ? (
            <g className="r-eyes-sleep">
              <path d="M15.5 21.5 h5.5" />
              <path d="M27 21.5 h5.5" />
            </g>
          ) : isHappy ? (
            <g className="r-eyes-happy">
              <path d="M15.5 22.5 q2.75 -4.5 5.5 0" />
              <path d="M27 22.5 q2.75 -4.5 5.5 0" />
            </g>
          ) : isScratch ? (
            <g className="r-eyes-scratch" ref={eyesRef}>
              <circle cx="18" cy="20.5" r="4.2" className="r-eye" />
              <circle className="r-glint" cx="19" cy="19.5" r="1.3" />
              <path d="M26.5 21.5 h6.5" />
            </g>
          ) : isSurprised ? (
            <g className="r-eyes-wide" ref={eyesRef}>
              <circle cx="18" cy="20.5" r="4.2" className="r-eye" />
              <circle cx="29.5" cy="20.5" r="4.2" className="r-eye" />
              <circle className="r-glint" cx="19" cy="19.5" r="1.3" />
              <circle className="r-glint" cx="30.5" cy="19.5" r="1.3" />
            </g>
          ) : (
            <g className="r-eyes" ref={eyesRef}>
              <rect className="r-eye r-eye-l" x="15.5" y="17" width="5.5" height="7" rx="2.75" />
              <rect className="r-eye r-eye-r" x="27" y="17" width="5.5" height="7" rx="2.75" />
              <circle className="r-glint" cx="19" cy="18.5" r="0.9" />
              <circle className="r-glint" cx="30.5" cy="18.5" r="0.9" />
            </g>
          )}
        </g>
      </g>
    </svg>
  )
}

/* ================== Asosiy komponent ================== */
export function Robot({ projects = [], onRun, onOpenPdf, onOpenPalette, apiRef }) {
  const [desktop, setDesktop] = useState(() => mm(mqDesktop))
  const [prefs, setPrefs] = useState(getRobotPrefs)
  const [bubble, setBubble] = useState(null)
  const [guide, setGuide] = useState(null)
  const [currentMode, setCurrentMode] = useState('idle')
  const [soundOn, setSoundOn] = useState(getSoundPref)
  const topics = useMemo(() => buildTopics(projects), [projects])

  const elRef = useRef(null)
  const btnRef = useRef(null)
  const eyesRef = useRef(null)
  const S = useRef({ mode: 'idle', x: 160, y: 0, vx: 0, vy: 0, dir: 1, t: 2, platform: null, relX: 0, goal: null, tx: 0, speed: 44, cw: null, side: 'r', dragged: false })
  const eng = useRef(null)
  const ptr = useRef({ x: 0, y: 0 })
  const gaze = useRef({ x: 0, y: 0, mode: 'cursor', nextSwitch: 0, lastPtrMove: nowMs(), lastPtrPos: { x: 0, y: 0 } })
  const keyAt = useRef(-1e9)
  const lastAct = useRef(nowMs())
  const drag = useRef(null)
  const hoverRef = useRef(false)
  const followRef = useRef(false)
  const reduced = useRef(mm(mqReduce))
  const guideRef = useRef(false)
  const prefsRef = useRef(prefs)
  const speech = useRef({ last: -1e9, count: 0, shown: new Set(), quietUntil: 0, timer: null })
  const tips = useRef({ cmds: 0, kinds: new Set(), usedTheme: false })
  guideRef.current = !!guide
  prefsRef.current = prefs

  /* ---- gapirish ---- */
  const sayRef = useRef(null)
  sayRef.current = (id, text, acts = [], force = false) => {
    const sp = speech.current
    const now = nowMs()
    if (prefsRef.current.hidden || guideRef.current) return false
    if (prefsRef.current.quiet || now < sp.quietUntil) return false

    if (!force) {
      if (sp.shown.has(id)) return false
      if (now - sp.last < 10000) return false
      if (now - keyAt.current < 2500) return false
      if (document.querySelector('.boot')) return false
      sp.shown.add(id)
    } else {
      if (now - sp.last < 1500) return false
    }

    sp.last = now
    sfx.chatter()
    setBubble({ id, text, acts, k: now })
    clearTimeout(sp.timer)
    sp.timer = setTimeout(() => { if (!hoverRef.current) setBubble(null) }, Math.min(10000, 4200 + text.length * 40))
    return true
  }

  /* ---- uyqudan uyg'onish ---- */
  const wakeUp = useCallback(() => {
    lastAct.current = nowMs()
    if (S.current.mode === 'sleep') {
      if (eng.current) {
        eng.current.setMode('wakeup')
        S.current.t = 0.7
      }
      sfx.wake()
      if (sayRef.current) sayRef.current('wake', 'Uyqudan turdim! Qayerda qolgan edik?', [], true)
      setTimeout(() => {
        if (eng.current && S.current.mode === 'wakeup') {
          eng.current.setMode('idle')
          S.current.t = rand(2, 4)
        }
      }, 700)
    }
  }, [])

  /* ---- sozlamalar va ekran turi ---- */
  useEffect(() => {
    const f = () => { setDesktop(mm(mqDesktop)); reduced.current = mm(mqReduce) }
    const p = () => setPrefs(getRobotPrefs())
    const s = () => setSoundOn(getSoundPref())
    window.addEventListener('resize', f)
    window.addEventListener('robot-pref', p)
    window.addEventListener('robot-sound-pref', s)
    return () => {
      window.removeEventListener('resize', f)
      window.removeEventListener('robot-pref', p)
      window.removeEventListener('robot-sound-pref', s)
    }
  }, [])

  /* ---- global tinglovchilar: klaviatura, sichqoncha, tashqariga bosish ---- */
  useEffect(() => {
    if (!desktop || prefs.hidden) return
    const onKey = (e) => {
      wakeUp()
      if (e.key === 'Escape') { setGuide(null); setBubble(null) }
      if (!['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) keyAt.current = nowMs()
    }
    const onMove = (e) => {
      const g = gaze.current
      const dist = Math.hypot(e.clientX - g.lastPtrPos.x, e.clientY - g.lastPtrPos.y)
      if (dist > 8) {
        g.lastPtrMove = nowMs()
        g.lastPtrPos = { x: e.clientX, y: e.clientY }
        if (Math.random() < 0.65) {
          g.mode = 'cursor'
          g.nextSwitch = nowMs() + rand(1800, 3200)
        }
      }
      ptr.current = { x: e.clientX, y: e.clientY }
      if (Math.hypot(e.movementX || 0, e.movementY || 0) > 4) wakeUp()
    }
    const onDown = (e) => {
      wakeUp()
      if (guideRef.current && !(e.target.closest && e.target.closest('.rbt'))) setGuide(null)
    }
    window.addEventListener('keydown', onKey, true)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [desktop, prefs.hidden, wakeUp])

  /* ---- harakat dvigateli ---- */
  useEffect(() => {
    if (!desktop || prefs.hidden) { eng.current = null; return }
    const el = elRef.current
    const btn = btnRef.current
    if (!el || !btn) return
    const s = S.current

    const ground = () => {
      const st = document.querySelector('.st')
      return st ? st.getBoundingClientRect().top : window.innerHeight - 30
    }
    const wins = () => Array.from(document.querySelectorAll('.win')).filter((w) => w.offsetWidth > 0 && w.offsetHeight > 0)
    const rectOf = (w) => w.getBoundingClientRect()
    const alive = (w) => !!w && w.isConnected && w.offsetWidth > 0

    const surfaceBelow = (x, y) => {
      let best = { y: ground(), win: null }
      for (const w of wins()) {
        const r = rectOf(w)
        if (x >= r.left + 8 && x <= r.right - 8 && r.top >= y - 1 && r.top < best.y) best = { y: r.top, win: w }
      }
      return best
    }

    const setMode = (m) => {
      if (s.mode !== m) {
        s.mode = m
        btn.dataset.mode = m
        setCurrentMode(m)
      }
    }

    const place = () => {
      el.style.transform = `translate3d(${Math.round(s.x - W / 2)}px,${Math.round(s.y - H)}px,0)`
      btn.style.setProperty('--dir', String(s.dir))
      el.classList.toggle('below', s.y - H < 190)
      el.classList.toggle('al-l', s.x < 170)
      el.classList.toggle('al-r', s.x > window.innerWidth - 170)
    }

    const arriveOnWin = (w, relX) => {
      s.platform = w; s.relX = relX; s.goal = null; s.vx = 0; s.vy = 0
      s.x = rectOf(w).left + relX
      setMode('idle'); s.t = rand(2.5, 5)
      sayRef.current('onwin', 'Bu yerdan terminal yaxshi ko‘rinadi. Meni ushlab boshqa joyga ko‘chirsangiz ham bo‘ladi.')
    }

    const land = (surf) => {
      s.y = surf.y; s.vx = 0; s.vy = 0; s.goal = null
      if (surf.win) {
        const r = rectOf(surf.win)
        s.platform = surf.win
        s.relX = clamp(s.x - r.left, 10, Math.max(10, r.width - 10))
      } else s.platform = null
      setMode('idle'); s.t = rand(1.5, 3)
      btn.dataset.land = '1'
      setTimeout(() => { btn.dataset.land = '0' }, 340)
      if (s.dragged) { s.dragged = false; sayRef.current('uf', 'Uf, yumshoq tushdim.', [], true) }
    }

    const startFall = (vx = 0, vy = 0) => { s.platform = null; s.goal = null; s.vx = vx; s.vy = vy; setMode('fall') }

    const walkTo = (tx) => { s.tx = tx; s.goal = null; setMode('walk') }

    const sideOk = (w) => {
      const r = rectOf(w)
      const L = r.left - 10 >= 24
      const R = r.right + 10 <= window.innerWidth - 24
      return L && R ? (Math.random() < 0.5 ? 'l' : 'r') : L ? 'l' : R ? 'r' : null
    }

    const decide = () => {
      const idleSec = (nowMs() - lastAct.current) / 1000
      if (idleSec > 25 && s.mode !== 'sleep') {
        setMode('sleep')
        s.t = 999999
        return
      }

      const roll = Math.random()
      if (!s.platform) {
        const cands = wins().filter((w) => { const r = rectOf(w); return r.top > 90 && ground() - r.top > 70 && sideOk(w) })
        if (roll < 0.35 || !cands.length) walkTo(rand(30, window.innerWidth - 80))
        else if (roll < 0.58) {
          const w = cands[Math.floor(Math.random() * cands.length)]
          s.goal = { type: 'climb', w, side: sideOk(w) }
          setMode('walk')
        } else if (roll < 0.72) {
          setMode('sit')
          s.t = rand(4, 8)
        } else if (roll < 0.82) {
          setMode('scratch')
          s.t = rand(1.6, 2.2)
          sfx.confused()
        } else if (roll < 0.92) {
          setMode('hop')
          s.t = rand(1.2, 1.8)
          sfx.hop()
        } else {
          setMode('dance')
          s.t = rand(2.2, 3.6)
          sfx.dance()
        }
        return
      }
      const r = rectOf(s.platform)
      const okL = r.left - 10 >= 24
      const okR = r.right + 10 <= window.innerWidth - 24
      if (roll < 0.28) {
        s.tx = rand(14, Math.max(15, r.width - 14))
        s.goal = null
        setMode('walk')
      } else if (roll < 0.42 || (!okL && !okR)) {
        setMode('sit')
        s.t = rand(5, 10)
      } else if (roll < 0.54) {
        const left = okL && (!okR || s.relX < r.width / 2)
        s.dir = left ? -1 : 1
        s.relX = left ? 10 : r.width - 10
        s.x = r.left + s.relX
        setMode('peek')
        s.t = rand(2.2, 3.5)
      } else if (roll < 0.64) {
        setMode('knock')
        s.t = 1.4
        sfx.knock()
      } else if (roll < 0.76) {
        setMode('hop')
        s.t = rand(1.2, 1.8)
        sfx.hop()
      } else if (roll < 0.86) {
        setMode('dance')
        s.t = rand(2.2, 3.4)
        sfx.dance()
      } else {
        const left = okL && (!okR || s.relX < r.width / 2)
        s.tx = left ? 10 : r.width - 10
        s.goal = { type: roll < 0.92 ? 'down' : 'jump', side: left ? 'l' : 'r' }
        setMode('walk')
      }
    }

    const arrivedWalk = () => {
      const g = s.goal
      if (!g) { setMode('idle'); s.t = rand(1.5, 4); return }
      if (g.type === 'climb') { s.cw = g.w; s.side = g.side; setMode('climb'); return }
      if (g.type === 'down') {
        const w = s.platform
        const r = rectOf(w)
        s.x = g.side === 'l' ? r.left - 10 : r.right + 10
        s.y = r.top; s.cw = w; s.side = g.side; s.platform = null; s.goal = null
        setMode('climbdown'); return
      }
      s.platform = null; s.goal = null
      s.vx = (g.side === 'l' ? -1 : 1) * 55; s.vy = -140
      setMode('fall')
    }

    let frame = 0

    const step = (dt, now) => {
      frame += 1

      if (eyesRef.current) {
        const g = gaze.current
        const dir = s.dir || 1

        if (now >= g.nextSwitch) {
          const idlePtrSec = (now - g.lastPtrMove) / 1000
          const roll = Math.random()

          if (guideRef.current) {
            g.mode = roll < 0.65 ? 'center' : 'up'
            g.nextSwitch = now + rand(2500, 4500)
          } else if (s.mode === 'walk') {
            if (roll < 0.50) g.mode = 'forward'
            else if (roll < 0.75) g.mode = 'cursor'
            else if (roll < 0.90) g.mode = 'center'
            else g.mode = 'thought'
            g.nextSwitch = now + rand(1600, 3200)
          } else if (s.mode === 'peek') {
            g.mode = 'down'
            g.nextSwitch = now + rand(2000, 3500)
          } else if (idlePtrSec > 2.0) {
            if (roll < 0.35) g.mode = 'center'
            else if (roll < 0.55) g.mode = 'thought'
            else if (roll < 0.75) g.mode = 'forward'
            else if (roll < 0.90) g.mode = 'side'
            else g.mode = 'cursor'
            g.nextSwitch = now + rand(2000, 4200)
          } else {
            if (roll < 0.55) g.mode = 'cursor'
            else if (roll < 0.75) g.mode = 'center'
            else if (roll < 0.90) g.mode = 'thought'
            else g.mode = 'forward'
            g.nextSwitch = now + rand(1800, 3600)
          }
        }

        let tx = 0
        let ty = 0
        if (g.mode === 'cursor') {
          tx = clamp((ptr.current.x - s.x) / 80, -1, 1) * 2.2 * dir
          ty = clamp((ptr.current.y - (s.y - H / 2)) / 80, -1, 1) * 1.6
        } else if (g.mode === 'forward') {
          tx = 2.0 * dir
          ty = 0.2
        } else if (g.mode === 'thought') {
          tx = -1.2 * dir
          ty = -1.4
        } else if (g.mode === 'up') {
          tx = 0
          ty = -1.5
        } else if (g.mode === 'down') {
          tx = 1.4 * dir
          ty = 1.4
        } else if (g.mode === 'side') {
          tx = -2.0 * dir
          ty = 0
        } else {
          tx = 0
          ty = 0
        }

        g.x += (tx - g.x) * 0.18
        g.y += (ty - g.y) * 0.18

        if (frame % 2 === 0) {
          eyesRef.current.setAttribute('transform', `translate(${g.x.toFixed(2)} ${g.y.toFixed(2)})`)
        }
      }

      if (s.mode === 'drag') { place(); return }

      if (s.mode === 'fall') {
        const py = s.y
        s.vy = Math.min(s.vy + 1600 * dt, 1400)
        s.y += s.vy * dt
        s.x = clamp(s.x + s.vx * dt, 24, window.innerWidth - 24)
        s.vx *= 0.98
        const surf = surfaceBelow(s.x, py)
        if (s.y >= surf.y) land(surf)
        place(); return
      }

      const hold = guideRef.current

      if (s.platform) {
        if (!alive(s.platform)) { startFall(); place(); return }
        const r = rectOf(s.platform)
        s.relX = clamp(s.relX, 10, Math.max(10, r.width - 10))
        s.x = r.left + s.relX
        s.y = r.top
      } else if (s.mode !== 'climb' && s.mode !== 'climbdown') {
        s.y = ground()
        s.x = clamp(s.x, 24, window.innerWidth - 24)
      }

      if (hold) {
        if (s.mode !== 'idle') {
          setMode('idle')
          s.goal = null
          s.vx = 0
          s.vy = 0
        }
        place()
        return
      }

      if (followRef.current && !hold && s.mode !== 'drag' && s.mode !== 'fall') {
        const dx = ptr.current.x - s.x
        if (Math.abs(dx) > 36) {
          s.dir = dx > 0 ? 1 : -1
          setMode('walk')
          s.x = clamp(s.x + Math.sign(dx) * s.speed * 1.25 * dt, 24, window.innerWidth - 24)
        } else {
          setMode('idle')
        }
        place()
        return
      }

      if (s.mode === 'idle' || s.mode === 'sit' || s.mode === 'hop' || s.mode === 'dance' || s.mode === 'peek' || s.mode === 'scratch' || s.mode === 'knock') {
        if (!hold) {
          s.t -= dt
          if (s.t <= 0) {
            if (s.mode !== 'idle') {
              setMode('idle')
              s.t = rand(1.5, 3.5)
            } else {
              decide()
            }
          }
        }
      } else if (s.mode === 'walk') {
        const sp = s.speed * dt
        if (s.platform) {
          const dx = s.tx - s.relX
          s.dir = dx >= 0 ? 1 : -1
          if (Math.abs(dx) <= sp) { s.relX = s.tx; arrivedWalk() } else s.relX += Math.sign(dx) * sp
          if (s.platform) s.x = rectOf(s.platform).left + s.relX
        } else {
          const g = s.goal
          if (g && g.type === 'climb') {
            if (!alive(g.w)) { s.goal = null; setMode('idle'); s.t = 1; place(); return }
            const r = rectOf(g.w)
            s.tx = g.side === 'l' ? r.left - 10 : r.right + 10
          }
          const dx = s.tx - s.x
          s.dir = dx >= 0 ? 1 : -1
          if (Math.abs(dx) <= sp) { s.x = s.tx; arrivedWalk() } else s.x += Math.sign(dx) * sp
        }
      } else if (s.mode === 'climb') {
        const w = s.cw
        if (!alive(w)) startFall()
        else {
          const r = rectOf(w)
          s.x = s.side === 'l' ? r.left - 10 : r.right + 10
          s.y -= 36 * dt
          if (s.y <= r.top) { s.y = r.top; arriveOnWin(w, s.side === 'l' ? 12 : Math.max(12, r.width - 12)) }
        }
      } else if (s.mode === 'climbdown') {
        s.y += 36 * dt
        if (alive(s.cw)) { const r = rectOf(s.cw); s.x = s.side === 'l' ? r.left - 10 : r.right + 10 }
        const gy = ground()
        if (s.y >= gy) { s.y = gy; s.cw = null; setMode('idle'); s.t = rand(1.5, 3) }
      }
      place()
    }

    const releaseDrag = () => {
      s.dragged = true
      if (reduced.current) { land(surfaceBelow(s.x, s.y)); place() } else startFall(0, 0)
    }

    // boshlang'ich holat
    if (!s.y) { s.x = reduced.current ? window.innerWidth - 90 : 160; s.y = ground() }
    btn.dataset.mode = s.mode
    place()

    eng.current = { place, releaseDrag, setMode, S: s }
    if (apiRef) apiRef.current = { S: s, step, decide, place, surfaceBelow, releaseDrag, startFall, setMode }

    let raf = 0
    let last = performance.now()
    const loop = (t) => {
      const dt = Math.min(0.05, Math.max(0, (t - last) / 1000))
      last = t
      step(dt, t)
      raf = requestAnimationFrame(loop)
    }
    if (!reduced.current) raf = requestAnimationFrame(loop)

    const onResize = () => { if (reduced.current) { s.y = ground(); s.x = clamp(s.x, 24, window.innerWidth - 24); place() } }
    const onSetMode = (e) => {
      if (e.detail && eng.current) {
        eng.current.setMode(e.detail)
        s.t = rand(2, 4)
      }
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('robot-set-mode', onSetMode)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('robot-set-mode', onSetMode)
      eng.current = null
    }
  }, [desktop, prefs.hidden, apiRef])

  /* ---- vaziyatga qarab maslahatlar ---- */
  useEffect(() => {
    if (!desktop || prefs.hidden) return
    const timers = new Set()
    let visibleSince = nowMs()

    const iv = setInterval(() => {
      if (document.querySelector('.boot')) { visibleSince = nowMs(); return }
      const t = (nowMs() - visibleSince) / 1000
      const say = sayRef.current
      if (t >= 7 && say('hello', 'Salom! Men Rootik. Bu yerda hamma narsa terminal orqali. Boshlash uchun `help` deb yozing.', [{ label: 'help', cmd: 'help' }, { label: 'Yo‘riqnoma', fn: 'guide' }])) return
      if (t >= 32 && tips.current.cmds === 0) say('idle', 'Klaviaturadan qo‘rqmang: `ls` yozib fayllarni ko‘ring.', [{ label: 'ls', cmd: 'ls' }])
      else if (t >= 75) say('palette', '`Ctrl+/` ni bosing: hamma narsa qidiruvli menyuda.', [{ label: 'Menyuni ochish', fn: 'palette' }])
    }, 1000)

    const onCmd = (e) => {
      wakeUp()
      const c = String((e.detail && e.detail.cmd) || '').trim()
      if (!c) return
      const w = c.split(/\s+/)[0]
      tips.current.cmds += 1
      tips.current.kinds.add(w)
      if (w === 'send-mail' || w === 'sendmail') {
        speech.current.quietUntil = nowMs() + 120000
        setBubble(null)
        return
      }
      if (w === 'theme' || w === 'crt') tips.current.usedTheme = true
      const id = setTimeout(() => {
        timers.delete(id)
        const say = sayRef.current
        if (!say) return
        if (w === 'help') {
          if (eng.current) { eng.current.setMode('hop'); S.current.t = 1.6; sfx.hop() }
          say('after-help', 'Ro‘yxatdan birini tanlang. Masalan, tanishuv uchun:', [{ label: 'cat about.md', cmd: 'cat about.md' }], true)
        } else if (w === 'ls' || w === 'dir') {
          say('after-ls', 'Papkaga kirish: `cd projects`. Faylni o‘qish: `cat <nom>.md`.', [{ label: 'cd projects', cmd: 'cd projects' }], true)
        } else if (w === 'cd') {
          say('after-cd', 'Endi `cat` bilan fayl o‘qing. Nomini to‘liq yozmay, `Tab` bosing: o‘zi to‘ldiradi.', [], true)
        } else if (w === 'cat') {
          say('after-cat', '`Tab` — avtoto‘ldirish, `↑` `↓` — oldingi buyruqlar, `Ctrl+/` — buyruqlar menyusi.', [], true)
        } else if (w === 'clear') {
          if (eng.current) { eng.current.setMode('hop'); S.current.t = 1.6; sfx.hop() }
          say('after-clear', 'Topp-toza bo‘ldi! Yangi buyruqqa tayyorman.', [], true)
        } else if (w === 'fortune') {
          if (eng.current) { eng.current.setMode('dance'); S.current.t = 2.8; sfx.dance() }
          say('after-fortune', 'Dasturchi donishmandligi! Har safar yangi hikmat chiqadi.', [], true)
        } else if (w === 'cowsay') {
          if (eng.current) { eng.current.setMode('dance'); S.current.t = 2.8; sfx.dance() }
          say('after-cowsay', 'Muuu! Sigircha bilan do‘stlashib oldik.', [], true)
        } else if (w === 'git') {
          if (eng.current) { eng.current.setMode('hop'); S.current.t = 1.6; sfx.hop() }
          say('after-git', 'GitHub’dagi barcha commit’lar shu yerda.', [], true)
        } else if (w === 'new' || w === 'new-term') {
          if (eng.current) { eng.current.setMode('hop'); S.current.t = 1.6; sfx.hop() }
          say('after-new', 'Yana bitta yangi oyna ochildi! Unga ham tirmashib ko‘raman.', [], true)
        } else if (w === 'whoami') {
          if (eng.current) { eng.current.setMode('hop'); S.current.t = 1.6; sfx.hop() }
          say('after-whoami', 'Siz qahramonsiz (va mening do‘stimsiz)!', [], true)
        } else if (w === 'neofetch') {
          if (eng.current) { eng.current.setMode('dance'); S.current.t = 2.8; sfx.dance() }
          say('after-neofetch', 'Mana tizim ma’lumotlari va bizning Tux pingvinimiz!', [], true)
        } else if (w === 'theme') {
          if (eng.current) { eng.current.setMode('dance'); S.current.t = 2.8; sfx.dance() }
          say('after-theme', 'Yangi rang juda yarashdi!', [], true)
        } else if (w === 'crt') {
          if (eng.current) { eng.current.setMode('hop'); S.current.t = 1.6; sfx.hop() }
          say('after-crt', 'Retro CRT monitor effekti!', [], true)
        } else if (tips.current.kinds.size >= 3 && !tips.current.usedTheme) {
          say('theme-tip', 'Rang yoqmadimi? `theme dracula` yoki `crt on` ni sinab ko‘ring.', [{ label: 'theme dracula', cmd: 'theme dracula' }, { label: 'crt on', cmd: 'crt on' }], true)
        }
      }, 500)
      timers.add(id)
    }

    const onCmdError = (e) => {
      wakeUp()
      const c = String((e.detail && e.detail.cmd) || '').trim().toLowerCase()
      if (!c) return

      if (eng.current) {
        eng.current.setMode('scratch')
        S.current.t = 2.5
      }
      sfx.confused()

      const typos = {
        cls: 'Linux terminalida `clear` ishlatiladi.',
        sl: 'Poezd emas, `ls` demoqchi edingizmi?',
        dir: 'Linux tizimida papkalarni ko‘rish uchun `ls` yozing.',
        helo: 'Barcha buyruqlar uchun `help` deb yozing.',
        halp: 'Yordam uchun `help` deb yozing.',
        exit: 'Terminal oynasini burchakdagi [×] bilan yopishingiz mumkin.',
        quit: 'Terminal oynasini burchakdagi [×] bilan yopishingiz mumkin.',
        clean: 'Ekranni tozalash uchun `clear` deb yozing.',
        hi: 'Salom! Boshlash uchun `help` deb yozing.',
        hello: 'Salom! Ishni `help` yoki `ls` buyrug‘idan boshlang.',
        man: 'Buyruqlar haqida bilish uchun `help` yozing.'
      }

      const msg = typos[c] || `\`${c}\` buyrug‘ini bilmayman. Buyruqlar ro‘yxati uchun \`help\` yozing.`
      sayRef.current('cmd-err', msg, [{ label: 'help', cmd: 'help' }], true)
    }

    const onTermAction = (e) => {
      const act = e.detail && e.detail.action
      if (!act || !eng.current) return
      wakeUp()

      if (act === 'dance') {
        eng.current.setMode('dance')
        S.current.t = 3.2
        sfx.dance()
      } else if (act === 'hop') {
        eng.current.setMode('hop')
        S.current.t = 1.6
        sfx.hop()
      } else if (act === 'sleep') {
        eng.current.setMode('sleep')
        S.current.t = 999999
      } else if (act === 'wake') {
        wakeUp()
      } else if (act === 'knock') {
        eng.current.setMode('knock')
        S.current.t = 1.4
        sfx.knock()
      } else if (act === 'follow') {
        followRef.current = !followRef.current
        if (followRef.current) {
          sfx.chatter()
          sayRef.current('act-follow', 'Kursor orqasidan ergashish yoqildi! To‘xtatish uchun: `robot stop`.', [], true)
        } else {
          sayRef.current('act-follow', 'Ergashish to‘xtatildi.', [], true)
          eng.current.setMode('idle')
        }
      } else if (act === 'stop') {
        followRef.current = false
        eng.current.setMode('idle')
        S.current.goal = null
        S.current.vx = 0
        S.current.vy = 0
      }
    }

    window.addEventListener('term-cmd', onCmd)
    window.addEventListener('term-cmd-error', onCmdError)
    window.addEventListener('robot-term-action', onTermAction)
    return () => {
      clearInterval(iv)
      timers.forEach(clearTimeout)
      window.removeEventListener('term-cmd', onCmd)
      window.removeEventListener('term-cmd-error', onCmdError)
      window.removeEventListener('robot-term-action', onTermAction)
    }
  }, [desktop, prefs.hidden])

  useEffect(() => () => clearTimeout(speech.current.timer), [])

  useEffect(() => {
    if (guide) {
      if (eng.current) {
        eng.current.setMode('idle')
        S.current.goal = null
        S.current.vx = 0
        S.current.vy = 0
      }
      if (elRef.current) {
        const b = elRef.current.querySelector('.rbt-panel button')
        if (b) b.focus({ preventScroll: true })
      }
    }
  }, [guide])

  if (!desktop || prefs.hidden) return null

  /* ---- sudrash va bosish ---- */
  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    const s = S.current
    drag.current = { sx: e.clientX, sy: e.clientY, moved: false, dx: s.x - e.clientX, dy: s.y - e.clientY }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* sinov muhiti */ }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    const g = eng.current
    if (!d || !g) return
    const s = S.current
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 4) {
      d.moved = true
      s.platform = null; s.goal = null
      wakeUp()
      g.setMode('drag')
      setBubble(null)
      setGuide(null)
      sayRef.current('drag', 'Voy! Ehtiyot bo‘ling.', [], true)
    }
    if (d.moved) {
      s.x = clamp(e.clientX + d.dx, 24, window.innerWidth - 24)
      s.y = clamp(e.clientY + d.dy, H + 10, window.innerHeight)
      g.place()
    }
  }
  const onPointerUp = (e) => {
    const d = drag.current
    drag.current = null
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* sinov muhiti */ }
    if (!d) return
    if (d.moved) {
      if (eng.current) eng.current.releaseDrag()
    } else {
      if (S.current.mode === 'sleep') {
        wakeUp()
      } else {
        sfx.click()
        toggleGuide()
      }
    }
  }
  const toggleGuide = () => {
    setBubble(null)
    setGuide((g) => {
      const next = g ? null : { topic: null }
      if (next && eng.current) {
        eng.current.setMode('idle')
        S.current.goal = null
        S.current.vx = 0
        S.current.vy = 0
      } else if (!next) {
        S.current.t = rand(2.5, 4.5)
      }
      return next
    })
  }

  const runAct = (a) => {
    if (a.fn === 'guide') {
      setBubble(null)
      setGuide({ topic: null })
      if (eng.current) {
        eng.current.setMode('idle')
        S.current.goal = null
        S.current.vx = 0
        S.current.vy = 0
      }
      return
    }
    setGuide(null)
    setBubble(null)
    if (a.fn === 'pdf') onOpenPdf && onOpenPdf()
    else if (a.fn === 'palette') onOpenPalette && onOpenPalette()
    else if (a.cmd && onRun) onRun(a.cmd)
  }

  const cur = guide && guide.topic ? topics.find((t) => t.id === guide.topic) : null

  return (
    <div className={'rbt' + (bubble ? ' talking' : '')} ref={elRef}>
      {bubble && !guide && (
        <div
          className="rbt-bubble"
          role="status"
          aria-live="polite"
          onMouseEnter={() => { hoverRef.current = true; clearTimeout(speech.current.timer) }}
          onMouseLeave={() => { hoverRef.current = false; speech.current.timer = setTimeout(() => setBubble(null), 3000) }}
        >
          <button type="button" className="rbt-x" aria-label="Yopish" onClick={() => setBubble(null)}>×</button>
          <div>{fmt(bubble.text)}</div>
          {bubble.acts.length > 0 && (
            <div className="rbt-acts">
              {bubble.acts.map((a) => <button key={a.label} type="button" onClick={() => runAct(a)}>{a.label}</button>)}
            </div>
          )}
        </div>
      )}

      {guide && (
        <div className="rbt-panel" role="dialog" aria-label="Robot yo‘riqnomasi">
          <div className="rbt-ph">
            <span>Rootik · yo‘riqnoma</span>
            <button type="button" className="rbt-x" aria-label="Yopish" onClick={() => setGuide(null)}>×</button>
          </div>
          {!cur ? (
            <div className="rbt-list">
              {topics.map((t) => <button key={t.id} type="button" onClick={() => setGuide({ topic: t.id })}>{t.q}</button>)}
            </div>
          ) : (
            <div className="rbt-ans">
              <div>{fmt(cur.a)}</div>
              {cur.acts.length > 0 && (
                <div className="rbt-acts">
                  {cur.acts.map((a) => <button key={a.label} type="button" onClick={() => runAct(a)}>{a.label}</button>)}
                </div>
              )}
              <button type="button" className="rbt-back" onClick={() => setGuide({ topic: null })}>← Orqaga</button>
            </div>
          )}
          <div className="rbt-pf">
            <button type="button" onClick={() => { sfx.click(); setSoundPref(!soundOn) }}>{soundOn ? 'Ovoz: Yoqiq' : 'Ovoz: O‘chiq'}</button>
            <button type="button" onClick={() => setRobotPref('quiet', !prefs.quiet)}>{prefs.quiet ? 'Gapirsin' : 'Jim bo‘l'}</button>
            <button type="button" onClick={() => setRobotPref('hidden', true)}>Yashir</button>
          </div>
        </div>
      )}

      <button
        type="button"
        ref={btnRef}
        className="rbt-btn"
        data-mode={currentMode}
        aria-label="Yordamchi robot. Yo‘riqnomani ochish uchun bosing"
        title="Bosing — yo‘riqnoma. Sudrab ko‘chirsa bo‘ladi"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={(e) => { if (e.detail === 0) toggleGuide() }}
      >
        {currentMode === 'sleep' && (
          <div className="rbt-zzz" aria-hidden="true">
            <span>z</span><span>z</span><span>Z</span>
          </div>
        )}
        <Sprite eyesRef={eyesRef} mode={currentMode} />
      </button>
    </div>
  )
}
