import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Extracted from App.tsx/Dashboard
function useCountUp(target: number, duration: number = 1500) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }, [target, duration]);
    return count;
}

const RevealOnScroll: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

export default function FoodVendorForecasting() {
    const navigate = useNavigate();

    // Count Ups
    const todayCount = useCountUp(380, 1500);
    const tomorrowCount = useCountUp(410, 1500);

    // Progress Ring Animation
    const [ringProgress, setRingProgress] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => setRingProgress(94.2), 500);
        return () => clearTimeout(timer);
    }, []);

    // SVG Chart points setup
    const chartPoints = [
        { x: 0, y: 380, label: "Mar 6", festival: null },
        { x: 10, y: 410, label: null, festival: null },
        { x: 20, y: 390, label: null, festival: null },
        { x: 30, y: 370, label: null, festival: null },
        { x: 40, y: 420, label: "Mar 11", festival: null },
        { x: 50, y: 450, label: null, festival: null },
        { x: 60, y: 400, label: null, festival: null },
        { x: 70, y: 430, label: null, festival: null },
        { x: 80, y: 480, label: "Mar 16", festival: null },
        { x: 90, y: 500, label: null, festival: null },
        { x: 100, y: 550, label: null, festival: null },
        { x: 110, y: 590, label: null, festival: null },
        { x: 120, y: 625, label: "Mar 25", festival: { name: "Holi", boost: "+65%" } },
        { x: 130, y: 420, label: null, festival: null },
        { x: 140, y: 400, label: null, festival: null },
        { x: 150, y: 390, label: "Mar 31", festival: null },
        { x: 160, y: 550, label: null, festival: { name: "Gudi Padwa", boost: "+45%" } }, // Apr 1
        { x: 170, y: 430, label: null, festival: null },
        { x: 180, y: 440, label: "Apr 5", festival: null },
        { x: 190, y: 570, label: null, festival: { name: "Ram Navami", boost: "+50%" } }, // Apr 6
        { x: 200, y: 450, label: null, festival: null },
        { x: 210, y: 480, label: "Apr 11", festival: null },
        { x: 220, y: 490, label: null, festival: null }, // Apr 14 Baisakhi approx
        { x: 230, y: 440, label: null, festival: null },
        { x: 240, y: 450, label: "Apr 16", festival: null },
        { x: 250, y: 460, label: null, festival: null },
        { x: 260, y: 490, label: null, festival: { name: "IPL Final", boost: "+29%" } }, // Apr 20
        { x: 270, y: 430, label: null, festival: null },
        { x: 280, y: 410, label: "Apr 25", festival: null }
    ];

    // Map y-values (0-700) to svg height (300px)
    // Formula: mapped_y = 300 - (y / 700) * 300
    const mapY = (val: number) => 300 - (val / 700) * 300;
    const mapX = (x: number) => (x / 280) * 1000; // Map 0-280 to 0-1000SVG width

    const pathData = `M ${chartPoints.map(p => `${mapX(p.x)},${mapY(p.y)}`).join(' L ')}`;

    // Confidence envelope (rough ±15%)
    const envUpper = `M ${chartPoints.map(p => `${mapX(p.x)},${mapY(p.y * 1.15)}`).join(' L ')}`;
    const envLower = `L ${chartPoints.map(p => `${mapX(p.x)},${mapY(p.y * 0.85)}`).reverse().join(' L ')}`;
    const envelopePath = `${envUpper} ${envLower} Z`;

    return (
        <div className="flex h-screen w-full bg-[#F7F7F5] text-[#111827] overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="fixed bottom-0 left-0 z-20 flex w-full flex-row border-t border-[#E5E5E5] bg-white md:relative md:w-64 md:flex-col md:border-r md:border-t-0">
                <div className="hidden p-6 md:block">
                    <div className="flex items-center gap-2">
                        <span className="relative flex items-center text-xl font-semibold tracking-tight">
                            <span className="mr-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#FF6B2B]" />
                            Vendor<span className="font-extrabold">IQ</span>
                        </span>
                    </div>
                </div>

                <nav className="flex w-full flex-row justify-around overflow-x-auto p-2 md:mt-4 md:flex-col md:justify-start md:space-y-1 md:p-4">
                    <button onClick={() => navigate('/dashboard/food')} className="flex flex-col items-center justify-center rounded-xl p-3 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] md:flex-row md:justify-start md:gap-3 md:p-3">
                        <svg className="h-5 w-5 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        <span className="mt-1 text-[10px] font-medium md:mt-0 md:text-sm">Home</span>
                    </button>
                    <button onClick={() => navigate('/dashboard/forecasting')} className="flex flex-col items-center justify-center rounded-xl bg-[#FFF9F6] p-3 text-[#FF6B2B] md:flex-row md:justify-start md:gap-3 md:p-3">
                        <svg className="h-5 w-5 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <span className="mt-1 text-[10px] font-medium md:mt-0 md:text-sm">Forecasting</span>
                    </button>
                    {/* Placeholder for Sales Log button to be added in the next step */}
                    <button onClick={() => alert("Sales Log coming soon")} className="flex flex-col items-center justify-center rounded-xl p-3 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] md:flex-row md:justify-start md:gap-3 md:p-3">
                        <svg className="h-5 w-5 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span className="mt-1 text-[10px] font-medium md:mt-0 md:text-sm">Sales Log</span>
                    </button>
                    <button onClick={() => navigate('/dashboard/food/chat')} className="flex flex-col items-center justify-center rounded-xl p-3 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] md:flex-row md:justify-start md:gap-3 md:p-3">
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
            </aside>

            {/* Main Content */}
            <main id="main-scroll-container" className="flex-1 overflow-y-auto custom-scrollbar relative px-4 py-8 md:px-10">
                <div className="mx-auto max-w-6xl pb-24 md:pb-10">

                    {/* Page Header */}
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <p className="font-mono text-[12px] text-[#9CA3AF] mb-3">Dashboard / Forecasting</p>
                            <h1 className="text-4xl font-semibold tracking-tight text-[#0D0D0D]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                                Demand Forecasting
                            </h1>
                            <p className="mt-2 text-[16px] text-[#6B7280]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                AI-powered predictions based on weather, festivals, and your sales history.
                            </p>
                        </div>
                        <div className="flex bg-white rounded-full p-1 border border-[#E5E5E5] self-start md:self-end shadow-sm">
                            <button className="px-5 py-1.5 rounded-full bg-[#FF6B2B] text-white text-[13px] font-medium" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Today</button>
                            <button className="px-5 py-1.5 rounded-full text-[#6B7280] hover:text-[#111827] text-[13px] font-medium" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>This Week</button>
                            <button className="px-5 py-1.5 rounded-full text-[#6B7280] hover:text-[#111827] text-[13px] font-medium" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>This Month</button>
                        </div>
                    </header>

                    {/* SECTION 1 — TODAY vs TOMORROW FORECAST */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-8">
                        {/* TODAY CARD */}
                        <RevealOnScroll delay={0.1}>
                            <div className="bg-white rounded-[16px] border border-[#E5E5E5] p-6 shadow-sm flex flex-col h-full">
                                <span className="font-mono text-[11px] font-semibold text-[#FF6B2B] tracking-wider uppercase mb-3">TODAY &middot; MARCH 6</span>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-7xl font-semibold text-[#0D0D0D] tracking-tight" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{todayCount}</span>
                                    <span className="text-[#6B7280] text-xl" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>units</span>
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[12px] font-medium text-[#6B7280]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>AI Confidence: 91%</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#F3F4F6] rounded-full overflow-hidden mb-8">
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: "91%" }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-[#FF6B2B] rounded-full" />
                                </div>

                                <hr className="border-[#E5E5E5] mb-6" />

                                <h4 className="text-[16px] font-semibold mb-5 text-[#0D0D0D]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Why this number?</h4>

                                <div className="space-y-4 flex-1">
                                    {[
                                        { label: "Day of Week (Friday)", impact: "+18%", positive: true, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "#FF6B2B", bg: "#FFF9F6" },
                                        { label: "Weather (34°C Clear)", impact: "+12%", positive: true, icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z", color: "#EAB308", bg: "#FEFCE8" },
                                        { label: "No Festival Today", impact: "Neutral", positive: null, icon: "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9", color: "#9CA3AF", bg: "#F3F4F6" },
                                        { label: "Last Friday Sales (365)", impact: "+5%", positive: true, icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z", color: "#3B82F6", bg: "#EFF6FF" },
                                    ].map((factor, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: factor.bg, color: factor.color }}>
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={factor.icon} /></svg>
                                                </div>
                                                <span className="text-[14px] font-semibold text-[#111827]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{factor.label}</span>
                                            </div>
                                            <span className={`px-2 py-1 rounded-md text-[12px] font-bold ${factor.positive === true ? 'bg-[#ECFDF3] text-[#10B981]' : factor.positive === false ? 'bg-[#FEF2F2] text-[#EF4444]' : 'bg-[#F3F4F6] text-[#6B7280]'}`} style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                                {factor.impact}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t border-[#F3F4F6]">
                                    <p className="font-mono text-[12px] text-[#6B7280]">Base prediction: 310 &rarr; after factors: 380</p>
                                </div>
                            </div>
                        </RevealOnScroll>

                        {/* TOMORROW CARD */}
                        <RevealOnScroll delay={0.2}>
                            <div className="bg-white rounded-[16px] border border-[#E5E5E5] p-6 shadow-sm flex flex-col h-full relative overflow-hidden">
                                <span className="font-mono text-[11px] font-semibold text-[#6B7280] tracking-wider uppercase mb-3">TOMORROW &middot; MARCH 7</span>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-7xl font-semibold text-[#0D0D0D] tracking-tight" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{tomorrowCount}</span>
                                    <span className="text-[#6B7280] text-xl" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>units</span>
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[12px] font-medium text-[#6B7280]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>AI Confidence: 87%</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#F3F4F6] rounded-full overflow-hidden mb-8">
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: "87%" }} transition={{ duration: 1, delay: 0.7 }} className="h-full bg-[#EAB308] rounded-full" />
                                </div>

                                <hr className="border-[#E5E5E5] mb-6" />

                                <h4 className="text-[16px] font-semibold mb-5 text-[#0D0D0D]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Why this number?</h4>

                                <div className="space-y-4 flex-1">
                                    {[
                                        { label: "Saturday", impact: "+22%", positive: true, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "#FF6B2B", bg: "#FFF9F6" },
                                        { label: "Weather (38°C Hotter)", impact: "+15%", positive: true, icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z", color: "#EAB308", bg: "#FEFCE8" },
                                        { label: "Weekend crowd", impact: "+10%", positive: true, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", color: "#6366F1", bg: "#EEF2FF" },
                                        { label: "Last Saturday Sales (395)", impact: "+8%", positive: true, icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z", color: "#3B82F6", bg: "#EFF6FF" },
                                    ].map((factor, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: factor.bg, color: factor.color }}>
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={factor.icon} /></svg>
                                                </div>
                                                <span className="text-[14px] font-semibold text-[#111827]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{factor.label}</span>
                                            </div>
                                            <span className={`px-2 py-1 rounded-md text-[12px] font-bold ${factor.positive === true ? 'bg-[#ECFDF3] text-[#10B981]' : factor.positive === false ? 'bg-[#FEF2F2] text-[#EF4444]' : 'bg-[#F3F4F6] text-[#6B7280]'}`} style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                                {factor.impact}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 border-l-4 border-[#FF6B2B] bg-[#FFF9F6] p-3 rounded-r-md">
                                    <p className="text-[13px] font-bold text-[#b4410e]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Prepare extra raw materials tonight</p>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>

                    {/* SECTION 2 — 30-DAY FORECAST CHART */}
                    <RevealOnScroll delay={0.3}>
                        <div className="bg-[#0D0D0D] rounded-3xl p-6 md:p-8 mb-8 relative shadow-xl overflow-hidden">
                            <span className="font-mono text-[11px] font-semibold tracking-wider text-[#FF6B2B] uppercase mb-1 block">30-DAY DEMAND FORECAST</span>
                            <h2 className="text-[24px] font-semibold text-white mb-8" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>The next month, day by day.</h2>

                            <div className="relative h-[300px] w-full mt-10">
                                {/* Chart Grid / Labels */}
                                <div className="absolute inset-0 flex flex-col justify-between">
                                    {[700, 500, 300, 100, 0].map(yVal => (
                                        <div key={yVal} className="flex items-center w-full">
                                            <span className="w-8 font-mono text-[10px] text-[#4B5563] -translate-y-2">{yVal}</span>
                                            <div className="flex-1 border-t border-[#1F2937] ml-2"></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Today's Baseline Line */}
                                <div className="absolute left-0 w-full flex items-center" style={{ top: `${mapY(380)}px` }}>
                                    <span className="w-8"></span>
                                    <div className="flex-1 border-t border-dashed border-[#4B5563] relative ml-2 z-10">
                                        <div className="absolute right-0 -top-6 bg-[#374151] px-2 py-1 rounded-md text-[10px] font-mono text-white opacity-80">Today's baseline (380)</div>
                                    </div>
                                </div>

                                {/* SVG Chart */}
                                <svg className="absolute inset-0 w-full h-[300px] pl-10" viewBox="0 0 1000 300" preserveAspectRatio="none">
                                    <motion.path
                                        d={envelopePath}
                                        fill="rgba(255, 107, 43, 0.08)"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                    />
                                    <motion.path
                                        d={pathData}
                                        fill="none"
                                        stroke="#FF6B2B"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                    />
                                </svg>

                                {/* Festival Markers Overlay */}
                                <div className="absolute inset-0 pl-10">
                                    {chartPoints.filter(p => p.festival).map((p, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute top-0 bottom-0 border-l border-dotted border-[#FF6B2B]"
                                            style={{ left: `${(p.x / 280) * 100}%` }}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 1.5 + i * 0.2 }}
                                        >
                                            <div className="absolute -top-6 -translate-x-1/2 bg-white px-3 py-1.5 rounded-md shadow-lg flex items-center gap-2 whitespace-nowrap min-w-max z-20">
                                                <span className="text-[12px] font-bold text-[#111827]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{p.festival?.name}</span>
                                                <span className="text-[10px] font-mono font-bold text-[#FF6B2B]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>&uarr; {p.festival?.boost}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {/* X-axis labels */}
                                    <div className="absolute -bottom-6 w-full flex justify-between">
                                        {chartPoints.filter(p => p.label).map((p, i) => (
                                            <div key={i} className="absolute font-mono text-[10px] text-[#4B5563] -translate-x-1/2" style={{ left: `${(p.x / 280) * 100}%` }}>
                                                {p.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-4 items-center">
                                <div className="flex items-center gap-2"><div className="w-4 h-1 bg-[#FF6B2B] rounded-full"></div><span className="text-[11px] font-mono text-[#9CA3AF]">Forecast</span></div>
                                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#FF6B2B] opacity-20 rounded-sm"></div><span className="text-[11px] font-mono text-[#9CA3AF]">Confidence range</span></div>
                                <div className="flex items-center gap-2"><div className="w-4 border-t border-dotted border-[#FF6B2B]"></div><span className="text-[11px] font-mono text-[#9CA3AF]">Festivals</span></div>
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* SECTION 3 — FESTIVAL FORECAST TABLE */}
                    <RevealOnScroll delay={0.4}>
                        <div className="bg-white rounded-[16px] border border-[#E5E5E5] p-6 shadow-sm mb-8 overflow-hidden">
                            <div className="mb-6">
                                <span className="font-mono text-[11px] font-semibold text-[#FF6B2B] tracking-wider uppercase mb-1 block">FESTIVAL DEMAND CALENDAR</span>
                                <h2 className="text-[20px] font-semibold text-[#0D0D0D]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Plan your stock before the rush hits.</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-[#E5E5E5] bg-white">
                                            <th className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider p-3 font-normal">Date</th>
                                            <th className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider p-3 font-normal">Festival</th>
                                            <th className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider p-3 font-normal">Normal Avg</th>
                                            <th className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider p-3 font-normal">Predicted Units</th>
                                            <th className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider p-3 font-normal">Demand Boost</th>
                                            <th className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider p-3 font-normal">AI Notes</th>
                                            <th className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider p-3 font-normal text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { date: "Mar 25", name: "Holi", avg: 380, pred: 625, boost: "+65%", type: "high", note: "High sugar snacks. Prepare sweet pani." },
                                            { date: "Apr 1", name: "Gudi Padwa", avg: 380, pred: 550, boost: "+45%", type: "med", note: "Early morning surge. Open 1hr earlier." },
                                            { date: "Apr 6", name: "Ram Navami", avg: 380, pred: 570, boost: "+50%", type: "high", note: "Procession route. Double chutney stock." },
                                            { date: "Apr 14", name: "Baisakhi", avg: 380, pred: 490, boost: "+29%", type: "low", note: "Moderate boost. Steady evening demand." },
                                            { date: "Apr 20", name: "IPL Final", avg: 380, pred: 490, boost: "+29%", type: "low", note: "Evening-only spike. Peak 7–10 PM." }
                                        ].map((row, i) => (
                                            <tr key={i} className={`border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                                                <td className="p-3 whitespace-nowrap"><span className="font-mono text-[13px] text-[#4B5563]">{row.date}</span></td>
                                                <td className="p-3"><span className="font-bold text-[14px] text-[#111827]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{row.name}</span></td>
                                                <td className="p-3"><span className="font-mono text-[14px] text-[#6B7280]">{row.avg}</span></td>
                                                <td className="p-3"><span className="font-mono font-bold text-[14px] text-[#111827]">{row.pred}</span></td>
                                                <td className="p-3">
                                                    <span className={`inline-flex px-2 py-1 rounded-md text-[11px] font-bold ${row.type === 'high' ? 'bg-[#FEF2F2] text-[#EF4444]' : row.type === 'med' ? 'bg-[#FFF9F6] text-[#FF6B2B]' : 'bg-[#ECFDF3] text-[#10B981]'}`} style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                                        {row.boost}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-[13px] text-[#4B5563]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{row.note}</td>
                                                <td className="p-3 text-right">
                                                    <button className="border border-[#FF6B2B] text-[#FF6B2B] hover:bg-[#FF6B2B] hover:text-white transition-colors text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                                        Set Reminder
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* SECTION 4 — FORECAST ACCURACY TRACKER */}
                    <RevealOnScroll delay={0.5}>
                        <div className="bg-white rounded-[16px] border border-[#E5E5E5] p-6 md:p-8 shadow-sm">
                            <div className="mb-6">
                                <span className="font-mono text-[11px] font-semibold text-[#FF6B2B] tracking-wider uppercase mb-1 block">FORECAST ACCURACY</span>
                                <h2 className="text-[20px] font-semibold text-[#0D0D0D]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>How well has the AI predicted your sales?</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10 items-center">
                                {/* Left: Line Chart */}
                                <div className="h-[200px] w-full relative">
                                    {/* Mock SVG Chart for Accuracy */}
                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                                        <motion.path
                                            d="M 0 40 L 10 35 L 20 28 L 30 38 L 40 20 L 50 15 L 60 25 L 70 30 L 80 18 L 90 22 L 100 10"
                                            fill="none" stroke="#22C97A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5 }}
                                        />
                                        <motion.path
                                            d="M 0 38 L 10 37 L 20 25 L 30 35 L 40 23 L 50 12 L 60 27 L 70 33 L 80 16 L 90 24 L 100 12"
                                            fill="none" stroke="#FF6B2B" strokeWidth="1.5" strokeDasharray="2 2" strokeLinecap="round" strokeLinejoin="round"
                                            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5 }}
                                        />
                                    </svg>
                                    <div className="absolute -bottom-6 flex w-full justify-between font-mono text-[10px] text-[#9CA3AF]">
                                        <span>14 days ago</span>
                                        <span>Today</span>
                                    </div>
                                    <div className="absolute -bottom-10 flex gap-4">
                                        <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-[#22C97A]"></div><span className="font-mono text-[10px] text-[#6B7280]">Actual Sales</span></div>
                                        <div className="flex items-center gap-1"><div className="w-3 border-t border-dashed border-[#FF6B2B]"></div><span className="font-mono text-[10px] text-[#6B7280]">AI Predicted</span></div>
                                    </div>
                                </div>

                                {/* Right: Stats & Ring */}
                                <div className="flex flex-col md:flex-row items-center gap-8 mt-10 md:mt-0">
                                    <div className="relative w-[120px] h-[120px] shrink-0">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                                            <motion.circle
                                                cx="50" cy="50" r="40" fill="none" stroke="#FF6B2B" strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeDasharray="251.2"
                                                strokeDashoffset="251.2"
                                                animate={{ strokeDashoffset: 251.2 - (251.2 * ringProgress) / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-[22px] font-semibold text-[#0D0D0D]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{ringProgress}%</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[36px] font-semibold text-[#FF6B2B] mb-1 leading-none" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Overall Accuracy</h3>
                                        <div className="space-y-2 mt-4">
                                            <p className="font-mono text-[13px] text-[#4B5563]"><span className="text-[#111827] font-bold">Best prediction:</span> 99.1% (last Tuesday)</p>
                                            <p className="font-mono text-[13px] text-[#4B5563]"><span className="text-[#111827] font-bold">Biggest miss:</span> 78% (Holi 2024)</p>
                                            <p className="font-mono text-[13px] text-[#4B5563]"><span className="text-[#111827] font-bold">Days tracked:</span> 14</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </main>
        </div>
    );
}
