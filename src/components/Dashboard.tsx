import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Calendar from './Calendar';
import TaskList from './TaskList';
import AddTaskModal from './AddTaskModal';
import AddFriendModal from './AddFriendModal';
import { useTasks } from '../hooks/useTasks';
import { Category, ViewMode, Task } from '../types';
import { Search, Bell, User, Cloud, Share2, Users, ArrowUpRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { tasks, categories, addTask: originalAddTask, toggleTask, deleteTask } = useTasks();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState<{id: string, title: string, message: string, time: string, isNew: boolean}[]>([
    { id: 'initial-1', title: 'Selamat Datang!', message: 'Selamat datang di TugasKu. Jadualkan tugasmu sekarang.', time: 'Baru saja', isNew: true },
  ]);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const [notifiedTaskIds, setNotifiedTaskIds] = useState<Set<string>>(new Set());

  // Wrap addTask to add a system notification
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    originalAddTask(task);
    const newNotif = {
      id: `created-${Date.now()}`,
      title: 'Tugas Disimpan',
      message: `Jadwal "${task.title}" telah aktif dan pengingat disetel.`,
      time: 'Baru saja',
      isNew: true
    };
    setActiveNotifications(prev => [newNotif, ...prev]);
    setHasNewNotifications(true);
    setIsModalOpen(false);
  };

  // Function to play notification sound
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      const now = audioCtx.currentTime;
      // Friendly ascending chime
      playNote(523.25, now, 0.4); // C5
      playNote(659.25, now + 0.12, 0.4); // E5
      playNote(783.99, now + 0.24, 0.5); // G5
    } catch (e) {
      console.log('Audio blocked', e);
    }
  };

  const handleCloudSync = () => {
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false);
      alert('Data berhasil disinkronisasi ke Cloud (Local Storage)!');
    }, 1500);
  };

  // Background checker for task due dates
  React.useEffect(() => {
    const checkTasks = () => {
      const now = new Date();
      let foundNew = false;
      const newNotifiedIds = new Set(notifiedTaskIds);
      const newNotifications = [...activeNotifications];

      tasks.forEach(task => {
        if (!task.completed && task.dueDate && !notifiedTaskIds.has(task.id)) {
          const dueDate = new Date(task.dueDate);
          
          // Trigger if time is reached or past
          if (dueDate <= now) {
            const newNotif = {
              id: `notif-${task.id}-${Date.now()}`,
              title: `Waktunya: ${task.title}`,
              message: `Jadwal ${task.category} Anda sudah tiba! Segera kerjakan.`,
              time: 'Sekarang',
              isNew: true
            };
            newNotifications.unshift(newNotif);
            newNotifiedIds.add(task.id);
            foundNew = true;
          }
        }
      });

      if (foundNew) {
        setActiveNotifications(newNotifications);
        setHasNewNotifications(true);
        setNotifiedTaskIds(newNotifiedIds);
        playNotificationSound();
      }
    };

    const interval = setInterval(checkTasks, 15000); // Check more frequently (every 15 seconds)
    checkTasks(); // Initial check

    return () => clearInterval(interval);
  }, [tasks, notifiedTaskIds, activeNotifications]);

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setHasNewNotifications(false);
      setActiveNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
    }
  };

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
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCloudSync}
                disabled={isSyncing}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
                  isSyncing 
                    ? "bg-slate-50 border-slate-100 text-slate-400" 
                    : "bg-green-50 border-green-100 text-green-700 hover:bg-green-100"
                )}
              >
                <Cloud className={cn("w-4 h-4", isSyncing && "animate-spin")} />
                <span className="text-[10px] font-black uppercase tracking-wider hidden sm:block">
                  {isSyncing ? 'Syncing...' : 'Sinkronisasi'}
                </span>
              </button>
              
              <button 
                onClick={() => setIsAddFriendModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider">Kolaborasi</span>
              </button>
            </div>
            <div className="relative">
              <button 
                onClick={handleOpenNotifications}
                className="relative w-10 h-10 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <motion.div
                  animate={hasNewNotifications ? { 
                    rotate: [0, -10, 10, -10, 10, 0],
                    scale: [1, 1.1, 1] 
                  } : {}}
                  transition={{ repeat: hasNewNotifications ? Infinity : 0, duration: 2, repeatDelay: 1 }}
                >
                  <Bell className="w-4 h-4 text-slate-600" />
                </motion.div>
                {hasNewNotifications && (
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowNotifications(false)}
                      className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100]"
                    />
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] z-[110] p-8 lg:p-10 border-l border-slate-100 font-sans"
                    >
                      <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                            <Bell className="text-white w-5 h-5" />
                          </div>
                          <h4 className="font-black text-lg uppercase tracking-tight text-slate-900">Notifikasi</h4>
                        </div>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                          <X className="w-6 h-6 text-slate-400" />
                        </button>
                      </div>
                      
                      <div className="space-y-4 overflow-y-auto no-scrollbar h-[calc(100vh-280px)]">
                        {activeNotifications.map((n) => (
                          <div key={n.id} className={cn(
                            "p-5 rounded-3xl border transition-all cursor-pointer group",
                            n.isNew ? "bg-black text-white border-black" : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                          )}>
                            <div className="flex justify-between items-start mb-2">
                              <p className={cn("text-xs font-black", n.isNew ? "text-white" : "text-slate-900")}>{n.title}</p>
                              {n.isNew && <span className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                            </div>
                            <p className={cn("text-[12px] mb-3 leading-relaxed", n.isNew ? "text-white/70" : "text-slate-500")}>{n.message}</p>
                            <p className={cn("text-[10px] font-bold uppercase tracking-wider", n.isNew ? "text-white/40" : "text-slate-400")}>{n.time}</p>
                          </div>
                        ))}
                        {activeNotifications.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                            <Bell className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-sm font-bold">Tidak ada notifikasi baru</p>
                          </div>
                        )}
                      </div>

                      <div className="absolute bottom-10 left-8 right-8">
                        <button 
                          onClick={() => setActiveNotifications([])}
                          className="w-full py-5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-slate-100 hover:text-slate-900 transition-all"
                        >
                          Bersihkan Semua
                        </button>
                      </div>
                    </motion.div>
                  </>
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
                <h3 className="text-xs font-black text-white/50 uppercase tracking-widest mb-6 px-1">Cloud & Kolaborasi</h3>
                <div className="space-y-3 relative z-10">
                  <button 
                    onClick={handleCloudSync}
                    disabled={isSyncing}
                    className="w-full text-left bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors group/sync"
                  >
                    <p className="text-[10px] text-white/60 font-black mb-1 uppercase tracking-wider">Status Penyimpanan</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-white">{isSyncing ? 'Sedang Sinkron...' : 'Data Aman di Cloud'}</p>
                      <Cloud className={cn("w-4 h-4 text-white/40", isSyncing && "animate-bounce")} />
                    </div>
                  </button>
                  <button 
                    onClick={() => setIsAddFriendModalOpen(true)}
                    className="w-full text-left bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors group/collab"
                  >
                    <p className="text-[10px] text-white/60 font-black mb-1 uppercase tracking-wider">Grup Belajar</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-white">2 Teman Aktif</p>
                      <Users className="w-4 h-4 text-white/40" />
                    </div>
                  </button>
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
                    <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight">
                      {selectedCategory === 'All' ? 'Tugas Terdekat' : `Daftar ${selectedCategory}`}
                    </h2>
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
