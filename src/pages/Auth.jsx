import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BUSINESS_TYPES = [
  {
    id: 'food',
    name: 'Food Vendor',
    color: '#FF6B2B',
    tint: '#FFF9F6',
    tagline: 'Panipuri, chai, tiffin, snacks',
    placeholder: 'e.g. Ramesh Panipuri Stall',
  },
  {
    id: 'medical',
    name: 'Medical Store',
    color: '#2B7FFF',
    tint: '#F5F8FF',
    tagline: 'Pharmacy, health products',
    placeholder: 'e.g. Sharma Medical Store',
  },
  {
    id: 'kirana',
    name: 'Kirana Store',
    color: '#22C97A',
    tint: '#F5FFF9',
    tagline: 'Grocery, daily essentials',
    placeholder: 'e.g. Gupta General Store',
  },
  {
    id: 'retail',
    name: 'Retail Shop',
    color: '#8B5CF6',
    tint: '#FAF7FF',
    tagline: 'Clothing, accessories, goods',
    placeholder: 'e.g. Priya Fashion House',
  },
]

function getBusinessConfig(id) {
  return BUSINESS_TYPES.find((t) => t.id === id) || null
}

function calculatePasswordStrength(password) {
  if (!password) return { level: 0, label: 'Too weak', color: '#9CA3AF' }

  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score <= 1) {
    return { level: 1, label: 'Weak', color: '#EF4444' }
  }
  if (score === 2) {
    return { level: 2, label: 'Fair', color: '#FF6B2B' }
  }
  if (score === 3) {
    return { level: 3, label: 'Good', color: '#FFD60A' }
  }
  return { level: 4, label: 'Strong', color: '#22C97A' }
}

function emailIsValid(value) {
  if (!value) return false
  // simple email pattern
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(value)
}

const rightPanelVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
  },
}

const formVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.19, 1, 0.22, 1] },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.25, ease: [0.19, 1, 0.22, 1] },
  },
}

