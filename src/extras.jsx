import { useEffect, useMemo, useRef, useState } from 'react'

/* ================== Saqlash (localStorage xavfsiz o'ramasi) ================== */
const store = {
  get(k) { try { return localStorage.getItem('portfolio-' + k) } catch { return null } },
  set(k, v) { try { localStorage.setItem('portfolio-' + k, v) } catch { /* ruxsat yo'q */ } },
}

/* ================== Mavzular ================== */
export const THEMES = ['dark', 'light', 'dracula', 'nord', 'gruvbox', 'tokyo']

export function applyTheme(name) {
  const root = document.documentElement
  if (name === 'auto') {
    root.removeAttribute('data-theme')
    store.set('theme', 'auto')
    return true
  }
  if (!THEMES.includes(name)) return false
  root.setAttribute('data-theme', name)
  store.set('theme', name)
  return true
}

export const currentTheme = () => document.documentElement.getAttribute('data-theme') || 'auto'

/* ================== CRT effekti ================== */
export function setCrt(on) {
  document.documentElement.classList.toggle('crt', on)
  store.set('crt', on ? '1' : '0')
}
export const isCrt = () => document.documentElement.classList.contains('crt')

/* Sahifa ochilganda saqlangan sozlamalarni qaytarish (yaltirashsiz) */
export function initPrefs() {
  const t = store.get('theme')
  if (t && t !== 'auto') applyTheme(t)
  if (store.get('crt') === '1') setCrt(true)
}

/* ================== Yuklanish ekrani (faqat birinchi kirishda) ================== */
export function shouldBoot() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  } catch { /* eski brauzer */ }
  return store.get('booted') !== '1'
}
export const markBooted = () => store.set('booted', '1')

const BOOT_LINES = [
  ['ok', 'Reached target Local File Systems'],
  ['ok', 'Started Network Manager'],
  ['ok', 'Started PostgreSQL Database Server'],
  ['ok', 'Started Docker Application Container Engine'],
  ['ok', 'Started Redis In-Memory Data Store'],
  ['ok', 'Started The Nginx HTTP Server'],
  ['ok', 'Mounted /home/root/portfolio'],
  ['ok', 'Reached target Multi-User System'],
  ['', ''],
  ['', 'Ubuntu 24.04 LTS alijonov tty1'],
]

export function BootScreen({ onDone }) {
  const [n, setN] = useState(0)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    let i = 0
    let t2 = null
    const id = setInterval(() => {
      i += 1
      setN(i)
      if (i >= BOOT_LINES.length) {
        clearInterval(id)
        t2 = setTimeout(() => doneRef.current(), 450)
      }
    }, 120)
    const skip = () => doneRef.current()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      clearInterval(id)
      if (t2) clearTimeout(t2)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [])

  return (
    <div className="boot" role="status" aria-label="Tizim yuklanmoqda">
      {BOOT_LINES.slice(0, n).map(([k, t], i) => (
        <div key={i} className="boot-line">
          {k === 'ok' ? <><span className="boot-ok">[  OK  ]</span> {t}</> : t || '\u00A0'}
        </div>
      ))}
      <div className="boot-skip">O‘tkazib yuborish: istalgan tugma yoki bosish</div>
    </div>
  )
}

/* ================== Buyruqlar menyusi (Ctrl+/) ================== */
export function CommandPalette({ items, onClose }) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter((it) => (it.group + ' ' + it.label + ' ' + (it.hint || '')).toLowerCase().includes(s))
  }, [q, items])

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => { setIdx(0) }, [q])
  useEffect(() => {
    const el = listRef.current?.querySelector('[aria-selected="true"]')
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' })
  }, [idx])

  const run = (it) => {
    if (!it) return
    onClose()
    it.run()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(filtered.length - 1, i + 1)); return }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); return }
    if (e.key === 'Enter') { e.preventDefault(); run(filtered[idx]) }
  }

  return (
    <div className="pal-back" onPointerDown={onClose}>
      <div className="pal" role="dialog" aria-modal="true" aria-label="Buyruqlar menyusi" onPointerDown={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="pal-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Buyruq qidiring…  (↑ ↓ Enter, Esc)"
          aria-label="Buyruq qidirish"
          autoComplete="off"
          spellCheck="false"
        />
        <div className="pal-list" ref={listRef} role="listbox">
          {filtered.map((it, i) => (
            <button
              key={it.id}
              type="button"
              role="option"
              aria-selected={i === idx}
              className={'pal-item' + (i === idx ? ' on' : '')}
              onMouseEnter={() => setIdx(i)}
              onClick={() => run(it)}
            >
              <span className="pal-g">{it.group}</span>
              <span>{it.label}</span>
              {it.hint && <span className="pal-h">{it.hint}</span>}
            </button>
          ))}
          {filtered.length === 0 && <div className="pal-empty">Hech narsa topilmadi</div>}
        </div>
      </div>
    </div>
  )
}

