import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ListTodo, 
  LogOut,
  FolderOpen,
  X
} from 'lucide-react';
import { Category } from '../types';
import { cn } from '../lib/utils';
import { CATEGORY_CONFIG } from '../constants';

interface SidebarProps {
  activeView: 'calendar' | 'list';
  onViewChange: (view: 'calendar' | 'list') => void;
  categories: Category[];
  selectedCategory: Category | 'All';
  onCategoryChange: (cat: Category | 'All') => void;
  onAddTask: () => void;
  onClose?: () => void;
}

export default function Sidebar({ 
  activeView, 
  onViewChange, 
  categories, 
  selectedCategory, 
  onCategoryChange,
  onAddTask,
  onClose
}: SidebarProps) {
  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    window.location.reload();
  };

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col p-8 h-screen sticky top-0 overflow-y-auto no-scrollbar relative">
      {onClose && (
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-8 right-6 p-2 hover:bg-slate-50 rounded-xl"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      )}
      
      <div className="flex items-center gap-3 mb-14 px-2">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
          <FolderOpen className="text-white w-5 h-5" />
        </div>
        <span className="font-sans font-black text-xl tracking-tighter text-slate-900 uppercase">TugasKu</span>
      </div>

      <div className="space-y-1 mb-10 overflow-y-auto no-scrollbar flex-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-4 mb-5">Filter Kategori</p>
        <button
          onClick={() => onCategoryChange('All')}
          className={cn(
            "w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all text-xs font-bold",
            selectedCategory === 'All' 
              ? "text-white bg-black shadow-lg shadow-black/10" 
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          )}
        >
          <div className={cn("w-2 h-2 rounded-full", selectedCategory === 'All' ? "bg-white" : "bg-black")} />
          <span>Semua Jadwal</span>
        </button>
        {categories.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all text-xs font-bold",
                isActive 
                  ? "text-white shadow-lg" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
              style={isActive ? { backgroundColor: config.color, shadowColor: `${config.color}20` } : {}}
            >
              <div className={cn("w-2 h-2 rounded-full bg-white", !isActive && "opacity-100")} 
                   style={!isActive ? { backgroundColor: config.color } : {}} />
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-50">
        <button 
          onClick={exitFullScreen}
          className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 transition-colors py-4 text-xs font-bold uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Aplikasi</span>
        </button>
      </div>
    </aside>
  );
}
