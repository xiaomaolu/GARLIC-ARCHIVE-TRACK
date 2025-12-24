
import React, { useMemo, useState } from 'react';
import { Expense, Language, TRANSLATIONS, ViewMode, YearGranularity } from '../types';

interface ChartBlockProps {
  expenses: Expense[];
  lang: Language;
}

export const ChartBlock: React.FC<ChartBlockProps> = ({ expenses, lang }) => {
  const t = TRANSLATIONS[lang];
  const [viewMode, setViewMode] = useState<ViewMode>('MONTH');
  const [yearGranularity, setYearGranularity] = useState<YearGranularity>('BY_WEEK');

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Helper to get all days in a year for the "By Week" view
  const getDaysOfYear = (year: number) => {
    const dates = [];
    const date = new Date(year, 0, 1);
    while (date.getFullYear() === year) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const gridData = useMemo(() => {
    const dataMap = new Map<string, number>();
    
    // Aggregate all expenses into a day-string map
    expenses.forEach(exp => {
      const valToAdd = exp.type === 'INCOME' ? exp.amount : -exp.amount;
      dataMap.set(exp.date, (dataMap.get(exp.date) || 0) + valToAdd);
    });

    if (viewMode === 'WEEK') {
      const startOfWeek = new Date(now);
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
      startOfWeek.setDate(diff);
      
      return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        const key = d.toISOString().split('T')[0];
        return { key, value: dataMap.get(key) || 0, label: d.getDate().toString() };
      });
    }

    if (viewMode === 'MONTH') {
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      const days = [];
      
      // Add empty padding for the first week
      const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
      for (let i = 0; i < startPadding; i++) {
        days.push({ key: `pad-${i}`, value: 0, isPadding: true });
      }

      for (let i = 1; i <= lastDay.getDate(); i++) {
        const d = new Date(currentYear, currentMonth, i);
        const key = d.toISOString().split('T')[0];
        days.push({ key, value: dataMap.get(key) || 0, label: i.toString() });
      }
      return days;
    }

    if (viewMode === 'YEAR') {
      if (yearGranularity === 'BY_MONTH') {
        const months = [];
        for (let i = 0; i < 12; i++) {
          let monthSum = 0;
          expenses.forEach(exp => {
            const d = new Date(exp.date);
            if (d.getFullYear() === currentYear && d.getMonth() === i) {
              monthSum += exp.type === 'INCOME' ? exp.amount : -exp.amount;
            }
          });
          months.push({ key: `${currentYear}-${i}`, value: monthSum, label: (i + 1).toString() });
        }
        return months;
      } else {
        // BY_WEEK: The "GitHub" view (Columns are weeks, Rows are days of week)
        const daysOfYear = getDaysOfYear(currentYear);
        return daysOfYear.map(d => {
          const key = d.toISOString().split('T')[0];
          return { key, value: dataMap.get(key) || 0, dayOfWeek: d.getDay() };
        });
      }
    }
    return [];
  }, [expenses, viewMode, yearGranularity]);

  // Color normalization
  const maxAbs = useMemo(() => {
    const values = gridData.map(d => Math.abs(d.value));
    return Math.max(...values, 100); // Minimum scale of 100
  }, [gridData]);

  const getCellColor = (val: number, isPadding?: boolean) => {
    if (isPadding) return 'bg-transparent border-transparent';
    if (val === 0) return 'bg-gray-50 border-gray-100';
    
    const ratio = Math.abs(val) / maxAbs;
    
    if (val > 0) {
      // Emerald Green shades
      if (ratio < 0.25) return 'bg-emerald-100 border-emerald-200';
      if (ratio < 0.5) return 'bg-emerald-300 border-emerald-400';
      if (ratio < 0.75) return 'bg-emerald-500 border-emerald-600';
      return 'bg-emerald-700 border-black';
    } else {
      // Orange-Yellow shades
      if (ratio < 0.25) return 'bg-orange-100 border-orange-200';
      if (ratio < 0.5) return 'bg-orange-300 border-orange-400';
      if (ratio < 0.75) return 'bg-amber-500 border-amber-600';
      return 'bg-orange-600 border-black';
    }
  };

  const totalBalance = useMemo(() => {
    return gridData.reduce((acc, curr) => acc + (curr.value || 0), 0);
  }, [gridData]);

  return (
    <div className="border border-black bg-white h-full flex flex-col relative p-5 select-none group">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">{t.totalBalance}</h3>
          <div className={`text-2xl font-bold tracking-tighter ${totalBalance >= 0 ? 'text-black' : 'text-orange-600'}`}>
             {totalBalance > 0 ? '+' : ''}{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
            <div className="flex border border-black text-[10px] font-bold">
              {(['WEEK', 'MONTH', 'YEAR'] as ViewMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`px-3 py-1.5 uppercase transition-colors ${viewMode === m ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'} ${m !== 'YEAR' ? 'border-r border-black' : ''}`}
                >
                  {t.views[m.toLowerCase() as keyof typeof t.views.week]}
                </button>
              ))}
            </div>
            {viewMode === 'YEAR' && (
               <div className="flex gap-2">
                  <button onClick={() => setYearGranularity('BY_MONTH')} className={`text-[9px] uppercase border-b ${yearGranularity === 'BY_MONTH' ? 'border-black font-black' : 'border-transparent text-gray-300'}`}>{t.views.byMonth}</button>
                  <button onClick={() => setYearGranularity('BY_WEEK')} className={`text-[9px] uppercase border-b ${yearGranularity === 'BY_WEEK' ? 'border-black font-black' : 'border-transparent text-gray-300'}`}>{t.views.byWeek}</button>
               </div>
            )}
        </div>
      </div>

      {/* Grid Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-2">
           <span className="text-[10px] font-mono text-gray-400 uppercase">{t.totalActivity}</span>
           <div className="flex items-center gap-1">
              <span className="text-[8px] text-gray-400">Less</span>
              <div className="w-2 h-2 bg-gray-50 border border-gray-100"></div>
              <div className="w-2 h-2 bg-orange-200"></div>
              <div className="w-2 h-2 bg-emerald-200"></div>
              <div className="w-2 h-2 bg-emerald-600"></div>
              <span className="text-[8px] text-gray-400">More</span>
           </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          {viewMode === 'YEAR' && yearGranularity === 'BY_WEEK' ? (
            /* Authentic GitHub Contribution Graph Layout (Columns = Weeks, Rows = Days) */
            <div 
              className="grid grid-flow-col gap-1 auto-cols-fr"
              style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}
            >
              {gridData.map((day: any, i) => (
                <div
                  key={day.key}
                  title={`${day.key}: ${day.value}`}
                  className={`w-3 h-3 border ${getCellColor(day.value)} transition-colors hover:border-black`}
                  style={{ gridRowStart: day.dayOfWeek + 1 }}
                />
              ))}
            </div>
          ) : (
            /* Standard Grid for Week / Month / ByMonth */
            <div className={`
              grid gap-1
              ${viewMode === 'WEEK' ? 'grid-cols-7' : ''}
              ${viewMode === 'MONTH' ? 'grid-cols-7' : ''}
              ${viewMode === 'YEAR' && yearGranularity === 'BY_MONTH' ? 'grid-cols-4' : ''}
            `}>
              {gridData.map((cell: any, idx) => (
                <div
                  key={cell.key + idx}
                  className={`
                    relative aspect-square border transition-all duration-300 group/cell
                    ${getCellColor(cell.value, cell.isPadding)}
                    ${!cell.isPadding ? 'hover:border-black' : ''}
                  `}
                >
                  {!cell.isPadding && (
                    <span className={`
                      absolute top-0.5 left-1 text-[8px] font-mono
                      ${Math.abs(cell.value) / maxAbs > 0.6 ? 'text-white' : 'text-gray-400'}
                    `}>
                      {cell.label}
                    </span>
                  )}
                  
                  {!cell.isPadding && (
                    <div className="opacity-0 group-hover/cell:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black text-white text-[8px] px-2 py-1 whitespace-nowrap z-20 pointer-events-none">
                      {cell.key}: {cell.value > 0 ? '+' : ''}{cell.value.toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Aesthetic Footer Label */}
      <div className="absolute bottom-2 right-2 text-[8px] text-gray-200 font-mono tracking-widest uppercase">
         Ledger_Heatmap_v2.0 // {viewMode}_{yearGranularity}
      </div>
    </div>
  );
};