/* ================== Telefon uchun tezkor tugmalar ================== */
export function QuickKeys({ onKey, onRun }) {
  return (
    <div className="qk" role="toolbar" aria-label="Tezkor tugmalar">
      <button type="button" onClick={() => onKey({ key: 'Tab' })} aria-label="Tab (avtoto‘ldirish)">Tab</button>
      <button type="button" onClick={() => onKey({ key: 'ArrowUp' })} aria-label="Oldingi buyruq">↑</button>
      <button type="button" onClick={() => onKey({ key: 'ArrowDown' })} aria-label="Keyingi buyruq">↓</button>
      <button type="button" onClick={() => onKey({ key: 'c', ctrlKey: true })} aria-label="Control C">Ctrl+C</button>
      <button type="button" onClick={() => onRun('help')}>help</button>
      <button type="button" onClick={() => onRun('menu')}>menu</button>
    </div>
  )
}

/* ================== 404: noma'lum yo'l ================== */
export const NOT_FOUND = (() => {
  if (typeof window === 'undefined') return null
  const p = window.location.pathname
  if (!p || p === '/') return null
  let s = p
  try { s = decodeURIComponent(p) } catch { /* qoldiramiz */ }
  return s.slice(0, 60)
})()

/* ================== Qo'shimcha buyruqlar ================== */
const FORTUNES = [
  'Ishlayaptimi? Tegmang. Ishlamayaptimi? git log ni oching va kim tekkanini toping.',
  'Eng yaxshi kod — yozilmagan kod.',
  '127.0.0.1 — dunyodagi eng yaxshi manzil.',
  'chmod 777 muammoni hal qilmaydi, uni hammaga baham ko‘radi.',
  'Production’da test qilish — eng tez va eng qimmat usul.',
  'Kod izohi yolg‘on gapirishi mumkin, git log esa yo‘q.',
  'Avval ishlating, keyin chiroyli qiling, keyin tezlashtiring — shu tartibda.',
  'Soat 03:00 da yozilgan kodni ertalab o‘qish alohida tajriba.',
  'Zaxira nusxa olmaganlar ikki xil bo‘ladi: yo‘qotganlar va hali yo‘qotmaganlar.',
  'Muammo DNS da. Har doim DNS da.',
]
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

function cowsay(text) {
  const words = text.trim().split(/\s+/)
  const lines = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > 36) { if (cur) lines.push(cur); cur = w } else cur = (cur + ' ' + w).trim()
  }
  if (cur) lines.push(cur)
  const w = Math.max(...lines.map((l) => l.length))
  const pad = (l) => l + ' '.repeat(w - l.length)
  let body
  if (lines.length === 1) body = [`< ${pad(lines[0])} >`]
  else {
    body = lines.map((l, i) => {
      const [a, b] = i === 0 ? ['/', '\\'] : i === lines.length - 1 ? ['\\', '/'] : ['|', '|']
      return `${a} ${pad(l)} ${b}`
    })
  }
  const cow = String.raw`        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||`
  return [' ' + '_'.repeat(w + 2), ...body, ' ' + '-'.repeat(w + 2), cow].join('\n')
}

const GH_USER = 'AlijonovUz'

function relTime(iso) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  const units = [[31536000, 'yil'], [2592000, 'oy'], [604800, 'hafta'], [86400, 'kun'], [3600, 'soat'], [60, 'daqiqa']]
  for (const [sec, name] of units) if (s >= sec) return `${Math.floor(s / sec)} ${name} oldin`
  return 'hozirgina'
}

async function fetchGitLog() {
  try {
    const c = JSON.parse(sessionStorage.getItem('portfolio-gitlog') || 'null')
    if (c && Date.now() - c.t < 10 * 60 * 1000) return c.rows
  } catch { /* keshsiz davom etamiz */ }

  const gh = async (path) => {
    const r = await fetch('https://api.github.com' + path, { headers: { Accept: 'application/vnd.github+json' } })
    if (r.status === 403 || r.status === 429) throw new Error('GitHub API limiti vaqtincha tugagan, birozdan keyin urinib ko‘ring')
    if (!r.ok) throw new Error(`GitHub javob bermadi (${r.status})`)
    return r.json()
  }

  const repos = await gh(`/users/${GH_USER}/repos?sort=pushed&per_page=6`)
  const top = (Array.isArray(repos) ? repos : []).filter((r) => !r.fork).slice(0, 3)
  const lists = await Promise.all(
    top.map((r) =>
      gh(`/repos/${GH_USER}/${r.name}/commits?per_page=5&author=${GH_USER}`)
        .then((cs) => (Array.isArray(cs) ? cs : []).map((c) => ({
          sha: String(c.sha).slice(0, 7),
          url: c.html_url,
          repo: r.name,
          msg: String(c.commit?.message || '').split('\n')[0].slice(0, 100),
          date: c.commit?.author?.date,
        })))
        .catch(() => [])
    )
  )
  const rows = lists.flat().filter((r) => r.date).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)
  try { sessionStorage.setItem('portfolio-gitlog', JSON.stringify({ t: Date.now(), rows })) } catch { /* kesh yo'q */ }
  return rows
}

