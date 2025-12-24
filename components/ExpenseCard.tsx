
import React, { useState } from 'react';
import { Expense, Language, TRANSLATIONS } from '../types';
import { 
  Edit2, Check, X, Trash2, StickyNote, Coffee, ShoppingCart, Car, Home, Zap, Heart, 
  Utensils, Smartphone, Briefcase, Banknote, TrendingUp, HelpCircle, GraduationCap, 
  Plane, Gift, ChevronDown, ChevronUp
} from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  onUpdate: (id: string, updates: Partial<Expense>) => void;
  onDelete: (id: string) => void;
  lang: Language;
}

const getCategoryStyle = (category: string, type: 'INCOME' | 'EXPENSE') => {
    const lower = category.toLowerCase();
    let Icon = HelpCircle;
    if (lower.match(/food|eat|dinner|lunch|breakfast|restaurant|snack/)) Icon = Utensils;
    else if (lower.match(/coffee|tea|drink/)) Icon = Coffee;
    else if (lower.match(/shop|buy|grocery|market/)) Icon = ShoppingCart;
    else if (lower.match(/car|taxi|uber|bus|train|transport|gas/)) Icon = Car;
    else if (lower.match(/home|rent|house|utilities/)) Icon = Home;
    else if (lower.match(/electric|water|bill|internet/)) Icon = Zap;
    else if (lower.match(/health|doctor|gym|med/)) Icon = Heart;
    else if (lower.match(/tech|phone|app|sub/)) Icon = Smartphone;
    else if (lower.match(/work|freelance|project/)) Icon = Briefcase;
    else if (lower.match(/salary|wage|pay/)) Icon = Banknote;
    else if (lower.match(/invest|stock|crypto/)) Icon = TrendingUp;
    else if (lower.match(/education|school|book/)) Icon = GraduationCap;
    else if (lower.match(/travel|hotel|flight/)) Icon = Plane;
    else if (lower.match(/gift|donation/)) Icon = Gift;

    let colorClass = 'text-gray-600 border-gray-200 bg-white';
    if (type === 'INCOME') {
        colorClass = 'text-emerald-700 border-emerald-200 bg-emerald-50';
    } else {
        if (lower.match(/food|coffee/)) colorClass = 'text-orange-700 border-orange-200 bg-orange-50';
        else if (lower.match(/transport/)) colorClass = 'text-blue-700 border-blue-200 bg-blue-50';
        else colorClass = 'text-gray-700 border-gray-200 bg-gray-50';
    }
    return { Icon, colorClass };
};

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onUpdate, onDelete, lang }) => {
  const t = TRANSLATIONS[lang];
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editValues, setEditValues] = useState({
    amount: expense.amount,
    description: expense.description,
    category: expense.category,
    date: expense.date,
    type: expense.type
  });

  const { Icon, colorClass } = getCategoryStyle(expense.category, expense.type);
  const isIncome = expense.type === 'INCOME';

  const handleSave = () => {
    onUpdate(expense.id, editValues);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border border-black p-4 bg-gray-50 flex flex-col gap-3 animate-pop-in">
         <div className="flex justify-between items-start">
            <div className="flex gap-2 w-1/2">
                <select 
                   value={editValues.type}
                   onChange={(e) => setEditValues({...editValues, type: e.target.value as any})}
                   className="bg-white border border-black p-1 text-[10px] uppercase font-bold outline-none"
                >
                    <option value="EXPENSE">EXP</option>
                    <option value="INCOME">INC</option>
                </select>
                 <input 
                    type="number"
                    value={editValues.amount}
                    onChange={(e) => setEditValues({...editValues, amount: parseFloat(e.target.value)})}
                    className="bg-white border border-black p-1 text-lg font-black w-full outline-none focus:bg-yellow-50"
                 />
            </div>
             <div className="flex gap-1">
                 <button onClick={handleSave} className="p-2 border border-black hover:bg-black hover:text-white"><Check size={14}/></button>
                 <button onClick={() => setIsEditing(false)} className="p-2 border border-black hover:bg-black hover:text-white"><X size={14}/></button>
             </div>
         </div>
         <textarea 
            value={editValues.description}
            onChange={(e) => setEditValues({...editValues, description: e.target.value})}
            className="bg-white border border-black p-2 text-xs font-mono w-full h-20 resize-none outline-none uppercase"
         />
      </div>
    );
  }

  return (
    <div 
        className={`group border border-black bg-white transition-all duration-300 animate-pop-in flex flex-col overflow-hidden relative
            ${isExpanded ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1' : 'hover:bg-gray-50'}`}
    >
        {/* Main Content Area */}
        <div 
            className="p-4 cursor-pointer flex items-center gap-3"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className={`p-2.5 border border-black transition-transform group-hover:scale-110 ${colorClass}`}>
                <Icon size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-xl font-black tracking-tighter ${isIncome ? 'text-emerald-600' : 'text-black'}`}>
                        {isIncome ? '+' : '-'}{expense.amount.toLocaleString(undefined, {minimumFractionDigits: 1})}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-gray-300 uppercase tracking-widest">{expense.date.split('-').slice(1).join('/')}</span>
                </div>
                {!isExpanded && (
                    <p className="text-[10px] text-gray-400 truncate font-mono uppercase tracking-tight">
                        {expense.description || expense.category}
                    </p>
                )}
            </div>
            
            <div className="text-gray-300 group-hover:text-black transition-colors">
                {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </div>
        </div>

        {/* Expanded Drawer */}
        <div 
            className={`transition-all duration-300 ease-in-out border-t border-black bg-gray-50/50 overflow-hidden
                ${isExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
        >
            <div className="p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1">Entry_Classification</span>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 w-fit">{expense.category}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsEditing(true)} className="p-1.5 border border-black bg-white hover:bg-black hover:text-white transition-colors"><Edit2 size={12}/></button>
                        <button onClick={() => onDelete(expense.id)} className="p-1.5 border border-black bg-white hover:bg-red-600 hover:text-white transition-colors"><Trash2 size={12}/></button>
                    </div>
                </div>
                
                <div className="bg-white border border-black p-3 relative">
                    <StickyNote size={10} className="absolute top-2 right-2 text-gray-200" />
                    <p className="text-[11px] font-mono text-gray-800 leading-relaxed uppercase tracking-tighter">
                        {expense.description || "NO_NOTES_ARCHIVED"}
                    </p>
                </div>

                <div className="flex justify-between text-[8px] font-mono text-gray-300 uppercase tracking-widest">
                    <span>ID: {expense.id.slice(0,8)}</span>
                    <span>TS: {new Date(expense.timestamp).toLocaleTimeString()}</span>
                </div>
            </div>
        </div>

        {expense.isAiGenerated && !isExpanded && (
            <div className="absolute top-1 right-1 w-1 h-1 bg-emerald-400 animate-pulse"></div>
        )}
    </div>
  );
};
