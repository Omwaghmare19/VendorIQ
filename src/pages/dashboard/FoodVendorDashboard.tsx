import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { model } from '../../gemini'; // Assuming this imports properly

// Helper for count-up animation
function useCountUp(target: number, duration: number = 1000) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [target, duration]);

    return count;
}

// Global Scroll Reveal Component
const RevealOnScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

export default function FoodVendorDashboard() {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const chatBottomRef = useRef<HTMLDivElement>(null);

    // Stats
    const forecastCount = useCountUp(380, 1500);

    // Suggested Prompts
    const suggestedPrompts = [
        "Should I prepare more for this weekend?",
        "How do I reduce waste further?",
        "What should I stock for Holi?",
        "Is today a good day to raise prices?"
    ];

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        // Add user message
        const newMessages = [...chatMessages, { role: 'user', text } as const];
        setChatMessages(newMessages);
        setInputValue('');

        try {
            // Build the prompt with the system context
            const systemPrompt = "You are a business advisor for a food vendor in India. Business: Ramesh Panipuri. Today's forecast: 380 units. Weather: 34°C clear. Upcoming: Holi in 19 days. Give short, specific, actionable advice in simple English.\n";
            const fullPrompt = `${systemPrompt}\nUser: ${text}\nAI:`;

            const result = await model.generateContent(fullPrompt);
            const output = result.response.text();

            setChatMessages([...newMessages, { role: 'ai', text: output }]);
        } catch (error) {
            console.error("Gemini Error:", error);
            setChatMessages([...newMessages, { role: 'ai', text: "Sorry, I am having trouble connecting right now. Please try again later." }]);
        }
    };

    // Scroll to bottom of chat
    useEffect(() => {
        if (chatBottomRef.current) {
            chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, isChatOpen]);

    return (
        <div className="flex h-screen w-full bg-[#FAFAFA] text-[#111827] overflow-hidden font-sans">

            {/* Sidebar - slides in from left */}
            <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="fixed bottom-0 left-0 z-20 flex w-full flex-row border-t border-[#E5E5E5] bg-white md:relative md:w-64 md:flex-col md:border-r md:border-t-0"
            >
                <div className="hidden p-6 md:block">
                    <div className="flex items-center gap-2">
                        <span className="relative flex items-center text-xl font-semibold tracking-tight">
                            <span className="mr-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#FF6B2B]" />
                            Vendor<span className="font-extrabold">IQ</span>
                        </span>
                    </div>
                </div>

                <nav className="flex w-full flex-row justify-around overflow-x-auto p-2 md:mt-4 md:flex-col md:justify-start md:space-y-1 md:p-4">
                    <button
                        onClick={() => {
                            const mainEl = document.getElementById('main-scroll-container');
                            if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex flex-col items-center justify-center rounded-xl bg-[#FFF9F6] p-3 text-[#FF6B2B] md:flex-row md:justify-start md:gap-3 md:p-3"
                    >
                        <svg className="h-5 w-5 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        <span className="mt-1 text-[10px] font-medium md:mt-0 md:text-sm">Home</span>
                    </button>
                    <button
                        onClick={() => {
                            const mainEl = document.getElementById('main-scroll-container');
                            const targetEl = document.getElementById('analytics-section');
                            if (mainEl && targetEl) {
                                mainEl.scrollTo({ top: targetEl.offsetTop - 24, behavior: 'smooth' });
                            }
                        }}
                        className="flex flex-col items-center justify-center rounded-xl p-3 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] md:flex-row md:justify-start md:gap-3 md:p-3"
                    >
                        <svg className="h-5 w-5 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <span className="mt-1 text-[10px] font-medium md:mt-0 md:text-sm">Analytics</span>
                    </button>
                    <button
                        onClick={() => {
                            const mainEl = document.getElementById('main-scroll-container');
                            const targetEl = document.getElementById('inventory-section');
                            if (mainEl && targetEl) {
                                mainEl.scrollTo({ top: targetEl.offsetTop - 24, behavior: 'smooth' });
                            }
                        }}
                        className="flex flex-col items-center justify-center rounded-xl p-3 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] md:flex-row md:justify-start md:gap-3 md:p-3"
                    >
                        <svg className="h-5 w-5 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        <span className="mt-1 text-[10px] font-medium md:mt-0 md:text-sm">Inventory</span>
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/forecasting')}
                        className="flex flex-col items-center justify-center rounded-xl p-3 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] md:flex-row md:justify-start md:gap-3 md:p-3"
                    >
                        <svg className="h-5 w-5 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <span className="mt-1 text-[10px] font-medium md:mt-0 md:text-sm">Forecasting</span>
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/food/chat')}
                        className="flex flex-col items-center justify-center rounded-xl p-3 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] md:flex-row md:justify-start md:gap-3 md:p-3"
                    >
                        <svg className="h-5 w-5 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        <span className="mt-1 text-[10px] font-medium md:mt-0 md:text-sm">AI Assistant</span>
                    </button>
                </nav>

                <div className="hidden mt-auto md:block p-4">
                    <button onClick={() => navigate('/')} className="flex w-full items-center gap-3 rounded-xl p-3 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span className="text-sm font-medium">Log out</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content - fades in */}
            <motion.main
                id="main-scroll-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="custom-scrollbar flex-1 overflow-y-auto pb-24 md:pb-8 relative"
            >
                <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">

                    {/* Header */}
                    <header className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                                Good Morning, Ramesh
                            </h1>
                            <p className="mt-1 text-sm text-[#6B7280]">
                                Here is your store&apos;s pulse for today.
                            </p>
                        </div>
                        <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#E5E5E5] font-semibold text-[#111827] md:flex">
                            R
                        </div>
                    </header>

                    <RevealOnScroll>
                        {/* Hero / Forecast Card */}
                        <div className="relative mb-10 overflow-hidden rounded-3xl bg-[#0b1120] p-6 text-white shadow-xl md:p-8">
                            {/* Decorative geometry */}
                            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full border border-white/10" />
                            <div className="absolute right-10 top-10 h-32 w-32 rounded-full border-4 border-[#FF6B2B]/20" />

                            <div className="relative z-10">
                                <p className="font-mono text-xs uppercase tracking-widest text-[#9CA3AF]">Today's Forecast</p>
                                <div className="mt-3 flex items-baseline gap-2">
                                    <span className="text-5xl font-semibold tracking-tight md:text-6xl">{forecastCount}</span>
                                    <span className="text-lg text-[#9CA3AF]">units</span>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                        🌤 34°C
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-[#ECFDF3]/10 px-3 py-1 text-xs font-medium text-[#4ADE80] backdrop-blur-sm">
                                        ↑ 12% vs last week
                                    </span>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* ANALYTICS PREVIEW SECTION */}
                    <RevealOnScroll>
                        <div id="analytics-section" className="mb-10 w-full rounded-3xl border border-[#E5E5E5] bg-white p-6 shadow-sm md:p-8">
                            <div className="mb-8 border-b border-[#F3F4F6] pb-4">
                                <p className="font-mono text-[11px] font-semibold tracking-wider text-[#FF6B2B]">ANALYTICS PREVIEW</p>
                                <h2 className="mt-2 text-[22px] font-semibold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Your patterns at a glance</h2>
                            </div>

                            <div className="grid gap-8 lg:grid-cols-3">
                                {/* 1. SALES HEATMAP */}
                                <div className="flex flex-col">
                                    <h3 className="mb-4 text-sm font-medium text-[#4B5563]">Sales Intensity (Last 4 Weeks)</h3>
                                    <div className="flex gap-2">
                                        {/* Row labels */}
                                        <div className="flex flex-col justify-between gap-2 pt-5">
                                            {['Wk1', 'Wk2', 'Wk3', 'Wk4'].map(wk => (
                                                <span key={wk} className="flex h-8 items-center font-mono text-[10px] text-[#9CA3AF]">{wk}</span>
                                            ))}
                                        </div>
                                        {/* Grid */}
                                        <div className="flex-1">
                                            <div className="mb-2 flex justify-between px-1">
                                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                                    <span key={day} className="w-8 text-center font-mono text-[10px] text-[#9CA3AF]">{day}</span>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-7 gap-2">
                                                {Array.from({ length: 28 }).map((_, i) => {
                                                    // Generate an intensity 0.1 to 1 for color
                                                    const intensity = 0.5 + Math.random() * 0.5;
                                                    // Custom color mix
                                                    const r = Math.round(255 - ((255 - 255) * intensity));
                                                    const g = Math.round(221 - ((221 - 107) * intensity));
                                                    const b = Math.round(200 - ((200 - 43) * intensity));

                                                    return (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            whileInView={{ opacity: 1, scale: 1 }}
                                                            viewport={{ once: true }}
                                                            transition={{ delay: 0.1 + (i % 7) * 0.05 + Math.floor(i / 7) * 0.05, duration: 0.3 }}
                                                            className="h-8 w-8 rounded-[6px]"
                                                            style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. BEST HOURS */}
                                <div className="flex flex-col">
                                    <h3 className="mb-4 px-2 text-sm font-medium text-[#4B5563]">Best Hours</h3>
                                    <div className="flex flex-1 flex-col justify-between gap-3 px-2">
                                        {[
                                            { time: '10am', width: '30%' },
                                            { time: '12pm', width: '45%' },
                                            { time: '2pm', width: '20%' },
                                            { time: '4pm', width: '60%' },
                                            { time: '6pm', width: '95%', isPeak: true },
                                            { time: '8pm', width: '80%' },
                                        ].map((slot, i) => (
                                            <div key={slot.time} className="flex items-center gap-3">
                                                <span className="w-8 shrink-0 font-mono text-[10px] text-[#9CA3AF]">{slot.time}</span>
                                                <div className="flex-1">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: slot.width }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                                                        className="relative h-4 rounded bg-[#FF6B2B]"
                                                    >
                                                        {slot.isPeak && (
                                                            <div className="absolute right-0 top-1/2 -mt-3 mr-2 flex items-center justify-end">
                                                                <span className="mr-1 text-[10px] font-bold text-white tracking-widest uppercase">PEAK</span>
                                                                <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. WASTE TREND */}
                                <div className="flex flex-col">
                                    <h3 className="mb-4 px-2 text-sm font-medium text-[#4B5563]">Waste Trend (14 days)</h3>
                                    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-xl bg-[#F9FAFB] p-4">
                                        <motion.svg
                                            viewBox="0 0 200 100"
                                            className="absolute inset-0 h-full w-full"
                                            preserveAspectRatio="none"
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                        >
                                            <defs>
                                                <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.3" />
                                                    <stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <motion.path
                                                d="M0 20 Q 50 20, 100 60 T 200 90 L 200 100 L 0 100 Z"
                                                fill="url(#wasteGrad)"
                                                initial={{ opacity: 0 }}
                                                variants={{ visible: { opacity: 1, transition: { duration: 1, delay: 0.5 } } }}
                                            />
                                            <motion.path
                                                d="M0 20 Q 50 20, 100 60 T 200 90"
                                                fill="none"
                                                stroke="#4ADE80"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                variants={{ visible: { pathLength: 1, transition: { duration: 1.5, ease: "easeOut" } } }}
                                            />
                                        </motion.svg>

                                        <div className="relative z-10 flex w-full justify-between px-2">
                                            <span className="rounded-md bg-white px-2 py-1 text-[10px] font-medium text-[#6B7280] shadow-sm">100 units</span>
                                            <span className="mt-16 rounded-md bg-[#ECFDF3] px-2 py-1 text-[10px] font-medium text-[#15803D] shadow-sm">3 units</span>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-center text-xs text-[#9CA3AF]">Waste eliminated over 14 days</p>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <a href="#" className="flex items-center gap-1 font-medium text-[#FF6B2B] hover:text-[#fb520e]">
                                    View full analytics <span aria-hidden="true">&rarr;</span>
                                </a>
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* INVENTORY PREVIEW SECTION */}
                    <RevealOnScroll>
                        <div id="inventory-section" className="mb-10 w-full rounded-3xl border border-[#E5E5E5] bg-white p-6 shadow-sm md:p-8">
                            <div className="mb-6 flex items-center justify-between border-b border-[#F3F4F6] pb-4">
                                <div>
                                    <p className="font-mono text-[11px] font-semibold tracking-wider text-[#FF6B2B]">INVENTORY</p>
                                    <h2 className="mt-2 text-[22px] font-semibold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Stock taking Action</h2>
                                </div>
                                <button className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                                    Update Stock
                                </button>
                            </div>

                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D1D5DB] bg-[#FAFAFA] py-16 text-center">
                                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF9F6] text-2xl text-[#FF6B2B]">
                                    📦
                                </span>
                                <h3 className="text-lg font-medium text-[#111827]">Live inventory coming soon</h3>
                                <p className="mt-2 text-sm text-[#6B7280] max-w-sm">
                                    Track expiration dates, see what's selling out, and automatically reorder with one click.
                                </p>
                            </div>
                        </div>
                    </RevealOnScroll>

                </div>
            </motion.main>

            {/* FLOATING AI CHATBOT */}
            <div className="fixed bottom-24 right-6 z-50 md:bottom-8 md:right-8">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6B2B] text-white shadow-[0_10px_30px_rgba(255,107,43,0.3)] hover:shadow-[0_15px_35px_rgba(255,107,43,0.4)] transition-shadow relative"
                >
                    {isChatOpen ? (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.625 21.055L9.67 15.657a2.128 2.128 0 00-1.328-1.328L2.945 12.375a.669.669 0 010-1.261l5.397-1.954a2.128 2.128 0 001.328-1.328l1.954-5.397a.669.669 0 011.261 0l1.954 5.397a2.128 2.128 0 001.328 1.328l5.397 1.954a.669.669 0 010 1.261l-5.397 1.954a2.128 2.128 0 00-1.328 1.328l-1.954 5.397a.669.669 0 01-1.261 0z" /></svg>
                    )}
                </motion.button>
            </div>

            {/* Chatbot Side Panel */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 400 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 400 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-24 right-0 top-0 z-40 w-full max-w-[400px] bg-white shadow-2xl flex flex-col md:bottom-auto md:h-auto md:bottom-24 md:right-10 md:top-24 md:rounded-2xl border md:border-[#E5E5E5]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-[#E5E5E5] px-5 py-4 bg-white/95 backdrop-blur-md rounded-t-2xl">
                            <div>
                                <h3 className="text-[20px] font-semibold text-[#111827]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>AI Assistant</h3>
                                <p className="font-mono text-[12px] text-[#9CA3AF]">Knows your business</p>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="rounded-full p-2 text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827]">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Content area */}
                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#FAFAFA]">
                            {chatMessages.length === 0 ? (
                                <div className="space-y-4">
                                    <p className="text-sm font-medium text-[#6B7280]">Suggested for you:</p>
                                    <div className="flex flex-col gap-2">
                                        {suggestedPrompts.map((prompt, idx) => (
                                            <motion.button
                                                key={idx}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => handleSendMessage(prompt)}
                                                className="rounded-xl border border-[#E5E5E5] bg-white p-3 text-left text-sm text-[#4B5563] shadow-sm hover:border-[#FF6B2B]/50 hover:text-[#111827] hover:shadow-md transition-all"
                                            >
                                                {prompt}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {chatMessages.map((msg, i) => (
                                        <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                                    ? 'rounded-[16px_16px_4px_16px] bg-[#FF6B2B] text-white'
                                                    : 'rounded-[16px_16px_16px_4px] border border-[#E5E5E5] bg-white text-[#111827] shadow-sm'
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatBottomRef} />
                                </div>
                            )}
                        </div>

                        {/* Input area */}
                        <div className="border-t border-[#E5E5E5] bg-white px-4 py-3 pb-8 md:pb-4 rounded-b-2xl">
                            <form
                                className="flex items-center gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage(inputValue);
                                }}
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask VendorIQ..."
                                    className="flex-1 rounded-full border border-[#D1D5DB] bg-[#F9FAFB] px-4 py-2 text-sm text-[#111827] outline-none transition-colors focus:border-[#FF6B2B] focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/30"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF6B2B] text-white disabled:opacity-50"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