export function ExtraHelp() {
  const col = { display: 'inline-block', width: '28ch' }
  return (
    <>
      <span className="d">Extra:</span><br />
      {'  '}<span className="h" style={col}>theme [nom]</span><span className="h">crt [on|off]</span><br />
      {'  '}<span className="h" style={col}>git log</span><span className="h">fortune</span><br />
      {'  '}<span className="h" style={col}>cowsay &lt;matn&gt;</span><span className="h">neofetch</span><br />
      {'  '}<span className="h" style={col}>menu (Ctrl+/)</span>
    </>
  )
}

/* true qaytarsa — buyruq shu yerda bajarildi */
export function handleExtraCommand(trimmed, ctx) {
  const { echoLine, addHistory, neofetch, openPalette } = ctx
  const parts = trimmed.split(/\s+/)
  const cmd = parts[0]
  const k = (s) => `${cmd}-${s}-${Date.now()}-${Math.random()}`
  const msg = (children) => <div key={k('m')} className="term-msg">{children}</div>

  if (cmd === 'theme') {
    const arg = (parts[1] || '').toLowerCase()
    if (!arg) {
      addHistory([echoLine, msg(
        <>
          <span className="d">Mavjud mavzular: </span>
          {['auto', ...THEMES].map((t) => (
            <span key={t} className={t === currentTheme() ? 'u' : 'h'} style={{ marginRight: 10 }}>{t === currentTheme() ? `*${t}` : t}</span>
          ))}
          <br /><span className="d">Ishlatish: theme &lt;nom&gt;   (auto — qurilma sozlamasiga ko‘ra)</span>
        </>
      )])
      return true
    }
    if (applyTheme(arg)) {
      addHistory([echoLine, msg(<><span className="u">[+]</span> Mavzu: <span className="h">{arg}</span></>)])
    } else {
      addHistory([echoLine, msg(<><span className="k">theme:</span> &apos;{arg.slice(0, 20)}&apos; topilmadi. Mavjud: auto, {THEMES.join(', ')}</>)])
    }
    return true
  }

  if (cmd === 'crt') {
    const arg = (parts[1] || '').toLowerCase()
    const next = arg === 'on' ? true : arg === 'off' ? false : !isCrt()
    setCrt(next)
    addHistory([echoLine, msg(<><span className="u">[+]</span> CRT effekti: <span className="h">{next ? 'yoqildi' : 'o‘chirildi'}</span></>)])
    return true
  }

  if (cmd === 'fortune') {
    addHistory([echoLine, msg(pick(FORTUNES))])
    return true
  }

  if (cmd === 'cowsay') {
    const text = trimmed.slice(6).trim().slice(0, 120) || 'Muuu! Salom, men Abdulbositning portfoliosiman!'
    addHistory([echoLine, <pre key={k('c')} className="term-msg" style={{ margin: '4px 0', font: 'inherit', lineHeight: 1.25, whiteSpace: 'pre' }}>{cowsay(text)}</pre>])
    return true
  }

  if (cmd === 'neofetch') {
    addHistory([echoLine, <div key={k('n')} className="o">{neofetch}</div>])
    return true
  }

  if (cmd === 'menu' || cmd === 'palette') {
    addHistory([echoLine])
    openPalette()
    return true
  }

  if (cmd === 'git') {
    if (parts[1] !== 'log') {
      addHistory([echoLine, msg(<><span className="k">git:</span> faqat <span className="h">git log</span> qo‘llab-quvvatlanadi</>)])
      return true
    }
    addHistory([echoLine, msg(<><span className="h">[*]</span> GitHub’dan ma’lumot olinmoqda…</>)])
    fetchGitLog()
      .then((rows) => {
        if (!rows.length) {
          addHistory([msg(<span className="d">Hozircha ommaviy commit topilmadi.</span>)])
          return
        }
        addHistory(rows.map((r) => (
          <div key={k(r.sha)} className="term-msg">
            <a href={r.url} target="_blank" rel="noreferrer" className="k">{r.sha}</a>{' '}
            <span className="h">{r.repo}</span> <span className="d">· {relTime(r.date)}</span>
            <div style={{ paddingLeft: '2ch' }}>{r.msg}</div>
          </div>
        )))
      })
      .catch((err) => {
        addHistory([msg(<><span className="k">[-] Xatolik:</span> {err.message}</>)])
      })
    return true
  }

  return false
}
