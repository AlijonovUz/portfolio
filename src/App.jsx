import { useEffect, useState, useRef } from 'react'

/* ====== MA'LUMOTLARNI SHU YERDA O'ZGARTIRING ====== */
const LINKS = [
  ['email', 'me@alijonov.uz', 'mailto:me@alijonov.uz'],
  ['telegram', '@AlijonovUz', 'https://t.me/AlijonovUz'],
  ['github', 'github.com/AlijonovUz', 'https://github.com/AlijonovUz'],
  ['linkedin', 'linkedin.com/in/alijonovuz', 'https://linkedin.com/in/alijonovuz'],
  ['instagram', 'instagram.com/alijonov.uz_', 'https://instagram.com/alijonov.uz_'],
]
const LOCATION = 'Oltiariq, Farg‘ona viloyati, O‘zbekiston'

// Resume bo'limida: asosiy ko'nikmalar
const MAIN = [
  ['languages', ['Python', 'PHP', 'C#']],
  ['databases', ['PostgreSQL', 'MySQL']],
]
// About bo'limida: to'liq texnologiyalar
const ALL = [
  ['languages', ['Python', 'PHP', 'C#']],
  ['frameworks', ['Django', 'DRF', 'FastAPI', 'Laravel', '.NET']],
  ['web', ['HTML', 'CSS', 'Bootstrap', 'TailwindCSS', 'JavaScript']],
  ['databases', ['PostgreSQL', 'MySQL', 'SQLite']],
  ['tools', ['Git', 'GitHub', 'GitLab', 'Redis', 'Celery', 'WebSockets']],
  ['devops', ['Docker', 'Docker Compose']],
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
const EDU = {
  title: 'Backend Python (Standard)',
  where: 'Najot Ta’lim · 2024 — 2025',
  lines: ['Texnologiyalar: Python, Django, DRF, Docker, Git, PostgreSQL.', 'Amaliy loyihalar orqali backend ko‘nikmalarini mustahkamlagan.'],
}
const LANGS = [['O‘zbek tili', 'ona tili'], ['Ingliz tili', 'A2'], ['Rus tili', 'A2']]
const RESUME_PDF = '/resume.pdf' // public/resume.pdf

// Loyihalar (Projects)
const PROJECTS = [
  {
    slug: 'meetly',
    name: 'Meetly',
    headline: 'Onlayn video va audio uchrashuvlar platformasi',
    desc: 'Konferensiya davomida tasvir va ovoz qotmasligi, kechikishlar minimal bo‘lishi uchun WebRTC hamda zamonaviy SFU (Selective Forwarding Unit) arxitekturasi asosida qurilgan. Video/audio oqimlarni har bir ishtirokchiga alohida optimallab, yuqori tezlikda tarqatib beradi.',
    note: 'Muloqot qulayligi va to‘liq imkoniyatlar uchun ayni bosqichda faqat kompyuter (desktop) brauzerlarida ishlaydi.',
    stack: ['WebRTC', 'SFU Architecture', 'WebSockets', 'Python', 'Django', 'DRF', 'Docker'],
    url: 'https://meetly.uz',
    status: 'production · online',
    access: 'private repo',
  },
  {
    slug: 'authly',
    name: 'Authly',
    headline: 'Yagona identifikatsiya va OAuth SSO tizimi',
    desc: 'Loyihalarni bitta ekotizimga birlashtirish va xavfsiz kirishni ta’minlash uchun yozilgan. Kriptografik tokenlar va xavfsiz avtorizatsiya standartlari asosida ishlaydi. O‘zingizning tashqi loyihalaringizga ham avtorizatsiya mexanizmi sifatida bemalol integratsiya qila olasiz.',
    note: 'Yagona SSO, OAuth 2.0 / OpenID Connect standartlari va xavfsiz tokenlar.',
    stack: ['OAuth 2.0', 'OpenID Connect', 'JWT', 'Python', 'Django', 'DRF', 'PostgreSQL', 'Docker'],
    url: 'https://authly.uz',
    status: 'production · online',
    access: 'private repo',
  },
  {
    slug: 'fragmently',
    name: 'Fragmently',
    headline: 'Fragment xizmatlarini avtomatlashtirish va Public API platformasi',
    desc: 'Dasturchilar uchun Fragment platformasi xizmatlarini avtomatlashtirib beruvchi tizim. Telegram Stars, Telegram Premium va boshqa xizmatlarni Telegram botlar hamda veb-saytlar uchun qulay va sifatli ommaviy (public) RESTful API orqali integratsiya qilish imkonini beradi.',
    note: 'Dasturchilar va tashqi tizimlar uchun ommaviy (public) API infratuzilmasi.',
    stack: ['Python', 'Django', 'DRF', 'FastAPI', 'PostgreSQL', 'Docker'],
    url: 'https://fragmently.uz',
    status: 'production · online',
    access: 'private repo',
  },
]
/* ================================================== */

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
    tokens.push(m[1] !== undefined ? m[1] : (m[2] !== undefined ? m[2] : m[0]))
  }
  return tokens
}

