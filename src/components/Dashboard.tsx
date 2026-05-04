import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Calendar from './Calendar';
import TaskList from './TaskList';
import AddTaskModal from './AddTaskModal';
import AddFriendModal from './AddFriendModal';
import { useTasks } from '../hooks/useTasks';
import { Category, ViewMode } from '../types';
import { Search, Bell, User, Cloud, Share2, Users, ArrowUpRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { tasks, categories, addTask, toggleTask, deleteTask } = useTasks();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Tugas Matematika', message: 'Deadline dalam 2 jam!', time: '2j yang lalu' },
    { id: 2, title: 'Grup Belajar', message: 'Andi bergabung ke grup.', time: '5j yang lalu' },
  ];

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
    <div className="flex bg-[#f8fafc] min-h-screen text-slate-900 relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out lg:block",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar 
          activeView={viewMode}
          onViewChange={setViewMode}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat);
            setIsSidebarOpen(false);
          }}
          onAddTask={() => setIsModalOpen(true)}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar w-full">
        <nav className="w-full h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-50 rounded-xl"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari tugas..."
                className="bg-slate-50 border border-slate-200 pl-11 pr-6 py-2.5 rounded-xl w-40 md:w-80 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-black rounded-full border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider">Cloud Terkoneksi</span>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-10 h-10 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-black rounded-full border-2 border-white" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl z-50 p-6"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-black text-sm uppercase tracking-widest text-slate-900">Notifikasi</h4>
                      <span className="text-[10px] font-bold text-white bg-black px-2 py-1 rounded-full">New</span>
                    </div>
                    <div className="space-y-4">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group">
                          <p className="text-xs font-black text-slate-900 mb-1 group-hover:text-black transition-colors">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mb-2">{n.message}</p>
                          <p className="text-[10px] font-bold text-slate-400">{n.time}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-6 py-3 border-t border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                      Lihat Semua
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-10 h-10 rounded-full bg-black border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs">
              K
            </div>
          </div>
        </nav>

        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Bento Hero Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-1 lg:col-span-3 bg-zinc-950 rounded-[2.5rem] p-8 lg:p-10 text-white shadow-xl shadow-black/10 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="relative z-10">
                <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4 tracking-tight text-white">Selamat Datang,<br />Pelajar Hebat!</h1>
                <p className="text-zinc-400 text-base lg:text-lg font-medium">Ada <span className="font-black text-white">{stats.pending}</span> tugas penting hari ini.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10 pt-8">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 lg:px-8 py-4 bg-white text-black font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  Tambah Tugas
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsAddFriendModalOpen(true)}
                  className="px-6 py-4 bg-white/30 backdrop-blur-md text-black font-black rounded-2xl hover:bg-white/40 transition-all flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Tambah Teman
                </button>
              </div>
              
              {/* Decorative Circle */}
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </motion.div>

            {/* Cloud/Collaboration Status */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-1 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                <Cloud className="w-32 h-32" />
              </div>
              <div>
                <h3 className="text-xs font-black text-black uppercase tracking-widest mb-6">Cloud & Kolaborasi</h3>
                <div className="space-y-3 relative z-10">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                    <p className="text-[10px] text-black font-black mb-1 uppercase tracking-wider">Sync Berhasil</p>
                    <p className="text-sm font-black text-black">Data aman di awan.</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                    <p className="text-[10px] text-black font-black mb-1 uppercase tracking-wider">Shared Tugas</p>
                    <p className="text-sm font-black text-black">2 teman baru bergabung.</p>
                  </div>
                </div>
              </div>
              <div className="pt-6 relative z-10">
                <div className="flex items-center gap-2 text-xs text-black font-black">
                  <Cloud className="w-3 h-3" />
                  Storage: 85% Free
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="col-span-1 lg:col-span-3 space-y-8">
              {/* Task List Section */}
              <section className="bg-white rounded-[2.5rem] border border-slate-200 p-6 lg:p-10 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight">Tugas Terdekat</h2>
                    <p className="text-sm text-slate-400">Total {filteredTasks.length} jadwal aktif.</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                     <span className="px-5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 block w-full text-center">
                      {selectedCategory === 'All' ? 'Semua Kategori' : selectedCategory}
                     </span>
                  </div>
                </div>
                <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={deleteTask} />
              </section>

              {/* Calendar Section - Below Task List */}
              <section className="bg-white rounded-[2.5rem] border border-slate-200 p-6 lg:p-10 shadow-sm overflow-x-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight">Kalender Akademik</h2>
                </div>
                <Calendar tasks={filteredTasks} />
              </section>
            </div>
            
            <div className="col-span-1 space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">Progres Belajar</h3>
                <div className="relative w-full max-w-[200px] mx-auto aspect-square flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                    <circle 
                      cx="50%" cy="50%" r="40%" fill="none" stroke="#000000" strokeWidth="12" 
                      strokeDasharray={`${(stats.completed / (stats.total || 1)) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl lg:text-3xl font-black">{Math.round((stats.completed / (stats.total || 1)) * 100)}%</span>
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
      <AddFriendModal
        isOpen={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
      />
    </div>
  );
}
