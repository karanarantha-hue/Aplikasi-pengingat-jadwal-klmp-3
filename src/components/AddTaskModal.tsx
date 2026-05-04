import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Flag, Tag, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Category, Task } from '../types';
import { cn } from '../lib/utils';
import { CATEGORY_CONFIG } from '../constants';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  categories: Category[];
}

export default function AddTaskModal({ isOpen, onClose, onAdd, categories }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 16));
  const [category, setCategory] = useState<Category>('Tugas');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    onAdd({
      title,
      description,
      dueDate,
      category,
      priority,
    });
    
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 100 }}
            className="fixed left-0 lg:left-1/2 bottom-0 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-full max-w-xl bg-white rounded-t-[3rem] lg:rounded-[3rem] shadow-2xl z-[101] overflow-hidden border border-slate-200 max-h-[90vh] lg:max-h-none overflow-y-auto"
          >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="p-8 lg:p-12 pb-6 lg:pb-8 bg-slate-50 border-b border-slate-100">
                <div className="flex justify-between items-center mb-8 lg:mb-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <BookOpen className="text-white w-4 h-4" />
                    </div>
                    <h2 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight">Input Jadwal</h2>
                  </div>
                  <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-4 lg:space-y-6">
                  <input
                    autoFocus
                    placeholder="Judul tugas/kegiatan..."
                    className="w-full bg-transparent text-2xl lg:text-3xl font-black placeholder:text-slate-200 focus:outline-none text-slate-900 tracking-tight"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  
                  <textarea
                    placeholder="Catatan tambahan..."
                    className="w-full bg-transparent text-sm lg:text-base placeholder:text-slate-300 focus:outline-none text-slate-500 resize-none h-16 lg:h-20"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-8 lg:p-12 space-y-8 lg:space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Deadline
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all focus:outline-none font-bold text-slate-900 text-sm"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Tag className="w-3 h-3" /> Jenis Jadwal
                    </label>
                    <div className="relative">
                      <select
                        className="w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all focus:outline-none font-bold text-slate-900 text-sm appearance-none cursor-pointer"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                      >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Tag className="w-3 h-3 text-slate-300" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Flag className="w-3 h-3" /> Prioritas Tugas
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {(['low', 'medium', 'high'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={cn(
                          "flex-1 py-3 lg:py-4 rounded-2xl font-bold border-2 transition-all text-[10px] lg:text-xs uppercase tracking-widest",
                          priority === p 
                            ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
                            : "bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-600"
                        )}
                      >
                        {p === 'high' ? 'PENTING' : p === 'medium' ? 'SEDANG' : 'SANTAI'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!title}
                  className={cn(
                    "w-full flex items-center justify-center gap-4 py-5 lg:py-6 rounded-2xl lg:rounded-[2rem] font-black text-base lg:text-lg transition-all",
                    title 
                      ? "bg-black text-white shadow-xl shadow-black/30 hover:scale-[1.02] active:scale-[0.98]" 
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  )}
                >
                  Simpan Jadwal
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
