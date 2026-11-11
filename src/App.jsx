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
/* ================================================== */

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
        <button onClick={() => go('resume')}>./resume</button>
        <button onClick={() => go('contact')}>./contact</button>
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
        <button onClick={() => go('contact')}>./contact</button>
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
    ],
  }
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

  const inputRef = useRef(null)
  const termRef = useRef(null)
  const bottomAnchorRef = useRef(null)

  const scrollToBottom = (smooth = true) => {
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
    scrollToBottom()
    const t1 = setTimeout(() => scrollToBottom(), 50)
    const t2 = setTimeout(() => scrollToBottom(), 180)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
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
    if (target === 'home') {
      setCur('home')
      addHistory([
        <div key={Date.now()} className="term-msg">
          <Prompt path={cur} /><span style={{ color: 'var(--fg)' }}>cd ~ && cat README.md</span>
        </div>,
        <div key={Date.now() + 1} className="o">
          {outputs(goTo)['home']}
        </div>,
      ])
    } else {
      setCur(target)
      addHistory([
        <div key={Date.now()} className="term-msg">
          <Prompt path={cur} /><span style={{ color: 'var(--fg)' }}>cd {target} && cat {target}.md</span>
        </div>,
        <div key={Date.now() + 1} className="o">
          {outputs(goTo)[target]}
        </div>,
      ])
    }
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
        {'  '}<span className="h" style={{ display: 'inline-block', width: '28ch' }}>cd ..</span><span className="h">help</span><br /><br />
        <span className="d">Directories:</span><br />
        {'  '}<span className="u" style={{ display: 'inline-block', width: '28ch' }}>about/</span><span className="u">resume/</span><br />
        {'  '}<span className="u" style={{ display: 'inline-block', width: '28ch' }}>contact/</span><span className="u">~ (home)</span><br /><br />
        <span className="d">Files:</span><br />
        {'  '}<span style={{ display: 'inline-block', width: '28ch' }}>README.md</span><span>about.md</span><br />
        {'  '}<span style={{ display: 'inline-block', width: '28ch' }}>resume.md</span><span>contact.md</span>
      </div>,
    ])
  }

  const handleCommand = (raw) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    const echoLine = (
      <div key={Date.now()} className="term-msg">
        <Prompt path={cur} /><span style={{ color: 'var(--fg)' }}>{trimmed}</span>
      </div>
    )

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

    // cd bosh sahifaga
    if (trimmed === 'cd' || trimmed === 'cd ~' || trimmed === 'cd /' || trimmed === 'cd /root' || trimmed === 'cd home' || trimmed === '~') {
      setCur('home')
      addHistory([echoLine])
      return
    }

    // cd ..
    if (trimmed === 'cd ..' || trimmed === 'cd ../') {
      if (cur !== 'home') {
        setCur('home')
        addHistory([echoLine])
      } else {
        addHistory([
          echoLine,
          <div key={Date.now() + 1} className="term-msg d">~ (bosh sahifadasiz)</div>,
        ])
      }
      return
    }

    // cd about
    if (trimmed === 'cd about' || trimmed === 'cd ./about' || trimmed === 'cd ~/about') {
      setCur('about')
      addHistory([echoLine])
      return
    }

    // cd resume
    if (trimmed === 'cd resume' || trimmed === 'cd ./resume' || trimmed === 'cd ~/resume') {
      setCur('resume')
      addHistory([echoLine])
      return
    }

    // cd contact
    if (trimmed === 'cd contact' || trimmed === 'cd ./contact' || trimmed === 'cd ~/contact') {
      setCur('contact')
      addHistory([echoLine])
      return
    }

    // cd xato
    if (trimmed.startsWith('cd ')) {
      const dir = trimmed.slice(3).trim()
      addHistory([
        echoLine,
        <div key={Date.now() + 1} className="term-msg">
          bash: cd: {dir}: No such file or directory
        </div>,
      ])
      return
    }

    // about.md / cat about.md
    if (trimmed === 'cat about.md' || trimmed === 'about.md' || trimmed === './about.md' || trimmed === 'cat about/about.md') {
      if (cur === 'about' || trimmed === 'cat about/about.md') {
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

    // resume.md / cat resume.md
    if (trimmed === 'cat resume.md' || trimmed === 'resume.md' || trimmed === './resume.md' || trimmed === 'cat resume/resume.md') {
      if (cur === 'resume' || trimmed === 'cat resume/resume.md') {
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

    // contact.md / cat contact.md
    if (trimmed === 'cat contact.md' || trimmed === 'contact.md' || trimmed === './contact.md' || trimmed === 'cat contact/contact.md') {
      if (cur === 'contact' || trimmed === 'cat contact/contact.md') {
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

    // Tezkor sahifa chaqirish (about / resume / contact) — faqat cd, output emas
    if (trimmed === 'about' || trimmed === './about') {
      setCur('about')
      addHistory([echoLine])
      return
    }
    if (trimmed === 'resume' || trimmed === './resume') {
      setCur('resume')
      addHistory([echoLine])
      return
    }
    if (trimmed === 'contact' || trimmed === './contact') {
      setCur('contact')
      addHistory([echoLine])
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
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      const nextIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIdx)
      setInputVal(cmdHistory[nextIdx])
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const nextIdx = historyIndex + 1
      if (nextIdx >= cmdHistory.length) {
        setHistoryIndex(-1)
        setInputVal('')
      } else {
        setHistoryIndex(nextIdx)
        setInputVal(cmdHistory[nextIdx])
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
        dirs = ['about', 'resume', 'contact']
        files = ['README.md', 'about.md', 'resume.md', 'contact.md']
      } else if (cur === 'about') {
        dirs = []
        files = ['about.md']
      } else if (cur === 'resume') {
        dirs = []
        files = ['resume.md', 'resume.pdf']
      } else if (cur === 'contact') {
        dirs = []
        files = ['contact.md']
      }

      // 1) cd <dir>
      if (val.startsWith('cd ')) {
        const prefix = val.slice(3).trimStart()
        const pool = ['..', '~', ...dirs]
        const match = pool.find((d) => d.toLowerCase().startsWith(prefix.toLowerCase()))
        if (match) {
          setInputVal(`cd ${match}`)
        }
        return
      }

      // 2) cat <file>
      if (val.startsWith('cat ')) {
        const prefix = val.slice(4).trimStart()
        const match = files.find((f) => f.toLowerCase().startsWith(prefix.toLowerCase()))
        if (match) {
          setInputVal(`cat ${match}`)
        }
        return
      }

      // 3) Boshqa alohida fayl, papka yoki buyruqlar (masalan: R -> README.md, a -> about.md, he -> help)
      const commands = ['help', 'clear', 'send-mail', 'pwd', 'ls', 'cd', 'cat']
      const pool = [...files, ...dirs, ...commands]
      const match = pool.find((item) => item.toLowerCase().startsWith(trimmed.toLowerCase()))
      if (match) {
        setInputVal(match)
      }
    }
  }

  return (
    <>
      <div className="blob b1" /><div className="blob b2" />
      <div className="panel">
        <span className="l"><span style={{ color: 'var(--acc2)', marginRight: 6 }}>&gt;_</span>alijonov.uz</span>
        <nav>
          {[['home', '~'], ['about', 'about'], ['resume', 'resume'], ['contact', 'contact']].map(([k, l]) => (
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
                <div className="term-msg">
                  <Prompt path="home" />cat README.md
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
                setInputVal('')
                if (v.trim() && !wizard) {
                  setCmdHistory((prev) => [...prev, v.trim()])
                  setHistoryIndex(-1)
                }
                if (wizard) handleWizardInput(v)
                else handleCommand(v)
                setTimeout(() => scrollToBottom(), 30)
                setTimeout(() => scrollToBottom(), 150)
              }}
              className="term-line"
            >
              {getPromptLabel()}
              <div className="term-input-wrapper" onClick={() => focusInput()}>
                <span className="term-typed-text">{inputVal}</span>
                <span className="term-block-cursor" />
                <input
                  ref={inputRef}
                  type="text"
                  className="term-real-input"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
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
