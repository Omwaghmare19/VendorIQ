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

export default function MedicalStoreDashboard() {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const chatBottomRef = useRef<HTMLDivElement>(null);

    // Stats
    const heroAlertsCount = useCountUp(3, 1000);
    const revenueCount = useCountUp(8240, 2000);

    // Business Data
    const [businessName, setBusinessName] = useState('Sharma Medical Store');
    const [userName, setUserName] = useState('Sharma');

    useEffect(() => {
        const vendorType = localStorage.getItem('vendorType');
        if (vendorType !== 'medical') {
            navigate('/auth');
        }
        const bName = localStorage.getItem('businessName');
        if (bName) setBusinessName(bName);
        const uName = localStorage.getItem('userName');
        if (uName) setUserName(uName);
    }, [navigate]);

    // Suggested Prompts
    const suggestedPrompts = [
        "What medicines expire next month?",
        "Should I restock Paracetamol?",
        "Show sales trends for cough syrups.",
        "Generate a reorder list."
    ];

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        // Add user message
        const newMessages = [...chatMessages, { role: 'user', text } as const];
        setChatMessages(newMessages);
        setInputValue('');

        try {
            // Build the prompt with the system context
            const systemPrompt = `You are a specialized business advisor for a medical store in India. Business: ${businessName}. Give short, specific, actionable advice in simple English.\n`;
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

    const activeNav = "Today's Dashboard";

    return (
        <div className="flex h-screen w-full bg-[#F5F8FF] text-[#111827] overflow-hidden font-sans" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {/* Top Navbar */}
            <header className="fixed top-0 left-0 md:left-64 right-0 z-10 flex h-14 items-center justify-between border-b border-[#E0ECFF] bg-white px-6">
                <div className="flex items-center gap-2 md:hidden">
                    <span className="relative flex items-center text-xl tracking-tight" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                        <span className="mr-1 inline-flex h-2 w-2 rounded-full bg-[#2B7FFF] shadow-[0_0_8px_#2B7FFF]" />
                        <span className="font-bold">VendorIQ</span>
                    </span>
                    <span className="text-[#9CA3AF]">/</span>
                    <span className="font-mono text-[13px] text-[#6B7280] truncate max-w-[100px]">{businessName}</span>
                </div>
                <div className="hidden md:flex items-center">
                    <div className="text-[13px] font-mono text-[#9CA3AF]">
                        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center rounded-full border border-[#2B7FFF] px-3 py-1 text-xs font-medium text-[#2B7FFF] bg-[#EEF4FF]">
                        34°C · Humid
                    </div>
                    <button className="relative p-2 text-[#6B7280] hover:text-[#111827]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-[#2B7FFF]" />
                    </button>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B7FFF] font-semibold text-white">
                        {userName ? userName[0].toUpperCase() : 'S'}
                    </div>
                </div>
            </header>

            {/* Sidebar - fixed left */}
            <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="fixed bottom-0 left-0 z-20 flex w-full flex-row border-t border-[#E0ECFF] bg-white md:relative md:w-64 md:flex-col md:border-r md:border-t-0"
            >
                <div className="hidden px-6 pt-6 pb-4 md:block border-b border-[#E0ECFF]">
                    <div className="flex items-center gap-2">
                        <span className="relative flex items-center text-xl tracking-tight" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                            <span className="mr-1 inline-flex h-2 w-2 rounded-full bg-[#2B7FFF] shadow-[0_0_8px_#2B7FFF]" />
                            <span className="font-bold">VendorIQ</span>
                        </span>
                        <span className="text-[#9CA3AF]">/</span>
                        <span className="font-mono text-[13px] text-[#6B7280] truncate max-w-[100px]">{businessName}</span>
                    </div>
                </div>

                <div className="hidden p-4 md:block">
                    <div className="rounded-[16px] border border-[#E0ECFF] bg-white p-4 shadow-sm relative overflow-hidden">
                        <p className="font-mono text-[10px] uppercase text-[#2B7FFF] tracking-wider mb-1">MEDICAL STORE</p>
                        <h3 className="text-[18px] font-semibold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{businessName}</h3>

                        <div className="mt-4 flex items-center gap-3">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[#2B7FFF] bg-[#EEF4FF]">
                                <span className="font-mono text-[10px] font-bold text-[#2B7FFF]">94%</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] text-[#6B7280]">Stock health</span>
                                <span className="text-[10px] text-[#4ADE80] font-medium tracking-wide">Looking Good</span>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex w-full flex-row justify-around overflow-x-auto p-2 md:flex-col md:justify-start md:space-y-1 md:px-3 md:py-2">
                    {[
                        { name: "Today's Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
                        { name: "Seasonal Forecast", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
                        { name: "Expiry Tracker", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                        { name: "Reorder Planner", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                        { name: "AI Assistant", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
                        { name: "My Storefront", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
                        { name: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }
                    ].map(item => (
                        <button
                            key={item.name}
                            className={`flex h-11 items-center gap-3 rounded-[10px] px-3 text-sm font-medium transition-colors ${activeNav === item.name
                                ? 'bg-[#EEF4FF] text-[#2B7FFF] border-l-[3px] border-[#2B7FFF] shadow-sm'
                                : 'text-[#6B7280] hover:bg-[#F9F9F9] hover:text-[#111827] border-l-[3px] border-transparent'
                                }`}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                            <span className="hidden md:inline">{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="hidden mt-auto md:block p-4">
                    <button onClick={() => navigate('/auth')} className="flex w-full items-center gap-3 rounded-[10px] p-3 text-[#6B7280] hover:bg-[#F9F9F9] hover:text-[#111827]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span className="text-sm font-medium">Log out</span>
                    </button>
                </div>

                <div className="hidden mt-auto md:block relative overflow-hidden p-6 w-full flex justify-center h-24">
                    <div className="absolute -bottom-10 h-20 w-20 rounded-full border-[3px] border-[#2B7FFF] opacity-10" />
                </div>
            </motion.aside>

            {/* Main Content - fades in */}
            <motion.main
                id="main-scroll-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="custom-scrollbar flex-1 overflow-y-auto pb-24 md:pb-8 pt-14 relative"
            >
                <div className="mx-auto max-w-5xl px-4 py-6 md:p-6">

                    {/* Header */}
                    <header className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-[#111827]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                                Good Morning, {userName}
                            </h1>
                            <p className="mt-1 text-sm text-[#6B7280]">
                                Here is your medical store&apos;s pulse for today.
                            </p>
                        </div>
                    </header>

                    <RevealOnScroll>
                        {/* Hero / Stock Intelligence Card */}
                        <div className="relative mb-6 overflow-hidden rounded-[20px] bg-[#0D0D0D] p-6 text-white shadow-xl md:p-8 flex flex-col justify-between">
                            {/* Decorative Arc Ring */}
                            <div className="absolute -right-16 -top-16 h-[200px] w-[200px] rounded-full border-[2px] border-[#2B7FFF] opacity-8" />

                            <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full relative z-10 gap-8 lg:gap-12">
                                {/* Left Side */}
                                <div className="flex-1 flex flex-col">
                                    <p className="font-mono text-[11px] uppercase tracking-widest text-[#2B7FFF] font-semibold mb-2">Stock Intelligence · Today</p>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-6xl md:text-[72px] font-semibold tracking-tight text-white leading-none" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{heroAlertsCount}</span>
                                        <span className="text-[18px] text-[#9CA3AF] leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                            urgent alerts<br />items need your attention right now
                                        </span>
                                    </div>
                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <span className="inline-flex items-center rounded-full border border-[#EF4444] px-3 py-1 font-mono text-[12px] text-white">
                                            2 expiring soon
                                        </span>
                                        <span className="inline-flex items-center rounded-full border border-[#F59E0B] px-3 py-1 font-mono text-[12px] text-white">
                                            1 stockout risk
                                        </span>
                                        <span className="inline-flex items-center rounded-full border border-[#2B7FFF] px-3 py-1 font-mono text-[12px] text-white">
                                            Stock health: 94%
                                        </span>
                                    </div>
                                    <p className="mt-4 font-mono text-[11px] text-[#555555]">Last synced 7:00 AM</p>
                                </div>

                                {/* Right Side - SVG Donut Chart */}
                                <div className="flex flex-col items-center justify-center shrink-0">
                                    <div className="relative h-[160px] w-[160px]">
                                        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90 transform">
                                            {/* Background track */}
                                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1A1A1A" strokeWidth="12" />
                                            {/* Blue segment: 78% */}
                                            <motion.circle cx="50" cy="50" r="40" fill="transparent" stroke="#2B7FFF" strokeWidth="12"
                                                strokeDasharray="251.2"
                                                strokeDashoffset="251.2"
                                                strokeLinecap="round"
                                                initial={{ strokeDashoffset: 251.2 }}
                                                animate={{ strokeDashoffset: 251.2 - (251.2 * 0.78) }}
                                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                            />
                                            {/* Yellow segment: 14% (Offset by 78%) */}
                                            <motion.circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="12"
                                                strokeDasharray="251.2"
                                                strokeDashoffset="251.2"
                                                strokeLinecap="round"
                                                initial={{ strokeDashoffset: 251.2 }}
                                                animate={{ strokeDashoffset: 251.2 - (251.2 * 0.14) }}
                                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                                style={{ transformOrigin: "50px 50px", transform: "rotate(280.8deg)" }}
                                            />
                                            {/* Red segment: 8% (Offset by 92%) */}
                                            <motion.circle cx="50" cy="50" r="40" fill="transparent" stroke="#EF4444" strokeWidth="12"
                                                strokeDasharray="251.2"
                                                strokeDashoffset="251.2"
                                                strokeLinecap="round"
                                                initial={{ strokeDashoffset: 251.2 }}
                                                animate={{ strokeDashoffset: 251.2 - (251.2 * 0.08) }}
                                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                                style={{ transformOrigin: "50px 50px", transform: "rotate(331.2deg)" }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="font-mono text-[32px] font-bold text-white">94%</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-4 font-mono text-[10px] text-[#9CA3AF]">
                                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#2B7FFF]"></span>Healthy</div>
                                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#F59E0B]"></span>Low</div>
                                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#EF4444]"></span>Expiring</div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Strip */}
                            <div className="mt-8 relative z-10 w-full border-t border-[#1A1A1A] pt-4 flex flex-wrap gap-4 md:gap-8 font-mono text-[12px] text-[#9CA3AF]">
                                <div>Total SKUs: <span className="text-white">248</span></div>
                                <div>Low stock: <span className="text-white">14 items</span></div>
                                <div>Expiring in 30 days: <span className="text-white">6 items</span></div>
                            </div>
                        </div>
                    </RevealOnScroll>

                    <RevealOnScroll>
                        {/* 4 STAT CARDS ROW */}
                        <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Card 1: Revenue */}
                            <div className="group relative flex flex-col justify-between rounded-[16px] border border-[#E0ECFF] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                                <div>
                                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#2B7FFF]">Today's Revenue</p>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-[32px] font-bold text-[#111827] leading-none" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>₹{revenueCount}</span>
                                        <span className="text-[12px] font-medium text-[#10B981]">↑ +₹620 vs yesterday</span>
                                    </div>
                                </div>
                                <div className="mt-4 h-6 w-full opacity-60">
                                    {/* Simple SVG sparkline */}
                                    <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="h-full w-full">
                                        <path d="M0 20 L10 15 L20 18 L30 10 L40 12 L50 5 L60 8 L70 2 L80 6 L90 0 L100 4" fill="none" stroke="#2B7FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M0 20 L10 15 L20 18 L30 10 L40 12 L50 5 L60 8 L70 2 L80 6 L90 0 L100 4 L100 20 L0 20 Z" fill="url(#blue-gradient)" stroke="none" />
                                        <defs>
                                            <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#2B7FFF" stopOpacity="0.2" />
                                                <stop offset="100%" stopColor="#2B7FFF" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>

                            {/* Card 2: Expiring Soon */}
                            <div className="group relative flex flex-col justify-between rounded-[16px] border border-[#E0ECFF] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                                <div>
                                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#EF4444]">Expiring in 30 Days</p>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-[32px] font-bold text-[#EF4444] leading-none" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>6 items</span>
                                    </div>
                                    <p className="mt-1 text-[12px] text-[#6B7280]">Earliest: Mar 18 · Crocin 500</p>
                                </div>
                                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                                    <motion.div
                                        className="h-full bg-[#EF4444] rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: "35%" }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                </div>
                            </div>

                            {/* Card 3: Stockout Risk */}
                            <div className="group relative flex flex-col justify-between rounded-[16px] border border-[#E0ECFF] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                                <div>
                                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#F59E0B]">Stockout Risk</p>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-[32px] font-bold text-[#F59E0B] leading-none" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>1 item</span>
                                    </div>
                                    <p className="mt-1 text-[12px] text-[#6B7280]">ORS Sachets · 3 units left</p>
                                </div>
                                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                                    <motion.div
                                        className="h-full bg-[#F59E0B] rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: "15%" }}
                                        transition={{ duration: 1, delay: 0.6 }}
                                    />
                                </div>
                            </div>

                            {/* Card 4: Reorders Pending */}
                            <div className="group relative flex flex-col justify-between rounded-[16px] border border-[#E0ECFF] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                                <div>
                                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#2B7FFF]">Reorders Pending</p>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="font-mono text-[32px] font-bold text-[#111827] leading-none">4 items</span>
                                    </div>
                                    <p className="mt-1 text-[12px] text-[#6B7280]">Suggested by AI today</p>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    <span className="inline-flex rounded border border-[#2B7FFF]/30 bg-[#EEF4FF] px-1.5 py-0.5 text-[10px] font-medium text-[#2B7FFF]">ORS</span>
                                    <span className="inline-flex rounded border border-[#2B7FFF]/30 bg-[#EEF4FF] px-1.5 py-0.5 text-[10px] font-medium text-[#2B7FFF]">Azithro</span>
                                    <span className="inline-flex rounded border border-[#E5E7EB] bg-[#F9FAFB] px-1.5 py-0.5 text-[10px] font-medium text-[#6B7280]">+2 more</span>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* EXPIRY TRACKER TABLE SECTION */}
                    <RevealOnScroll>
                        <div id="expiry-tracker-section" className="mb-10 w-full rounded-[16px] border border-[#E0ECFF] bg-white shadow-sm overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between border-b border-[#E0ECFF] p-6 bg-white">
                                <div>
                                    <p className="font-mono text-[11px] font-semibold tracking-wider text-[#2B7FFF] uppercase">Expiry Tracker</p>
                                    <h2 className="mt-1 text-[22px] font-semibold text-[#111827]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Know before it's too late</h2>
                                </div>
                            </div>

                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left text-sm table-fixed min-w-[800px]">
                                    <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_rgba(224,236,255,1)]">
                                        <tr className="text-[#2B7FFF] font-mono text-[11px] uppercase tracking-wide">
                                            <th className="py-4 pl-6 pr-4 w-[25%] font-semibold">Medicine Name</th>
                                            <th className="py-4 px-4 w-[15%] font-semibold">Category</th>
                                            <th className="py-4 px-4 w-[15%] font-semibold">Stock Qty</th>
                                            <th className="py-4 px-4 w-[15%] font-semibold">Expiry Date</th>
                                            <th className="py-4 pr-6 pl-4 w-[30%] font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E0ECFF] bg-white">
                                        {[
                                            { name: 'Crocin 500mg', category: 'Fever', qty: '48 units', expiry: 'Mar 14, 2026', statusLabel: 'Expires < 7 days', statusColor: 'bg-[#FEF2F2] text-[#EF4444] border-[#FCA5A5]', isUrgent: true },
                                            { name: 'ORS Sachet', category: 'Dehydration', qty: '3 units', expiry: 'May 2026', statusLabel: 'Stockout Risk', statusColor: 'bg-[#FFFBEB] text-[#F59E0B] border-[#FCD34D]', isUrgent: false },
                                            { name: 'Azithromycin', category: 'Antibiotic', qty: '12 units', expiry: 'Apr 3, 2026', statusLabel: 'Expires 7–30 days', statusColor: 'bg-[#FFFBEB] text-[#F59E0B] border-[#FCD34D]', isUrgent: false },
                                            { name: 'Vicks VapoRub', category: 'Cold', qty: '34 units', expiry: 'Dec 2026', statusLabel: 'Healthy', statusColor: 'bg-[#EEF4FF] text-[#2B7FFF] border-[#BFDBFE]', isUrgent: false },
                                            { name: 'Paracetamol', category: 'Fever', qty: '210 units', expiry: 'Aug 2026', statusLabel: 'Healthy', statusColor: 'bg-[#EEF4FF] text-[#2B7FFF] border-[#BFDBFE]', isUrgent: false },
                                            { name: 'Cetirizine', category: 'Allergy', qty: '5 units', expiry: 'Apr 10, 2026', statusLabel: 'Expires 7–30 days', statusColor: 'bg-[#FFFBEB] text-[#F59E0B] border-[#FCD34D]', isUrgent: false },
                                            { name: 'Digene', category: 'Acidity', qty: '89 units', expiry: 'Nov 2026', statusLabel: 'Healthy', statusColor: 'bg-[#EEF4FF] text-[#2B7FFF] border-[#BFDBFE]', isUrgent: false },
                                            { name: 'Betadine', category: 'Antiseptic', qty: '140 units', expiry: 'Feb 2027', statusLabel: 'Overstocked', statusColor: 'bg-[#F9FAFB] text-[#6B7280] border-[#D1D5DB]', isUrgent: false },
                                        ].map((item, index) => (
                                            <tr key={index} className={`group border-b border-[#E0ECFF] transition-colors hover:bg-white ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9FBFF]'} ${item.isUrgent ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}`}>
                                                <td className="py-4 pl-6 pr-4 font-semibold text-[#111827]">{item.name}</td>
                                                <td className="py-4 px-4 text-[#6B7280]">{item.category}</td>
                                                <td className="py-4 px-4 font-mono text-xs font-medium text-[#4B5563]">{item.qty}</td>
                                                <td className="py-4 px-4 text-sm text-[#4B5563]">{item.expiry}</td>
                                                <td className="py-4 pr-6 pl-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${item.statusColor}`}>
                                                            {item.statusLabel}
                                                        </span>
                                                        <button className="text-[12px] font-semibold text-[#2B7FFF] opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
                                                            Take Action
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* TWO COLUMN ROW: SEASONAL FORECAST (60%) + REORDER PLANNER (40%) */}
                    <div className="mb-10 flex flex-col gap-4 lg:flex-row">
                        {/* LEFT: SEASONAL DEMAND FORECAST */}
                        <RevealOnScroll>
                            <div className="w-full lg:w-[60%] flex h-full flex-col rounded-[16px] border border-[#E0ECFF] bg-white p-6 shadow-sm">
                                <div className="mb-6">
                                    <p className="font-mono text-[11px] font-semibold tracking-wider text-[#2B7FFF] uppercase">Seasonal Intelligence · AI Forecast</p>
                                    <h2 className="mt-1 text-[20px] font-semibold text-[#111827]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>What will sell next — before the season hits</h2>
                                </div>
                                <div className="flex flex-col gap-4 flex-1">
                                    {/* Allergy Season (Highlighted - Current) */}
                                    <div className="flex gap-4 rounded-[12px] border border-[#E0ECFF] border-l-[4px] border-l-[#2B7FFF] bg-[#EEF4FF] p-4 relative overflow-hidden">
                                        <div className="absolute right-0 top-0 rounded-bl-[8px] bg-[#2B7FFF]/10 px-2 py-1 flex items-center gap-1">
                                            <svg className="h-3 w-3 text-[#2B7FFF]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" /></svg>
                                            <span className="font-mono text-[9px] font-bold tracking-wider text-[#2B7FFF] uppercase">AI Predicted</span>
                                        </div>
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#2B7FFF] shadow-sm">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-[15px] font-bold text-[#111827]">Allergy Season <span className="font-normal text-[#6B7280]">· Feb–Mar</span></h3>
                                            </div>
                                            <p className="mt-1 text-[13px] text-[#4B5563]">Allergies, eye infections</p>
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <div className="rounded bg-[#2B7FFF] px-2 py-0.5 font-mono text-[13px] text-white">Stock Cetirizine, Eye drops</div>
                                                <span className="font-mono text-[12px] font-medium text-[#2B7FFF]">↑ +40% demand</span>
                                            </div>
                                            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/50">
                                                <div className="h-full bg-gradient-to-r from-[#2B7FFF]/50 to-[#2B7FFF]" style={{ width: '40%' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summer */}
                                    <div className="flex gap-4 rounded-[12px] border border-[#F3F4F6] bg-white p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFFBEB] text-[#F59E0B]">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-[15px] font-bold text-[#111827]">Summer <span className="font-normal text-[#6B7280]">· Mar–Jun</span></h3>
                                            <p className="mt-1 text-[13px] text-[#4B5563]">Fever, dehydration, sunstroke</p>
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <div className="rounded bg-[#F3F4F6] px-2 py-0.5 font-mono text-[13px] text-[#4B5563]">Stock ORS, Paracetamol, Electral</div>
                                                <span className="font-mono text-[12px] font-medium text-[#2B7FFF]">↑ +80% demand</span>
                                            </div>
                                            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                                                <div className="h-full bg-gradient-to-r from-[#2B7FFF]/20 to-[#2B7FFF]" style={{ width: '80%' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Monsoon */}
                                    <div className="flex gap-4 rounded-[12px] border border-[#F3F4F6] bg-white p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280]">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-[15px] font-bold text-[#111827]">Monsoon <span className="font-normal text-[#6B7280]">· Jul–Sep</span></h3>
                                            <p className="mt-1 text-[13px] text-[#4B5563]">Malaria, typhoid, cold</p>
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <div className="rounded bg-[#F3F4F6] px-2 py-0.5 font-mono text-[13px] text-[#4B5563]">Stock Azithromycin, Dolo 650, Antifungals</div>
                                                <span className="font-mono text-[12px] font-medium text-[#2B7FFF]">↑ +65% demand</span>
                                            </div>
                                            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                                                <div className="h-full bg-gradient-to-r from-[#2B7FFF]/20 to-[#2B7FFF]" style={{ width: '65%' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Winter */}
                                    <div className="flex gap-4 rounded-[12px] border border-[#F3F4F6] bg-white p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#60A5FA]">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-[15px] font-bold text-[#111827]">Winter <span className="font-normal text-[#6B7280]">· Oct–Dec</span></h3>
                                            <p className="mt-1 text-[13px] text-[#4B5563]">Cold, flu, respiratory</p>
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <div className="rounded bg-[#F3F4F6] px-2 py-0.5 font-mono text-[13px] text-[#4B5563]">Stock Vicks, Cetirizine, Cough syrups</div>
                                                <span className="font-mono text-[12px] font-medium text-[#2B7FFF]">↑ +55% demand</span>
                                            </div>
                                            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                                                <div className="h-full bg-gradient-to-r from-[#2B7FFF]/20 to-[#2B7FFF]" style={{ width: '55%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Area Chart */}
                                <div className="mt-6 h-32 w-full pt-4 border-t border-[#F3F4F6] relative">
                                    <svg viewBox="0 0 600 100" preserveAspectRatio="none" className="h-full w-full">
                                        <path d="M0 80 Q 50 80, 100 20 T 200 80 T 350 35 T 500 45 T 600 80 L600 100 L0 100 Z" fill="url(#season-gradient)" stroke="none" />
                                        <motion.path
                                            d="M0 80 Q 50 80, 100 20 T 200 80 T 350 35 T 500 45 T 600 80"
                                            fill="none"
                                            stroke="#2B7FFF"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeDasharray="1000"
                                            initial={{ strokeDashoffset: 1000 }}
                                            whileInView={{ strokeDashoffset: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 2, ease: "easeOut" }}
                                        />
                                        <defs>
                                            <linearGradient id="season-gradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#2B7FFF" stopOpacity="0.15" />
                                                <stop offset="100%" stopColor="#2B7FFF" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute top-2 left-[15%] text-[10px] font-mono text-[#2B7FFF] bg-white/80 px-1 rounded">Allergy Spikes</div>
                                    <div className="absolute top-6 left-[55%] text-[10px] font-mono text-[#2B7FFF] bg-white/80 px-1 rounded">Monsoon Spikes</div>
                                    <div className="flex justify-between w-full mt-2 font-mono text-[10px] text-[#9CA3AF]">
                                        <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>

                        {/* RIGHT: SMART REORDER PLANNER (40%) */}
                        <RevealOnScroll>
                            <div className="w-full lg:w-[40%] h-full flex flex-col rounded-[16px] border border-[#E0ECFF] bg-white p-6 shadow-sm">
                                <div className="mb-6">
                                    <p className="font-mono text-[11px] font-semibold tracking-wider text-[#2B7FFF] uppercase">Smart Reorder Planner</p>
                                    <h2 className="mt-1 text-[18px] font-semibold text-[#111827]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>AI-suggested orders for this week</h2>
                                </div>
                                <div className="flex flex-col gap-3 flex-1">
                                    {[
                                        { qty: '3 units', reorder: '50 units', urgency: 'URGENT', name: 'ORS Sachets', reason: 'monsoon demand spike + critically low stock', barWidth: '95%' },
                                        { qty: '18 units', reorder: '100 units', urgency: 'HIGH', name: 'Paracetamol 500mg', reason: 'historical seasonal sales trend', barWidth: '75%' },
                                        { qty: '12 units', reorder: '30 units', urgency: 'MEDIUM', name: 'Azithromycin', reason: 'steady burn rate', barWidth: '45%' },
                                        { qty: '5 units', reorder: '40 units', urgency: 'HIGH', name: 'Cetirizine 10mg', reason: 'allergy season approaching rapidly', barWidth: '85%' },
                                    ].map((item, i) => (
                                        <div key={i} className="rounded-[12px] border border-[#E0ECFF] p-3 hover:border-[#2B7FFF]/40 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-[15px] font-bold text-[#111827]">{item.name}</h3>
                                                <span className={`font-mono text-[10px] font-bold tracking-wider ${item.urgency === 'URGENT' ? 'text-[#EF4444]' : item.urgency === 'HIGH' ? 'text-[#F59E0B]' : 'text-[#2B7FFF]'}`}>{item.urgency}</span>
                                            </div>
                                            <p className="mt-1 font-mono text-[12px] text-[#4B5563]">Current stock: {item.qty} · <span className="font-semibold text-[#111827]">Reorder: {item.reorder}</span></p>
                                            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                                                <div className={`h-full ${item.urgency === 'URGENT' ? 'bg-[#EF4444]' : item.urgency === 'HIGH' ? 'bg-[#F59E0B]' : 'bg-[#2B7FFF]'}`} style={{ width: item.barWidth }}></div>
                                            </div>
                                            <div className="mt-3 flex gap-2">
                                                <button className="flex-1 rounded-lg bg-[#2B7FFF] py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-[#1E5FCD] transition-colors">Order Now</button>
                                                <button className="flex-1 rounded-lg border border-[#D1D5DB] py-1.5 text-[12px] font-semibold text-[#4B5563] hover:bg-[#F9FAFB] transition-colors">Snooze 3 days</button>
                                            </div>
                                            <p className="mt-2 text-[11px] italic text-[#6B7280]">Based on: {item.reason}</p>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-4 w-full text-center text-[13px] font-semibold text-[#2B7FFF] hover:underline">
                                    View all 14 AI suggestions →
                                </button>
                            </div>
                        </RevealOnScroll>
                    </div>

                    {/* AI BUSINESS IDEAS SECTION (FULL WIDTH) */}
                    <RevealOnScroll>
                        <div className="mb-10 w-full rounded-[20px] border border-[#C7DCFF] bg-[#EEF4FF] p-6 shadow-sm md:p-8">
                            <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                                <div>
                                    <p className="font-mono text-[11px] font-semibold tracking-wider text-[#2B7FFF] uppercase">AI Business Ideas · Powered By Gemini</p>
                                    <h2 className="mt-1 text-[24px] font-semibold text-[#111827]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Grow your medical store revenue</h2>
                                </div>
                                <button className="self-start md:self-auto rounded-xl border border-[#2B7FFF]/30 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-[#2B7FFF] shadow-sm hover:bg-[#F5F8FF] transition-colors flex items-center gap-1.5">
                                    <span>↻</span> Refresh Ideas
                                </button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {/* Idea 1: Bundles */}
                                <div className="flex flex-col justify-between rounded-[12px] bg-white p-5 shadow-sm border border-transparent hover:border-[#2B7FFF]/30 transition-all">
                                    <div>
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2B7FFF]">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        </div>
                                        <div className="mb-2 inline-flex rounded-full bg-[#EEF4FF] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#2B7FFF]">Bundle Strategy</div>
                                        <h3 className="text-[16px] font-bold text-[#111827] leading-tight mb-2">Create Monsoon Health Kits</h3>
                                        <p className="text-[13px] text-[#4B5563] leading-relaxed">Bundle ORS + Dolo + Antifungal cream. Customers pay ₹199 for what costs them ₹230 separately — and you move slow stock.</p>
                                    </div>
                                    <button className="mt-5 text-left text-[13px] font-semibold text-[#2B7FFF] hover:underline decoration-2 underline-offset-2">Create Kit →</button>
                                </div>

                                {/* Idea 2: Expiry Discounts */}
                                <div className="flex flex-col justify-between rounded-[12px] bg-white p-5 shadow-sm border border-transparent hover:border-[#F59E0B]/30 transition-all">
                                    <div>
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFBEB] text-[#F59E0B]">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                        </div>
                                        <div className="mb-2 inline-flex rounded-full bg-[#FFFBEB] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">Loss Prevention</div>
                                        <h3 className="text-[16px] font-bold text-[#111827] leading-tight mb-2">Run Expiry Discount Sales</h3>
                                        <p className="text-[13px] text-[#4B5563] leading-relaxed">6 medicines expire in 30 days. A 20% discount today clears them before they become a complete loss.</p>
                                    </div>
                                    <button className="mt-5 text-left text-[13px] font-semibold text-[#F59E0B] hover:underline decoration-2 underline-offset-2">Set Discount →</button>
                                </div>

                                {/* Idea 3: Doctor Network */}
                                <div className="flex flex-col justify-between rounded-[12px] bg-white p-5 shadow-sm border border-transparent hover:border-[#10B981]/30 transition-all">
                                    <div>
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFDF5] text-[#10B981]">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        </div>
                                        <div className="mb-2 inline-flex rounded-full bg-[#ECFDF5] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#10B981]">Revenue Growth</div>
                                        <h3 className="text-[16px] font-bold text-[#111827] leading-tight mb-2">Partner with Nearby Clinics</h3>
                                        <p className="text-[13px] text-[#4B5563] leading-relaxed">3 clinics within 500m. A referral agreement means their patients come to you first — zero marketing cost.</p>
                                    </div>
                                    <button className="mt-5 text-left text-[13px] font-semibold text-[#10B981] hover:underline decoration-2 underline-offset-2">Explore →</button>
                                </div>
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
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2B7FFF] text-white shadow-[0_10px_30px_rgba(43,127,255,0.3)] hover:shadow-[0_15px_35px_rgba(43,127,255,0.4)] transition-shadow relative"
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
                        className="fixed bottom-24 right-0 top-0 z-40 w-full max-w-[400px] bg-white shadow-2xl flex flex-col md:bottom-auto md:h-auto md:bottom-24 md:right-10 md:top-24 md:rounded-[16px] border md:border-[#E0ECFF]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-[#E0ECFF] px-5 py-4 bg-white/95 backdrop-blur-md rounded-t-[16px]">
                            <div>
                                <h3 className="text-[18px] font-semibold text-[#111827]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Medical AI Assistant</h3>
                                <p className="font-mono text-[11px] text-[#2B7FFF]">Trained on your inventory</p>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="rounded-full p-2 text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827]">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Content area */}
                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#F5F8FF]">
                            {chatMessages.length === 0 ? (
                                <div className="space-y-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Suggested prompts:</p>
                                    <div className="flex flex-col gap-2">
                                        {suggestedPrompts.map((prompt, idx) => (
                                            <motion.button
                                                key={idx}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => handleSendMessage(prompt)}
                                                className="rounded-xl border border-[#E0ECFF] bg-white p-3 text-left text-sm text-[#4B5563] shadow-sm hover:border-[#2B7FFF]/50 hover:text-[#2B7FFF] hover:shadow-md transition-all"
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
                                                    ? 'rounded-[16px_16px_4px_16px] bg-[#2B7FFF] text-white shadow-md'
                                                    : 'rounded-[16px_16px_16px_4px] border border-[#E0ECFF] bg-white text-[#111827] shadow-sm'
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
                        <div className="border-t border-[#E0ECFF] bg-white px-4 py-3 pb-8 md:pb-4 rounded-b-[16px]">
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
                                    placeholder="Ask about inventory, expiry or trends..."
                                    className="flex-1 rounded-full border border-[#E0ECFF] bg-[#F9FAFB] px-4 py-2 text-sm text-[#111827] outline-none transition-colors focus:border-[#2B7FFF] focus:bg-white focus:ring-1 focus:ring-[#2B7FFF]/30"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2B7FFF] text-white disabled:opacity-50"
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
