import { useState, useEffect, useRef } from 'react'

/* ================== MA'LUMOTLAR VA KONSTANTALAR ================== */
const PROJECTS = [
  {
    name: 'Meetly',
    slug: 'meetly',
    headline: 'Onlayn video va audio uchrashuvlar platformasi',
    desc: 'Konferensiya davomida tasvir va ovoz qotmasligi, kechikishlar minimal bo‘lishi uchun WebRTC hamda zamonaviy SFU (Selective Forwarding Unit) arxitekturasi asosida qurilgan. Video/audio oqimlarni har bir ishtirokchiga alohida optimallab, yuqori tezlikda tarqatib beradi.',
    note: 'Muloqot qulayligi va to‘liq imkoniyatlar uchun ayni bosqichda faqat kompyuter (desktop) brauzerlarida ishlaydi.',
    stack: ['WebRTC', 'SFU Architecture', 'WebSockets', 'Python', 'Django', 'DRF', 'Docker'],
    url: 'https://meetly.uz',
    status: 'production · online',
    access: 'private repo',
  },
  {
    name: 'Authly',
    slug: 'authly',
    headline: 'Yagona identifikatsiya va OAuth SSO tizimi',
    desc: 'Loyihalarni bitta ekotizimga birlashtirish va xavfsiz kirishni ta’minlash uchun yozilgan. Kriptografik tokenlar va xavfsiz avtorizatsiya standartlari asosida ishlaydi. O‘zingizning tashqi loyihalaringizga ham avtorizatsiya mexanizmi sifatida bemalol integratsiya qila olasiz.',
    note: 'Yagona SSO, OAuth 2.0 / OpenID Connect standartlari va xavfsiz tokenlar.',
    stack: ['OAuth 2.0', 'OpenID Connect', 'JWT', 'Python', 'Django', 'DRF', 'PostgreSQL', 'Docker'],
    url: 'https://authly.uz',
    status: 'production · online',
    access: 'private repo',
  },
  {
    name: 'Fragmently',
    slug: 'fragmently',
    headline: 'Fragment xizmatlarini avtomatlashtirish va Public API platformasi',
    desc: 'Dasturchilar uchun Fragment platformasi xizmatlarini avtomatlashtirib beruvchi tizim. Telegram Stars, Telegram Premium va boshqa xizmatlarni Telegram botlar hamda veb-saytlar uchun qulay va sifatli ommaviy (public) RESTful API orqali integratsiya qilish imkonini beradi.',
    note: 'Dasturchilar va tashqi tizimlar uchun ommaviy (public) API infratuzilmasi.',
    stack: ['Python', 'Django', 'DRF', 'FastAPI', 'PostgreSQL', 'Docker'],
    url: 'https://fragmently.uz',
    status: 'production · online',
    access: 'private repo',
  },
]

const JOBS = [
  ['Backend developer', 'Raqamli Nazorat · 2026-yil aprel — hozir', [
    'Masshtablanuvchi monitoring tizimlari va RESTful API larni loyihalash hamda qo‘llab-quvvatlash.',
    'Tizimdagi murakkab nosozliklarni aniqlash (debugging), so‘rovlarni optimallashtirish va barqarorlikni ta’minlash.',
    'Code review jarayonlarini olib borish va jamoa a’zolariga texnik mentorlik qilish.',
  ]],
  ['Backend mentor', 'Najot Ta’lim · 2025-yil noyabr — 2026-yil avgust', [
    'Talabalarga Python dasturlashda amaliy yordam berish.',
    'Uy vazifalarini tekshirish va kodni tahlil qilib, sifatini oshirish.',
    'Mustaqil ishlash va muammo yechish ko‘nikmalarini rivojlantirish.',
  ]],
  ['Freelance developer', 'Frilans · 2021 — 2025', [
    'Buyurtmachilar uchun Telegram botlar yaratish va ishga tushirish.',
    'Loyihalarni mustaqil olib borib, tayyor holda yetkazib berish.',
  ]],
]

const MAIN = [
  ['languages', ['Python', 'PHP', 'C#']],
  ['databases', ['PostgreSQL', 'MySQL']],
]

const ALL = [
  ['languages', ['Python', 'PHP', 'C#']],
  ['frameworks', ['Django', 'DRF', 'FastAPI', 'Laravel', '.NET']],
  ['web', ['HTML', 'CSS', 'Bootstrap', 'TailwindCSS', 'JavaScript']],
  ['databases', ['PostgreSQL', 'MySQL', 'SQLite']],
  ['tools', ['Git', 'GitHub', 'GitLab', 'Redis', 'Celery', 'WebSockets']],
  ['devops', ['Docker', 'Docker Compose']],
]

const LINKS = [
  ['email', 'me@alijonov.uz', 'mailto:me@alijonov.uz'],
  ['telegram', '@AlijonovUz', 'https://t.me/AlijonovUz'],
  ['github', 'github.com/AlijonovUz', 'https://github.com/AlijonovUz'],
  ['linkedin', 'linkedin.com/in/alijonovuz', 'https://linkedin.com/in/alijonovuz'],
  ['instagram', 'instagram.com/alijonov.uz_', 'https://instagram.com/alijonov.uz_'],
]

const EDU = {
  title: 'Backend Python (Standard)',
  where: 'Najot Ta’lim · 2024 — 2025',
  lines: ['Texnologiyalar: Python, Django, DRF, Docker, Git, PostgreSQL.', 'Amaliy loyihalar orqali backend ko‘nikmalarini mustahkamlagan.'],
}

const LANGS = [['O‘zbek tili', 'ona tili'], ['Ingliz tili', 'A2'], ['Rus tili', 'A2']]
const RESUME_PDF = '/resume.pdf' // public/resume.pdf
const LOCATION = 'Oltiariq, Farg‘ona viloyati, O‘zbekiston'

function singleProjectOutput(slug) {
  const p = PROJECTS.find((x) => x.slug === slug)
  if (!p) return null
  return (
    <div className="job" key={p.slug} style={{ margin: '8px 0' }}>
      <div>
        <span className="h" style={{ fontSize: 16, fontWeight: 700 }}>{p.name}</span>
        <span className="d"> — {p.headline}</span>
      </div>
      <div style={{ marginTop: 6, lineHeight: 1.6 }}>{p.desc}</div>
      {p.note && <div className="d" style={{ marginTop: 4 }}>• {p.note}</div>}
      <div style={{ marginTop: 8 }}>
        <span className="d">stack: </span>
        {p.stack.map((t) => <span className="tag" key={t}>{t}</span>)}
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <span>havola: → <a href={p.url} target="_blank" rel="noreferrer">{p.url}</a></span>
        <span className="d">status: <span className="u">{p.status}</span> ({p.access})</span>
      </div>
    </div>
  )
}

const TUX = ['    .--.', '   |o_o |', '   |:_/ |', '  //   \\ \\', ' (|     | )', "/'\\_   _/'\\", '\\___)=(___/'].join('\n')

const Prompt = ({ path = '~' }) => {
  const p = path === 'home' || path === 'neofetch' || path === '~' ? '~' : `~/${path}`
  return (
    <span style={{ whiteSpace: 'nowrap', userSelect: 'none' }}>
      <span className="u">root@alijonov</span>
      <span className="d">:</span>
      <span className="h">{p}</span>
      <span className="d">#&nbsp;</span>
    </span>
  )
}

const Groups = ({ data }) => (
  <div>
    {data.map(([k, list]) => (
      <div className="grp" key={k}>
        <span className="h">{k}</span>
        <div>{list.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
      </div>
    ))}
  </div>
)

function parseCliArgs(text) {
  const tokens = []
  const re = /[^\s"']+|"([^"]*)"|'([^']*)'/g
  let m
  while ((m = re.exec(text)) !== null) {
    if (m[1] !== undefined) tokens.push(m[1])
    else if (m[2] !== undefined) tokens.push(m[2])
    else tokens.push(m[0])
  }
  return tokens
}

function getLongestCommonPrefix(strs) {
  if (!strs || strs.length === 0) return ''
  let prefix = strs[0]
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].toLowerCase().startsWith(prefix.toLowerCase())) {
      prefix = prefix.slice(0, -1)
      if (!prefix) return ''
    }
  }
  return prefix
}

