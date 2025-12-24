
import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Expense, Language, TRANSLATIONS } from '../types';
import { TrendingUp, PieChart as PieIcon, List } from 'lucide-react';

interface AnalyticsBlockProps {
  expenses: Expense[];
  lang: Language;
}

export const AnalyticsBlock: React.FC<AnalyticsBlockProps> = ({ expenses, lang }) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'trend' | 'pie' | 'table'>('trend');

  const trendData = useMemo(() => {
    const map: Record<string, { date: string; income: number; expense: number }> = {};
    const sorted = [...expenses].sort((a, b) => a.timestamp - b.timestamp);
    
    sorted.forEach(e => {
      if (!map[e.date]) {
        map[e.date] = { date: e.date.split('-').slice(1).join('/'), income: 0, expense: 0 };
      }
      if (e.type === 'INCOME') map[e.date].income += e.amount;
      else map[e.date].expense += e.amount;
    });
    
    return Object.values(map).slice(-15); // Show last 15 days
  }, [expenses]);

  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.filter(e => e.type === 'EXPENSE').forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const tableData = useMemo(() => {
    const map: Record<string, { category: string; count: number; income: number; expense: number }> = {};
    expenses.forEach(e => {
      if (!map[e.category]) map[e.category] = { category: e.category, count: 0, income: 0, expense: 0 };
      map[e.category].count++;
      if (e.type === 'INCOME') map[e.category].income += e.amount;
      else map[e.category].expense += e.amount;
    });
    return Object.values(map).sort((a, b) => (b.income + b.expense) - (a.income + a.expense));
  }, [expenses]);

  const COLORS = ['#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6', '#3b82f6', '#ef4444'];

  return (
    <div className="border border-black bg-white h-full flex flex-col relative group">
      {/* Header Tabs */}
      <div className="flex border-b border-black">
        <button
          onClick={() => setActiveTab('trend')}
          className={`flex-1 p-2 text-[10px] font-bold flex items-center justify-center gap-1 border-r border-black hover:bg-gray-50 ${activeTab === 'trend' ? 'bg-black text-white' : ''}`}
        >
          <TrendingUp size={12} /> {t.analytics.trend}
        </button>
        <button
          onClick={() => setActiveTab('pie')}
          className={`flex-1 p-2 text-[10px] font-bold flex items-center justify-center gap-1 border-r border-black hover:bg-gray-50 ${activeTab === 'pie' ? 'bg-black text-white' : ''}`}
        >
          <PieIcon size={12} /> {t.analytics.distribution}
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={`flex-1 p-2 text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-gray-50 ${activeTab === 'table' ? 'bg-black text-white' : ''}`}
        >
          <List size={12} /> {t.analytics.table}
        </button>
      </div>

      <div className="flex-1 p-4 min-h-0 overflow-auto">
        {expenses.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-300 text-[10px] font-mono uppercase italic">
            Waiting for data archival...
          </div>
        ) : (
          <>
            {activeTab === 'trend' && (
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{fontSize: 10}} stroke="#000" />
                    <YAxis tick={{fontSize: 10}} stroke="#000" />
                    <Tooltip contentStyle={{fontSize: '10px', borderRadius: '0', border: '1px solid black'}} />
                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={{r: 2}} activeDot={{r: 4}} />
                    <Line type="monotone" dataKey="expense" stroke="#f59e0b" strokeWidth={2} dot={{r: 2}} activeDot={{r: 4}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'pie' && (
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{fontSize: '10px', borderRadius: '0', border: '1px solid black'}} />
                    <Legend iconSize={8} wrapperStyle={{fontSize: '9px', paddingTop: '10px'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'table' && (
              <table className="w-full text-left border-collapse font-mono text-[10px]">
                <thead>
                  <tr className="border-b border-black">
                    <th className="py-2">{t.analytics.category}</th>
                    <th className="py-2 text-right">{t.analytics.count}</th>
                    <th className="py-2 text-right">{t.analytics.sum}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 font-bold uppercase">{row.category}</td>
                      <td className="py-2 text-right">{row.count}</td>
                      <td className="py-2 text-right font-bold">
                        {row.income > 0 && <span className="text-emerald-600">+{row.income.toFixed(0)}</span>}
                        {row.income > 0 && row.expense > 0 && <span className="mx-1">/</span>}
                        {row.expense > 0 && <span className="text-orange-600">-{row.expense.toFixed(0)}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      <div className="absolute top-2 right-2 text-[8px] text-gray-200 font-mono select-none pointer-events-none uppercase">
        REPORT_MODULE_v1
      </div>
    </div>
  );
};
