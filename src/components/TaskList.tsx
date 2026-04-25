import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Clock, 
  Share2,
  ChevronRight,
  MoreVertical,
  Users
} from 'lucide-react';
import { Task } from '../types';
import { format, isPast, isToday } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { CATEGORY_CONFIG } from '../constants';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  const handleShare = (task: Task) => {
    const shareCode = `TGS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    alert(`Kode Kolaborasi: ${shareCode}\nBagikan kode ini ke teman sekelasmu!`);
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-slate-200" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Belum ada tugas</h3>
        <p className="text-sm text-slate-400 max-w-xs">Mulai isi jadwal Anda dengan mengklik tombol "Tambah Tugas" yang ada di dasbor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => {
          const isOverdue = isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.completed;
          const isTaskToday = isToday(new Date(task.dueDate)) && !task.completed;
          const config = CATEGORY_CONFIG[task.category];
          const Icon = config.icon;

          return (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "group flex items-center gap-6 bg-slate-50/50 p-5 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/20",
                task.completed && "opacity-60 grayscale-[0.8]"
              )}
            >
              <button
                onClick={() => onToggle(task.id)}
                className={cn(
                  "shrink-0 transition-colors",
                  task.completed ? "text-blue-600" : "text-slate-300 group-hover:text-blue-500"
                )}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-8 h-8 fill-current" />
                ) : (
                  <Circle className="w-8 h-8 stroke-[1.5px]" />
                )}
              </button>

              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", config.bgColor)}>
                <Icon className="w-6 h-6" style={{ color: config.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className={cn(
                    "text-lg font-bold truncate leading-tight transition-all",
                    task.completed && "line-through text-slate-400"
                  )}>
                    {task.title}
                  </h4>
                  {task.priority === 'high' && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-full">Urgent</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                  <span className={cn(
                    "flex items-center gap-1.5",
                    isOverdue ? "text-red-500" : isTaskToday ? "text-blue-600" : ""
                  )}>
                    <Clock className="w-3.5 h-3.5" />
                    {format(new Date(task.dueDate), 'd MMM, HH:mm', { locale: localeID })}
                  </span>
                  <span className="flex items-center gap-1.5 opacity-60">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    {task.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleShare(task)}
                  title="Bagikan ke teman"
                  className="p-3 rounded-xl text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Users className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-3 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <ChevronRight className="w-5 h-5 text-slate-200" />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