function resolveCd(targetArg, currentCur) {
  const raw = (targetArg || '').trim()
  if (!raw || raw === '~' || raw === '/' || raw === '/root' || raw === 'home') {
    return { success: true, newCur: 'home' }
  }
  if (raw === '.' || raw === './') {
    return { success: true, newCur: currentCur }
  }
  if (raw === '..' || raw === '../') {
    return { success: true, newCur: 'home' }
  }

  // Absolute / home-relative
  if (raw.startsWith('~/') || raw.startsWith('/root/')) {
    const sub = raw.replace(/^(~\/|\/root\/)/, '').replace(/\/+$/, '')
    if (!sub) return { success: true, newCur: 'home' }
    if (['about', 'projects', 'resume', 'contact'].includes(sub)) {
      return { success: true, newCur: sub }
    }
    return { success: false, error: `bash: cd: ${targetArg}: No such file or directory` }
  }

  // Parent-relative
  if (raw.startsWith('../')) {
    const sub = raw.replace(/^\.\.\//, '').replace(/\/+$/, '')
    if (currentCur === 'home') {
      return { success: false, error: `bash: cd: ${targetArg}: No such file or directory` }
    }
    if (!sub) return { success: true, newCur: 'home' }
    if (['about', 'projects', 'resume', 'contact'].includes(sub)) {
      return { success: true, newCur: sub }
    }
    return { success: false, error: `bash: cd: ${targetArg}: No such file or directory` }
  }

  // Current-relative
  if (raw.startsWith('./')) {
    const sub = raw.replace(/^\.\//, '').replace(/\/+$/, '')
    if (currentCur === 'home' && ['about', 'projects', 'resume', 'contact'].includes(sub)) {
      return { success: true, newCur: sub }
    }
    return { success: false, error: `bash: cd: ${targetArg}: No such file or directory` }
  }

  // Direct bare name
  const cleanBare = raw.replace(/\/+$/, '')
  if (['about', 'projects', 'resume', 'contact'].includes(cleanBare)) {
    if (currentCur === 'home') {
      return { success: true, newCur: cleanBare }
    }
    if (cleanBare === currentCur) {
      return { success: false, error: `bash: cd: ${targetArg}: No such file or directory (allaqachon ~/${cleanBare} papkasidasiz)` }
    }
    return { success: false, error: `bash: cd: ${targetArg}: No such file or directory (avval cd .. yoki cd ../${cleanBare} qiling)` }
  }

  return { success: false, error: `bash: cd: ${targetArg}: No such file or directory` }
}

function outputs(go) {
  return {
    home: [
      <div className="nf" key="nf">
        <pre>{TUX}</pre>
        <div style={{ whiteSpace: 'normal' }}>
          <div className="row"><span className="u">root</span><span className="d">@</span><span className="u">alijonov.uz</span></div>
          <div className="d">─────────────────</div>
          {[['Role', 'Backend developer'], ['OS', 'Ubuntu'], ['Stack', 'Python · Django · FastAPI'], ['DB', 'PostgreSQL · MySQL'], ['Tools', 'Docker · Git · Celery'], ['From', 'Fergana, Uzbekistan'], ['Uptime', '2021-yildan beri']].map(([a, b]) => (
            <div className="row" key={a}><span className="h" style={{ display: 'inline-block', width: '8ch' }}>{a}</span>: {b}</div>
          ))}
        </div>
      </div>,
      <div className="cta" key="cta">
        <button onClick={() => go('about')}>./about</button>
        <button onClick={() => go('projects')}>./projects</button>
        <button onClick={() => go('resume')}>./resume</button>
        <button onClick={() => go('contact')}>./contact</button>
      </div>,
    ],
    projects: [
      <div className="k" key="h"># Loyihalar (Projects)</div>,
      <div className="d" key="d1">## ishlab chiqilgan va production&apos;da ishlayotgan platformalar</div>,
      ...PROJECTS.map((p) => (
        <div className="job" key={p.slug} style={{ marginBottom: 18 }}>
          <div>
            <span className="h" style={{ fontSize: 16, fontWeight: 700 }}>{p.name}</span>
            <span className="d"> — {p.headline}</span>
          </div>
          <div style={{ marginTop: 6, lineHeight: 1.6 }}>{p.desc}</div>
          {p.note && <div className="d" style={{ marginTop: 4 }}>• {p.note}</div>}
          <div style={{ marginTop: 8 }}>
            <span className="d">stack: </span>
            {p.stack.map((t) => <span className="tag" key={t}>{t}</span>)}
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span>havola: → <a href={p.url} target="_blank" rel="noreferrer">{p.url}</a></span>
            <span className="d">status: <span className="u">{p.status}</span> ({p.access})</span>
          </div>
        </div>
      )),
      <div className="cta" key="cta">
        <button onClick={() => go('contact')}>../contact</button>
        <button onClick={() => go('resume')}>../resume</button>
      </div>,
    ],
    about: [
      <div className="k" key="h"># Abdulbosit Alijonov</div>,
      <div className="d" key="d1">## kim ekanim</div>,
      <div key="bio">Farg‘onalik backend dasturchiman. Dasturlashni 2021-yilda boshlaganman, shundan beri Telegram botlardan tortib katta tizimlargacha ishlab keldim. Toza kod va oddiy yechimlarni yoqtiraman.</div>,
      <div className="hr" key="hr1" />,
      <div className="d" key="d2">## nima bilan shug‘ullanaman</div>,
      <div key="act">• Yuqori yuklamaga chidamli backend tizimlari va RESTful API ishlab chiqish<br />• Murakkab xatolarni chuqur tahlil qilish (debugging) va tizim barqarorligini ta’minlash<br />• Docker yordamida loyihalarni konteynerlashtirish va serverga sozlash (deploy)<br />• Agile/Scrum muhitida jamoa bilan hamkorlikda toza arxitektura qurish</div>,
      <div className="hr" key="hr2" />,
      <div className="d" key="d3">## texnologiyalar</div>,
      <Groups data={ALL} key="all" />,
      <div className="cta" key="cta">
        <button onClick={() => go('projects')}>../projects</button>
        <button onClick={() => go('resume')}>../resume</button>
        <button onClick={() => go('contact')}>../contact</button>
      </div>,
    ],
    resume: [
      <div className="k" key="h"># Resume</div>,
      <div className="d" key="d1">## asosiy ko‘nikmalar</div>,
      <Groups data={MAIN} key="main" />,
      <div className="hr" key="hr1" />,
      <div className="d" key="d2">## tajriba</div>,
      ...JOBS.map(([t, w, items]) => (
        <div className="job" key={t}><span className="h">{t}</span><br /><span className="d">{w}</span>{items.map((x) => <div key={x}>• {x}</div>)}</div>
      )),
      <div className="hr" key="hr2" />,
      <div className="d" key="d3">## ta’lim</div>,
      <div className="job" key="edu"><span className="h">{EDU.title}</span><br /><span className="d">{EDU.where}</span>{EDU.lines.map((x) => <div key={x}>• {x}</div>)}</div>,
      <div className="hr" key="hr3" />,
      <div className="d" key="d4">## tillar</div>,
      <div key="langs">{LANGS.map(([a, b]) => <div className="row" key={a}>• {a} <span className="d">— {b}</span></div>)}</div>,
      <div className="cta" key="cta">
        <button onClick={() => window.open(RESUME_PDF, '_blank')}>resume.pdf</button>
        <button onClick={() => go('contact')}>../contact</button>
      </div>,
    ],
    contact: [
      <div className="k" key="h"># Aloqa</div>,
      ...LINKS.map(([k, label, url]) => (
        <div className="grp" key={k}><span className="h">{k}</span><span>→ <a href={url} target="_blank" rel="noreferrer">{label}</a></span></div>
      )),
      <div className="grp" key="loc"><span className="h">manzil</span><span>→ {LOCATION}</span></div>,
      <div className="d" key="note" style={{ marginTop: 10 }}>Loyiha yoki hamkorlik bo‘lsa, yozing — javob beraman.</div>,
      <div className="hr" key="hr" />,
      <div className="d" key="h_mail">## xabar yuborish</div>,
      <div key="mail_desc" style={{ marginTop: 6, lineHeight: 1.6 }}>
        Terminal orqali to‘g‘ridan-to‘g‘ri email yuborish:<br />
        • Interaktiv rejim: <span className="h">send-mail</span><br />
        • Parametrlar bilan: <span className="h">send-mail --help</span>
      </div>,
      <div className="cta" key="cta">
        <button onClick={() => go('projects')}>../projects</button>
        <button onClick={() => go('resume')}>../resume</button>
      </div>,
    ],
  }
}

function getDomainIp(target) {
  const known = {
    'kun.uz': '188.114.96.11',
    'daryo.uz': '104.26.12.115',
    'gazeta.uz': '104.21.32.45',
    'alijonov.uz': '185.199.108.153',
    'google.com': '142.250.185.78',
    'github.com': '140.82.121.4',
    'cloudflare.com': '104.16.132.229',
    'yandex.ru': '77.88.55.66',
    'telegram.org': '149.154.167.99',
    'localhost': '127.0.0.1',
  }
  const clean = target.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '')
  if (known[clean]) return { host: clean, ip: known[clean], valid: true }

  // IPv4 check
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(clean)) {
    const parts = clean.split('.').map(Number)
    if (parts.every((p) => p >= 0 && p <= 255)) {
      return { host: clean, ip: clean, valid: true }
    }
  }

  // Domain syntax check
  if (/^[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)+$/.test(clean)) {
    let hash = 0
    for (let i = 0; i < clean.length; i++) {
      hash = (hash << 5) - hash + clean.charCodeAt(i)
      hash |= 0
    }
    const o1 = 104 + (Math.abs(hash) % 80)
    const o2 = (Math.abs(hash >> 3) % 250) + 1
    const o3 = (Math.abs(hash >> 6) % 250) + 1
    const o4 = (Math.abs(hash >> 9) % 250) + 1
    return { host: clean, ip: `${o1}.${o2}.${o3}.${o4}`, valid: true }
  }

  return { host: clean, ip: null, valid: false }
}