function getLongestCommonPrefix(strs) {
  if (!strs || strs.length === 0) return ''
  if (strs.length === 1) return strs[0]
  let prefix = strs[0]
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].toLowerCase().startsWith(prefix.toLowerCase())) {
      prefix = prefix.slice(0, -1)
      if (!prefix) return ''
    }
  }
  return prefix
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

  // Absolute / home-relative: ~/projects, /root/projects
  if (raw.startsWith('~/') || raw.startsWith('/root/')) {
    const sub = raw.replace(/^(~\/|\/root\/)/, '').replace(/\/+$/, '')
    if (!sub) return { success: true, newCur: 'home' }
    if (['about', 'projects', 'resume', 'contact'].includes(sub)) {
      return { success: true, newCur: sub }
    }
    return { success: false, error: `bash: cd: ${targetArg}: No such file or directory` }
  }

  // Parent-relative: ../projects, ../resume
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

  // Current-relative: ./projects, ./resume
  if (raw.startsWith('./')) {
    const sub = raw.replace(/^\.\//, '').replace(/\/+$/, '')
    if (currentCur === 'home' && ['about', 'projects', 'resume', 'contact'].includes(sub)) {
      return { success: true, newCur: sub }
    }
    return { success: false, error: `bash: cd: ${targetArg}: No such file or directory` }
  }

  // Direct bare name: about, projects, resume, contact
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

export default function App() {
  const [cur, setCur] = useState('home')
  const [clock, setClock] = useState('')
  const [initialCleared, setInitialCleared] = useState(false)

  // Terminal buyruqlar va xabarlar ro'yxati
  const [history, setHistory] = useState([])
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [wizard, setWizard] = useState(null)
  const [inputVal, setInputVal] = useState('')
  const [loading, setLoading] = useState(false)
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef(null)

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

  const inputRef = useRef(null)
  const termRef = useRef(null)
  const bottomAnchorRef = useRef(null)

  const scrollToBottom = (smooth = false) => {
    const behavior = smooth ? 'smooth' : 'auto'
    if (bottomAnchorRef.current) {
      bottomAnchorRef.current.scrollIntoView({ behavior, block: 'end' })
    }
    const maxScroll = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    )
    window.scrollTo({ top: maxScroll, behavior })
  }

  useEffect(() => {
    scrollToBottom(false)
    const t = setTimeout(() => scrollToBottom(false), 50)
    return () => clearTimeout(t)
  }, [history, cur, wizard, loading, initialCleared])

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true })
    }
  }

  useEffect(() => {
    focusInput()
    const t1 = setTimeout(focusInput, 50)
    const t2 = setTimeout(focusInput, 200)

    const handleGlobalClick = (e) => {
      if (!e.target.closest('a, button')) {
        focusInput()
      }
    }
    window.addEventListener('click', handleGlobalClick)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('click', handleGlobalClick)
    }
  }, [wizard, loading, cur])

  useEffect(() => {
    if (window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/')
    }
    const tick = () => setClock(new Date().toLocaleString('uz', { weekday: 'short', hour: '2-digit', minute: '2-digit' }))
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  const addHistory = (nodes) => {
    setHistory((prev) => [...prev, ...nodes])
  }

  // GUI orqali yoki tezkor navigatsiya
  const goTo = (target) => {
    const prevCur = cur
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
        {outputs(goTo)[target]}
      </div>,
    ])
    setTimeout(() => scrollToBottom(), 40)
  }

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

  const showHelp = (echoLine) => {
    addHistory([
      echoLine,
      <div key={Date.now() + 1} className="term-msg" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>
        <span className="d">GNU bash, version 5.3.9(1)-release (x86_64-pc-linux-gnu)</span><br />
        <span className="d">These shell commands are defined internally. Type `help&apos; to see this list.</span><br />
        <span className="d">Type `send-mail --help&apos; to find out more about sending emails.</span><br /><br />
        {'  '}<span className="h" style={{ display: 'inline-block', width: '28ch' }}>cd [dir]</span><span className="h">pwd</span><br />
        {'  '}<span className="h" style={{ display: 'inline-block', width: '28ch' }}>cat &lt;file.md&gt;</span><span className="h">ls [-la]</span><br />
        {'  '}<span className="h" style={{ display: 'inline-block', width: '28ch' }}>send-mail [options]</span><span className="h">clear</span><br />
        {'  '}<span className="h" style={{ display: 'inline-block', width: '28ch' }}>whoami / uname / date</span><span className="h">history</span><br />
        {'  '}<span className="h" style={{ display: 'inline-block', width: '28ch' }}>cd ..</span><span className="h">help</span><br /><br />
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
      </div>,
    ])
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
      setInitialCleared(true)
      setWizard(null)
      return
    }

    // ls / dir
    if (trimmed === 'ls' || trimmed === 'dir' || trimmed.startsWith('ls ')) {
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

    // cd [dir] (about, about/, projects, projects/, resume, contact, ~, .., va h.k.)
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

    // meetly.md / cat meetly.md
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

    // authly.md / cat authly.md
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

    // fragmently.md / cat fragmently.md
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

    // resume.md / cat resume.md
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

    // resume.pdf / cat resume.pdf
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

    // contact.md / cat contact.md
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

    // README.md / cat README.md
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

    // Tezkor sahifa chaqirish (about / projects / resume / contact) — faqat cd, output emas
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

    // cat xato fayl
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
      showHelp(echoLine)
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
      addHistory([echoLine, <div key={Date.now() + 1} className="term-msg d">logout — sessiya yopilmaydi (bu brauzer :)</div>])
      return
    }

    // rm / rmdir / mkdir / touch / sudo / vim / reboot hazil javoblari
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
        : <>tahrirlash cheklangan (read-only portfolio). Chiqish uchun &apos;:q!&apos; shart emas :)</>

      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg d">
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
      return
    }

    // Noma'lum buyruq: haqiqiy Linux bash xatoligi
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
      setWizard({ ...wizard, name: trimmed, step: 'email' })
    } else if (wizard.step === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        addHistory([
          <div key={Date.now()} className="term-msg">
            <span className="k">[!]</span> To‘g‘ri email kiriting (masalan: user@example.com):
          </div>,
        ])
        return
      }
      addHistory([
        <div key={Date.now()} className="term-msg"><span className="u">&gt;</span> Email: {trimmed}</div>,
      ])
      setWizard({ ...wizard, email: trimmed, step: 'message' })
    } else if (wizard.step === 'message') {
      if (!trimmed) return
      addHistory([
        <div key={Date.now()} className="term-msg"><span className="u">&gt;</span> Xabar: {trimmed}</div>,
      ])
      setWizard({ ...wizard, message: trimmed, step: 'confirm' })
    } else if (wizard.step === 'confirm') {
      const lower = trimmed.toLowerCase()
      if (lower === 'n' || lower === 'no' || lower === 'yoq') {
        addHistory([
          <div key={Date.now()} className="term-msg d">[!] Yuborish bekor qilindi.</div>,
        ])
        setWizard(null)
      } else {
        sendEmail(wizard.name, wizard.email, wizard.message)
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

  const handleKeyDown = (e) => {
    touchTyping()

    // Bash readline klaviatura kombinatsiyalari
    if (e.ctrlKey) {
      const k = e.key.toLowerCase()
      if (k === 'c') {
        e.preventDefault()
        const v = inputVal
        addHistory([
          <div key={Date.now()} className="term-line term-echo">
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
        setInitialCleared(true)
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
      if (historyIndex === -1) return
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

      // tryComplete yordamchi funksiyasi: LCP va Linux Bash completion
      const tryComplete = (cmdPrefix, rawPrefix, pool) => {
        const cleanPrefix = rawPrefix.trimStart()
        if (!cleanPrefix) {
          if (cmdPrefix === 'cat ') {
            const defaultFile = cur === 'home' ? 'README.md' : (cur === 'projects' ? 'projects.md' : `${cur}.md`)
            setInputValueAndCaret(`cat ${defaultFile}`)
            return true
          }
          return false
        }

        // 1. Mos keluvchilarni topish (avval case-sensitive, keyin case-insensitive)
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

        // 2. Yagona moslik bo'lsa
        if (matches.length === 1) {
          setInputValueAndCaret(`${cmdPrefix}${matches[0]}`)
          return true
        }

        // 3. Bir nechta moslik bo'lsa: Longest Common Prefix (LCP)
        const lcp = getLongestCommonPrefix(matches)
        if (lcp && lcp.length > cleanPrefix.length) {
          setInputValueAndCaret(`${cmdPrefix}${lcp}`)
          return true
        }

        // 4. Allaqachon LCP darajasida bo'lsa, Tab bosilganda navbatdagi variantga o'tish (cycle)
        const currIdx = matches.indexOf(cleanPrefix)
        const nextIdx = (currIdx + 1) % matches.length
        setInputValueAndCaret(`${cmdPrefix}${matches[nextIdx]}`)
        return true
      }

      // Prefiksli buyruqlarni tekshirish
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
      ]

      for (const cfg of prefixConfigs) {
        if (val.startsWith(cfg.prefix)) {
          const raw = val.slice(cfg.prefix.length)
          tryComplete(cfg.prefix, raw, cfg.pool)
          return
        }
      }

      // Maxsus holatlar (bo'sh argumentli buyruqlar)
      if (val === 'cat') { setInputValueAndCaret('cat '); return }
      if (val === 'cd') { setInputValueAndCaret('cd '); return }
      if (val === 'rm') { setInputValueAndCaret('rm '); return }
      if (val === 'rm -') { setInputValueAndCaret('rm -rf '); return }
      if (val === 'vim') { setInputValueAndCaret('vim '); return }
      if (val === 'nano') { setInputValueAndCaret('nano '); return }
      if (val === 'touch') { setInputValueAndCaret('touch '); return }
      if (val === 'mkdir') { setInputValueAndCaret('mkdir '); return }
      if (val === 'rmdir') { setInputValueAndCaret('rmdir '); return }

      // Prefikssiz, alohida yozilayotgan buyruq yoki fayl/papka nomi
      const commands = [
        'help', 'clear', 'send-mail', 'pwd', 'ls', 'cd', 'cat',
        'whoami', 'uname', 'uptime', 'date', 'history',
        'rm -rf', 'rm', 'mkdir', 'rmdir', 'touch', 'vim', 'nano', 'sudo'
      ]
      const standalonePool = [...files, ...dirs, ...commands]
      tryComplete('', trimmed, standalonePool)
      return
    }
  }

  return (
    <>
      <div className="blob b1" /><div className="blob b2" />
      <div className="panel">
        <span className="l"><span style={{ color: 'var(--acc2)', marginRight: 6 }}>&gt;_</span>alijonov.uz</span>
        <nav>
          {[['home', '~'], ['about', 'about'], ['projects', 'projects'], ['resume', 'resume'], ['contact', 'contact']].map(([k, l]) => (
            <button key={k} className={cur === k ? 'on' : ''} onClick={() => goTo(k)}>{l}</button>
          ))}
        </nav>
        <span id="clk">{clock}</span>
      </div>
      <main>
        <div className="win">
          <div className="bar">
            <i style={{ background: '#ff5f57' }} /><i style={{ background: '#febc2e' }} /><i style={{ background: '#28c840' }} />
            <span>root@alijonov: {cur === 'home' ? '~' : `~/${cur}`}</span>
          </div>
          <div className="term" ref={termRef} onClick={() => inputRef.current?.focus()}>
            {!initialCleared && (
              <>
                <div className="term-line term-echo">
                  <Prompt path="home" />
                  <div className="term-input-wrapper">
                    <span className="term-typed-text">cat README.md</span>
                  </div>
                </div>
                <div className="o">
                  {outputs(goTo)['home']}
                </div>
              </>
            )}

            {history.map((el, i) => (
              <div key={i}>{el}</div>
            ))}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (loading) return
                const v = inputVal
                setInputValueAndCaret('')
                if (v.trim() && !wizard) {
                  setCmdHistory((prev) => [...prev, v.trim()])
                  setHistoryIndex(-1)
                }
                if (wizard) handleWizardInput(v)
                else handleCommand(v)
              }}
              className="term-line"
            >
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
                  autoFocus
                />
              </div>
            </form>
            <div ref={bottomAnchorRef} style={{ height: 24 }} />
          </div>
        </div>
      </main>
      <div className="st"><span>-- NORMAL -- main</span><span>© {new Date().getFullYear()} alijonov.uz</span></div>
    </>
  )
}
