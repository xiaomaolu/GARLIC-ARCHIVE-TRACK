
import React, { useState, useEffect } from 'react';
import { Expense, AiParseResponse, Language, TRANSLATIONS, TransactionType } from './types';
import { InputBlock } from './components/InputBlock';
import { ChartBlock } from './components/ChartBlock';
import { AnalyticsBlock } from './components/AnalyticsBlock';
import { ExpenseCard } from './components/ExpenseCard';
import { Circle, Plus, Globe, BarChart3, Database, Activity } from 'lucide-react';

type NavView = 'ARCHIVE' | 'METRICS';

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [filter, setFilter] = useState<'ALL' | TransactionType>('ALL');
  const [currentNav, setCurrentNav] = useState<NavView>('ARCHIVE');
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const saved = localStorage.getItem('garlic_expenses');
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load expenses", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('garlic_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (data: AiParseResponse) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      ...data,
      timestamp: Date.now(),
      isAiGenerated: true,
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const filteredExpenses = expenses.filter(exp => {
      if (filter === 'ALL') return true;
      return exp.type === filter;
  });

  const toggleLang = () => {
      setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-12 font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end border-b-2 border-black pb-6 gap-6 animate-fade-in-up">
        <div>
          <h1 className="text-5xl font-black tracking-[calc(-0.05em)] leading-none mb-2 hover:scale-[1.01] transition-transform origin-left cursor-default">{t.title}</h1>
          <div className="flex items-center gap-3">
             <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em] font-bold">{t.subtitle}</p>
             <div className="h-[2px] w-8 bg-black/10"></div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
            <button 
                onClick={toggleLang}
                className="flex items-center gap-2 text-[10px] font-black border-2 border-black px-4 py-1.5 hover:bg-black hover:text-white transition-all active:scale-95 uppercase font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-[-2px] active:translate-y-[0px]"
            >
                <Globe size={12} />
                {lang === 'en' ? 'LOCALE:ZH' : 'LOCALE:EN'}
            </button>

            <div className="flex gap-6 text-[10px] font-mono">
                <div className="flex items-center gap-2 text-emerald-600 font-black">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> 
                    <span>{t.online}</span>
                </div>
                <div className="text-gray-300 font-bold border-l border-gray-100 pl-4">
                    INDEX_SIZE: {expenses.length.toString().padStart(4, '0')}
                </div>
            </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <nav className="flex gap-2 mb-10 animate-fade-in-up stagger-1">
          <button 
            onClick={() => setCurrentNav('ARCHIVE')}
            className={`flex-1 md:flex-none md:min-w-[180px] flex items-center justify-center gap-3 py-4 border-2 border-black font-black uppercase text-xs transition-all tracking-widest
                ${currentNav === 'ARCHIVE' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 hover:translate-y-[-2px]'}`}
          >
            <Database size={14} strokeWidth={3} /> {t.navArchive}
          </button>
          <button 
            onClick={() => setCurrentNav('METRICS')}
            className={`flex-1 md:flex-none md:min-w-[180px] flex items-center justify-center gap-3 py-4 border-2 border-black font-black uppercase text-xs transition-all tracking-widest
                ${currentNav === 'METRICS' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 hover:translate-y-[-2px]'}`}
          >
            <BarChart3 size={14} strokeWidth={3} /> {t.navMetrics}
          </button>
      </nav>

      {/* Content Area */}
      <main className="min-h-[60vh]">
          {currentNav === 'ARCHIVE' ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Input Panel */}
              <div className="lg:col-span-1 h-fit sticky top-12 animate-fade-in-up stagger-2">
                <InputBlock onAddExpense={addExpense} lang={lang} />
                
                <div className="mt-12 bg-gray-50/50 p-4 border border-black/5">
                    <div className="text-[9px] font-mono text-gray-400 uppercase mb-4 tracking-[0.2em] font-black">Filter_Index_v2</div>
                    <div className="flex flex-col gap-1.5">
                        {(['ALL', 'INCOME', 'EXPENSE'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`text-[10px] font-black py-3 px-4 border-2 transition-all uppercase tracking-widest text-left
                                    ${filter === f 
                                        ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(16,185,129,1)]' 
                                        : 'bg-white border-transparent hover:border-black text-gray-400 hover:text-black'
                                    }`}
                            >
                                {t.filters[f.toLowerCase() as keyof typeof t.filters]}
                            </button>
                        ))}
                    </div>
                </div>
              </div>

              {/* List Panel */}
              <div className="lg:col-span-3 animate-fade-in-up stagger-3">
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min">
                    {filteredExpenses.map((expense, idx) => (
                        <ExpenseCard 
                            key={expense.id}
                            expense={expense} 
                            onUpdate={updateExpense} 
                            onDelete={deleteExpense}
                            lang={lang}
                        />
                    ))}
                    
                    {expenses.length === 0 && (
                        <div className="col-span-full border-2 border-dashed border-gray-100 p-24 flex flex-col items-center justify-center text-gray-300 gap-6 opacity-60">
                            <Plus size={64} strokeWidth={0.5} className="animate-pulse-slow" />
                            <div className="text-center">
                                <div className="font-black text-xs uppercase tracking-[0.4em] mb-2">{t.noData}</div>
                                <div className="text-[9px] font-mono bg-gray-50 px-3 py-1">{t.noDataSub}</div>
                            </div>
                        </div>
                    )}
                 </div>
              </div>
            </div>
          ) : (
            /* Metrics View */
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in-up stagger-2">
               <div className="xl:col-span-2 min-h-[450px]">
                  <ChartBlock expenses={expenses} lang={lang} />
               </div>
               <div className="xl:col-span-1 min-h-[450px]">
                  <AnalyticsBlock expenses={expenses} lang={lang} />
               </div>
               
               <div className="col-span-full border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] grid grid-cols-2 md:grid-cols-4 gap-12 font-mono relative overflow-hidden group">
                    <Activity size={100} className="absolute -right-8 -bottom-8 text-black/[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                    <div>
                        <div className="text-[10px] text-gray-400 font-black uppercase mb-3 tracking-widest border-b border-gray-100 pb-1">AVG_DAILY</div>
                        <div className="text-3xl font-black tracking-tighter">
                            {(expenses.filter(e => e.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0) / Math.max(1, new Set(expenses.map(e => e.date)).size)).toFixed(1)}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-400 font-black uppercase mb-3 tracking-widest border-b border-gray-100 pb-1">PEAK_FLOW</div>
                        <div className="text-3xl font-black tracking-tighter">
                            {Math.max(0, ...expenses.map(e => e.amount)).toFixed(0)}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-400 font-black uppercase mb-3 tracking-widest border-b border-gray-100 pb-1">POS_FREQ</div>
                        <div className="text-3xl font-black tracking-tighter text-emerald-600">
                            {((expenses.filter(e => e.type === 'INCOME').length / Math.max(1, expenses.length)) * 100).toFixed(0)}%
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-400 font-black uppercase mb-3 tracking-widest border-b border-gray-100 pb-1">DATA_CYCLES</div>
                        <div className="text-3xl font-black tracking-tighter">
                            {new Set(expenses.map(e => e.date)).size.toString().padStart(3, '0')}
                        </div>
                    </div>
               </div>
            </div>
          )}
      </main>
      
      {/* Footer */}
      <footer className="mt-32 border-t-2 border-black pt-8 flex flex-col md:flex-row justify-between items-center text-[9px] text-gray-400 uppercase font-mono gap-6 tracking-[0.2em] font-bold">
         <div className="flex items-center gap-6">
            <span className="text-black">{t.designedBy}</span>
            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
            <span>STABLE_BUILD:1.2.05</span>
         </div>
         <div className="flex items-center gap-8 opacity-40">
            <span>STORAGE_SIG:ONLINE_LOCAL</span>
            <span>(C) {new Date().getFullYear()} CORE_ARCHIVE</span>
         </div>
      </footer>
    </div>
  );
}