/* ================== TERMINAL WINDOW COMPONENT ================== */
function TerminalWindow({
  win,
  isActive,
  isMobile,
  onActivate,
  onClose,
  onMinimize,
  onToggleMaximize,
  onSpawnWindow,
  onUpdateCur,
  registerGoTo,
  onStartDrag,
  onStartResize,
}) {
  const [cur, setCur] = useState(win.cur || 'home')
  const curRef = useRef(cur)
  curRef.current = cur

  const goToRef = useRef(null)
  const goToProxy = (t) => {
    if (goToRef.current) goToRef.current(t)
  }

  const [history, setHistory] = useState(() => {
    const initCur = win.cur || 'home'
    const initCmd = initCur === 'home' ? 'cat README.md' : `cat ${initCur}.md`
    return [
      <div key="init-echo" className="term-line term-echo">
        <Prompt path={initCur} />
        <div className="term-input-wrapper">
          <span className="term-typed-text">{initCmd}</span>
        </div>
      </div>,
      <div key="init-out" className="o">
        {outputs(goToProxy)[initCur]}
      </div>,
    ]
  })
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [wizard, setWizard] = useState(null)
  const [inputVal, setInputVal] = useState('')
  const [loading, setLoading] = useState(false)
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef(null)

  const [isPinging, setIsPinging] = useState(false)
  const pingIntervalRef = useRef(null)
  const pingCancelRef = useRef(null)

  useEffect(() => {
    return () => {
      if (pingCancelRef.current) {
        pingCancelRef.current()
      } else if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current)
        pingIntervalRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!isPinging) return
    const onGlobalKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault()
        e.stopPropagation()
        if (pingCancelRef.current) {
          pingCancelRef.current()
        }
      }
    }
    window.addEventListener('keydown', onGlobalKey, true)
    return () => window.removeEventListener('keydown', onGlobalKey, true)
  }, [isPinging])

  const inputRef = useRef(null)
  const termRef = useRef(null)
  const bottomAnchorRef = useRef(null)

  useEffect(() => {
    onUpdateCur(cur)
  }, [cur])

  const touchTyping = () => {
    setIsTyping(true)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 600)
  }

  const syncSelection = (targetEl) => {
    const el = targetEl || inputRef.current
    if (el) {
      const start = el.selectionStart ?? 0
      const end = el.selectionEnd ?? start
      setSelection({ start, end })
    }
  }

  const setInputValueAndCaret = (val, caretPos) => {
    setInputVal(val)
    const pos = caretPos !== undefined ? caretPos : val.length
    setSelection({ start: pos, end: pos })
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(pos, pos)
      }
    })
  }

  const scrollToBottom = (smooth = false) => {
    const behavior = smooth ? 'smooth' : 'auto'
    if (termRef.current) {
      if (smooth) {
        termRef.current.scrollTo({ top: termRef.current.scrollHeight, behavior: 'smooth' })
      } else {
        termRef.current.scrollTop = termRef.current.scrollHeight
      }
    }
    if (bottomAnchorRef.current) {
      bottomAnchorRef.current.scrollIntoView({ behavior, block: 'end' })
    }
  }

  useEffect(() => {
    scrollToBottom(false)
    const t = setTimeout(() => scrollToBottom(false), 50)
    return () => clearTimeout(t)
  }, [history, cur, wizard, loading])

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true })
    }
  }

  useEffect(() => {
    if (isActive) {
      focusInput()
      const t = setTimeout(focusInput, 50)
      return () => clearTimeout(t)
    }
  }, [isActive, cur, wizard, loading])

  const addHistory = (nodes) => {
    setHistory((prev) => [...prev, ...nodes])
  }

  // GUI orqali yoki tezkor navigatsiya
  const goTo = (target) => {
    const prevCur = curRef.current
    setCur(target)

    let cmd = ''
    if (target === 'home') {
      cmd = prevCur === 'home' ? 'cat README.md' : 'cd .. && cat README.md'
    } else {
      if (prevCur === 'home') {
        cmd = `cd ${target} && cat ${target}.md`
      } else if (prevCur === target) {
        cmd = `cat ${target}.md`
      } else {
        cmd = `cd ../${target} && cat ${target}.md`
      }
    }

    addHistory([
      <div key={Date.now()} className="term-line term-echo">
        <Prompt path={prevCur} />
        <div className="term-input-wrapper">
          <span className="term-typed-text">{cmd}</span>
        </div>
      </div>,
      <div key={Date.now() + 1} className="o">
        {outputs(goToProxy)[target]}
      </div>,
    ])
    setTimeout(() => scrollToBottom(), 40)
  }

  useEffect(() => {
    goToRef.current = goTo
  }, [goTo])

  useEffect(() => {
    registerGoTo(win.id, goTo)
    return () => registerGoTo(win.id, null)
  }, [goTo, win.id])

  const sendEmail = async (n, e, m) => {
    setLoading(true)
    addHistory([
      <div key={Date.now()} className="term-msg"><span className="h">[*]</span> Pochta serveriga ulanilmoqda...</div>,
    ])
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: n, email: e, message: m }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        addHistory([
          <div key={Date.now() + 1} className="term-msg">
            <span className="u">[+]</span> <span className="u" style={{ fontWeight: 700 }}>Xabar muvaffaqiyatli yetkazildi!</span> Tez orada javob qaytaraman.
          </div>,
        ])
      } else {
        addHistory([
          <div key={Date.now() + 1} className="term-msg">
            <span className="k">[-] Xatolik:</span> {data.error || 'Yuborishda xatolik yuz berdi'}
          </div>,
        ])
      }
    } catch (err) {
      addHistory([
        <div key={Date.now() + 1} className="term-msg">
          <span className="k">[-] Tarmoq xatoligi:</span> {err.message}
        </div>,
      ])
    } finally {
      setLoading(false)
      setWizard(null)
    }
  }

  const getHelpNode = () => (
    <div key={Date.now() + 1} className="term-msg" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>
      <span className="d">GNU bash, version 5.3.9(1)-release (x86_64-pc-linux-gnu)</span><br />
      <span className="d">These shell commands are defined internally. Type `help&apos; to see this list.</span><br />
      <span className="d">Type `send-mail --help&apos; to find out more about sending emails.</span><br /><br />
      {'  '}<span className="h" style={{ display: 'inline-block', width: '28ch' }}>cd [dir]</span><span className="h">pwd</span><br />
      {'  '}<span className="h" style={{ display: 'inline-block', width: '28ch' }}>cat &lt;file.md&gt;</span><span className="h">ls [-la]</span><br />
      {'  '}<span className="h" style={{ display: 'inline-block', width: '28ch' }}>ping &lt;host&gt;</span><span className="h">clear</span><br />
      {'  '}<span className="h" style={{ display: 'inline-block', width: '28ch' }}>send-mail [options]</span><span className="h">history</span><br />
      {'  '}<span className="h" style={{ display: 'inline-block', width: '28ch' }}>new / open [dir]</span><span className="h">help</span><br />
      {'  '}<span className="h" style={{ display: 'inline-block', width: '28ch' }}>whoami / uname / date</span><span className="h">cd ..</span><br /><br />
      <span className="d">Directories:</span><br />
      {'  '}<span className="u" style={{ display: 'inline-block', width: '28ch' }}>about/</span><span className="u">projects/</span><br />
      {'  '}<span className="u" style={{ display: 'inline-block', width: '28ch' }}>resume/</span><span className="u">contact/</span><br />
      {'  '}<span className="u" style={{ display: 'inline-block', width: '28ch' }}>~ (home)</span><br /><br />
      <span className="d">Files:</span><br />
      {'  '}<span style={{ display: 'inline-block', width: '28ch' }}>README.md</span><span>about.md</span><br />
      {'  '}<span style={{ display: 'inline-block', width: '28ch' }}>projects.md</span><span>meetly.md</span><br />
      {'  '}<span style={{ display: 'inline-block', width: '28ch' }}>authly.md</span><span>fragmently.md</span><br />
      {'  '}<span style={{ display: 'inline-block', width: '28ch' }}>resume.md</span><span>contact.md</span><br />
      {'  '}<span style={{ display: 'inline-block', width: '28ch' }}>resume.pdf</span>
    </div>
  )

  const handleSendMailCmd = (tokens, echoLine) => {
    if (tokens.includes('--help') || tokens.includes('-h')) {
      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg" style={{ whiteSpace: 'pre-wrap' }}>
          <span className="h">Usage:</span> send-mail [options]<br /><br />
          <span className="d">Options:</span><br />
          {'  '}<span className="u">-n, --name</span> &lt;string&gt;     Ism va familiyangiz<br />
          {'  '}<span className="u">-e, --email</span> &lt;email&gt;     Javob qaytarish uchun emailingiz<br />
          {'  '}<span className="u">-m, --message</span> &lt;string&gt;  Xabar matni<br />
          {'  '}<span className="u">-h, --help</span>             Ushbu yordam oynasini chiqarish<br /><br />
          <span className="d">Examples:</span><br />
          {'  '}<span className="h">send-mail</span> <span className="d">(interaktiv rejim)</span><br />
          {'  '}<span className="h">send-mail --name &quot;Alijonov Abdulbosit&quot; --email &quot;me@alijonov.uz&quot; --message &quot;Salom!&quot;</span>
        </div>,
      ])
      return
    }

    let nameVal = ''
    let emailVal = ''
    let msgVal = ''
    for (let i = 1; i < tokens.length; i++) {
      const t = tokens[i]
      if ((t === '--name' || t === '-n') && tokens[i + 1]) nameVal = tokens[++i]
      else if ((t === '--email' || t === '-e') && tokens[i + 1]) emailVal = tokens[++i]
      else if ((t === '--message' || t === '-m') && tokens[i + 1]) msgVal = tokens[++i]
    }

    if (nameVal && emailVal && msgVal) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            <span className="k">[-] Xatolik:</span> Email formati noto‘g‘ri (&apos;{emailVal}&apos;)
          </div>,
        ])
        return
      }
      addHistory([echoLine])
      sendEmail(nameVal, emailVal, msgVal)
      return
    }

    addHistory([
      echoLine,
      <div key={Date.now() + 1} className="term-msg d">
        --- Interaktiv xabar yuborish (bekor qilish: &apos;exit&apos;) ---
      </div>,
    ])

    if (!nameVal) {
      setWizard({ step: 'name', name: '', email: '', message: '' })
    } else if (!emailVal) {
      addHistory([<div key={Date.now() + 2} className="term-msg"><span className="u">&gt;</span> Ism: {nameVal}</div>])
      setWizard({ step: 'email', name: nameVal, email: '', message: '' })
    } else {
      addHistory([
        <div key={Date.now() + 2} className="term-msg"><span className="u">&gt;</span> Ism: {nameVal}</div>,
        <div key={Date.now() + 3} className="term-msg"><span className="u">&gt;</span> Email: {emailVal}</div>,
      ])
      setWizard({ step: 'message', name: nameVal, email: emailVal, message: '' })
    }
  }

  const handlePing = (cmdStr, echoLine) => {
    const rawArgs = cmdStr.replace(/^ping\s*/, '').trim()
    if (!rawArgs) {
      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          ping: usage error: Destination address required
        </div>,
      ])
      return
    }

    const parts = rawArgs.split(/\s+/).filter(Boolean)
    let count = 0
    let dest = ''

    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === '-c' && parts[i + 1]) {
        const n = parseInt(parts[i + 1], 10)
        if (!isNaN(n) && n > 0) count = Math.min(n, 50)
        i++
      } else if (!parts[i].startsWith('-')) {
        dest = parts[i]
      }
    }

    if (!dest) {
      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          ping: usage error: Destination address required
        </div>,
      ])
      return
    }

    const { host, ip, valid } = getDomainIp(dest)
    if (!valid || !ip) {
      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          ping: {dest}: No address associated with hostname
        </div>,
      ])
      return
    }

    const maxPackets = count > 0 ? count : 30
    const startTime = Date.now()
    const rtts = []
    let seq = 1
    let initialTimer = null

    addHistory([
      echoLine,
      <div key={`ping-hdr-${Date.now()}`} className="term-msg" style={{ fontFamily: 'inherit' }}>
        PING {host} ({ip}) 56(84) bytes of data.
      </div>,
    ])

    setIsPinging(true)

    const finishPing = (wasCancelled = false) => {
      if (initialTimer) {
        clearTimeout(initialTimer)
        initialTimer = null
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current)
        pingIntervalRef.current = null
      }
      setIsPinging(false)
      pingCancelRef.current = null

      const totalTime = Date.now() - startTime
      const transmitted = wasCancelled ? (seq - 1) : rtts.length
      const received = rtts.length
      const loss = transmitted > 0 ? Math.round(((transmitted - received) / transmitted) * 100) : 0

      const statsNodes = []
      if (wasCancelled) {
        statsNodes.push(<span key={`ctrlc-${Date.now()}`} className="d" style={{ display: 'block', margin: '4px 0' }}>^C</span>)
      }

      if (rtts.length > 0) {
        const min = Math.min(...rtts).toFixed(3)
        const avg = (rtts.reduce((a, b) => a + b, 0) / rtts.length).toFixed(3)
        const max = Math.max(...rtts).toFixed(3)
        const mean = +avg
        const variance = rtts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / rtts.length
        const mdev = Math.sqrt(variance).toFixed(3)

        statsNodes.push(
          <div key={`stats-${Date.now()}`} className="term-msg" style={{ fontFamily: 'inherit', marginTop: 4 }}>
            --- {host} ping statistics ---<br />
            {transmitted} packets transmitted, {received} received, {loss}% packet loss, time {totalTime}ms<br />
            rtt min/avg/max/mdev = {min}/{avg}/{max}/{mdev} ms
          </div>
        )
      } else {
        statsNodes.push(
          <div key={`stats-${Date.now()}`} className="term-msg" style={{ fontFamily: 'inherit', marginTop: 4 }}>
            --- {host} ping statistics ---<br />
            {transmitted} packets transmitted, 0 received, 100% packet loss, time {totalTime}ms
          </div>
        )
      }

      addHistory(statsNodes)
      setTimeout(() => {
        scrollToBottom()
        focusInput()
      }, 40)
    }

    pingCancelRef.current = () => finishPing(true)

    const sendOnePacket = () => {
      if (seq > maxPackets) {
        finishPing(false)
        return
      }

      const baseMs = (host === 'kun.uz' || host.endsWith('.uz')) ? 81 : 48
      const jitter = (Math.random() * 5) - 2.5
      const spike = (seq === 17) ? 17.5 : 0
      const rtt = +(baseMs + jitter + spike).toFixed(1)
      rtts.push(rtt)

      const line = `64 bytes from ${ip}: icmp_seq=${seq} ttl=50 time=${rtt} ms`
      addHistory([
        <div key={`pkt-${Date.now()}-${seq}`} className="term-msg" style={{ fontFamily: 'inherit' }}>
          {line}
        </div>,
      ])
      scrollToBottom()
      seq++

      if (seq > maxPackets) {
        finishPing(false)
      }
    }

    initialTimer = setTimeout(() => {
      sendOnePacket()
      if (seq <= maxPackets) {
        pingIntervalRef.current = setInterval(sendOnePacket, 850)
      }
    }, 120)
  }

  const handleChainedCommand = (fullCmd, echoLine) => {
    const subCmds = fullCmd.split('&&').map((s) => s.trim()).filter(Boolean)
    let runningCur = cur
    const outputNodes = []

    for (let i = 0; i < subCmds.length; i++) {
      const sub = subCmds[i]

      // 1. cd yoki papka yo'nalishi
      if (sub === 'cd' || sub.startsWith('cd ') || ['about', 'projects', 'resume', 'contact', './about', './projects', './resume', './contact', '../about', '../projects', '../resume', '../contact', '..', '~'].includes(sub)) {
        const rawTarget = sub.startsWith('cd ') ? sub.slice(3).trim() : (sub === 'cd' ? '' : sub)
        const res = resolveCd(rawTarget, runningCur)
        if (res.success) {
          runningCur = res.newCur
        } else {
          outputNodes.push(
            <div key={Date.now() + i} className="term-msg">
              {res.error}
            </div>
          )
          break
        }
        continue
      }

      // 2. cat buyruqlari
      if (sub.startsWith('cat ') || sub.endsWith('.md') || sub.endsWith('.pdf')) {
        let file = sub.startsWith('cat ') ? sub.slice(4).trim() : sub
        file = file.replace(/^\.\//, '')

        if (file === 'README.md' || file === 'readme.md') {
          if (runningCur === 'home') {
            outputNodes.push(<div key={Date.now() + i} className="o">{outputs(goTo)['home']}</div>)
          } else {
            outputNodes.push(
              <div key={Date.now() + i} className="term-msg">
                cat: README.md: No such file or directory. (<span className="h">cd ~</span> qiling)
              </div>
            )
            break
          }
          continue
        }

        if (file === 'about.md' || file === 'about/about.md') {
          if (runningCur === 'about' || (runningCur === 'home' && file === 'about/about.md')) {
            outputNodes.push(<div key={Date.now() + i} className="o">{outputs(goTo)['about']}</div>)
          } else {
            outputNodes.push(
              <div key={Date.now() + i} className="term-msg">
                cat: about.md: No such file or directory. (<span className="h">cd about</span> yoki <span className="h">cat about/about.md</span> qiling)
              </div>
            )
            break
          }
          continue
        }

        if (file === 'projects.md' || file === 'projects/projects.md') {
          if (runningCur === 'projects' || (runningCur === 'home' && file === 'projects/projects.md')) {
            outputNodes.push(<div key={Date.now() + i} className="o">{outputs(goTo)['projects']}</div>)
          } else {
            outputNodes.push(
              <div key={Date.now() + i} className="term-msg">
                cat: projects.md: No such file or directory. (<span className="h">cd projects</span> yoki <span className="h">cat projects/projects.md</span> qiling)
              </div>
            )
            break
          }
          continue
        }

        if (file === 'meetly.md' || file === 'projects/meetly.md') {
          if (runningCur === 'projects' || (runningCur === 'home' && file === 'projects/meetly.md')) {
            outputNodes.push(<div key={Date.now() + i} className="o">{singleProjectOutput('meetly')}</div>)
          } else {
            outputNodes.push(
              <div key={Date.now() + i} className="term-msg">
                cat: meetly.md: No such file or directory. (<span className="h">cd projects</span> qiling)
              </div>
            )
            break
          }
          continue
        }

        if (file === 'authly.md' || file === 'projects/authly.md') {
          if (runningCur === 'projects' || (runningCur === 'home' && file === 'projects/authly.md')) {
            outputNodes.push(<div key={Date.now() + i} className="o">{singleProjectOutput('authly')}</div>)
          } else {
            outputNodes.push(
              <div key={Date.now() + i} className="term-msg">
                cat: authly.md: No such file or directory. (<span className="h">cd projects</span> qiling)
              </div>
            )
            break
          }
          continue
        }

        if (file === 'fragmently.md' || file === 'projects/fragmently.md') {
          if (runningCur === 'projects' || (runningCur === 'home' && file === 'projects/fragmently.md')) {
            outputNodes.push(<div key={Date.now() + i} className="o">{singleProjectOutput('fragmently')}</div>)
          } else {
            outputNodes.push(
              <div key={Date.now() + i} className="term-msg">
                cat: fragmently.md: No such file or directory. (<span className="h">cd projects</span> qiling)
              </div>
            )
            break
          }
          continue
        }

        if (file === 'resume.md' || file === 'resume/resume.md') {
          if (runningCur === 'resume' || (runningCur === 'home' && file === 'resume/resume.md')) {
            outputNodes.push(<div key={Date.now() + i} className="o">{outputs(goTo)['resume']}</div>)
          } else {
            outputNodes.push(
              <div key={Date.now() + i} className="term-msg">
                cat: resume.md: No such file or directory. (<span className="h">cd resume</span> yoki <span className="h">cat resume/resume.md</span> qiling)
              </div>
            )
            break
          }
          continue
        }

        if (file === 'resume.pdf' || file === 'resume/resume.pdf') {
          if (runningCur === 'resume' || (runningCur === 'home' && file === 'resume/resume.pdf')) {
            window.open(RESUME_PDF, '_blank')
            outputNodes.push(
              <div key={Date.now() + i} className="term-msg">
                <span className="u">[+]</span> resume.pdf ochilmoqda (yangi oynada)...
              </div>
            )
          } else {
            outputNodes.push(
              <div key={Date.now() + i} className="term-msg">
                cat: resume.pdf: No such file or directory. (<span className="h">cd resume</span> qiling)
              </div>
            )
            break
          }
          continue
        }

        if (file === 'contact.md' || file === 'contact/contact.md') {
          if (runningCur === 'contact' || (runningCur === 'home' && file === 'contact/contact.md')) {
            outputNodes.push(<div key={Date.now() + i} className="o">{outputs(goTo)['contact']}</div>)
          } else {
            outputNodes.push(
              <div key={Date.now() + i} className="term-msg">
                cat: contact.md: No such file or directory. (<span className="h">cd contact</span> yoki <span className="h">cat contact/contact.md</span> qiling)
              </div>
            )
            break
          }
          continue
        }

        outputNodes.push(
          <div key={Date.now() + i} className="term-msg">
            cat: {file}: No such file or directory
          </div>
        )
        break
      }

      // 3. pwd
      if (sub === 'pwd') {
        const p = runningCur === 'home' ? '/root' : `/root/${runningCur}`
        outputNodes.push(<div key={Date.now() + i} className="term-msg">{p}</div>)
        continue
      }

      // 4. echo
      if (sub.startsWith('echo ')) {
        const msg = sub.slice(5).replace(/^["']|["']$/g, '')
        outputNodes.push(<div key={Date.now() + i} className="term-msg">{msg}</div>)
        continue
      }

      // 5. ls
      if (sub === 'ls' || sub === 'dir' || sub.startsWith('ls ')) {
        let lsContent = null
        if (runningCur === 'home') {
          lsContent = (
            <div key={Date.now() + i} className="term-msg">
              <span className="u" style={{ marginRight: 24 }}>README.md</span>
              <span className="h" style={{ marginRight: 24, fontWeight: 700 }}>about/</span>
              <span className="h" style={{ marginRight: 24, fontWeight: 700 }}>projects/</span>
              <span className="h" style={{ marginRight: 24, fontWeight: 700 }}>resume/</span>
              <span className="h" style={{ fontWeight: 700 }}>contact/</span>
            </div>
          )
        } else if (runningCur === 'about') {
          lsContent = <div key={Date.now() + i} className="term-msg"><span>about.md</span></div>
        } else if (runningCur === 'projects') {
          lsContent = (
            <div key={Date.now() + i} className="term-msg">
              <span style={{ marginRight: 24 }}>projects.md</span>
              <span style={{ marginRight: 24 }}>meetly.md</span>
              <span style={{ marginRight: 24 }}>authly.md</span>
              <span>fragmently.md</span>
            </div>
          )
        } else if (runningCur === 'resume') {
          lsContent = (
            <div key={Date.now() + i} className="term-msg">
              <span style={{ marginRight: 24 }}>resume.md</span>
              <span className="u">resume.pdf</span>
            </div>
          )
        } else if (runningCur === 'contact') {
          lsContent = <div key={Date.now() + i} className="term-msg"><span>contact.md</span></div>
        }
        outputNodes.push(lsContent)
        continue
      }

      outputNodes.push(
        <div key={Date.now() + i} className="term-msg">
          bash: {sub}: command not found
        </div>
      )
      break
    }

    if (runningCur !== cur) {
      setCur(runningCur)
    }

    addHistory([echoLine, ...outputNodes])
  }

  const handleCommand = (raw) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    const echoLine = (
      <div key={Date.now()} className="term-line term-echo">
        <Prompt path={cur} />
        <div className="term-input-wrapper">
          <span className="term-typed-text">{trimmed}</span>
        </div>
      </div>
    )

    if (trimmed.includes('&&')) {
      handleChainedCommand(trimmed, echoLine)
      return
    }

    if (trimmed === 'clear') {
      setHistory([])
      setWizard(null)
      return
    }

    // ping <destination>
    if (trimmed === 'ping' || trimmed.startsWith('ping ') || trimmed.startsWith('ping\t')) {
      handlePing(trimmed, echoLine)
      return
    }

    // new / new-term / open
    if (trimmed === 'new' || trimmed === 'new-term' || trimmed === 'new-window') {
      const ok = onSpawnWindow('home')
      if (ok === false) {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            <span className="w">[!]</span> Maksimal 10 ta oyna ochish mumkin. Avval mavjud oynalardan birini yoping.
          </div>,
        ])
      } else {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            <span className="u">[+]</span> Yangi terminal oynasi ochildi.
          </div>,
        ])
      }
      return
    }

    if (trimmed.startsWith('open ') || trimmed === 'open') {
      const targetDir = trimmed.startsWith('open ') ? trimmed.slice(5).trim() : 'home'
      const ok = onSpawnWindow(targetDir || 'home')
      if (ok === false) {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            <span className="w">[!]</span> Maksimal 10 ta oyna ochish mumkin. Avval mavjud oynalardan birini yoping.
          </div>,
        ])
      } else {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            <span className="u">[+]</span> Yangi oynada ochilmoqda: {targetDir}
          </div>,
        ])
      }
      return
    }

    // ls / dir
    if (trimmed === 'ls' || trimmed === 'dir' || trimmed.startsWith('ls ') || trimmed.startsWith('dir ')) {
      let lsContent = null
      if (cur === 'home') {
        lsContent = (
          <div key={Date.now() + 1} className="term-msg">
            <span className="u" style={{ marginRight: 24 }}>README.md</span>
            <span className="h" style={{ marginRight: 24, fontWeight: 700 }}>about/</span>
            <span className="h" style={{ marginRight: 24, fontWeight: 700 }}>projects/</span>
            <span className="h" style={{ marginRight: 24, fontWeight: 700 }}>resume/</span>
            <span className="h" style={{ fontWeight: 700 }}>contact/</span>
          </div>
        )
      } else if (cur === 'about') {
        lsContent = (
          <div key={Date.now() + 1} className="term-msg">
            <span>about.md</span>
          </div>
        )
      } else if (cur === 'projects') {
        lsContent = (
          <div key={Date.now() + 1} className="term-msg">
            <span style={{ marginRight: 24 }}>projects.md</span>
            <span style={{ marginRight: 24 }}>meetly.md</span>
            <span style={{ marginRight: 24 }}>authly.md</span>
            <span>fragmently.md</span>
          </div>
        )
      } else if (cur === 'resume') {
        lsContent = (
          <div key={Date.now() + 1} className="term-msg">
            <span style={{ marginRight: 24 }}>resume.md</span>
            <span className="u">resume.pdf</span>
          </div>
        )
      } else if (cur === 'contact') {
        lsContent = (
          <div key={Date.now() + 1} className="term-msg">
            <span>contact.md</span>
          </div>
        )
      }
      addHistory([echoLine, lsContent])
      return
    }

    // pwd
    if (trimmed === 'pwd') {
      const p = cur === 'home' ? '/root' : `/root/${cur}`
      addHistory([echoLine, <div key={Date.now() + 1} className="term-msg">{p}</div>])
      return
    }

    // cd [dir]
    if (trimmed.startsWith('cd ') || trimmed === 'cd') {
      const rawTarget = trimmed.startsWith('cd ') ? trimmed.slice(3).trim() : ''
      const res = resolveCd(rawTarget, cur)
      if (res.success) {
        setCur(res.newCur)
        addHistory([echoLine])
      } else {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            {res.error}
          </div>,
        ])
      }
      return
    }

    // about.md / cat about.md
    if (trimmed === 'cat about.md' || trimmed === 'about.md' || trimmed === './about.md' || trimmed === 'cat about/about.md' || trimmed === 'cat about.m') {
      if (cur === 'about' || cur === 'home' || trimmed === 'cat about/about.md') {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="o">
            {outputs(goTo)['about']}
          </div>,
        ])
      } else {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            cat: about.md: No such file or directory. (<span className="h">cd about</span> yoki <span className="h">cat about/about.md</span> qiling)
          </div>,
        ])
      }
      return
    }

    // projects.md / cat projects.md
    if (trimmed === 'cat projects.md' || trimmed === 'projects.md' || trimmed === './projects.md' || trimmed === 'cat projects/projects.md' || trimmed === 'cat projects.m') {
      if (cur === 'projects' || cur === 'home' || trimmed === 'cat projects/projects.md') {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="o">
            {outputs(goTo)['projects']}
          </div>,
        ])
      } else {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            cat: projects.md: No such file or directory. (<span className="h">cd projects</span> yoki <span className="h">cat projects/projects.md</span> qiling)
          </div>,
        ])
      }
      return
    }

    // meetly.md
    if (trimmed === 'cat meetly.md' || trimmed === 'meetly.md' || trimmed === './meetly.md' || trimmed === 'cat projects/meetly.md' || trimmed === 'cat meetly.m') {
      if (cur === 'projects' || cur === 'home' || trimmed === 'cat projects/meetly.md') {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="o">
            {singleProjectOutput('meetly')}
          </div>,
        ])
      } else {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            cat: meetly.md: No such file or directory. (<span className="h">cd projects</span> qiling)
          </div>,
        ])
      }
      return
    }

    // authly.md
    if (trimmed === 'cat authly.md' || trimmed === 'authly.md' || trimmed === './authly.md' || trimmed === 'cat projects/authly.md' || trimmed === 'cat authly.m') {
      if (cur === 'projects' || cur === 'home' || trimmed === 'cat projects/authly.md') {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="o">
            {singleProjectOutput('authly')}
          </div>,
        ])
      } else {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            cat: authly.md: No such file or directory. (<span className="h">cd projects</span> qiling)
          </div>,
        ])
      }
      return
    }

    // fragmently.md
    if (trimmed === 'cat fragmently.md' || trimmed === 'fragmently.md' || trimmed === './fragmently.md' || trimmed === 'cat projects/fragmently.md' || trimmed === 'cat fragmently.m') {
      if (cur === 'projects' || cur === 'home' || trimmed === 'cat projects/fragmently.md') {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="o">
            {singleProjectOutput('fragmently')}
          </div>,
        ])
      } else {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            cat: fragmently.md: No such file or directory. (<span className="h">cd projects</span> qiling)
          </div>,
        ])
      }
      return
    }

    // resume.md
    if (trimmed === 'cat resume.md' || trimmed === 'resume.md' || trimmed === './resume.md' || trimmed === 'cat resume/resume.md' || trimmed === 'cat resume.m' || trimmed === 'cat resumem') {
      if (cur === 'resume' || cur === 'home' || trimmed === 'cat resume/resume.md') {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="o">
            {outputs(goTo)['resume']}
          </div>,
        ])
      } else {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            cat: resume.md: No such file or directory. (<span className="h">cd resume</span> yoki <span className="h">cat resume/resume.md</span> qiling)
          </div>,
        ])
      }
      return
    }

    // resume.pdf
    if (trimmed === 'cat resume.pdf' || trimmed === 'resume.pdf' || trimmed === './resume.pdf' || trimmed === 'cat resume/resume.pdf' || trimmed === 'cat resume.p' || trimmed === 'cat resumep') {
      window.open(RESUME_PDF, '_blank')
      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          <span className="u">[+]</span> resume.pdf ochilmoqda (yangi oynada)...
        </div>,
      ])
      return
    }

    // contact.md
    if (trimmed === 'cat contact.md' || trimmed === 'contact.md' || trimmed === './contact.md' || trimmed === 'cat contact/contact.md' || trimmed === 'cat contact.m') {
      if (cur === 'contact' || cur === 'home' || trimmed === 'cat contact/contact.md') {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="o">
            {outputs(goTo)['contact']}
          </div>,
        ])
      } else {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            cat: contact.md: No such file or directory. (<span className="h">cd contact</span> yoki <span className="h">cat contact/contact.md</span> qiling)
          </div>,
        ])
      }
      return
    }

    // README.md
    if (trimmed === 'cat README.md' || trimmed === 'README.md' || trimmed === './README.md' || trimmed === 'cat readme.md' || trimmed === 'readme.md') {
      if (cur === 'home') {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="o">
            {outputs(goTo)['home']}
          </div>,
        ])
      } else {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            cat: README.md: No such file or directory. (<span className="h">cd ~</span> qiling)
          </div>,
        ])
      }
      return
    }

    // Quick shortcuts
    if (['about', 'projects', 'resume', 'contact', './about', './projects', './resume', './contact', '../about', '../projects', '../resume', '../contact', 'about/', 'projects/', 'resume/', 'contact/'].includes(trimmed)) {
      const res = resolveCd(trimmed, cur)
      if (res.success) {
        setCur(res.newCur)
        addHistory([echoLine])
      } else {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg">
            {res.error}
          </div>,
        ])
      }
      return
    }

    // cat invalid file
    if (trimmed.startsWith('cat ')) {
      const f = trimmed.slice(4).trim()
      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          cat: {f}: No such file or directory
        </div>,
      ])
      return
    }

    if (trimmed === 'help') {
      addHistory([echoLine, getHelpNode()])
      return
    }

    // whoami
    if (trimmed === 'whoami') {
      addHistory([echoLine, <div key={Date.now() + 1} className="term-msg">root</div>])
      return
    }

    // uname
    if (trimmed === 'uname' || trimmed === 'uname -a' || trimmed === 'uname -r') {
      const full = trimmed === 'uname -a'
        ? 'Linux alijonov 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux'
        : 'Linux'
      addHistory([echoLine, <div key={Date.now() + 1} className="term-msg">{full}</div>])
      return
    }

    // uptime
    if (trimmed === 'uptime') {
      const now = new Date()
      const h = now.getHours().toString().padStart(2, '0')
      const m = now.getMinutes().toString().padStart(2, '0')
      addHistory([echoLine, <div key={Date.now() + 1} className="term-msg"> {h}:{m}:00 up 3 years, 2:21,  1 user,  load average: 0.08, 0.04, 0.01</div>])
      return
    }

    // date
    if (trimmed === 'date') {
      addHistory([echoLine, <div key={Date.now() + 1} className="term-msg">{new Date().toString()}</div>])
      return
    }

    // echo
    if (trimmed.startsWith('echo ')) {
      const msg = trimmed.slice(5)
      const cleaned = msg.replace(/^["']|["']$/g, '')
      addHistory([echoLine, <div key={Date.now() + 1} className="term-msg">{cleaned}</div>])
      return
    }

    // history
    if (trimmed === 'history') {
      if (cmdHistory.length === 0) {
        addHistory([echoLine, <div key={Date.now() + 1} className="term-msg d">(buyruqlar tarixi bo'sh)</div>])
      } else {
        const histLines = cmdHistory.map((c, i) => (
          <div key={i} className="term-msg">
            <span className="d" style={{ display: 'inline-block', width: '5ch', textAlign: 'right', marginRight: 8 }}>{i + 1}</span>
            {c}
          </div>
        ))
        addHistory([echoLine, ...histLines])
      }
      return
    }

    // exit / logout
    if (trimmed === 'exit' || trimmed === 'logout') {
      onClose()
      return
    }

    // Joke commands
    if (trimmed.startsWith('rm -rf') || trimmed.startsWith('rm -r')) {
      const rawTarget = trimmed.replace(/^rm\s+(-rf|-r)\s*/, '').trim()
      let target = rawTarget || '/'
      if (target === 'resume.m' || target === 'resumem') target = 'resume.md'
      else if (target === 'resume.p' || target === 'resumep') target = 'resume.pdf'
      else if (target === 'about.m') target = 'about.md'
      else if (target === 'projects.m') target = 'projects.md'
      else if (target === 'contact.m') target = 'contact.md'

      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          <span className="k">rm:</span> cannot remove &apos;{target}&apos;: Read-only file system (portfolioni o‘chirib bo‘lmaydi :)
        </div>,
      ])
      return
    }

    if (trimmed.startsWith('rm ') || trimmed === 'rm') {
      const rawTarget = trimmed.startsWith('rm ') ? trimmed.slice(3).trim() : ''
      let target = rawTarget || 'file'
      if (target === 'resume.m' || target === 'resumem') target = 'resume.md'
      else if (target === 'resume.p' || target === 'resumep') target = 'resume.pdf'
      else if (target === 'about.m') target = 'about.md'
      else if (target === 'projects.m') target = 'projects.md'
      else if (target === 'contact.m') target = 'contact.md'

      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          <span className="k">rm:</span> cannot remove &apos;{target}&apos;: Read-only file system (faylni o‘chirish taqiqlangan :)
        </div>,
      ])
      return
    }

    if (trimmed.startsWith('mkdir') || trimmed === 'mkdir') {
      const rawTarget = trimmed.startsWith('mkdir ') ? trimmed.slice(6).trim() : ''
      const target = rawTarget || 'new_dir'
      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          <span className="k">mkdir:</span> cannot create directory &apos;{target}&apos;: Read-only file system (papka yaratish cheklangan :)
        </div>,
      ])
      return
    }

    if (trimmed.startsWith('rmdir') || trimmed === 'rmdir') {
      const rawTarget = trimmed.startsWith('rmdir ') ? trimmed.slice(6).trim() : ''
      const target = rawTarget || 'dir'
      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          <span className="k">rmdir:</span> failed to remove &apos;{target}&apos;: Read-only file system (papkalarni o‘chirib bo‘lmaydi :)
        </div>,
      ])
      return
    }

    if (trimmed.startsWith('touch ') || trimmed === 'touch') {
      const rawTarget = trimmed.startsWith('touch ') ? trimmed.slice(6).trim() : ''
      let target = rawTarget || 'new_file'
      if (target === 'resume.m' || target === 'resumem') target = 'resume.md'
      else if (target === 'resume.p' || target === 'resumep') target = 'resume.pdf'
      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          <span className="k">touch:</span> cannot touch &apos;{target}&apos;: Read-only file system (fayl yaratish cheklangan :)
        </div>,
      ])
      return
    }

    if (trimmed.startsWith('sudo')) {
      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          <span className="u">root@alijonov:</span> siz allaqachon root huquqidasiz, sudo kerak emas :)
        </div>,
      ])
      return
    }

    if (trimmed.startsWith('nano') || trimmed.startsWith('vim') || trimmed.startsWith('vi ') || trimmed === 'vi' || trimmed === 'vim') {
      let target = ''
      if (trimmed.startsWith('nano ')) target = trimmed.slice(5).trim()
      else if (trimmed.startsWith('vim ')) target = trimmed.slice(4).trim()
      else if (trimmed.startsWith('vi ')) target = trimmed.slice(3).trim()
      if (target === 'resume.m' || target === 'resumem') target = 'resume.md'
      else if (target === 'resume.p' || target === 'resumep') target = 'resume.pdf'

      const targetMsg = target
        ? <><span className="k">vim:</span> &apos;{target}&apos; tahrirlash cheklangan (read-only portfolio). Chiqish uchun &apos;:q!&apos; shart emas :)</>
        : <><span className="k">vim:</span> read-only tizim, fayl tahrirlab bo‘lmaydi. Chiqish uchun &apos;:q!&apos; shart emas :)</>

      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          {targetMsg}
        </div>,
      ])
      return
    }

    if (trimmed === 'reboot' || trimmed === 'shutdown' || trimmed.startsWith('shutdown') || trimmed === 'poweroff' || trimmed === 'init 0') {
      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          <span className="k">shutdown:</span> server 24/7 onlayn rejimda ishlaydi, o‘chirish taqiqlangan :)
        </div>,
      ])
      return
    }

    if (trimmed.startsWith('kill') || trimmed.startsWith('pkill')) {
      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          <span className="k">kill:</span> jarayonlarni to‘xtatish cheklangan :)
        </div>,
      ])
      return
    }

    const tokens = parseCliArgs(trimmed)
    const cmd = tokens[0]

    if (cmd === 'send-mail' || cmd === 'sendmail') {
      handleSendMailCmd(tokens, echoLine)
      return
    }

    // Noma'lum buyruq
    addHistory([
      echoLine,
      <div key={Date.now() + 1} className="term-msg">
        bash: {cmd}: command not found
      </div>,
    ])
  }

  const handleWizardInput = (val) => {
    const trimmed = val.trim()
    if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'cancel') {
      addHistory([
        <div key={Date.now()} className="term-msg d">[!] Yuborish bekor qilindi.</div>,
      ])
      setWizard(null)
      return
    }

    if (wizard.step === 'name') {
      if (!trimmed) return
      addHistory([
        <div key={Date.now()} className="term-msg"><span className="u">&gt;</span> Ism: {trimmed}</div>,
      ])
      setWizard({ step: 'email', name: trimmed, email: '', message: '' })
      return
    }

    if (wizard.step === 'email') {
      if (!trimmed) return
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        addHistory([
          <div key={Date.now()} className="term-msg">
            <span className="k">[-] Xatolik:</span> To‘g‘ri email manzil kiriting (masalan: siz@gmail.com):
          </div>,
        ])
        return
      }
      addHistory([
        <div key={Date.now()} className="term-msg"><span className="u">&gt;</span> Email: {trimmed}</div>,
      ])
      setWizard((prev) => ({ ...prev, step: 'message', email: trimmed }))
      return
    }

    if (wizard.step === 'message') {
      if (!trimmed) return
      addHistory([
        <div key={Date.now()} className="term-msg"><span className="u">&gt;</span> Xabar: {trimmed}</div>,
        <div key={Date.now() + 1} className="term-msg d">--- Xabar tayyor ---</div>,
        <div key={Date.now() + 2} className="term-msg">Ism: {wizard.name}</div>,
        <div key={Date.now() + 3} className="term-msg">Email: {wizard.email}</div>,
        <div key={Date.now() + 4} className="term-msg">Matn: {trimmed}</div>,
      ])
      setWizard((prev) => ({ ...prev, step: 'confirm', message: trimmed }))
      return
    }

    if (wizard.step === 'confirm') {
      const ans = trimmed.toLowerCase()
      if (ans === 'y' || ans === 'yes' || ans === 'ha' || ans === '') {
        sendEmail(wizard.name, wizard.email, wizard.message)
      } else {
        addHistory([
          <div key={Date.now()} className="term-msg d">[!] Yuborish bekor qilindi.</div>,
        ])
        setWizard(null)
      }
    }
  }

  const getPromptLabel = () => {
    if (!wizard) return <Prompt path={cur} />
    if (wizard.step === 'name') return <span className="h" style={{ whiteSpace: 'nowrap' }}>? Ism va familiyangiz:&nbsp;</span>
    if (wizard.step === 'email') return <span className="h" style={{ whiteSpace: 'nowrap' }}>? Email manzilingiz:&nbsp;</span>
    if (wizard.step === 'message') return <span className="h" style={{ whiteSpace: 'nowrap' }}>? Xabaringiz:&nbsp;</span>
    if (wizard.step === 'confirm') return <span className="u" style={{ whiteSpace: 'nowrap' }}>[?] Tasdiqlash (y/n) [y]:&nbsp;</span>
    return <Prompt path={cur} />
  }

  const submitCurrentInput = () => {
    if (loading || isPinging) return
    const v = inputVal
    setInputValueAndCaret('')
    if (v.trim() && !wizard) {
      setCmdHistory((prev) => [...prev, v.trim()])
      setHistoryIndex(-1)
    }
    if (wizard) handleWizardInput(v)
    else handleCommand(v)
  }

  const handleKeyDown = (e) => {
    touchTyping()

    if (e.key === 'Enter') {
      e.preventDefault()
      submitCurrentInput()
      return
    }

    // Bash readline klaviatura kombinatsiyalari
    if (e.ctrlKey || e.metaKey) {
      const k = e.key.toLowerCase()
      if (k === 'c') {
        e.preventDefault()
        if (isPinging && pingCancelRef.current) {
          pingCancelRef.current()
          setInputValueAndCaret('')
          return
        }
        const v = inputVal
        addHistory([
          <div key={`ctrlc-${Date.now()}`} className="term-line term-echo">
            <Prompt path={cur} />
            <div className="term-input-wrapper">
              <span className="term-typed-text">{v}</span>
              <span className="d" style={{ marginLeft: 6 }}>^C</span>
            </div>
          </div>
        ])
        setInputValueAndCaret('')
        setWizard(null)
        return
      }
      if (k === 'l') {
        e.preventDefault()
        setHistory([])
        setWizard(null)
        return
      }
      if (k === 'a') {
        e.preventDefault()
        setInputValueAndCaret(inputVal, 0)
        return
      }
      if (k === 'e') {
        e.preventDefault()
        setInputValueAndCaret(inputVal, inputVal.length)
        return
      }
      if (k === 'u') {
        e.preventDefault()
        const pos = selection.start
        const remaining = inputVal.slice(pos)
        setInputValueAndCaret(remaining, 0)
        return
      }
      if (k === 'k') {
        e.preventDefault()
        const pos = selection.start
        const remaining = inputVal.slice(0, pos)
        setInputValueAndCaret(remaining, pos)
        return
      }
      if (k === 'w') {
        e.preventDefault()
        const pos = selection.start
        const before = inputVal.slice(0, pos).trimEnd()
        const lastSpace = before.lastIndexOf(' ')
        const newPos = lastSpace === -1 ? 0 : lastSpace + 1
        const newVal = inputVal.slice(0, newPos) + inputVal.slice(pos)
        setInputValueAndCaret(newVal, newPos)
        return
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      const nextIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIdx)
      setInputValueAndCaret(cmdHistory[nextIdx])
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (cmdHistory.length === 0 || historyIndex === -1) return
      const nextIdx = historyIndex + 1
      if (nextIdx >= cmdHistory.length) {
        setHistoryIndex(-1)
        setInputValueAndCaret('')
      } else {
        setHistoryIndex(nextIdx)
        setInputValueAndCaret(cmdHistory[nextIdx])
      }
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      if (wizard || loading) return
      const val = inputVal
      const trimmed = val.trim()
      if (!trimmed) return

      let dirs = []
      let files = []
      if (cur === 'home') {
        dirs = ['about/', 'projects/', 'resume/', 'contact/']
        files = [
          'README.md',
          'about.md',
          'projects.md',
          'meetly.md',
          'authly.md',
          'fragmently.md',
          'resume.md',
          'resume.pdf',
          'contact.md',
          'about/about.md',
          'projects/projects.md',
          'projects/meetly.md',
          'projects/authly.md',
          'projects/fragmently.md',
          'resume/resume.md',
          'contact/contact.md',
        ]
      } else if (cur === 'about') {
        dirs = ['..', '../', '../projects/', '../resume/', '../contact/']
        files = ['about.md']
      } else if (cur === 'projects') {
        dirs = ['..', '../', '../about/', '../resume/', '../contact/']
        files = ['projects.md', 'meetly.md', 'authly.md', 'fragmently.md']
      } else if (cur === 'resume') {
        dirs = ['..', '../', '../about/', '../projects/', '../contact/']
        files = ['resume.md', 'resume.pdf']
      } else if (cur === 'contact') {
        dirs = ['..', '../', '../about/', '../projects/', '../resume/']
        files = ['contact.md']
      }

      const tryComplete = (cmdPrefix, rawPrefix, pool) => {
        const cleanPrefix = rawPrefix.trimStart()
        if (!cleanPrefix) {
          if (cmdPrefix === 'cat ') {
            const defaultFile = cur === 'home' ? 'README.md' : (cur === 'projects' ? 'projects.md' : `${cur}.md`)
            setInputValueAndCaret(`cat ${defaultFile}`)
            return true
          }
          if (cmdPrefix === 'ping ') {
            setInputValueAndCaret('ping kun.uz')
            return true
          }
          if (cmdPrefix === 'cd ') {
            const defaultDir = cur === 'home' ? 'about/' : '..'
            setInputValueAndCaret(`cd ${defaultDir}`)
            return true
          }
          if (pool.length > 0) {
            setInputValueAndCaret(`${cmdPrefix}${pool[0]}`)
            return true
          }
          return false
        }

        if (pool.includes(cleanPrefix)) {
          const poolIdx = pool.indexOf(cleanPrefix)
          const nextPoolIdx = (poolIdx + 1) % pool.length
          setInputValueAndCaret(`${cmdPrefix}${pool[nextPoolIdx]}`)
          return true
        }

        const stripTrailing = (s) => s.replace(/\/+$/, '')
        let matches = pool.filter((item) =>
          item.startsWith(cleanPrefix) ||
          stripTrailing(item).replace(/^.*\//, '').startsWith(cleanPrefix)
        )
        if (matches.length === 0) {
          matches = pool.filter((item) =>
            item.toLowerCase().startsWith(cleanPrefix.toLowerCase()) ||
            stripTrailing(item).replace(/^.*\//, '').toLowerCase().startsWith(cleanPrefix.toLowerCase())
          )
        }
        if (matches.length === 0 && /^resume[mp]/i.test(cleanPrefix)) {
          const alt = cleanPrefix.replace(/^resume([mp])/i, 'resume.$1')
          matches = pool.filter((item) => item.toLowerCase().startsWith(alt.toLowerCase()))
        }
        if (matches.length === 0) return false

        const needsTrailingSpace = [
          'ping', 'cat', 'cd', 'open', 'vim', 'nano', 'touch', 'mkdir', 'rmdir', 'rm', 'send-mail'
        ]

        if (matches.length === 1) {
          const completion = matches[0]
          const suffix = (cmdPrefix === '' && needsTrailingSpace.includes(completion)) ? ' ' : ''
          setInputValueAndCaret(`${cmdPrefix}${completion}${suffix}`)
          return true
        }

        const lcp = getLongestCommonPrefix(matches)
        if (lcp && lcp.length > cleanPrefix.length) {
          setInputValueAndCaret(`${cmdPrefix}${lcp}`)
          return true
        }

        const currIdx = matches.indexOf(cleanPrefix)
        const nextIdx = (currIdx + 1) % matches.length
        setInputValueAndCaret(`${cmdPrefix}${matches[nextIdx]}`)
        return true
      }

      const prefixConfigs = [
        { prefix: 'rm -rf ', pool: [...dirs, ...files] },
        { prefix: 'rm -r ', pool: [...dirs, ...files] },
        { prefix: 'rm ', pool: [...dirs, ...files] },
        { prefix: 'touch ', pool: files },
        { prefix: 'mkdir ', pool: dirs },
        { prefix: 'rmdir ', pool: dirs },
        { prefix: 'nano ', pool: files },
        { prefix: 'vim ', pool: files },
        { prefix: 'vi ', pool: files },
        { prefix: 'cat ', pool: files },
        { prefix: 'cd ', pool: cur === 'home' ? ['..', '~', ...dirs] : ['..', '../', ...dirs, '~', '~/'] },
        { prefix: 'open ', pool: ['home', 'about', 'projects', 'resume', 'contact'] },
        { prefix: 'ping ', pool: ['kun.uz', 'daryo.uz', 'gazeta.uz', 'alijonov.uz', 'google.com', 'github.com'] },
      ]

      for (const cfg of prefixConfigs) {
        if (val.startsWith(cfg.prefix)) {
          const raw = val.slice(cfg.prefix.length)
          tryComplete(cfg.prefix, raw, cfg.pool)
          return
        }
      }

      if (val === 'cat') {
        const defaultFile = cur === 'home' ? 'README.md' : (cur === 'projects' ? 'projects.md' : `${cur}.md`)
        setInputValueAndCaret(`cat ${defaultFile}`)
        return
      }
      if (val === 'cd') {
        const defaultDir = cur === 'home' ? 'about/' : '..'
        setInputValueAndCaret(`cd ${defaultDir}`)
        return
      }
      if (val === 'ping') { setInputValueAndCaret('ping kun.uz'); return }
      if (val === 'rm') { setInputValueAndCaret('rm '); return }
      if (val === 'rm -') { setInputValueAndCaret('rm -rf '); return }
      if (val === 'vim') { setInputValueAndCaret('vim '); return }
      if (val === 'nano') { setInputValueAndCaret('nano '); return }
      if (val === 'touch') { setInputValueAndCaret('touch '); return }
      if (val === 'mkdir') { setInputValueAndCaret('mkdir '); return }
      if (val === 'rmdir') { setInputValueAndCaret('rmdir '); return }
      if (val === 'open') { setInputValueAndCaret('open '); return }

      const commands = [
        'help', 'clear', 'ping', 'send-mail', 'pwd', 'ls', 'cd', 'cat',
        'whoami', 'uname', 'uptime', 'date', 'history',
        'new', 'new-term', 'open',
        'rm -rf', 'rm', 'mkdir', 'rmdir', 'touch', 'vim', 'nano', 'sudo'
      ]
      const standalonePool = [...files, ...dirs, ...commands]
      tryComplete('', trimmed, standalonePool)
      return
    }
  }

  const windowStyle = isMobile
    ? { display: win.isMinimized ? 'none' : (isActive ? 'flex' : 'none'), zIndex: win.zIndex }
    : {
        display: win.isMinimized ? 'none' : 'flex',
        left: win.isMaximized ? 8 : win.x,
        top: win.isMaximized ? 8 : win.y,
        width: win.isMaximized ? 'calc(100% - 16px)' : win.width,
        height: win.isMaximized ? 'calc(100% - 16px)' : win.height,
        zIndex: win.zIndex,
      }

  return (
    <div
      className={`win ${isActive ? 'is-active' : 'is-inactive'} ${win.isMaximized ? 'is-maximized' : ''}`}
      style={windowStyle}
      onPointerDown={onActivate}
      onKeyDown={(e) => {
        if (isPinging && e.ctrlKey && e.key.toLowerCase() === 'c') {
          e.preventDefault()
          if (pingCancelRef.current) pingCancelRef.current()
        }
      }}
      tabIndex={-1}
    >
      {/* 8-yo'nalishli resize tutqichlari */}
      {!win.isMaximized && !isMobile && (
        <>
          <div className="resize-handle rh-e" onPointerDown={(e) => onStartResize('e', e)} />
          <div className="resize-handle rh-w" onPointerDown={(e) => onStartResize('w', e)} />
          <div className="resize-handle rh-s" onPointerDown={(e) => onStartResize('s', e)} />
          <div className="resize-handle rh-n" onPointerDown={(e) => onStartResize('n', e)} />
          <div className="resize-handle rh-se" onPointerDown={(e) => onStartResize('se', e)} />
          <div className="resize-handle rh-sw" onPointerDown={(e) => onStartResize('sw', e)} />
          <div className="resize-handle rh-ne" onPointerDown={(e) => onStartResize('ne', e)} />
          <div className="resize-handle rh-nw" onPointerDown={(e) => onStartResize('nw', e)} />
        </>
      )}

      {/* Sarlavha: macOS tugmalari va sudrab ko'chirish */}
      <div
        className="bar"
        onPointerDown={onStartDrag}
        onDoubleClick={onToggleMaximize}
      >
        <div className="bar-dots" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="dot dot-close"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            title="Yopish (Close)"
          >
            <svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
          <button
            type="button"
            className="dot dot-min"
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            title="Kichraytirish (Minimize)"
          >
            <svg viewBox="0 0 12 12"><path d="M2.5 6h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
          <button
            type="button"
            className="dot dot-max"
            onClick={(e) => { e.stopPropagation(); onToggleMaximize(); }}
            title="Kattalashtirish (Zoom)"
          >
            <svg viewBox="0 0 12 12"><path d="M3 8.5L8.5 3M8.5 6.5V3H5M3.5 5.5v3.5H7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <span>root@alijonov: {cur === 'home' ? '~' : `~/${cur}`}</span>
      </div>

      {/* Terminal kontenti va ichki scroll */}
      <div className="term" ref={termRef} onClick={() => focusInput()}>
        {history.map((el, i) => (
          <div key={i}>{el}</div>
        ))}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submitCurrentInput()
          }}
          className="term-line"
          style={isPinging ? { position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, overflow: 'hidden' } : {}}
        >
          <button type="submit" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
          {getPromptLabel()}
          <div className="term-input-wrapper" onClick={() => focusInput()}>
            {(() => {
              const start = Math.min(selection.start, selection.end)
              const end = Math.max(selection.start, selection.end)
              const isSelected = start !== end

              if (isSelected) {
                const before = inputVal.slice(0, start)
                const selectedText = inputVal.slice(start, end)
                const after = inputVal.slice(end)
                return (
                  <span className="term-typed-text">
                    <span>{before}</span>
                    <span className="term-selection">{selectedText}</span>
                    <span>{after}</span>
                  </span>
                )
              }

              const pos = Math.min(Math.max(0, start), inputVal.length)
              const before = inputVal.slice(0, pos)
              const char = pos < inputVal.length
                ? (inputVal[pos] === ' ' ? '\u00A0' : inputVal[pos])
                : '\u00A0'
              const after = pos < inputVal.length ? inputVal.slice(pos + 1) : ''

              return (
                <span className="term-typed-text">
                  <span>{before}</span>
                  <span className={`term-cursor-block ${isTyping ? 'solid' : ''}`}>{char}</span>
                  <span>{after}</span>
                </span>
              )
            })()}
            <input
              ref={inputRef}
              type="text"
              className="term-real-input"
              value={inputVal}
              onChange={(e) => {
                touchTyping()
                setInputVal(e.target.value)
                syncSelection(e.target)
              }}
              onKeyDown={(e) => {
                handleKeyDown(e)
                if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Backspace', 'Delete'].includes(e.key)) {
                  requestAnimationFrame(() => syncSelection())
                }
              }}
              onKeyUp={() => syncSelection()}
              onSelect={(e) => syncSelection(e.target)}
              onClick={(e) => syncSelection(e.target)}
              disabled={loading}
              autoComplete="off"
              spellCheck="false"
              autoFocus={isActive}
            />
          </div>
        </form>
        <div ref={bottomAnchorRef} style={{ height: 24 }} />
      </div>
    </div>
  )
}

