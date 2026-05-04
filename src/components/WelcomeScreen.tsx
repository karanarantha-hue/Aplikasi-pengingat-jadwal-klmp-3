import React from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle, Bell, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const handleStart = () => {
    // Attempt to go fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    }
    // Check notification permission
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    onStart();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-slate-400 rounded-full blur-3xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-slate-300 rounded-full blur-3xl"
      />

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10 pt-10 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left flex flex-col items-center lg:items-start"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[#141414] rounded-xl flex items-center justify-center">
              <CheckCircle className="text-white w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-[#141414]">TugasKu</span>
          </div>

          <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1] lg:leading-[0.9] mb-6 tracking-tighter">
            Kelola Tugas <br className="hidden lg:block" /> 
            <span className="text-black italic">Lebih Cerdas.</span>
          </h1>
          
          <p className="text-slate-600 text-base md:text-lg mb-8 max-w-sm leading-relaxed">
            Asisten digital untuk mengatur jadwal tugas, pelajaran, dan ujian Anda dengan pengingat cerdas tingkat lanjut.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="group flex items-center gap-4 bg-black text-white px-8 py-5 rounded-full font-black text-lg transition-shadow hover:shadow-2xl hover:shadow-black/20"
          >
            Mulai Input Jadwal
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="bg-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden border border-[#141414]/5">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <div className="w-12 h-2 bg-[#141414]/10 rounded-full" />
                <div className="w-8 h-2 bg-[#141414]/10 rounded-full" />
              </div>
              <div className="w-10 h-10 rounded-full border border-[#141414]/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-[#141414]/40" />
              </div>
            </div>

            <div className="space-y-6">
              {[
                { title: 'Persiapan Ujian', date: 'Besok, 08:00', cat: 'Ujian', color: '#EF4444' },
                { title: 'Tugas Harian', date: 'Selasa, 23:59', cat: 'Tugas', color: '#2563EB' },
                { title: 'Project Akhir', date: 'Hari ini', cat: 'Project', color: '#8B5CF6' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-3xl border border-[#141414]/5 bg-[#141414]/2"
                >
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <Calendar className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#141414] leading-tight">{item.title}</h3>
                    <p className="text-xs text-[#141414]/40 font-medium">{item.date} • {item.cat}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Floating Element */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-10 -right-6 bg-black text-white p-4 rounded-3xl shadow-xl font-black rotate-12"
          >
            Aplikasi Aktif! 🚀
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-10 flex gap-12 font-mono text-[10px] uppercase tracking-[0.2em] text-[#141414]/30">
        <span>Cloud Sync Active</span>
        <span>Notification System Ready</span>
        <span>Calendar Integrated</span>
      </div>
    </div>
  );
}
