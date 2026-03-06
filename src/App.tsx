import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import AuthPage from './pages/Auth'
import FoodVendorDashboard from './pages/dashboard/FoodVendorDashboard'
import FoodVendorChatbot from './pages/dashboard/FoodVendorChatbot'
import FoodVendorForecasting from './pages/dashboard/FoodVendorForecasting'
import MedicalStoreDashboard from './pages/dashboard/MedicalStoreDashboard'

type StatPill = {
  label: string
  accent: 'orange' | 'green' | 'blue'
}

const statPills: StatPill[] = [
  { label: '500+ vendors', accent: 'orange' },
  { label: '12 cities', accent: 'green' },
  { label: '₹8,000 avg monthly gain', accent: 'blue' },
]

const marqueeText =
  'AI Demand Forecasting  •  Inventory Intelligence  •  Gemini-Powered  •  Digital Storefront  •  Zero Waste  •  Smart Reorder  •  Festival Planner  •  '

// Loosen types for Framer Motion variants to avoid TS friction
const heroLineVariants: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.6,
      ease: [0.19, 1, 0.22, 1],
    },
  }),
}

const shapeVariant: any = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay,
      duration: 0.7,
      ease: [0.19, 1, 0.22, 1],
    },
  }),
}

function useCountUpOnView(target: number, duration = 1400) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const hasAnimatedRef = useRef(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true

          const frameDuration = 30
          const totalFrames = Math.round(duration / frameDuration)
          let frame = 0

          timerRef.current = window.setInterval(() => {
            frame += 1
            const progress = Math.min(frame / totalFrames, 1)
            const nextValue = target * progress
            setValue(nextValue)

            if (progress >= 1 && timerRef.current !== null) {
              window.clearInterval(timerRef.current)
              timerRef.current = null
            }
          }, frameDuration)

          observer.disconnect()
        }
      },
      { threshold: 0.6 },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [duration, target])

  return { ref, value }
}

function useScrolled(threshold = 80) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

function useSectionReveal() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