/* ================== MAIN APP (DESKTOP WINDOW MANAGER) ================== */
export default function App() {
  const [clock, setClock] = useState('')
  const [windows, setWindows] = useState(() => {
    const isSmall = typeof window !== 'undefined' && window.innerWidth <= 640
    const w = typeof window !== 'undefined' ? (isSmall ? window.innerWidth : Math.min(940, window.innerWidth - 32)) : 800
    const h = typeof window !== 'undefined' ? (isSmall ? window.innerHeight : Math.min(620, window.innerHeight - 150)) : 520
    const initX = typeof window !== 'undefined' ? Math.max(16, (window.innerWidth - w) / 2) : 24
    const initY = typeof window !== 'undefined' ? Math.max(16, (window.innerHeight - 100 - h) / 2) : 24

    return [
      {
        id: 'term-1',
        cur: 'home',
        x: initX,
        y: initY,
        width: w,
        height: h,
        zIndex: 10,
        isMaximized: false,
        isMinimized: false,
      },
    ]
  })
  const [activeId, setActiveId] = useState('term-1')
  const [maxZIndex, setMaxZIndex] = useState(10)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 640)
  const goToRegistryRef = useRef({})

  const registerGoTo = (winId, fn) => {
    if (fn) {
      goToRegistryRef.current[winId] = fn
    } else {
      delete goToRegistryRef.current[winId]
    }
  }

  // Ekran o'lchami o'zgarganda aniqlash
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Soat
  useEffect(() => {
    if (window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/')
    }
    const tick = () => setClock(new Date().toLocaleString('uz', { weekday: 'short', hour: '2-digit', minute: '2-digit' }))
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  const activateWindow = (winId) => {
    setActiveId(winId)
    setMaxZIndex((prev) => {
      const nextZ = prev + 1
      setWindows((wList) =>
        wList.map((w) => (w.id === winId ? { ...w, zIndex: nextZ } : w))
      )
      return nextZ
    })
  }

  const MAX_WINDOWS = 10

  const createNewWindow = (targetCur = 'home') => {
    if (windows.length >= MAX_WINDOWS) {
      return false
    }
    const id = 'term-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
    const count = windows.length
    const offset = (count % 7) * 26

    const isSmall = window.innerWidth <= 640
    const w = isSmall ? window.innerWidth : Math.min(920, window.innerWidth - 48)
    const h = isSmall ? window.innerHeight : Math.min(600, window.innerHeight - 160)

    const baseCenterX = Math.max(16, (window.innerWidth - w) / 2)
    const baseCenterY = Math.max(16, (window.innerHeight - 100 - h) / 2)

    const nextZ = maxZIndex + 1
    setMaxZIndex(nextZ)

    const newWin = {
      id,
      cur: targetCur,
      x: isSmall ? 0 : Math.max(16, baseCenterX + offset),
      y: isSmall ? 0 : Math.max(16, baseCenterY + offset),
      width: w,
      height: h,
      zIndex: nextZ,
      isMaximized: false,
      isMinimized: false,
    }

    setWindows((prev) => [...prev, newWin])
    setActiveId(id)
    return true
  }

  const closeWindow = (winId) => {
    setWindows((prev) => {
      const filtered = prev.filter((w) => w.id !== winId)
      if (activeId === winId) {
        const nextActive = filtered[filtered.length - 1]?.id || null
        setActiveId(nextActive)
      }
      return filtered
    })
  }

  const minimizeWindow = (winId) => {
    setWindows((prev) => {
      const updated = prev.map((w) => (w.id === winId ? { ...w, isMinimized: true } : w))
      if (activeId === winId) {
        const remainingUnmin = updated.filter((w) => !w.isMinimized)
        setActiveId(remainingUnmin[remainingUnmin.length - 1]?.id || null)
      }
      return updated
    })
  }

  const toggleMaximize = (winId) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== winId) return w
        if (w.isMaximized) {
          return {
            ...w,
            isMaximized: false,
            ...(w.prevBounds || {}),
          }
        } else {
          return {
            ...w,
            isMaximized: true,
            prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
          }
        }
      })
    )
  }

  const restoreOrActivate = (winId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === winId ? { ...w, isMinimized: false } : w))
    )
    activateWindow(winId)
  }

  const handleUpdateCur = (winId, newCur) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === winId ? { ...w, cur: newCur } : w))
    )
  }

  // Sarlavhadan ushlab sudrab ko'chirish (Drag)
  const handleStartDrag = (winId, e) => {
    if (isMobile) return
    if (e.target.closest('.bar-dots, button')) return
    e.preventDefault()
    activateWindow(winId)

    const win = windows.find((w) => w.id === winId)
    if (!win || win.isMaximized) return

    const startX = e.clientX
    const startY = e.clientY
    const origX = win.x
    const origY = win.y

    const onPointerMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== winId) return w
          const boundedX = Math.max(-w.width + 120, Math.min(window.innerWidth - 120, origX + dx))
          const boundedY = Math.max(0, Math.min(window.innerHeight - 80, origY + dy))
          return { ...w, x: boundedX, y: boundedY }
        })
      )
    }

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  // 8 ta chet va burchaklardan o'lchamni o'zgartirish (Resize)
  const handleStartResize = (winId, dir, e) => {
    if (isMobile) return
    e.preventDefault()
    e.stopPropagation()
    activateWindow(winId)

    const win = windows.find((w) => w.id === winId)
    if (!win || win.isMaximized) return

    const startX = e.clientX
    const startY = e.clientY
    const origX = win.x
    const origY = win.y
    const origW = win.width
    const origH = win.height

    const minW = 380
    const minH = 260

    const onPointerMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY

      let newW = origW
      let newH = origH
      let newX = origX
      let newY = origY

      if (dir.includes('e')) {
        newW = Math.max(minW, origW + dx)
      }
      if (dir.includes('s')) {
        newH = Math.max(minH, origH + dy)
      }
      if (dir.includes('w')) {
        const proposedW = origW - dx
        if (proposedW >= minW) {
          newW = proposedW
          newX = origX + dx
        }
      }
      if (dir.includes('n')) {
        const proposedH = origH - dy
        if (proposedH >= minH) {
          newH = proposedH
          newY = origY + dy
        }
      }

      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== winId) return w
          return { ...w, x: newX, y: newY, width: newW, height: newH }
        })
      )
    }

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  // Yuqori navbar tugmasi bosilganda faol oynani boshqarish
  const handleNavClick = (section) => {
    let targetWin = activeId ? windows.find((w) => w.id === activeId) : null
    if (!targetWin && windows.length > 0) {
      targetWin = windows[windows.length - 1]
    }

    if (targetWin) {
      setWindows((prev) =>
        prev.map((w) => (w.id === targetWin.id ? { ...w, isMinimized: false } : w))
      )
      activateWindow(targetWin.id)
      if (goToRegistryRef.current[targetWin.id]) {
        goToRegistryRef.current[targetWin.id](section)
      }
    } else {
      createNewWindow(section)
    }
  }

  const activeWindow = windows.find((w) => w.id === activeId)
  const activeCur = activeWindow ? activeWindow.cur : 'home'

  return (
    <>
      <div className="blob b1" /><div className="blob b2" />
      <div className="panel">
        <span className="l"><span style={{ color: 'var(--acc2)', marginRight: 6 }}>&gt;_</span>alijonov.uz</span>
        <nav>
          {[['home', '~'], ['about', 'about'], ['projects', 'projects'], ['resume', 'resume'], ['contact', 'contact']].map(([k, l]) => (
            <button key={k} className={activeCur === k && windows.length > 0 ? 'on' : ''} onClick={() => handleNavClick(k)}>{l}</button>
          ))}
        </nav>
        <span id="clk">{clock}</span>
      </div>

      <main>
        {windows.length === 0 && (
          <div className="empty-desktop">
            <div className="empty-tux"><pre>{TUX}</pre></div>
            <div style={{ marginTop: 12, color: 'var(--dim)', fontSize: 13 }}>Barcha terminal oynalari yopilgan</div>
            <button className="btn-new-term" onClick={() => createNewWindow('home')}>
              + Yangi terminal ochish
            </button>
          </div>
        )}

        {windows.length > 0 && windows.every((w) => w.isMinimized) && (
          <div className="empty-desktop">
            <div className="empty-tux"><pre>{TUX}</pre></div>
            <div style={{ marginTop: 12, color: 'var(--dim)', fontSize: 13 }}>Barcha terminal oynalari kichraytirilgan</div>
            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                className="btn-new-term"
                onClick={() => {
                  const target = windows.find((w) => w.id === activeId) || windows[windows.length - 1]
                  if (target) restoreOrActivate(target.id)
                }}
              >
                Oynani tiklash
              </button>
              {windows.length > 1 && (
                <button
                  className="btn-new-term"
                  style={{ background: 'transparent', color: 'var(--fg)', borderColor: 'var(--line)' }}
                  onClick={() => {
                    setWindows((prev) => prev.map((w) => ({ ...w, isMinimized: false })))
                    if (activeId) activateWindow(activeId)
                  }}
                >
                  Barcha oynalarni tiklash
                </button>
              )}
            </div>
          </div>
        )}

        {windows.map((w) => (
          <TerminalWindow
            key={w.id}
            win={w}
            isActive={w.id === activeId}
            isMobile={isMobile}
            onActivate={() => activateWindow(w.id)}
            onClose={() => closeWindow(w.id)}
            onMinimize={() => minimizeWindow(w.id)}
            onToggleMaximize={() => toggleMaximize(w.id)}
            onSpawnWindow={(t) => createNewWindow(t)}
            onUpdateCur={(newCur) => handleUpdateCur(w.id, newCur)}
            registerGoTo={registerGoTo}
            onStartDrag={(e) => handleStartDrag(w.id, e)}
            onStartResize={(dir, e) => handleStartResize(w.id, dir, e)}
          />
        ))}
      </main>

      <div className="st">
        <div className="st-left">
          <span className="st-mode">-- NORMAL --</span>
          <div className="win-tabs">
            {windows.map((w, idx) => (
              <button
                key={w.id}
                className={`win-tab ${w.id === activeId ? 'on' : ''} ${w.isMinimized ? 'min' : ''}`}
                onClick={() => restoreOrActivate(w.id)}
                title={w.isMinimized ? 'Kichraytirilgan (ochish uchun bosing)' : `Oyna ${idx + 1}`}
              >
                {idx + 1}: {w.cur === 'home' ? '~' : `~/${w.cur}`}
              </button>
            ))}
          </div>
        </div>
        <span className="st-right">
          <span className="st-yr">© {new Date().getFullYear()} </span>
          alijonov.uz
        </span>
      </div>
    </>
  )
}
