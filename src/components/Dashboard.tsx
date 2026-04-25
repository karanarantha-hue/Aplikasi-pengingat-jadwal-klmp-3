import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Calendar from './Calendar';
import TaskList from './TaskList';
import AddTaskModal from './AddTaskModal';
import { useTasks } from '../hooks/useTasks';
import { Category, ViewMode } from '../types';
import { Search, Bell, User, Cloud, Share2, Users, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { tasks, categories, addTask, toggleTask, deleteTask } = useTasks();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen text-slate-900">
      <Sidebar 
        activeView={viewMode}
        onViewChange={setViewMode}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onAddTask={() => setIsModalOpen(true)}
      />

      <main className="flex-1 overflow-y-auto no-scrollbar">
        <nav className="w-full h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari tugas..."
              className="bg-slate-50 border border-slate-200 pl-11 pr-6 py-2.5 rounded-xl w-80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Cloud Terkoneksi</span>
            </div>
            <button className="relative w-10 h-10 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs">
              K
            </div>
          </div>
        </nav>

        <div className="p-10 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Bento Hero Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-xl shadow-blue-500/10 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="relative z-10">
                <h1 className="text-4xl font-extrabold leading-tight mb-4 tracking-tight">Selamat Datang,<br />Pelajar Hebat!</h1>
                <p className="text-blue-100 opacity-80 text-lg">Ada <span className="font-black text-white">{stats.pending}</span> tugas penting yang menunggumu hari ini.</p>
              </div>
              <div className="flex gap-4 relative z-10 pt-8">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  Buat Jadwal Baru
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button className="px-6 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Grup Belajar
                </button>
              </div>
              
              {/* Decorative Circle */}
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </motion.div>

            {/* Calendar Mini Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-1 bento-card p-8 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Digital Calendar</h3>
                  <Share2 className="w-4 h-4 text-slate-300 group-hover:text-blue-500 cursor-pointer transition-colors" />
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-600">Terbaik untuk memantau deadline besar.</p>
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                        U{i}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">
                      +4
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setViewMode('calendar')}
                className="w-full py-3 bg-slate-50 text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
              >
                Buka Kalender Full
              </button>
            </motion.div>

            {/* Cloud/Collaboration Status */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="col-span-1 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                <Cloud className="w-32 h-32" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Cloud & Kolaborasi</h3>
                <div className="space-y-3 relative z-10">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <p className="text-[10px] text-blue-400 font-bold mb-1 uppercase tracking-wider">Sync Berhasil</p>
                    <p className="text-sm font-medium opacity-90">Data aman di awan.</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <p className="text-[10px] text-emerald-400 font-bold mb-1 uppercase tracking-wider">Shared Tugas</p>
                    <p className="text-sm font-medium opacity-90">2 teman baru bergabung.</p>
                  </div>
                </div>
              </div>
              <div className="pt-6 relative z-10">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Cloud className="w-3 h-3" />
                  Storage: 85% Free
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-3">
              <section className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm min-h-[500px]">
                <AnimatePresence mode="wait">
                  {viewMode === 'calendar' ? (
                    <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Calendar tasks={filteredTasks} />
                    </motion.div>
                  ) : (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="flex justify-between items-center mb-10">
                        <div>
                          <h2 className="text-2xl font-extrabold tracking-tight">Tugas Terdekat</h2>
                          <p className="text-sm text-slate-400">Total {filteredTasks.length} jadwal aktif.</p>
                        </div>
                        <div className="flex gap-2">
                           <span className="px-5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
                            {selectedCategory === 'All' ? 'Semua Kategori' : selectedCategory}
                           </span>
                        </div>
                      </div>
                      <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={deleteTask} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </div>
            
            <div className="col-span-1 space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Progres Belajar</h3>
                <div className="relative w-full aspect-square flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                    <circle 
                      cx="50%" cy="50%" r="40%" fill="none" stroke="#2563eb" strokeWidth="12" 
                      strokeDasharray={`${(stats.completed / (stats.total || 1)) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black">{Math.round((stats.completed / (stats.total || 1)) * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-[2.5rem] border border-amber-100 p-8">
                <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-4">Tips Cerdas</h3>
                <p className="text-sm text-amber-900 font-medium leading-relaxed">
                  "Bagikan tugas kelompokmu dengan kode unik untuk kolaborasi real-time!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTask}
        categories={categories}
      />
    </div>
  );
}
