
import React, { useState, useRef } from 'react';
import { Mic, Loader2, Type, AudioLines, Zap } from 'lucide-react';
import { parseExpenseText, parseExpenseAudio } from '../services/geminiService';
import { AiParseResponse, Language, TRANSLATIONS } from '../types';

interface InputBlockProps {
  onAddExpense: (data: AiParseResponse) => void;
  lang: Language;
}

export const InputBlock: React.FC<InputBlockProps> = ({ onAddExpense, lang }) => {
  const t = TRANSLATIONS[lang];
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setIsProcessing(true);
    try {
      const result = await textInput.toLowerCase().includes('demo') 
        ? { amount: 100, currency: 'USD', category: 'Demo', description: 'Testing input', date: new Date().toISOString().split('T')[0], type: 'EXPENSE' as const }
        : await parseExpenseText(textInput);
      onAddExpense(result);
      setTextInput('');
    } catch (e) {
      alert("Failed to parse text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => e.data.size > 0 && audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const result = await parseExpenseAudio(base64Audio, blob.type);
        onAddExpense(result);
        setIsProcessing(false);
      };
    } catch (e) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="border border-black bg-white h-full flex flex-col relative overflow-hidden animate-fade-in-up">
      {/* Dynamic Tab Underline */}
      <div className="flex border-b border-black relative">
        <button
          onClick={() => setMode('text')}
          className={`flex-1 p-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 z-10 ${mode === 'text' ? 'text-white' : 'text-gray-400 hover:text-black'}`}
        >
          <Type size={12} /> {t.inputTab}
        </button>
        <button
          onClick={() => setMode('voice')}
          className={`flex-1 p-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 z-10 ${mode === 'voice' ? 'text-white' : 'text-gray-400 hover:text-black'}`}
        >
            <Mic size={12} /> {t.voiceTab}
        </button>
        <div 
            className="absolute bottom-0 top-0 left-0 w-1/2 bg-black transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(${mode === 'text' ? '0%' : '100%'})` }}
        />
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center items-center bg-gray-50/30">
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
                <Loader2 className="animate-spin text-black" size={40} strokeWidth={3} />
                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500 animate-pulse" size={16} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500">{t.processing}</span>
          </div>
        ) : mode === 'text' ? (
          <div className="w-full h-full flex flex-col animate-slide-right">
            <textarea
              className="w-full flex-1 resize-none bg-transparent outline-none text-xl font-medium placeholder-gray-200 leading-tight"
              placeholder={t.textPlaceholder}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleTextSubmit())}
            />
            <div className="flex justify-end pt-4">
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="group border-2 border-black px-8 py-2 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-20 flex items-center gap-2 brutalist-button"
              >
                {t.logBtn}
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:animate-ping"></div>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full gap-8 animate-pop-in">
            <div className="relative">
                {isRecording && (
                    <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-25"></div>
                )}
                <div 
                    className={`w-24 h-24 border-2 border-black rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-orange-600 border-orange-600 scale-110' : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                >
                    {isRecording ? (
                         <AudioLines className="text-white" size={40} />
                    ) : (
                        <Mic className="text-black" size={40} />
                    )}
                </div>
            </div>
            
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`border-2 border-black px-10 py-3 text-xs font-black tracking-widest uppercase transition-all w-full max-w-[220px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] ${isRecording ? 'bg-black text-white' : 'bg-white'}`}
            >
              {isRecording ? t.stopRecord : t.startRecord}
            </button>
            <p className="text-[10px] text-gray-400 text-center font-mono uppercase tracking-tighter opacity-60">
                {t.voiceHint}
            </p>
          </div>
        )}
      </div>
      
       <div className="absolute bottom-2 right-2 text-[8px] text-gray-200 font-mono select-none pointer-events-none uppercase tracking-[0.2em]">
            SYSTEM_I:READY
       </div>
    </div>
  );
};
