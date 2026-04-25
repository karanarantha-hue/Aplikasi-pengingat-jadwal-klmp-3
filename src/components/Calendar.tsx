import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarProps {
  tasks: Task[];
}

export default function Calendar({ tasks }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-sans font-bold text-[#141414] tracking-tight">
            {format(currentMonth, 'MMMM', { locale: localeID })}
          </h2>
          <p className="text-sm font-mono uppercase tracking-[0.2em] text-[#141414]/30">{format(currentMonth, 'yyyy')}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-3 rounded-2xl border border-[#141414]/5 hover:bg-[#141414]/5 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#141414]" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-3 rounded-2xl border border-[#141414]/5 hover:bg-[#141414]/5 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#141414]" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return (
      <div className="grid grid-cols-7 mb-4">
        {days.map((day) => (
          <div key={day} className="text-center text-[10px] font-bold text-[#141414]/20 uppercase tracking-[0.2em] py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-px bg-[#141414]/5 border border-[#141414]/5 rounded-[32px] overflow-hidden shadow-sm">
        {days.map((day, idx) => {
          const dayTasks = tasks.filter(task => isSameDay(new Date(task.dueDate), day));
          const isSelected = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[140px] bg-white p-4 transition-colors hover:bg-[#141414]/[0.02]",
                !isSelected && "bg-[#F9F9F7] opacity-40"
              )}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={cn(
                  "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                  isToday ? "bg-[#FF6321] text-white" : "text-[#141414]/60"
                )}>
                  {format(day, 'd')}
                </span>
              </div>
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "text-[10px] p-2 rounded-lg font-bold truncate transition-transform hover:scale-[1.02] cursor-pointer",
                      task.category === 'Ujian' ? "bg-red-50 text-red-600 border border-red-100" :
                      task.category === 'Tugas' ? "bg-[#FF6321]/10 text-[#FF6321] border border-[#FF6321]/20" :
                      "bg-[#141414]/5 text-[#141414]/60 border border-[#141414]/10"
                    )}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <p className="text-[9px] text-[#141414]/30 font-bold px-1">+{dayTasks.length - 3} lainnya</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-2"
    >
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </motion.div>
  );
}
