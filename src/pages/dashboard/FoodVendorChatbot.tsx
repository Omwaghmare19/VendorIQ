import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { model } from '../../gemini'; // Adjust path if necessary depending on location

// Shared animation variants
const fadeVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
};

const slideUpVariant = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function FoodVendorChatbot() {
    const navigate = useNavigate();

    // Context Data
    const businessName = localStorage.getItem('businessName') || 'Ramesh Panipuri';
    const userName = localStorage.getItem('userName') || 'Ramesh';

    // State
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; timestamp: Date }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial message load
    useEffect(() => {
        setMessages([
            { role: 'user', text: "It's going to rain heavily tomorrow. Should I prepare less?", timestamp: new Date(Date.now() - 600000) },
            { role: 'ai', text: "Yes — on heavy rain days your sales average 285 units vs your usual 380. I'd recommend preparing 290–300 tomorrow. Also keep your setup covered and have a tarp ready. Rain usually peaks in your area between 3–6 PM, so the morning session should be fine.", timestamp: new Date(Date.now() - 500000) },
            { role: 'user', text: "What about the weekend after? Holi is coming.", timestamp: new Date(Date.now() - 300000) },
            { role: 'ai', text: "Holi (Mar 25) is 19 days away and your biggest opportunity this season. Based on last year's festival patterns, I recommend preparing 620–640 units that day. Stock up on extra sweet pani ingredients 3 days before — sugar, black salt, and jeera tend to go short in local markets right before Holi.", timestamp: new Date(Date.now() - 100000) },
        ]);
    }, []);

    // Scroll to bottom whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const suggestedPrompts = [
        "How many units should I prepare for Holi?",
        "My sales dropped this week, why?",
        "Should I raise my price during IPL?",
        "How do I reduce my waste further?",
        "What should I stock extra for summer?",
        "Is Saturday or Sunday better for me?",
        "How can I get more repeat customers?",
        "Should I start pre-orders on WhatsApp?"
    ];

    const generateResponse = async (userText: string) => {
        const sysPrompt = `You are VendorIQ's AI business advisor, specialized for food vendors in India. 
Business name: ${businessName} from localStorage. 
Vendor name: ${userName} from localStorage.
Today's forecast: 380 units. Weather: 34°C, clear. City: Mumbai.
Upcoming festival: Holi in 19 days.
Recent sales: Mon 310, Tue 340, Wed 420, Thu 365, Fri 380.
Waste trend: down 87% over 14 days.
Give short, practical, specific advice. Use simple English — the vendor may not be highly educated. Never be vague. Always give a specific number or action.\n`;

        const historyText = messages.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.text}\n`).join('');
        const fullPrompt = `${sysPrompt}\n${historyText}User: ${userText}\nAI:`;

        try {
            const result = await model.generateContent(fullPrompt);
            return result.response.text();
        } catch (error) {
            console.error("Gemini AI API Error:", error);
            return "Sorry, I couldn't connect right now. Please try again.";
        }
    };

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isTyping) return;

        const newMsg = { role: 'user' as const, text, timestamp: new Date() };
        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
        setIsTyping(true);

        const aiResponseText = await generateResponse(text);

        const aiMsg = { role: 'ai' as const, text: aiResponseText, timestamp: new Date() };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div className="flex h-screen w-full bg-[#FAFAFA] text-[#111827] overflow-hidden font-sans">

            {/* Sidebar (Same as dashboard for seamless nav) */}
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
                    <button
                        onClick={() => navigate('/dashboard/food')}
                        className="flex flex-col items-center justify-center rounded-xl p-3 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] md:flex-row md:justify-start md:gap-3 md:p-3"
                    >
                        <svg className="h-5 w-5 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        <span className="mt-1 text-[10px] font-medium md:mt-0 md:text-sm">Home</span>
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/forecasting')}
                        className="flex flex-col items-center justify-center rounded-xl p-3 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] md:flex-row md:justify-start md:gap-3 md:p-3"
                    >
                        <svg className="h-5 w-5 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <span className="mt-1 text-[10px] font-medium md:mt-0 md:text-sm">Forecasting</span>
                    </button>
                    <button
                        className="flex flex-col items-center justify-center rounded-xl bg-[#FFF9F6] p-3 text-[#FF6B2B] md:flex-row md:justify-start md:gap-3 md:p-3"
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
            </aside>

            {/* Main Editor View */}
            <main className="flex-1 flex flex-col h-full overflow-hidden pb-20 md:pb-0 relative">

                {/* Header (Top) */}
                <header className="px-6 py-8 md:px-10 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-semibold tracking-tight" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                                AI Assistant
                            </h1>
                            <p className="mt-1 text-base text-[#6B7280]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                Powered by Gemini &middot; Knows your business, your sales, your city.
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
                            </span>
                            <span className="font-mono text-xs text-[#4B5563]">Online</span>
                        </div>
                    </div>
                </header>

                {/* Two Columns Grid */}
                <div className="flex-1 flex flex-col lg:flex-row gap-6 px-6 md:px-10 pb-6 overflow-hidden">

                    {/* LEFT — CHAT INTERFACE (65%) */}
                    <motion.section
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex-[0.65] flex flex-col bg-white rounded-[20px] shadow-sm border border-[#E5E5E5] overflow-hidden"
                    >
                        {/* Top Bar of Chat */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5] bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B2B] text-white">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.625 21.055L9.67 15.657a2.128 2.128 0 00-1.328-1.328L2.945 12.375a.669.669 0 010-1.261l5.397-1.954a2.128 2.128 0 001.328-1.328l1.954-5.397a.669.669 0 011.261 0l1.954 5.397a2.128 2.128 0 001.328 1.328l5.397 1.954a.669.669 0 010 1.261l-5.397 1.954a2.128 2.128 0 00-1.328 1.328l-1.954 5.397a.669.669 0 01-1.261 0z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-bold" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>VendorIQ AI</h3>
                                    <p className="font-mono text-[12px] text-[#6B7280]">Specialist for food vendors &middot; India</p>
                                </div>
                            </div>
                            <button onClick={clearChat} className="text-xs font-medium text-[#6B7280] hover:text-[#FF6B2B] transition-colors bg-[#F3F4F6] px-3 py-1.5 rounded-md hover:bg-[#FFF9F6]">
                                Clear Chat
                            </button>
                        </div>

                        {/* Middle: Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#FAFAFA] flex flex-col gap-6">

                            {messages.length === 0 && (
                                <motion.div variants={fadeVariant} initial="hidden" animate="visible" className="my-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                                        {suggestedPrompts.map((prompt, i) => {
                                            const colors = ['bg-[#FF6B2B]', 'bg-[#10B981]', 'bg-[#3B82F6]', 'bg-[#8B5CF6]'];
                                            const colorClass = colors[i % colors.length];
                                            return (
                                                <motion.button
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05, duration: 0.3 }}
                                                    whileHover={{ y: -2 }}
                                                    onClick={() => handleSendMessage(prompt)}
                                                    className="flex items-start gap-3 bg-white border border-[#E5E5E5] rounded-[10px] p-3 md:p-4 text-left hover:border-[#FF6B2B] hover:bg-[#FFF9F6] transition-all shadow-sm"
                                                >
                                                    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${colorClass}`} />
                                                    <span className="text-[13px] md:text-[14px] font-medium leading-snug text-[#374151]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{prompt}</span>
                                                </motion.button>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    variants={slideUpVariant}
                                    initial="hidden"
                                    animate="visible"
                                    className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start gap-3'}`}
                                >
                                    {m.role === 'ai' && (
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF6B2B] text-white">
                                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.625 21.055L9.67 15.657a2.128 2.128 0 00-1.328-1.328L2.945 12.375a.669.669 0 010-1.261l5.397-1.954a2.128 2.128 0 001.328-1.328l1.954-5.397a.669.669 0 011.261 0l1.954 5.397a2.128 2.128 0 001.328 1.328l5.397 1.954a.669.669 0 010 1.261l-5.397 1.954a2.128 2.128 0 00-1.328 1.328l-1.954 5.397a.669.669 0 01-1.261 0z" /></svg>
                                        </div>
                                    )}
                                    <div className="flex flex-col max-w-[80%] md:max-w-[75%] gap-1">
                                        <div
                                            className={`text-[14px] leading-relaxed p-4 ${m.role === 'user'
                                                ? `bg-[#FF6B2B] text-white rounded-[18px_18px_4px_18px]`
                                                : `bg-white text-[#111827] border border-[#E5E5E5] shadow-sm rounded-[18px_18px_18px_4px] ${m.text.includes("Sorry, I couldn't connect") ? 'border-red-400' : ''}`
                                                }`}
                                            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                                        >
                                            {m.text}
                                        </div>
                                        <span className={`font-mono text-[10px] text-[#9CA3AF] ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                                            {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div variants={slideUpVariant} initial="hidden" animate="visible" className="flex w-full justify-start gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF6B2B] text-white">
                                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.625 21.055L9.67 15.657a2.128 2.128 0 00-1.328-1.328L2.945 12.375a.669.669 0 010-1.261l5.397-1.954a2.128 2.128 0 001.328-1.328l1.954-5.397a.669.669 0 011.261 0l1.954 5.397a2.128 2.128 0 001.328 1.328l5.397 1.954a.669.669 0 010 1.261l-5.397 1.954a2.128 2.128 0 00-1.328 1.328l-1.954 5.397a.669.669 0 01-1.261 0z" /></svg>
                                    </div>
                                    <div className="flex items-center bg-white border border-[#E5E5E5] shadow-sm rounded-[18px_18px_18px_4px] py-4 px-5">
                                        <div className="flex gap-1.5 align-middle">
                                            {[0, 1, 2].map((dot) => (
                                                <motion.div
                                                    key={dot}
                                                    className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full"
                                                    animate={{ y: [0, -4, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15, ease: 'easeInOut' }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} className="h-2" />
                        </div>

                        {/* Bottom Input Area */}
                        <div className="border-t border-[#E5E5E5] bg-white p-4 shrink-0 flex flex-col gap-2">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
                                className="flex gap-3 items-center"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask anything about your business..."
                                    className="flex-1 rounded-xl h-12 bg-[#F9FAFB] border border-[#D1D5DB] px-4 text-[15px] outline-none transition-colors focus:border-[#FF6B2B] focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/30"
                                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                                />
                                <motion.button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex shrink-0 h-12 w-12 items-center justify-center rounded-full bg-[#FF6B2B] text-white disabled:opacity-50 shadow-sm"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </motion.button>
                            </form>
                            <p className="font-mono text-[10px] text-center text-[#9CA3AF]">
                                Gemini AI &middot; Responses based on your sales data and local context
                            </p>
                        </div>
                    </motion.section>

                    {/* RIGHT — CONTEXT PANEL (35%) */}
                    <motion.section
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="flex-[0.35] flex flex-col bg-white rounded-[20px] shadow-sm border border-[#E5E5E5] overflow-y-auto custom-scrollbar"
                    >
                        {/* Section 1: Business Snapshot */}
                        <div className="p-6">
                            <h4 className="font-mono text-[11px] font-semibold text-[#FF6B2B] uppercase tracking-wider mb-1">What the AI knows about you</h4>
                            <h2 className="text-[18px] font-semibold mb-6" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Your Context</h2>

                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-3">
                                    <span className="font-mono text-[11px] text-[#6B7280]">Business</span>
                                    <span className="text-[14px] font-bold text-[#111827]">{businessName}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-3">
                                    <span className="font-mono text-[11px] text-[#6B7280]">Today's Forecast</span>
                                    <span className="text-[14px] font-bold text-[#111827]">380 units</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-3">
                                    <span className="font-mono text-[11px] text-[#6B7280]">Weather</span>
                                    <span className="text-[14px] font-bold text-[#111827]">34°C &middot; Clear</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-3">
                                    <span className="font-mono text-[11px] text-[#6B7280]">Next Festival</span>
                                    <span className="text-[14px] font-bold text-[#111827]">Holi (Mar 25)</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-mono text-[11px] text-[#6B7280]">Waste Trend</span>
                                    <span className="text-[14px] font-bold text-[#10B981]">&darr; 87% this month</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Quick Actions */}
                        <div className="px-6 py-5 border-t border-[#F0F0F0] bg-[#FAFAFA]">
                            <h4 className="font-mono text-[11px] font-semibold text-[#FF6B2B] uppercase tracking-wider mb-4">Quick Actions</h4>
                            <div className="flex flex-col gap-3">
                                {[
                                    "Ask about this week's forecast",
                                    "Get festival prep advice",
                                    "Review my waste pattern"
                                ].map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInputValue(`${q} →`)}
                                        className="h-11 w-full bg-white border border-[#D1D5DB] rounded-[10px] text-[13px] font-medium text-[#374151] hover:border-[#FF6B2B] hover:text-[#FF6B2B] shadow-sm transition-colors text-left px-4 flex justify-between items-center"
                                        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                                    >
                                        {q}
                                        <svg className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section 3: Conversation Topics */}
                        <div className="px-6 py-5 border-t border-[#F0F0F0]">
                            <h4 className="font-mono text-[11px] font-semibold text-[#FF6B2B] uppercase tracking-wider mb-4">You've asked about</h4>
                            <div className="flex flex-wrap gap-2">
                                {/* TODO: Pull these dynamically from previous chat history once persistence is built */}
                                {["Holi prep", "Rain impact", "Weekend sales", "Pricing", "WhatsApp orders"].map((tag, i) => (
                                    <span key={i} className="bg-[#F3F4F6] text-[#4B5563] text-[12px] font-medium px-3 py-1.5 rounded-full" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Section 4: Tip of the day */}
                        <div className="mt-auto px-6 py-6 border-t border-[#F0F0F0]">
                            <div className="relative border-l-4 border-[#FF6B2B] bg-[#FFF9F6] p-4 rounded-r-xl">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-mono text-[10px] font-semibold text-[#FF6B2B]">TODAY'S TIP</span>
                                    <button className="text-[#9CA3AF] hover:text-[#4B5563]">
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    </button>
                                </div>
                                <p className="text-[14px] leading-snug text-[#0D0D0D]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                    Fridays with clear weather are your highest-earning days. Today is one — make sure you don't run short after 6 PM.
                                </p>
                            </div>
                        </div>
                    </motion.section>

                </div>
            </main>
        </div>
    );
}
