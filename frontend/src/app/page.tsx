'use client';

import Link from "next/link";
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Bot, FileText, Zap, Share2, Users, ArrowRight, Sparkles, ChevronDown, Globe } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans">
        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white">R</div>
                    <span className="font-bold text-xl tracking-tight">ReadSum</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
                    <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Log in</Link>
                    <Link href="/register" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>

        {/* Hero Section */}
        <div className="relative pt-32 pb-20 overflow-hidden">
             {/* Background Effects */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
             <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

             <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                 <div className="text-left animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-6">
                            <Sparkles className="h-3 w-3" />
                            <span>We just released Gemini 3.0 Support!</span>
                            <ArrowRight className="h-3 w-3" />
                        </div>
                        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">ReadSum</span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-zinc-400 mb-8 max-w-lg leading-relaxed">
                            Turn anything into notes, flashcards, quizzes, and more. 
                            <br className="hidden sm:block"/>
                            The last study tool you'll ever need.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/register" className="h-12 px-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20 hover:scale-105 hover:shadow-purple-900/40">
                                <Zap className="h-4 w-4" />
                                Get Started - It's Free
                            </Link>
                        </div>
                        
                        <div className="mt-12 flex items-center gap-4 text-zinc-500 text-sm">
                            <div className="flex -space-x-2">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-[#050505] bg-zinc-800" />
                                ))}
                            </div>
                            <p>ReadSum is trusted by students at leading universities.</p>
                        </div>
                 </div>

                 {/* Hero Visual Mockup */}
                 <div className="relative animate-fade-in delay-200 mt-12 lg:mt-0">
                     <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-3xl transform rotate-3 scale-95" />
                     <SpotlightCard as="div" className="relative bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-lg mx-auto lg:ml-auto overflow-hidden group">
                        {/* Mock App Header */}
                        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                             <div className="flex items-center gap-3">
                                 <div className="h-3 w-3 rounded-full bg-red-500" />
                                 <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                 <div className="h-3 w-3 rounded-full bg-green-500" />
                             </div>
                             <div className="h-2 w-20 rounded-full bg-zinc-800" />
                        </div>

                        {/* Mock Content */}
                        <div className="space-y-4">
                             <div className="flex items-center gap-3 mb-6">
                                 <span className="text-2xl">🧬</span>
                                 <div>
                                     <h3 className="font-bold text-white">Lecture 5: Cellular Biology</h3>
                                     <p className="text-xs text-zinc-500">Last edited 2 mins ago</p>
                                 </div>
                             </div>

                             <div className="space-y-2 p-4 rounded-lg bg-white/5 border border-white/5">
                                 <h4 className="text-sm font-semibold text-purple-300">The Cell Theory</h4>
                                 <ul className="space-y-2 text-xs text-zinc-400 list-disc list-inside">
                                     <li>All living organisms are composed of one or more cells.</li>
                                     <li>The cell is the basic unit of life.</li>
                                     <li>All cells arise from pre-existing cells.</li>
                                 </ul>
                             </div>

                             <div className="grid grid-cols-2 gap-3 mt-4">
                                 <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex flex-col items-center gap-2 group-hover:bg-blue-500/20 transition-colors">
                                     <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <Bot className="h-4 w-4 text-blue-400" />
                                     </div>
                                     <span className="text-xs font-medium text-blue-300">Generate Quiz</span>
                                 </div>
                                 <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex flex-col items-center gap-2 group-hover:bg-green-500/20 transition-colors">
                                     <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-green-400" />
                                     </div>
                                     <span className="text-xs font-medium text-green-300">Flashcards</span>
                                 </div>
                             </div>
                        </div>

                         {/* Floating Tag */}
                         <div className="absolute bottom-6 right-6 bg-[#050505] border border-white/10 px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 animate-bounce-slow">
                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                             <span className="text-xs font-medium">AI Sync Complete</span>
                         </div>
                     </SpotlightCard>
                 </div>
             </div>
        </div>

        {/* Logos Strip */}
        <div className="border-y border-white/5 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <p className="text-center text-sm font-medium text-zinc-500 mb-8">TRUSTED BY INNOVATORS AT</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 items-center">
                    {['Google', 'MIT', 'Stanford', 'Harvard', 'NASA', 'Microsoft'].map((logo) => (
                        <span key={logo} className="text-lg md:text-xl font-bold text-white/40 hover:text-white transition-colors cursor-default">{logo}</span>
                    ))}
                </div>
            </div>
        </div>

        {/* Bento Grid Features */}
        <section id="features" className="py-24 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-5xl font-bold mb-4">The last notetaker you'll ever need</h2>
                <p className="text-zinc-400 max-w-2xl mx-auto">ReadSum records live, edits, comments and collaborates like a real assistant.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr md:auto-rows-[300px]">
                {/* Feature 1: Large Span */}
                <SpotlightCard as="div" className="md:col-span-2 row-span-1 border border-white/10 bg-[#0a0a0a] rounded-2xl p-8 flex flex-col justify-between overflow-hidden group min-h-[300px]">
                     <div className="relative z-10">
                         <h3 className="text-2xl font-bold mb-2">Turn anything into an editable note.</h3>
                         <p className="text-zinc-400">Transform PDFs, videos, and audio into notes you can edit and share.</p>
                     </div>
                     <div className="absolute right-0 bottom-0 w-2/3 h-2/3 bg-gradient-to-t from-purple-900/20 to-transparent opacity-50 block" />
                     {/* Abstract Visual */}
                     <div className="absolute bottom-4 right-4 w-64 h-32 bg-white/5 rounded-lg border border-white/10 p-4 space-y-2 transform translate-y-8 translate-x-8 group-hover:translate-y-6 group-hover:translate-x-6 transition-transform">
                          <div className="h-2 w-1/3 bg-purple-500/50 rounded-full" />
                          <div className="h-2 w-full bg-white/10 rounded-full" />
                          <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                          <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                     </div>
                </SpotlightCard>

                {/* Feature 2: Tall */}
                <SpotlightCard as="div" className="md:col-span-1 row-span-1 md:row-span-2 border border-white/10 bg-[#0a0a0a] rounded-2xl p-8 flex flex-col overflow-hidden group min-h-[300px]">
                    <div className="relative z-10 space-y-4">
                         <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                             <Users className="h-6 w-6 text-blue-400" />
                         </div>
                         <div>
                            <h3 className="text-xl font-bold mb-2">Live collaboration</h3>
                            <p className="text-zinc-400 text-sm">Active works alongside you — editing your doc, highlighting issues.</p>
                         </div>
                    </div>
                    {/* Chat Mockup */}
                    <div className="mt-8 space-y-3 relative">
                        <div className="bg-white/5 p-3 rounded-lg rounded-tl-none border border-white/10 ml-4">
                            <p className="text-xs text-zinc-300">Be more specific, which markets?</p>
                        </div>
                        <div className="bg-blue-600/20 p-3 rounded-lg rounded-tr-none border border-blue-500/20 mr-4 text-right">
                            <p className="text-xs text-blue-200">The European Fintech sector.</p>
                        </div>
                    </div>
                </SpotlightCard>

                {/* Feature 3: Standard */}
                <SpotlightCard as="div" className="md:col-span-1 row-span-1 border border-white/10 bg-[#0a0a0a] rounded-2xl p-8 flex flex-col justify-between group min-h-[300px]">
                     <div>
                        <h3 className="text-xl font-bold mb-2">Study smarter.</h3>
                        <p className="text-zinc-400 text-sm">Generate quizzes, podcasts, flashcards from your notes.</p>
                     </div>
                     <div className="mt-4 bg-white/5 rounded-lg p-3 border border-white/10 group-hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-medium text-zinc-300">Quiz Progress</span>
                             <span className="text-xs font-bold text-green-400">85%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full bg-green-500 w-[85%] rounded-full" />
                        </div>
                     </div>
                </SpotlightCard>

                {/* Feature 4: Standard */}
                <SpotlightCard as="div" className="md:col-span-1 row-span-1 border border-white/10 bg-[#0a0a0a] rounded-2xl p-8 flex flex-col justify-between group min-h-[300px]">
                     <div>
                        <h3 className="text-xl font-bold mb-2">Always synced.</h3>
                        <p className="text-zinc-400 text-sm">ReadSum works on the web and mobile. Desktop app coming next!</p>
                     </div>
                     <div className="mt-4 flex justify-center">
                         <Globe className="h-16 w-16 text-zinc-700 group-hover:text-purple-500 transition-colors duration-500" />
                     </div>
                </SpotlightCard>
            </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-white/[0.02] border-y border-white/5">
             <div className="max-w-7xl mx-auto px-6">
                 <div className="text-center mb-16">
                     <h2 className="text-3xl sm:text-5xl font-bold mb-4">How It Works - It's Simple.</h2>
                     <p className="text-zinc-400">Transform any PDF, YouTube video, or audio into beautiful notes.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                     {[
                         { icon: Share2, title: "1. Upload Content", desc: "Record live or upload PDFs, videos, files." },
                         { icon: Bot, title: "2. Let AI Process", desc: "Our AI transcribes and analyzes your content instantly." },
                         { icon: FileText, title: "3. Get Materials", desc: "Receive comprehensive notes, flashcards, and quizzes." },
                         { icon: Zap, title: "4. Study & Succeed", desc: "Access materials anywhere, share and ace your exams." }
                     ].map((step, i) => (
                         <div key={i} className="flex flex-col items-center text-center p-4">
                             <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-purple-400 shadow-lg shadow-purple-500/10">
                                 <step.icon className="h-8 w-8" />
                             </div>
                             <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                             <p className="text-sm text-zinc-400">{step.desc}</p>
                         </div>
                     ))}
                 </div>

                 {/* Stats */}
                 <div className="mt-20 flex flex-wrap justify-center gap-16 border-t border-white/10 pt-12">
                      <div className="text-center">
                          <div className="text-4xl font-bold text-white mb-1">5M+</div>
                          <div className="text-sm text-zinc-500">Active Students</div>
                      </div>
                      <div className="text-center">
                          <div className="text-4xl font-bold text-white mb-1">99%</div>
                          <div className="text-sm text-zinc-500">Accuracy Rate</div>
                      </div>
                      <div className="text-center">
                          <div className="text-4xl font-bold text-white mb-1">30s</div>
                          <div className="text-sm text-zinc-500">Processing Time</div>
                      </div>
                 </div>
             </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 max-w-4xl mx-auto px-6">
            <h2 className="text-3xl sm:text-5xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {[
                    "What happened to ReadSum? Why the change?",
                    "How do I record lectures and turn them into notes?",
                    "Can I convert my PDF textbooks into study materials?",
                    "Is ReadSum AI free to use?",
                    "Can I create flashcards from YouTube videos?"
                ].map((q, i) => (
                    <div key={i} className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
                        <button 
                            onClick={() => toggleFaq(i)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                        >
                            <span className="font-medium text-lg">{q}</span>
                            <ChevronDown className={`h-5 w-5 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                        </button>
                        {activeFaq === i && (
                            <div className="px-6 py-6 text-zinc-400 animate-slide-down leading-relaxed">
                                ReadSum is constantly evolving. We've updated our core AI engine to provide even better summaries using Gemini 2.0 Flash. Yes, you can do all those things and more with our new updated platform.
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[#050505] py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-xs text-white">R</div>
                    <span className="font-bold tracking-tight">ReadSum</span>
                </div>
                <div className="flex gap-8 text-sm text-zinc-500">
                    <a href="#" className="hover:text-white">Privacy</a>
                    <a href="#" className="hover:text-white">Terms</a>
                    <a href="#" className="hover:text-white">Twitter</a>
                </div>
                <div className="text-sm text-zinc-600">
                    © 2026 ReadSum LLC. All rights reserved.
                </div>
            </div>
        </footer>
    </div>
  );
}