function AuthPage({ defaultMode = 'login', onLogin }) {
  const [mode, setMode] = useState(defaultMode === 'signup' ? 'signup' : 'login')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginShowPassword, setLoginShowPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [loginErrors, setLoginErrors] = useState({ email: false, password: false })

  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupShowPassword, setSignupShowPassword] = useState(false)
  const [signupBusinessType, setSignupBusinessType] = useState(null)
  const [signupBusinessName, setSignupBusinessName] = useState('')
  const [signupLoading, setSignupLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [signupErrors, setSignupErrors] = useState({
    name: false,
    email: false,
    password: false,
    businessType: false,
    businessName: false,
  })
  const [signupDropdownOpen, setSignupDropdownOpen] = useState(false)

  const signupStrength = useMemo(
    () => calculatePasswordStrength(signupPassword),
    [signupPassword],
  )

  const tintConfig = getBusinessConfig(signupBusinessType)
  const rightPanelTint = tintConfig?.tint || '#FAFAFA'
  const submitAccent = tintConfig?.color || '#0D0D0D'

  useEffect(() => {
    // close dropdown when clicking outside
    function handleClick(e) {
      if (!document) return
      const dropdown = document.getElementById('business-type-dropdown')
      if (dropdown && !dropdown.contains(e.target)) {
        setSignupDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function triggerErrorShake(setter, key) {
    setter((prev) => ({ ...prev, [key]: false }))
    // re-enable in next tick so animation restarts
    requestAnimationFrame(() => {
      setter((prev) => ({ ...prev, [key]: true }))
    })
  }

  function handleLoginSubmit(e) {
    e.preventDefault()
    if (loginLoading || loginSuccess) return

    const emailValid = emailIsValid(loginEmail)
    const passwordValid = Boolean(loginPassword)

    const nextErrors = {
      email: !emailValid,
      password: !passwordValid,
    }
    setLoginErrors(nextErrors)

    if (!emailValid) triggerErrorShake(setLoginErrors, 'email')
    if (!passwordValid) triggerErrorShake(setLoginErrors, 'password')

    if (!emailValid || !passwordValid) return

    setLoginLoading(true)

    setTimeout(() => {
      const userData = {
        email: loginEmail,
        vendorType:
          (typeof window !== 'undefined' && window.localStorage.getItem('vendorType')) ||
          null,
      }

      setLoginLoading(false)
      setLoginSuccess(true)

      if (typeof window !== 'undefined') {
        window.setTimeout(() => {
          if (onLogin) {
            onLogin(userData)
          } else {
            // fallback: simple navigation target placeholder
            // eslint-disable-next-line no-console
            console.log('Logged in user:', userData)
          }
        }, 1000)
      }
    }, 900)
  }

  function handleSignupSubmit(e) {
    e.preventDefault()
    if (signupLoading || signupSuccess) return

    const nameValid = Boolean(signupName.trim())
    const emailValid = emailIsValid(signupEmail)
    const passwordValid = signupPassword.length >= 8
    const typeValid = Boolean(signupBusinessType)
    const businessNameValid = Boolean(signupBusinessName.trim())

    const nextErrors = {
      name: !nameValid,
      email: !emailValid,
      password: !passwordValid,
      businessType: !typeValid,
      businessName: !businessNameValid,
    }
    setSignupErrors(nextErrors)

    Object.entries(nextErrors).forEach(([key, value]) => {
      if (value) triggerErrorShake(setSignupErrors, key)
    })

    if (!nameValid || !emailValid || !passwordValid || !typeValid || !businessNameValid) {
      return
    }

    setSignupLoading(true)

    setTimeout(() => {
      const vendorTypeConfig = getBusinessConfig(signupBusinessType)
      if (typeof window !== 'undefined' && vendorTypeConfig) {
        window.localStorage.setItem('vendorType', vendorTypeConfig.id)
      }

      const userData = {
        name: signupName,
        email: signupEmail,
        vendorType: vendorTypeConfig?.id || null,
        businessName: signupBusinessName,
      }

      setSignupLoading(false)
      setSignupSuccess(true)

      if (typeof window !== 'undefined') {
        window.setTimeout(() => {
          if (onLogin) {
            onLogin(userData)
          } else {
            // eslint-disable-next-line no-console
            console.log('Signed up user:', userData)
          }
        }, 1000)
      }
    }, 1000)
  }

  const businessPlaceholder = useMemo(() => {
    const conf = getBusinessConfig(signupBusinessType)
    if (!conf) return 'Your business name'
    return conf.placeholder
  }, [signupBusinessType])

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col md:flex-row">
        {/* LEFT PANEL (desktop only) */}
        <div className="relative hidden min-h-screen w-full items-stretch bg-[#0d0d0d] text-white md:flex md:w-1/2">
          <div className="dot-matrix-dark absolute inset-0 opacity-[0.18]" />
          <div className="relative z-10 flex w-full flex-col px-8 py-6">
            <div className="flex items-center">
              <span className="relative flex items-center text-2xl font-semibold tracking-tight text-white">
                <span className="mr-1 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[var(--orange)] shadow-[0_0_18px_rgba(255,107,43,0.85)]" />
                Vendor<span className="font-extrabold">IQ</span>
              </span>
            </div>

            <div className="mt-10 flex flex-1 flex-col items-start justify-center gap-8">
              <div>
                <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-white lg:text-[3rem]">
                  Your business.
                  <br />
                  Your AI.
                  <br />
                  <span className="text-[var(--orange)]">Your edge.</span>
                </h1>
                <p className="mt-4 max-w-sm text-[0.98rem] text-[#9ca3af]">
                  Join 500+ vendors across 12 Indian cities.
                </p>
              </div>

              <div className="relative mt-4 h-[260px] w-[260px]">
                <motion.div
                  className="absolute inset-2 rounded-full border-2 border-[var(--orange)]/40"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-12 flex flex-col justify-between rounded-3xl bg-white/95 p-4 text-[#111827] shadow-[0_22px_55px_rgba(0,0,0,0.65)]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9ca3af]">
                        Today&apos;s Forecast
                      </p>
                      <p className="mt-1 text-[0.78rem] text-[#6b7280]">
                        Based on your last 90 days
                      </p>
                    </div>
                    <span className="rounded-full bg-[#ecfdf3] px-2 py-1 text-[10px] font-semibold text-[#15803d]">
                      +12.4% uplift
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="font-mono text-[1.6rem] font-semibold text-[var(--orange)]">
                      380 <span className="text-xs text-[#6b7280]">units</span>
                    </p>
                  </div>
                  <div className="mt-3">
                    <svg
                      viewBox="0 0 120 40"
                      className="h-10 w-full"
                      aria-hidden="true"
                    >
                      {[45, 60, 80, 55, 70].map((h, index) => {
                        const barWidth = 14
                        const gap = 8
                        const x = 6 + index * (barWidth + gap)
                        const maxHeight = 32
                        const clampedHeight = (h / 100) * maxHeight
                        return (
                          <motion.rect
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            x={x}
                            y={36 - clampedHeight}
                            width={barWidth}
                            height={clampedHeight}
                            rx="4"
                            fill="url(#authForecast)"
                            initial={{ height: 0, y: 36 }}
                            animate={{ height: clampedHeight, y: 36 - clampedHeight }}
                            transition={{
                              delay: 0.2 + index * 0.07,
                              duration: 0.5,
                              ease: [0.19, 1, 0.22, 1],
                            }}
                          />
                        )
                      })}
                      <defs>
                        <linearGradient
                          id="authForecast"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#FDBA74" />
                          <stop offset="100%" stopColor="#FB923C" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -right-3 top-6 h-8 w-8 rounded-full bg-[var(--orange)] shadow-[0_18px_45px_rgba(255,107,43,0.7)]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute -left-2 bottom-6 h-5 w-5 rotate-45 rounded-[0.9rem] bg-[var(--blue)] shadow-[0_16px_40px_rgba(37,99,235,0.65)]"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.4,
                  }}
                />
                <motion.div
                  className="absolute -left-4 top-16 h-0 w-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-[var(--green)]"
                  animate={{ y: [0, -7, 0] }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.2,
                  }}
                />
                <motion.div
                  className="absolute right-2 bottom-0 flex h-9 w-9 items-center justify-center rounded-[1.2rem] border-2 border-[var(--violet)]"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                >
                  <div className="h-2.5 w-2.5 rounded-full border border-white/70" />
                </motion.div>

                <div className="absolute -left-6 bottom-6 grid grid-cols-3 gap-1 opacity-[0.18]">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      className="h-1 w-1 rounded-full bg-white"
                    />
                  ))}
                </div>
                <div className="absolute right-8 top-4 grid grid-cols-3 gap-1 opacity-[0.16]">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      className="h-1 w-1 rounded-full bg-white"
                    />
                  ))}
                </div>
                <div className="absolute -right-8 bottom-10 grid grid-cols-3 gap-1 opacity-[0.16]">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      className="h-1 w-1 rounded-full bg-white"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-[0.78rem]">
                <div className="inline-flex items-center rounded-full border border-[#1f2937] border-l-4 border-l-[var(--orange)] bg-[#111827] px-3 py-1">
                  Food Vendors
                </div>
                <div className="inline-flex items-center rounded-full border border-[#1f2937] border-l-4 border-l-[var(--blue)] bg-[#111827] px-3 py-1">
                  Medical Stores
                </div>
                <div className="inline-flex items-center rounded-full border border-[#1f2937] border-l-4 border-l-[var(--green)] bg-[#111827] px-3 py-1">
                  Kirana Shops
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <motion.div
          variants={rightPanelVariants}
          initial="hidden"
          animate="visible"
          className="flex min-h-screen w-full items-stretch justify-center bg-[#fafafa] md:w-1/2"
          style={{ backgroundColor: rightPanelTint }}
        >
          <div className="flex w-full max-w-md flex-col px-5 py-6 sm:px-8 sm:py-10">
            {/* Mobile logo / header */}
            <div className="mb-6 flex items-center justify-between md:hidden">
              <div className="flex items-center">
                <span className="relative flex items-center text-xl font-semibold tracking-tight text-[#111827]">
                  <span className="mr-1 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[var(--orange)] shadow-[0_0_14px_rgba(255,107,43,0.9)]" />
                  Vendor<span className="font-extrabold">IQ</span>
                </span>
              </div>
              <div className="h-[2px] w-16 rounded-full bg-[var(--orange)]/70" />
            </div>

            {/* Tab switcher */}
            <div className="mb-6">
              <div className="inline-flex items-center rounded-full bg-[#f0f0f0] p-1">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`relative z-10 min-w-[110px] rounded-full px-4 py-1.5 text-xs font-medium ${
                    mode === 'login' ? 'text-[#0d0d0d]' : 'text-[#888888]'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`relative z-10 min-w-[130px] rounded-full px-4 py-1.5 text-xs font-medium ${
                    mode === 'signup' ? 'text-[#0d0d0d]' : 'text-[#888888]'
                  }`}
                >
                  Create Account
                </button>
                <motion.div
                  className="absolute h-[30px] rounded-full bg-white shadow-[0_10px_25px_rgba(15,23,42,0.15)]"
                  initial={false}
                  animate={{
                    width: mode === 'login' ? 114 : 136,
                    x: mode === 'login' ? 2 : 116,
                  }}
                  transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
                />
              </div>
              <div className="mt-3 h-[2px] w-full rounded-full bg-[#e5e5e5]">
                <motion.div
                  className="h-full rounded-full bg-[var(--orange)]"
                  initial={false}
                  animate={{ x: mode === 'login' ? '0%' : '100%', width: '50%' }}
                  transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.form
                  key="login"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleLoginSubmit}
                  className="space-y-5 pb-10"
                >
                  <div>
                    <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#0d0d0d]">
                      Welcome back.
                    </h2>
                    <p className="mt-2 text-[0.94rem] text-[#888888]">
                      Let&apos;s see what your business is doing today.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#555555]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className={`auth-input w-full text-[0.9rem] ${
                          loginErrors.email ? 'input-error input-error-shake' : ''
                        }`}
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#555555]">
                        Password
                      </label>
                      <div
                        className={`flex items-center auth-input w-full bg-white pr-3 ${
                          loginErrors.password ? 'input-error input-error-shake' : ''
                        }`}
                      >
                        <input
                          type={loginShowPassword ? 'text' : 'password'}
                          className="h-full w-full border-none bg-transparent text-[0.9rem] outline-none"
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setLoginShowPassword((v) => !v)}
                          className="ml-2 text-[#9ca3af]"
                          aria-label={loginShowPassword ? 'Hide password' : 'Show password'}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path
                              d="M2.5 12C4.2 7.6 7.7 5 12 5C16.3 5 19.8 7.6 21.5 12C19.8 16.4 16.3 19 12 19C7.7 19 4.2 16.4 2.5 12Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-1 flex justify-end">
                      <button
                        type="button"
                        className="text-[13px] font-medium text-[var(--orange)]"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loginLoading || loginSuccess}
                      className="group inline-flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#0d0d0d] text-[17px] font-semibold text-white shadow-[0_18px_45px_rgba(15,23,42,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--orange)] hover:shadow-[0_22px_60px_rgba(15,23,42,0.65)] disabled:cursor-not-allowed disabled:opacity-90"
                      style={
                        loginSuccess
                          ? {
                              backgroundColor: '#22C97A',
                              boxShadow: '0 18px 45px rgba(34,201,122,0.55)',
                            }
                          : undefined
                      }
                    >
                      {loginLoading ? (
                        <>
                          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Logging in...
                        </>
                      ) : loginSuccess ? (
                        <>
                          <span className="mr-2">✓</span> Logged in
                        </>
                      ) : (
                        'Log In →'
                      )}
                    </button>
                    <p className="mt-3 text-center text-[0.86rem] text-[#6b7280]">
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        className="font-medium text-[var(--orange)]"
                        onClick={() => setMode('signup')}
                      >
                        Create one
                      </button>
                    </p>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleSignupSubmit}
                  className="space-y-5 pb-10"
                >
                  <div>
                    <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#0d0d0d]">
                      Set up your vendor account.
                    </h2>
                    <p className="mt-2 text-[0.94rem] text-[#888888]">
                      Tell us about you and your business.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#555555]">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className={`auth-input w-full text-[0.9rem] ${
                          signupErrors.name ? 'input-error input-error-shake' : ''
                        }`}
                        placeholder="Ramesh Bhai"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#555555]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className={`auth-input w-full text-[0.9rem] ${
                          signupErrors.email ? 'input-error input-error-shake' : ''
                        }`}
                        placeholder="you@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#555555]">
                        Password
                      </label>
                      <div
                        className={`flex items-center auth-input w-full bg-white pr-3 ${
                          signupErrors.password ? 'input-error input-error-shake' : ''
                        }`}
                      >
                        <input
                          type={signupShowPassword ? 'text' : 'password'}
                          className="h-full w-full border-none bg-transparent text-[0.9rem] outline-none"
                          placeholder="Min. 8 characters"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setSignupShowPassword((v) => !v)}
                          className="ml-2 text-[#9ca3af]"
                          aria-label={signupShowPassword ? 'Hide password' : 'Show password'}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path
                              d="M2.5 12C4.2 7.6 7.7 5 12 5C16.3 5 19.8 7.6 21.5 12C19.8 16.4 16.3 19 12 19C7.7 19 4.2 16.4 2.5 12Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-2">
                        <div className="flex h-1 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
                          {Array.from({ length: 4 }).map((_, index) => {
                            const active = signupStrength.level > index
                            return (
                              <div
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                                className="flex-1 transition-colors duration-300"
                                style={{
                                  backgroundColor: active
                                    ? signupStrength.color
                                    : 'transparent',
                                }}
                              />
                            )
                          })}
                        </div>
                        <p
                          className="mt-1 font-mono text-[11px] text-[#6b7280]"
                          style={{ color: signupStrength.color }}
                        >
                          Strength: {signupStrength.label}
                        </p>
                      </div>
                    </div>

                    <div id="business-type-dropdown" className="relative">
                      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#555555]">
                        Business Type
                      </label>
                      <button
                        type="button"
                        onClick={() => setSignupDropdownOpen((v) => !v)}
                        className={`auth-input flex w-full items-center justify-between bg-white text-[0.9rem] ${
                          signupErrors.businessType ? 'input-error input-error-shake' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-[4px]"
                            style={{
                              backgroundColor: tintConfig?.color || '#d1d5db',
                            }}
                          />
                          <span className="text-[#374151]">
                            {tintConfig ? tintConfig.name : 'Choose your business type'}
                          </span>
                        </div>
                        <motion.span
                          animate={{ rotate: signupDropdownOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-[#9ca3af]"
                        >
                          ▼
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {signupDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 4 }}
                            animate={{ opacity: 1, scale: 1, y: 8 }}
                            exit={{ opacity: 0, scale: 0.96, y: 4 }}
                            transition={{ duration: 0.18, ease: [0.19, 1, 0.22, 1] }}
                            className="absolute z-20 mt-1 w-full overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.18)]"
                          >
                            <ul className="divide-y divide-[#f3f4f6]">
                              {BUSINESS_TYPES.map((type) => {
                                const selected = signupBusinessType === type.id
                                return (
                                  <li key={type.id}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSignupBusinessType(type.id)
                                        setSignupDropdownOpen(false)
                                      }}
                                      className="flex w-full items-center justify-between px-4 py-3 text-left text-[0.9rem] hover:bg-[#f9fafb]"
                                      style={
                                        selected
                                          ? {
                                              backgroundColor: `${type.tint}`,
                                            }
                                          : undefined
                                      }
                                    >
                                      <div className="flex items-center gap-3">
                                        <span
                                          className="h-3 w-3 rounded-[4px]"
                                          style={{ backgroundColor: type.color }}
                                        />
                                        <div>
                                          <p className="text-[0.95rem] font-medium text-[#111827]">
                                            {type.name}
                                          </p>
                                          <p className="text-[0.8rem] text-[#6b7280]">
                                            {type.tagline}
                                          </p>
                                        </div>
                                      </div>
                                      {selected && (
                                        <span className="text-[0.8rem] text-[#16a34a]">
                                          ✓
                                        </span>
                                      )}
                                    </button>
                                  </li>
                                )
                              })}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#555555]">
                        Business Name
                      </label>
                      <input
                        type="text"
                        className={`auth-input w-full text-[0.9rem] ${
                          signupErrors.businessName ? 'input-error input-error-shake' : ''
                        }`}
                        placeholder={businessPlaceholder}
                        value={signupBusinessName}
                        onChange={(e) => setSignupBusinessName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={signupLoading || signupSuccess}
                      className="group inline-flex h-[52px] w-full items-center justify-center rounded-[12px] text-[17px] font-semibold text-white shadow-[0_18px_45px_rgba(15,23,42,0.36)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(15,23,42,0.5)] disabled:cursor-not-allowed disabled:opacity-95"
                      style={{
                        backgroundColor: signupSuccess ? '#22C97A' : submitAccent,
                        boxShadow: signupSuccess
                          ? '0 18px 45px rgba(34,201,122,0.55)'
                          : undefined,
                      }}
                    >
                      {signupLoading ? (
                        <>
                          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Setting up your account...
                        </>
                      ) : signupSuccess ? (
                        <>
                          <span className="mr-2">✓</span> Account created
                        </>
                      ) : (
                        'Create My Account →'
                      )}
                    </button>
                    <p className="mt-3 text-center text-[0.86rem] text-[#6b7280]">
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="font-medium text-[var(--orange)]"
                        onClick={() => setMode('login')}
                      >
                        Log in
                      </button>
                    </p>
                    <p className="mt-2 text-center text-[0.75rem] text-[#9ca3af]">
                      By signing up, you agree to our Terms and Privacy Policy.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AuthPage