function Navbar() {
  const scrolled = useScrolled(80)
  const navigate = useNavigate()

  return (
    <header
      className={`sticky top-0 z-40 border-b border-[#E5E5E5] bg-white/90 backdrop-blur-md transition-shadow ${scrolled ? 'shadow-nav' : ''
        }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6 lg:py-4">
        <a href="#top" className="flex items-center gap-2">
          <span className="relative flex items-center text-xl font-semibold tracking-tight text-[#111827] lg:text-2xl">
            <span className="mr-1 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[var(--orange)] shadow-[0_0_18px_rgba(255,107,43,0.85)]" />
            Vendor<span className="font-extrabold">IQ</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#4b5563] md:flex">
          <a href="#features" className="transition-colors hover:text-black">
            Features
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-black">
            How it works
          </a>
          <a href="#impact" className="transition-colors hover:text-black">
            Impact
          </a>
          <a href="#for-vendors" className="transition-colors hover:text-black">
            For Vendors
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/auth')}
            className="hidden rounded-full border border-[#e5e7eb] px-4 py-1.5 text-xs font-medium text-[#4b5563] transition hover:bg-[#f3f4f6] md:inline-flex"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => navigate('/auth/signup')}
            className="inline-flex items-center rounded-full bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm transition-transform duration-150 hover:scale-[1.03] md:px-5 md:py-2.5 md:text-sm"
          >
            Start Free
          </button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  const navigate = useNavigate()

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-white pt-10 pb-16 lg:pt-16 lg:pb-20"
    >
      <div className="dot-grid-hero pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white/70 to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl flex-col items-start gap-12 px-4 lg:flex-row lg:items-center lg:gap-16 lg:px-6">
        <div className="z-10 max-w-xl space-y-8">
          <div className="space-y-2">
            <motion.p
              custom={0}
              variants={heroLineVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center rounded-full border border-black/5 bg-[#f3f4ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4b5563]"
            >
              <span className="mr-2 inline-flex h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
              For India&apos;s Offline Backbone
            </motion.p>

            <div className="space-y-1">
              <motion.h1
                custom={0}
                variants={heroLineVariants}
                initial="hidden"
                animate="visible"
                className="text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--ink)] sm:text-5xl lg:text-6xl xl:text-[5rem]"
              >
                India&apos;s 63 Million
              </motion.h1>
              <motion.h1
                custom={1}
                variants={heroLineVariants}
                initial="hidden"
                animate="visible"
                className="relative text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--ink)] sm:text-5xl lg:text-6xl xl:text-[5rem]"
              >
                Vendors Deserve
                <span className="pointer-events-none absolute inset-x-0 -bottom-2 -z-10 h-4">
                  <svg
                    viewBox="0 0 320 40"
                    className="h-full w-full"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 25C70 15 140 5 315 15"
                      fill="none"
                      stroke="#FF6B2B"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </motion.h1>
              <motion.h1
                custom={2}
                variants={heroLineVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap items-center gap-3 text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--ink)] sm:text-5xl lg:text-6xl xl:text-[5rem]"
              >
                <span>AI Too.</span>
                <span className="inline-flex items-center rounded-full bg-[var(--orange)] px-4 py-1 text-lg font-semibold text-white shadow-[0_14px_40px_rgba(255,107,43,0.5)] sm:text-xl lg:text-2xl">
                  AI
                </span>
              </motion.h1>
            </div>
          </div>

          <motion.p
            custom={3}
            variants={heroLineVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl text-[0.98rem] leading-relaxed text-[#4b5563] sm:text-[1.05rem]"
          >
            While Amazon predicts demand by the hour — your kirana store runs on
            gut feeling. <span className="font-semibold">VendorIQ</span> fixes
            that with AI demand forecasting built for India&apos;s street-level
            reality.
          </motion.p>

          <motion.div
            custom={4}
            variants={heroLineVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={() => navigate('/auth/signup')}
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,23,42,0.4)] transition-transform duration-150 hover:scale-[1.03]"
            >
              Get Started
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d1d5db] bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#111827] shadow-sm transition hover:bg-white">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f3f4f6] text-[11px] font-semibold">
                ▶
              </span>
              Watch the Story
            </button>
          </motion.div>

          <motion.div
            custom={5}
            variants={heroLineVariants}
            initial="hidden"
            animate="visible"
            className="mt-4 flex flex-wrap gap-3 text-[11px] sm:text-xs"
          >
            {statPills.map((pill) => {
              const borderColor =
                pill.accent === 'orange'
                  ? 'border-[var(--orange)]'
                  : pill.accent === 'green'
                    ? 'border-[var(--green)]'
                    : 'border-[var(--blue)]'

              return (
                <div
                  key={pill.label}
                  className={`inline-flex items-center rounded-full border-l-4 ${borderColor} bg-white/90 px-3 py-1 text-[0.7rem] font-medium text-[#4b5563] shadow-sm backdrop-blur-sm sm:px-4 sm:text-[0.74rem]`}
                >
                  {pill.label}
                </div>
              )
            })}
          </motion.div>
        </div>

        <div className="relative flex flex-1 items-center justify-center lg:justify-end">
          <motion.div
            className="relative h-[320px] w-[320px] sm:h-[360px] sm:w-[360px] lg:h-[400px] lg:w-[400px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <motion.div
              className="absolute inset-4 rounded-full border-[3px] border-[var(--orange)]/80"
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            <motion.div
              variants={shapeVariant}
              initial="hidden"
              animate="visible"
              custom={0.25}
              className="absolute inset-14 flex flex-col justify-between rounded-3xl bg-white/95 p-4 shadow-[0_26px_70px_rgba(15,23,42,0.25)] backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#9ca3af]">
                    Today&apos;s forecast
                  </p>
                  <p className="mt-1 text-xs text-[#6b7280]">
                    Based on 18 months of sales
                  </p>
                </div>
                <span className="rounded-full bg-[#ecfdf3] px-2 py-1 text-[10px] font-semibold text-[#15803d]">
                  +14.6% uplift
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#9ca3af]">
                  Maggi 2-Min Noodles
                </p>
                <p className="font-mono text-2xl font-medium text-[#111827]">
                  380 <span className="text-xs text-[#6b7280]">units</span>
                </p>
              </div>

              <div className="mt-4 flex items-end gap-1.5">
                {[48, 70, 100, 62, 55].map((height, index) => (
                  <motion.div
                    key={index}
                    className="flex-1 rounded-full bg-gradient-to-t from-[var(--blue)] to-[var(--green)]"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{
                      delay: 0.2 + index * 0.05,
                      duration: 0.6,
                      ease: [0.19, 1, 0.22, 1],
                    }}
                    style={{ minHeight: '12px', maxHeight: '72px' }}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-[10px] text-[#6b7280]">
                <span>Rainy weekday</span>
                <span className="font-mono text-[11px] text-[#111827]">
                  Next reorder: 18:45
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={shapeVariant}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="animate-float-slow absolute -left-3 top-10 h-9 w-9 rounded-full bg-[var(--orange)] shadow-[0_18px_50px_rgba(255,107,43,0.55)]"
            />

            <motion.div
              variants={shapeVariant}
              initial="hidden"
              animate="visible"
              custom={0.55}
              className="animate-float-medium absolute -right-2 bottom-16 h-8 w-8 rotate-45 rounded-[0.9rem] bg-[var(--blue)] shadow-[0_16px_45px_rgba(37,99,235,0.55)]"
            />

            <motion.div
              variants={shapeVariant}
              initial="hidden"
              animate="visible"
              custom={0.65}
              className="animate-float-fast absolute left-16 -bottom-3 h-0 w-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent border-b-[var(--green)]"
            />

            <motion.div
              variants={shapeVariant}
              initial="hidden"
              animate="visible"
              custom={0.8}
              className="animate-float-medium absolute -top-4 right-12 flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-[var(--violet)] shadow-[0_18px_50px_rgba(139,92,246,0.6)]"
            >
              <div className="h-3 w-3 rounded-full border-2 border-white/70" />
            </motion.div>

            <div className="absolute -left-4 bottom-8 grid grid-cols-3 gap-1 opacity-[0.18]">
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="h-1 w-1 rounded-full bg-[var(--ink)]"
                />
              ))}
            </div>
            <div className="absolute right-6 top-4 grid grid-cols-3 gap-1 opacity-[0.16]">
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="h-1 w-1 rounded-full bg-[var(--ink)]"
                />
              ))}
            </div>
            <div className="absolute -right-6 bottom-0 grid grid-cols-3 gap-1 opacity-[0.16]">
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="h-1 w-1 rounded-full bg-[var(--ink)]"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Ticker() {
  return (
    <section className="flex min-h-[48px] items-center border-y border-[#111827]/10 bg-[#0d0d0d] text-[#e5e5e5]">
      <div className="relative mx-auto flex max-w-full items-center overflow-hidden py-3 text-[13px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0d0d0d] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0d0d0d] to-transparent" />
        <div
          aria-hidden="true"
          className="animate-marquee flex min-w-max items-center gap-10 whitespace-nowrap"
        >
          {[0, 1].map((i) => (
            <span key={i} className="font-mono text-[13px] text-[#888888]">
              {marqueeText.split('•').map((chunk, idx, arr) => (
                <span key={idx}>
                  {chunk}
                  {idx < arr.length - 1 && (
                    <span className="px-2 text-[var(--orange)]">•</span>
                  )}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProblemSection() {
  const radius = 115
  const circumference = 2 * Math.PI * radius
  const lossPercentage = 0.78

  const barHeights = [26, 42, 55, 48, 60, 38]

  const { ref, isVisible } = useSectionReveal()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`section-fade bg-white py-16 lg:py-20 ${isVisible ? 'visible' : ''}`}
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center lg:gap-16">
          <div className="space-y-6">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--orange)]">
              THE PROBLEM
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl lg:text-[3.5rem] lg:leading-[1.05]">
              Every month, India&apos;s vendors lose what they can&apos;t afford
              to lose.
            </h2>
            <div className="space-y-4 text-[1.06rem] leading-[1.8] text-[#444444]">
              <p>
                Crates of milk, bread, and vegetables expire in the back room
                because no one saw the pattern in last Diwali&apos;s demand.
                Those write-offs quietly eat into razor-thin margins.
              </p>
              <p>
                On the other side, shelves sit empty on the month&apos;s first
                few days. Customers walk to the next kirana or quick-commerce
                app, and that sale is gone for good.
              </p>
              <p>
                Behind both problems is the same thing: zero AI, almost no
                digital tools, and decisions made purely on gut feeling in a
                market that moves faster than any one shopkeeper can track.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="flex h-full flex-col rounded-2xl border border-[#E5E5E5] border-l-4 border-l-[var(--orange)] bg-white px-4 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                  <span aria-hidden="true" className="text-lg">
                    🥖
                  </span>
                  Food Waste
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#4b5563]">
                  Perishables expire silently each week because demand patterns
                  live only in memory, not in data.
                </p>
              </div>
              <div className="flex h-full flex-col rounded-2xl border border-[#E5E5E5] border-l-4 border-l-[var(--blue)] bg-white px-4 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                  <span aria-hidden="true" className="text-lg">
                    📦
                  </span>
                  Stock Blindness
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#4b5563]">
                  No live view of what&apos;s running out, what&apos;s stuck,
                  or what tomorrow&apos;s customers will ask for.
                </p>
              </div>
              <div className="flex h-full flex-col rounded-2xl border border-[#E5E5E5] border-l-4 border-l-[var(--green)] bg-white px-4 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                  <span aria-hidden="true" className="text-lg">
                    🌐
                  </span>
                  No Digital Presence
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#4b5563]">
                  Loyal customers drift to apps because the shop they trust
                  doesn&apos;t exist where they now discover products.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
              className="relative flex w-full max-w-xs flex-col items-center rounded-3xl bg-[#0b1120] px-6 py-7 text-[#e5e7eb] shadow-[0_30px_80px_rgba(15,23,42,0.7)] sm:max-w-sm"
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#6b7280]">
                The ₹12,500 Problem
              </p>
              <div className="relative">
                <svg
                  width="260"
                  height="260"
                  viewBox="0 0 260 260"
                  className="block"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="lossGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#F97316" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="130"
                    cy="130"
                    r={radius}
                    fill="transparent"
                    stroke="rgba(31,41,55,0.8)"
                    strokeWidth="18"
                  />
                  <motion.circle
                    cx="130"
                    cy="130"
                    r={radius}
                    fill="transparent"
                    stroke="url(#lossGradient)"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{
                      strokeDashoffset: circumference * (1 - lossPercentage),
                    }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 1.4,
                      ease: [0.19, 1, 0.22, 1],
                    }}
                    style={{ transformOrigin: '50% 50%', transformBox: 'fill-box' }}
                  />
                </svg>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p className="font-mono text-3xl font-semibold text-[var(--orange)] sm:text-[2.4rem]">
                    ₹12,500
                  </p>
                  <p className="mt-1 text-[13px] text-[#9ca3af]">/month lost</p>
                  <p className="mt-3 rounded-full bg-white/5 px-3 py-1 text-[11px] text-[#9ca3af]">
                    Across waste, stockouts & walk-aways
                  </p>
                </div>
              </div>

              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#9ca3af]">
                  <span>Estimated monthly leakage</span>
                  <span className="font-mono text-[12px] text-[#e5e7eb]">
                    Kirana sample cohort
                  </span>
                </div>
                <motion.svg
                  width="100%"
                  height="72"
                  viewBox="0 0 120 60"
                  preserveAspectRatio="none"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                >
                  {barHeights.map((h, index) => {
                    const barWidth = 10
                    const gap = 10
                    const x = 5 + index * (barWidth + gap)
                    const maxHeight = 50
                    const clampedHeight = (h / 60) * maxHeight

                    return (
                      <motion.rect
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        x={x}
                        y={60 - clampedHeight}
                        width={barWidth}
                        height={clampedHeight}
                        rx={4}
                        fill="url(#lossGradient)"
                        variants={{
                          hidden: { height: 0, y: 60 },
                          visible: {
                            height: clampedHeight,
                            y: 60 - clampedHeight,
                            transition: {
                              delay: 0.2 + index * 0.06,
                              duration: 0.5,
                              ease: [0.19, 1, 0.22, 1],
                            },
                          },
                        }}
                      />
                    )
                  })}
                </motion.svg>
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#9ca3af]">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>
              </div>

              <div className="mt-5 flex w-full flex-wrap items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="inline-flex items-center rounded-full bg-[rgba(248,113,113,0.12)] px-3 py-1 text-[11px] font-medium text-[var(--orange)]"
                >
                  100 units wasted daily
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: 0.28, duration: 0.4 }}
                  className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-[#e5e7eb]"
                >
                  0 digital tools
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

type StatConfig = {
  label: string
  target: number
  format: (value: number) => string
}

const stats: StatConfig[] = [
  {
    label: 'Micro-vendors in India',
    target: 63,
    format: (value) => `${Math.round(value)}M`,
  },
  {
    label: 'Informal retail market',
    target: 1.1,
    format: (value) => `₹${value.toFixed(1)}T`,
  },
  {
    label: 'Have any digital tools',
    target: 3,
    format: (value) => `<${Math.round(value)}%`,
  },
  {
    label: 'Avg monthly gain with VendorIQ',
    target: 8000,
    format: (value) =>
      `₹${Math.round(value).toLocaleString('en-IN', {
        maximumFractionDigits: 0,
      })}`,
  },
]

function FourWorldsSection() {
  type WorldCardProps = {
    theme: 'orange' | 'blue' | 'green' | 'violet'
    emoji: string
    title: string
    description: string
  }

  function FoodChart({ rerenderKey }: { rerenderKey: number }) {
    const heights = [32, 38, 45, 60, 40, 34, 28]

    return (
      <motion.svg
        key={rerenderKey}
        viewBox="0 0 140 60"
        className="h-16 w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
      >
        <defs>
          <linearGradient id="foodBars" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="foodBarsMuted" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#FED7AA" />
          </linearGradient>
        </defs>
        {heights.map((h, index) => {
          const barWidth = 10
          const gap = 8
          const x = 5 + index * (barWidth + gap)
          const maxHeight = 48
          const clampedHeight = (h / 60) * maxHeight
          const isToday = index === 3

          return (
            <motion.rect
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              x={x}
              y={60 - clampedHeight}
              width={barWidth}
              height={clampedHeight}
              rx={3}
              fill={isToday ? 'url(#foodBars)' : 'url(#foodBarsMuted)'}
              variants={{
                hidden: { height: 0, y: 60 },
                visible: {
                  height: clampedHeight,
                  y: 60 - clampedHeight,
                  transition: {
                    delay: 0.18 + index * 0.05,
                    duration: 0.45,
                    ease: [0.19, 1, 0.22, 1],
                  },
                },
              }}
            />
          )
        })}
      </motion.svg>
    )
  }

  function MedicalChart({ rerenderKey }: { rerenderKey: number }) {
    const dash = 220

    return (
      <motion.svg
        key={rerenderKey}
        viewBox="0 0 160 64"
        className="h-16 w-full"
      >
        <defs>
          <linearGradient id="medArea" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
        <motion.path
          d="M4 54C15 50 24 40 35 38C48 36 56 30 66 26C76 22 88 22 100 26C112 30 122 38 134 34C142 32 148 28 156 24L156 60L4 60Z"
          fill="url(#medArea)"
          fillOpacity="0.18"
        />
        <motion.path
          d="M4 54C15 50 24 40 35 38C48 36 56 30 66 26C76 22 88 22 100 26C112 30 122 38 134 34C142 32 148 28 156 24"
          fill="none"
          stroke="url(#medArea)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={dash}
          initial={{ strokeDashoffset: dash }}
          whileInView={{ strokeDashoffset: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        />
      </motion.svg>
    )
  }

  function KiranaHeatmap({ rerenderKey }: { rerenderKey: number }) {
    const intensities = [
      0.2, 0.3, 0.4, 0.7, 0.6, 0.3, 0.25, 0.25, 0.35, 0.45, 0.8, 0.7, 0.3, 0.35,
      0.5, 0.85, 0.65, 0.4, 0.5, 0.9, 0.4, 0.35, 0.5, 0.75, 0.55, 0.3, 0.45, 0.7,
    ]

    return (
      <div
        key={rerenderKey}
        className="grid h-20 w-full grid-cols-7 gap-1.5 rounded-lg bg-[#ecfdf3] p-1.5"
      >
        {intensities.map((intensity, index) => (
          <motion.div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="h-full rounded-[6px]"
            style={{
              backgroundColor: `rgba(34,201,122,${0.18 + intensity * 0.6})`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              delay: 0.12 + index * 0.03,
              duration: 0.25,
              ease: [0.19, 1, 0.22, 1],
            }}
          />
        ))}
      </div>
    )
  }

  function RetailStackedBar({ rerenderKey }: { rerenderKey: number }) {
    const soldPercent = 0.6

    return (
      <div className="w-full">
        <div className="h-4 w-full rounded-full bg-[#ede9fe]">
          <motion.div
            key={`sold-${rerenderKey}`}
            className="h-full rounded-full bg-[#8b5cf6]"
            initial={{ width: 0 }}
            whileInView={{ width: `${soldPercent * 100}%` }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-[#6b7280]">
          <span>Sold: 120</span>
          <span>Remaining: 80</span>
        </div>
      </div>
    )
  }

  function WorldCard({ theme, emoji, title, description }: WorldCardProps) {
    const [chartKey, setChartKey] = useState(0)

    const isOrange = theme === 'orange'
    const isBlue = theme === 'blue'
    const isGreen = theme === 'green'

    const bgColor = isOrange
      ? '#FFF7F3'
      : isBlue
        ? '#F3F7FF'
        : isGreen
          ? '#F3FFF8'
          : '#F8F3FF'

    const accent =
      theme === 'orange'
        ? 'var(--orange)'
        : theme === 'blue'
          ? 'var(--blue)'
          : theme === 'green'
            ? 'var(--green)'
            : 'var(--violet)'

    const labelText =
      theme === 'orange'
        ? 'ZERO WASTE INTELLIGENCE'
        : theme === 'blue'
          ? 'SEASONAL DEMAND RADAR'
          : theme === 'green'
            ? 'SALARY CYCLE AWARE'
            : 'DEAD STOCK DETECTOR'

    const badgeText =
      theme === 'orange'
        ? '380 units today'
        : theme === 'blue'
          ? 'Expiry Alert: 12 items'
          : theme === 'green'
            ? 'Restock Alert: Cold Drinks'
            : '80 units at risk'

    const badgeBg =
      theme === 'orange'
        ? 'rgba(255,107,43,0.12)'
        : theme === 'blue'
          ? 'rgba(59,130,246,0.14)'
          : theme === 'green'
            ? 'rgba(34,201,122,0.14)'
            : 'rgba(139,92,246,0.16)'

    const handleHoverStart = () => {
      setChartKey((key) => key + 1)
    }

    return (
      <motion.div
        onHoverStart={handleHoverStart}
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="group flex min-h-[380px] flex-col justify-between rounded-3xl border border-[#e5e7eb] bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-transparent backdrop-blur-sm transition-shadow duration-200 hover:shadow-[0_26px_70px_rgba(15,23,42,0.16)] sm:p-6"
        style={{ backgroundColor: bgColor }}
      >
        <div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
                style={{ backgroundColor: 'rgba(17,24,39,0.04)', color: accent }}
              >
                {emoji}
              </div>
              <div>
                <p
                  className="font-mono text-[11px] font-medium uppercase tracking-[0.24em]"
                  style={{ color: accent }}
                >
                  {labelText}
                </p>
                <p className="mt-1 text-[0.78rem] text-[#6b7280]">{title}</p>
              </div>
            </div>
          </div>

          <h3 className="mt-4 text-[1.45rem] font-semibold leading-tight tracking-tight text-[#111827]">
            {title}
          </h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-[#4b5563]">
            {description}
          </p>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div className="flex-1">
            {theme === 'orange' && <FoodChart rerenderKey={chartKey} />}
            {theme === 'blue' && <MedicalChart rerenderKey={chartKey} />}
            {theme === 'green' && <KiranaHeatmap rerenderKey={chartKey} />}
            {theme === 'violet' && <RetailStackedBar rerenderKey={chartKey} />}
          </div>
          <div className="relative flex flex-col items-end justify-end gap-3">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-mono font-medium"
              style={{ backgroundColor: badgeBg, color: accent }}
            >
              {badgeText}
            </span>
            <div className="relative h-10 w-10">
              {theme === 'orange' && (
                <div className="absolute inset-0 rounded-full border-2 border-[var(--orange)] border-t-transparent border-l-transparent transition-transform duration-200 group-hover:rotate-12" />
              )}
              {theme === 'blue' && (
                <div className="absolute inset-1 rotate-0 rounded-[40%] border-2 border-[var(--blue)] transition-transform duration-200 group-hover:-rotate-6" />
              )}
              {theme === 'green' && (
                <div className="absolute inset-1 origin-bottom border-l-[18px] border-r-[18px] border-b-[30px] border-l-transparent border-r-transparent border-b-[var(--green)] transition-transform duration-200 group-hover:-rotate-6" />
              )}
              {theme === 'violet' && (
                <div className="absolute inset-1 rotate-45 rounded-[0.9rem] border-2 border-[var(--violet)] transition-transform duration-200 group-hover:-rotate-[-55deg]" />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const { ref, isVisible } = useSectionReveal()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`section-fade bg-white py-16 lg:py-20 ${isVisible ? 'visible' : ''}`}
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="max-w-2xl space-y-3">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--orange)]">
            BUILT FOR YOUR WORLD
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl lg:text-[3rem]">
            One platform. Four completely different intelligences.
          </h2>
          <p className="text-[0.98rem] leading-relaxed text-[#4b5563] sm:text-[1.02rem]">
            Not just different colors — different AI brains, different
            forecasts, different vocabulary for every type of business that
            trusts VendorIQ.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:gap-6">
          <WorldCard
            theme="orange"
            emoji="🍽️"
            title="Food Vendor"
            description="Every morning: exact units to prepare. Weather, festivals, and your own sales history — combined."
          />
          <WorldCard
            theme="blue"
            emoji="💊"
            title="Medical Store"
            description="Fever medicines spike in summer. ORS in monsoon. VendorIQ predicts it before the season hits."
          />
          <WorldCard
            theme="green"
            emoji="🛒"
            title="Kirana Store"
            description="Salary day = premium product day. Temperature = cold drink day. VendorIQ knows before you do."
          />
          <WorldCard
            theme="violet"
            emoji="👗"
            title="Retail Shop"
            description="Bought 200 winter shirts. Sold 120. VendorIQ flags the other 80 before you forget they exist."
          />
        </div>
      </div>
    </section>
  )
}

function DiagonalDivider() {
  return (
    <section
      aria-hidden="true"
      className="relative h-10 bg-white lg:h-14"
    >
      <div
        className="absolute inset-0 bg-[#0d0d0d]"
        style={{
          clipPath: 'polygon(0 0, 100% 70%, 100% 100%, 0 100%)',
        }}
      />
    </section>
  )
}

type FeatureConfig = {
  title: string
  description: string
  accentColor: string
  accentGlow: string
  badge: string
  icon: 'forecast' | 'inventory' | 'logger' | 'chatbot' | 'storefront' | 'analytics'
}

const features: FeatureConfig[] = [
  {
    title: 'AI Demand Forecasting',
    description:
      'Gemini-powered hourly demand curves that speak the language of Indian seasons, festivals, and footfall.',
    accentColor: '#FF6B2B',
    accentGlow: 'rgba(255,107,43,0.55)',
    badge: 'Powered by Gemini 1.5 Flash',
    icon: 'forecast',
  },
  {
    title: 'Smart Inventory',
    description:
      'See what is overstocked, at-risk, and about to run out — before it hits your shelf.',
    accentColor: '#2B7FFF',
    accentGlow: 'rgba(43,127,255,0.55)',
    badge: 'Real-time stock health',
    icon: 'inventory',
  },
  {
    title: 'Sales Logger',
    description:
      'Simple taps or quick notes turn into training data that keeps your AI getting sharper every week.',
    accentColor: '#22C97A',
    accentGlow: 'rgba(34,201,122,0.55)',
    badge: 'Trains your AI over time',
    icon: 'logger',
  },
  {
    title: 'AI Chatbot',
    description:
      'Ask in plain Hindi or Gujarati: “Kal kitna banau?” and get answers tuned to your world.',
    accentColor: '#8B5CF6',
    accentGlow: 'rgba(139,92,246,0.55)',
    badge: 'Knows your business type',
    icon: 'chatbot',
  },
  {
    title: 'Digital Storefront',
    description:
      'Share a beautiful WhatsApp-ready menu link — no app downloads, no passwords, live in minutes.',
    accentColor: '#FFD60A',
    accentGlow: 'rgba(255,214,10,0.55)',
    badge: 'Live in 3 minutes',
    icon: 'storefront',
  },
  {
    title: 'Analytics Dashboard',
    description:
      'Before/after views, heatmaps, and simple stories that explain where your extra profit comes from.',
    accentColor: '#FF6B2B',
    accentGlow: 'rgba(255,107,43,0.55)',
    badge: 'Heatmaps + before/after',
    icon: 'analytics',
  },
]

function FeatureIcon({
  accentColor,
  accentGlow,
  type,
}: {
  accentColor: string
  accentGlow: string
  type: FeatureConfig['icon']
}) {
  return (
    <motion.div
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b0b0b]"
      style={{
        color: accentColor,
        boxShadow: `0 0 0 ${accentGlow.replace('0.55', '0')}`,
      }}
      animate={{
        boxShadow: [
          `0 0 0 ${accentGlow.replace('0.55', '0')}`,
          `0 0 22px ${accentGlow}`,
          `0 0 0 ${accentGlow.replace('0.55', '0')}`,
        ],
      }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {type === 'forecast' && (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M4 17L9 10L13 14L20 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 5H20V7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {type === 'inventory' && (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <rect
            x="4"
            y="4"
            width="7"
            height="7"
            rx="1.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <rect
            x="13"
            y="4"
            width="7"
            height="7"
            rx="1.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <rect
            x="4"
            y="13"
            width="7"
            height="7"
            rx="1.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <rect
            x="13"
            y="13"
            width="7"
            height="7"
            rx="1.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      )}
      {type === 'logger' && (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M6 5H15"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M6 10H11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M6 15H10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M16.5 5.5L19 8L13 14L11 14L11 12L16.5 5.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {type === 'chatbot' && (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M7 18L5 20V14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="5"
            y="4"
            width="14"
            height="10"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle cx="10" cy="9" r="0.9" fill="currentColor" />
          <circle cx="14" cy="9" r="0.9" fill="currentColor" />
          <path
            d="M16 4V2.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
      {type === 'storefront' && (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <rect
            x="6"
            y="3"
            width="9"
            height="18"
            rx="2.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M18 8L20.5 10.5L18 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 8H17"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
      {type === 'analytics' && (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M5 19V11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M10 19V7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M15 19V9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M20 19V5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </motion.div>
  )
}

function FeaturesSection() {
  const { ref, isVisible } = useSectionReveal()

  return (
    <section
      id="features"
      ref={ref as React.RefObject<HTMLElement>}
      className={`section-fade relative overflow-hidden bg-[#0d0d0d] py-16 text-white lg:py-20 ${isVisible ? 'visible' : ''}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <div className="dot-matrix-dark h-full w-full" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 lg:px-6">
        <div className="max-w-2xl space-y-3">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--orange)]">
            THE PLATFORM
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[3.25rem]">
            Six tools. One intelligence layer.
          </h2>
          <p className="text-[0.96rem] leading-relaxed text-[#9ca3af]">
            From predicting tomorrow&apos;s samosa demand to flagging dead
            stock on your back shelf, VendorIQ stitches six modules into a
            single AI that learns your business every day.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{
                y: -8,
                boxShadow: `0 26px 70px ${feature.accentGlow}`,
                borderColor: feature.accentColor,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="flex min-h-[220px] flex-col justify-between rounded-2xl border border-[#2a2a2a] bg-[#161616]/95 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <FeatureIcon
                  accentColor={feature.accentColor}
                  accentGlow={feature.accentGlow}
                  type={feature.icon}
                />
              </div>
              <div className="mt-4 space-y-1.5">
                <h3 className="text-[1.05rem] font-semibold leading-snug">
                  {feature.title}
                </h3>
                <p className="text-[0.88rem] leading-relaxed text-[#9ca3af]">
                  {feature.description}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p
                  className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
                  style={{ color: feature.accentColor }}
                >
                  {feature.badge}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

type StoryStep = {
  day: string
  title: string
  tone: 'before' | 'first' | 'pattern' | 'after'
  body: string
  stats: string
}

const storySteps: StoryStep[] = [
  {
    day: 'Day 1',
    title: 'Before VendorIQ',
    tone: 'before',
    body: 'Panipuri stall opens with guesswork. 500 puris prepared because “bas hamesha itna hi banta hai”.',
    stats: '500 units prepared • 100 wasted • ₹500/day lost',
  },
  {
    day: 'Day 7',
    title: 'First Forecast',
    tone: 'first',
    body: 'VendorIQ looks at last week + weather. Gemini says 380. Ramesh prepares 390. Almost perfect.',
    stats: 'Gemini said 380 • Prepared 390 • Sold 385',
  },
  {
    day: 'Day 14',
    title: 'Pattern Forming',
    tone: 'pattern',
    body: 'Evening waste drops. Slow days get lighter prep. A simple WhatsApp menu goes out to regulars.',
    stats: 'Waste dropping daily • Menu shared to 80 contacts',
  },
  {
    day: 'Day 30',
    title: 'Transformed',
    tone: 'after',
    body: '₹8,000 extra this month. Almost no waste. 200+ people now know when Ramesh is open & stocked.',
    stats: '₹8,000 extra/month • Near-zero waste • 200+ digital contacts',
  },
]

function RameshStorySection() {
  const timelineLength = 260

  const beforeTargets = {
    lost: 12500,
    wasteUnits: 100,
    contacts: 0,
  }

  const afterTargets = {
    gain: 8000,
    contacts: 200,
  }

  const { ref: beforeRef, value: beforeBase } = useCountUpOnView(1)
  const { ref: afterRef, value: afterBase } = useCountUpOnView(1)

  const beforeLost = Math.round(beforeBase * beforeTargets.lost)
  const beforeWasteUnits = Math.round(beforeBase * beforeTargets.wasteUnits)
  const beforeContacts = Math.round(beforeBase * beforeTargets.contacts)

  const afterGain = Math.round(afterBase * afterTargets.gain)
  const afterContacts = Math.round(afterBase * afterTargets.contacts)

  const { ref, isVisible } = useSectionReveal()

  return (
    <section
      id="impact"
      ref={ref as React.RefObject<HTMLElement>}
      className={`section-fade bg-white py-16 lg:py-20 ${isVisible ? 'visible' : ''}`}
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="max-w-2xl space-y-3">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--orange)]">
            THE IMPACT STORY
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl lg:text-[3.1rem]">
            One vendor. Thirty days. The numbers speak.
          </h2>
        </div>

        <div className="mt-10">
          <div className="relative">
            <motion.svg
              viewBox="0 0 280 6"
              className="mx-auto h-6 w-full max-w-xl"
            >
              <motion.path
                d="M10 3 H270"
                fill="none"
                stroke="#F97316"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray={timelineLength}
                strokeDashoffset={timelineLength}
                initial={{ strokeDashoffset: timelineLength }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1] }}
              />
            </motion.svg>

            <div className="relative mt-4 grid gap-6 md:grid-cols-4">
              {storySteps.map((step, index) => {
                const toneBg =
                  step.tone === 'before'
                    ? 'bg-[#f3f4f6]'
                    : step.tone === 'first'
                      ? 'bg-[#fff7ed]'
                      : step.tone === 'pattern'
                        ? 'bg-[#ffedd5]'
                        : 'bg-[#ecfdf3]'

                const circleColor =
                  step.tone === 'before'
                    ? '#d1d5db'
                    : step.tone === 'first'
                      ? '#fed7aa'
                      : step.tone === 'pattern'
                        ? '#fb923c'
                        : '#22c55e'

                return (
                  <div
                    key={step.day}
                    className="flex flex-col items-center text-center md:items-start md:text-left"
                  >
                    <motion.div
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-[0_10px_25px_rgba(15,23,42,0.2)]"
                      style={{ backgroundColor: circleColor }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.7 }}
                      transition={{
                        delay: 0.1 + index * 0.1,
                        duration: 0.3,
                        ease: [0.19, 1, 0.22, 1],
                      }}
                    >
                      <span className="font-mono text-[11px] font-medium text-[#111827]">
                        {step.day.replace('Day ', 'D')}
                      </span>
                    </motion.div>
                    <motion.div
                      className={`mt-4 w-full max-w-xs rounded-2xl px-4 py-4 text-left shadow-[0_16px_40px_rgba(15,23,42,0.14)] ${toneBg}`}
                      initial={{ opacity: 0, scale: 0.96, y: 8 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        delay: 0.18 + index * 0.12,
                        duration: 0.4,
                        ease: [0.19, 1, 0.22, 1],
                      }}
                    >
                      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#6b7280]">
                        {step.day} — {step.title}
                      </p>
                      <p className="mt-2 text-[0.94rem] leading-relaxed text-[#374151]">
                        {step.body}
                      </p>
                      <p className="mt-3 text-[0.8rem] font-mono text-[#6b7280]">
                        {step.stats}
                      </p>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 md:flex-row md:items-stretch md:gap-6">
          <div
            ref={beforeRef}
            className="flex-1 rounded-2xl bg-[#f3f4f6] px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.14)]"
          >
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b7280]">
              BEFORE
            </p>
            <div className="mt-3 space-y-1.5 text-[0.95rem] text-[#374151]">
              <p>
                <span className="font-mono text-[1.3rem] font-semibold text-[#111827]">
                  ₹{beforeLost.toLocaleString('en-IN')}
                </span>{' '}
                <span className="text-[0.9rem] text-[#6b7280]">
                  /month lost
                </span>
              </p>
              <p>
                <span className="font-mono text-[1.1rem] font-semibold text-[#111827]">
                  {beforeWasteUnits}
                </span>{' '}
                units wasted / day
              </p>
              <p>
                <span className="font-mono text-[1.1rem] font-semibold text-[#111827]">
                  {beforeContacts}
                </span>{' '}
                digital presence
              </p>
            </div>
          </div>

          <div className="hidden flex-none items-center justify-center md:flex">
            <span className="text-3xl font-semibold text-[#9ca3af]">→</span>
          </div>

          <div
            ref={afterRef}
            className="flex-1 rounded-2xl bg-[#FFF7F3] px-5 py-5 shadow-[0_18px_50px_rgba(255,107,43,0.32)]"
          >
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--orange)]">
              AFTER
            </p>
            <div className="mt-3 space-y-1.5 text-[0.95rem] text-[#7c2d12]">
              <p>
                <span className="font-mono text-[1.3rem] font-semibold text-[var(--orange)]">
                  ₹{afterGain.toLocaleString('en-IN')}
                </span>{' '}
                <span className="text-[0.9rem] text-[#9a3412]">
                  /month gained
                </span>
              </p>
              <p>
                ~<span className="font-mono text-[1.1rem] font-semibold text-[#15803d]">
                  0
                </span>{' '}
                waste on a normal day
              </p>
              <p>
                <span className="font-mono text-[1.1rem] font-semibold text-[#111827]">
                  {afterContacts}+
                </span>{' '}
                WhatsApp contacts
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border-l-4 border-[var(--orange)] bg-[#FFF7F3] px-5 py-6 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="shrink-0">
              <svg
                viewBox="0 0 80 80"
                className="h-12 w-12 text-[var(--orange)] sm:h-16 sm:w-16"
                aria-hidden="true"
              >
                <text
                  x="12"
                  y="58"
                  fontSize="64"
                  fill="currentColor"
                >
                  “
                </text>
              </svg>
            </div>
            <div>
              <p className="text-[1.2rem] italic leading-relaxed text-[#7c2d12] sm:text-[1.4rem]">
                Pehle andaze se banata tha. Ab VendorIQ bolta hai — aur main
                sunta hoon.
              </p>
              <p className="mt-3 text-[0.9rem] font-medium text-[#9a3412]">
                — Ramesh Bhai, Panipuri Vendor, Ahmedabad
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MarketOpportunitySection() {
  const statsConfig = [
    {
      label: 'Micro-enterprises in India',
      target: 63,
      format: (value: number) => `${Math.round(value)}M`,
      color: 'var(--orange)',
    },
    {
      label: 'Informal retail sector value',
      target: 1.1,
      format: (value: number) => `$${value.toFixed(1)}T`,
      color: 'var(--green)',
    },
    {
      label: 'Currently have digital tools',
      target: 3,
      format: (value: number) => `<${Math.round(value)}%`,
      color: 'var(--blue)',
    },
  ]

  const { ref: sectionRef, isVisible } = useSectionReveal()

  const cityTicker =
    'Mumbai  •  Delhi  •  Bangalore  •  Ahmedabad  •  Surat  •  Pune  •  Chennai  •  Jaipur  •  Lucknow  •  Indore  •  Bhopal  •  Nagpur  •  '

  const mapCities = [
    { name: 'Delhi', cx: 105, cy: 40 },
    { name: 'Jaipur', cx: 95, cy: 52 },
    { name: 'Lucknow', cx: 125, cy: 55 },
    { name: 'Mumbai', cx: 80, cy: 90 },
    { name: 'Pune', cx: 82, cy: 104 },
    { name: 'Surat', cx: 72, cy: 100 },
    { name: 'Ahmedabad', cx: 73, cy: 88 },
    { name: 'Bangalore', cx: 105, cy: 128 },
    { name: 'Chennai', cx: 118, cy: 132 },
    { name: 'Indore', cx: 96, cy: 80 },
    { name: 'Bhopal', cx: 110, cy: 72 },
    { name: 'Nagpur', cx: 118, cy: 90 },
  ]

  return (
    <section
      id="market"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`section-fade bg-[#0d0d0d] py-16 text-white lg:py-20 ${isVisible ? 'visible' : ''}`}
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center lg:gap-16">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--orange)]">
              MARKET
            </p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[3.25rem]">
              The world&apos;s largest untouched AI market.
            </h2>

            <div className="mt-6 space-y-4">
              {statsConfig.map((stat) => {
                const { ref, value } = useCountUpOnView(stat.target)

                return (
                  <div
                    key={stat.label}
                    ref={ref}
                    className="flex items-baseline gap-3"
                  >
                    <p
                      className="font-mono text-[2.4rem] font-medium leading-none"
                      style={{ color: stat.color }}
                    >
                      {stat.format(value)}
                    </p>
                    <p className="text-[0.9rem] text-[#e5e7eb]">{stat.label}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 space-y-3 text-[0.96rem] leading-relaxed text-[#d1d5db]">
              <p>
                India&apos;s 63 million micro-enterprises run on instinct,
                notebooks, and late-night mental math — while big retail runs on
                hourly AI forecasts.
              </p>
              <p>
                VendorIQ is built to close that gap: AI that understands cash
                constraints, festival spikes, and what it means to run a
                business in Bharat, not in a spreadsheet.
              </p>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative h-[260px] w-[220px] sm:h-[300px] sm:w-[260px]">
              <div className="pointer-events-none absolute inset-[-40px] rounded-full bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.25),transparent_60%)]" />
              <svg
                viewBox="0 0 200 220"
                className="relative z-10 h-full w-full text-[#f9fafb]"
                aria-hidden="true"
              >
                <path
                  d="M65 10L85 18L95 38L112 44L126 66L138 88L142 110L134 130L120 148L110 168L104 190L92 205L72 210L60 196L52 178L44 156L40 132L32 112L30 92L36 72L46 52L54 34Z"
                  fill="rgba(15,23,42,0.9)"
                  stroke="#f9fafb"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
                {mapCities.map((city, index) => (
                  <motion.circle
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    cx={city.cx}
                    cy={city.cy}
                    r="2.2"
                    fill="#F97316"
                    initial={{ opacity: 0.2, scale: 0.6 }}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.6, 1.6, 0.6] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      delay: 0.12 * index,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
                {mapCities.map((city, index) => {
                  if (index % 3 !== 0) return null
                  return (
                    <text
                      // eslint-disable-next-line react/no-array-index-key
                      key={`label-${index}`}
                      x={city.cx + 6}
                      y={city.cy - 4}
                      fontSize="6"
                      fill="#e5e7eb"
                    >
                      {city.name}
                    </text>
                  )
                })}
              </svg>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                className="absolute -left-10 top-20 w-40 rounded-2xl bg-[#020617]/90 px-3 py-3 text-[0.78rem] text-[#e5e7eb] shadow-[0_20px_45px_rgba(15,23,42,0.65)] backdrop-blur"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9ca3af]">
                  Mumbai
                </p>
                <p className="mt-1 font-mono text-[1.05rem] font-medium text-[var(--orange)]">
                  127
                  <span className="ml-1 text-[0.78rem] text-[#e5e7eb]">
                    active vendors
                  </span>
                </p>
                <p className="mt-1 text-[0.7rem] text-[#9ca3af]">
                  Across fast food, kirana & tiffin services.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex min-h-[40px] items-center border-t border-[#1f2933] pt-3 text-xs text-[#e5e5e5]">
          <div className="relative mx-auto flex max-w-full items-center overflow-hidden text-[12px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0d0d0d] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0d0d0d] to-transparent" />
            <div className="animate-marquee flex min-w-max items-center gap-10 whitespace-nowrap">
              {[0, 1].map((i) => (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  className="font-mono text-[12px] text-[#e5e7eb]"
                >
                  {cityTicker.split('•').map((chunk, idx, arr) => (
                    <span
                      // eslint-disable-next-line react/no-array-index-key
                      key={idx}
                    >
                      {chunk}
                      {idx < arr.length - 1 && (
                        <span className="px-2 text-[var(--orange)]">•</span>
                      )}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FinalCTASection() {
  const { ref, isVisible } = useSectionReveal()
  const navigate = useNavigate()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`section-fade relative overflow-hidden bg-white py-16 text-center lg:py-24 ${isVisible ? 'visible' : ''}`}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 400 400"
          className="h-[420px] w-[420px] text-[var(--orange)] opacity-[0.08]"
          aria-hidden="true"
        >
          <circle
            cx="200"
            cy="200"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <circle
            cx="200"
            cy="200"
            r="170"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle
            cx="200"
            cy="200"
            r="220"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="relative h-full w-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        >
          <span className="absolute left-1/4 top-10 h-4 w-4 rounded-full bg-[var(--orange)]/40" />
          <span className="absolute right-1/4 top-24 h-3 w-3 rotate-45 rounded-[0.7rem] bg-[var(--blue)]/40" />
          <span className="absolute left-10 bottom-16 h-0 w-0 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-[var(--green)]/40" />
          <span className="absolute right-10 bottom-10 h-4 w-4 rotate-45 rounded-[0.9rem] border border-[var(--violet)]/40" />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-3xl px-4">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--orange)]">
          GET STARTED
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl lg:text-[4.2rem]">
          Your AI business partner is ready.
        </h2>
        <p className="mt-4 text-[0.98rem] leading-relaxed text-[#4b5563] sm:text-[1.02rem]">
          Join 500+ vendors across 12 Indian cities who&apos;ve already stopped
          guessing — and started letting VendorIQ think with them.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/auth/signup')}
            className="inline-flex items-center justify-center rounded-full bg-black px-7 py-3 text-sm font-semibold text-white shadow-[0_22px_55px_rgba(15,23,42,0.5)] transition-transform duration-150 hover:scale-[1.03] sm:px-9 sm:text-base"
          >
            Start Free
          </button>
          <button
            type="button"
            onClick={() => navigate('/auth')}
            className="inline-flex items-center justify-center rounded-full border border-[#d1d5db] bg-white/80 px-7 py-3 text-sm font-semibold text-[#111827] shadow-sm transition hover:bg-white sm:px-9 sm:text-base"
          >
            Talk to an Expert
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[0.86rem] text-[#4b5563]">
          <span className="inline-flex items-center gap-2">
            <span>🔒</span> <span>Free forever plan</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span>⚡</span> <span>Setup in 5 minutes</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span>🤖</span> <span>Powered by Gemini AI</span>
          </span>
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  return (
    <footer className="bg-[#0d0d0d] text-[#e5e7eb]">
      <div className="h-[1px] w-full bg-[var(--orange)]" />
      <div
        className="mx-auto max-w-6xl px-4 py-10 text-sm sm:px-6 lg:px-6"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(248,250,252,0.05) 0, rgba(248,250,252,0.05) 1px, transparent 1px, transparent 8px)',
        }}
      >
        <div className="flex flex-col gap-8 border-b border-[#111827] pb-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex items-center text-xl font-semibold tracking-tight text-white">
                <span className="mr-1 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[var(--orange)] shadow-[0_0_18px_rgba(255,107,43,0.85)]" />
                Vendor<span className="font-extrabold">IQ</span>
              </span>
            </div>
            <p className="text-[0.9rem] text-[#9ca3af]">
              AI for India&apos;s 63 million vendors — from panipuri stalls to
              medical stores and kiranas.
            </p>
          </div>

          <div className="grid flex-1 gap-6 text-[0.88rem] sm:grid-cols-3">
            <div>
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
                Product
              </p>
              <ul className="mt-3 space-y-1.5">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#demo" className="hover:text-white">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
                Company
              </p>
              <ul className="mt-3 space-y-1.5">
                <li>
                  <a href="#about" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#blog" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
                Support
              </p>
              <ul className="mt-3 space-y-1.5">
                <li>
                  <a href="#help" className="hover:text-white">
                    Help
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-3 text-[0.8rem] text-[#9ca3af] sm:flex-row">
          <span>© 2025 VendorIQ</span>
          <span className="text-center text-[#e5e7eb]">
            Built with ❤️ for Bharat
          </span>
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="VendorIQ on X"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#374151] text-[0.75rem] hover:border-[#9ca3af] hover:text-white"
            >
              X
            </a>
            <a
              href="#"
              aria-label="VendorIQ on LinkedIn"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#374151] text-[0.75rem] hover:border-[#9ca3af] hover:text-white"
            >
              in
            </a>
            <a
              href="#"
              aria-label="VendorIQ on Instagram"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#374151] text-[0.75rem] hover:border-[#9ca3af] hover:text-white"
            >
              IG
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function StatsRow() {
  const { ref, isVisible } = useSectionReveal()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`section-fade bg-[#0d0d0d] py-10 text-[#f9fafb] lg:py-12 ${isVisible ? 'visible' : ''}`}
    >
      <div
        className="mx-auto flex max-w-6xl divide-x divide-[#111827] overflow-hidden rounded-3xl border border-[#111827] bg-[#020617]/80 px-4 py-6 shadow-[0_26px_80px_rgba(15,23,42,0.85)] sm:px-6 lg:px-8"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(248,250,252,0.04) 0, rgba(248,250,252,0.04) 1px, transparent 1px, transparent 8px)',
        }}
      >
        {stats.map((stat) => {
          const { ref, value } = useCountUpOnView(stat.target)

          return (
            <div
              key={stat.label}
              ref={ref}
              className="flex flex-1 flex-col items-center gap-1 px-3 text-center sm:px-4 lg:items-start lg:text-left"
            >
              <p className="font-mono text-[2.6rem] font-medium leading-none text-white sm:text-[3rem] lg:text-[3.25rem]">
                {stat.format(value)}
              </p>
              <p className="mt-2 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-[#9ca3af] sm:text-xs">
                {stat.label}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function PlaceholderSection({
  id,
  title,
  eyebrow,
}: {
  id: string
  title: string
  eyebrow: string
}) {
  return (
    <section
      id={id}
      className="bg-[#0d0d0d] py-16 text-[#f9fafb] lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9ca3af]">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#9ca3af]">
          These sections are wired to your navbar anchors and ready for deeper
          content — impact stories, step-by-step flows, and vendor-facing
          benefits — whenever you&apos;re ready to define them.
        </p>
      </div>
    </section>
  )
}

function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoaded(true)
    }, 800)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--ink)]">
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0, 1, 0], scale: [0.9, 1, 1.06] }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="relative flex items-center text-2xl font-semibold tracking-tight text-[var(--ink)]">
              <span className="mr-1 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[var(--orange)] shadow-[0_0_18px_rgba(255,107,43,0.85)]" />
              Vendor<span className="font-extrabold">IQ</span>
            </span>
          </motion.div>
        </div>
      )}
      <Navbar />
      <main
        className={`flex-1 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <Hero />
        <Ticker />
        <ProblemSection />
        <FourWorldsSection />
        <DiagonalDivider />
        <FeaturesSection />
        <StatsRow />
        <RameshStorySection />
        <PlaceholderSection
          id="how-it-works"
          title="From ledgers to live forecasts in days, not months."
          eyebrow="How it works"
        />
        <PlaceholderSection
          id="for-vendors"
          title="Built for shopkeepers, not spreadsheets."
          eyebrow="For vendors"
        />
        <MarketOpportunitySection />
        <FinalCTASection />
      </main>
      <FooterSection />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={
          <AuthPage
            defaultMode="login"
            onLogin={(user: any) => {
              if (user.vendorType === 'medical') {
                window.location.href = '/medical-dashboard';
              } else if (user.vendorType === 'food' || !user.vendorType) { // Defaulting to food vendor for now
                window.location.href = '/dashboard/food';
              }
            }}
          />
        } />
        <Route path="/auth/signup" element={
          <AuthPage
            defaultMode="signup"
            onLogin={(user: any) => {
              if (user.vendorType === 'medical') {
                window.location.href = '/medical-dashboard';
              } else if (user.vendorType === 'food' || !user.vendorType) { // Defaulting to food vendor for now
                window.location.href = '/dashboard/food';
              }
            }}
          />
        } />
        <Route path="/dashboard/food" element={<FoodVendorDashboard />} />
        <Route path="/medical-dashboard" element={<MedicalStoreDashboard />} />
        <Route path="/dashboard/food/chat" element={<FoodVendorChatbot />} />
        <Route path="/dashboard/forecasting" element={<FoodVendorForecasting />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
