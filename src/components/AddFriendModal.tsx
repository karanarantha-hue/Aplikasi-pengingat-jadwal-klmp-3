import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Copy, Check, Send } from 'lucide-react';
import { cn } from '../lib/utils';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const shareCode = "TUGASKU-8829-XP";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Undangan dikirim ke: ${email}`);
      setEmail('');
      onClose();
    }
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
            className="fixed left-0 lg:left-1/2 bottom-0 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-full max-w-md bg-white rounded-t-[3rem] lg:rounded-[3rem] shadow-2xl z-[101] overflow-hidden border border-slate-200"
          >
            <div className="p-8 lg:p-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <Users className="text-white w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-black text-slate-800 tracking-tight text-black">Tambah Teman</h2>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Kode Bagikanmu</label>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="flex-1 font-mono font-bold text-slate-600">{shareCode}</span>
                    <button 
                      onClick={handleCopy}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        copied ? "bg-green-500 text-white" : "bg-white text-slate-400 hover:text-slate-900 shadow-sm"
                      )}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                    Bagikan kode ini ke temanmu agar mereka bisa bergabung ke grup belajarmu secara instan.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-slate-300">
                    <span className="bg-white px-4">Atau Undang Lewat Email</span>
                  </div>
                </div>

                <form onSubmit={handleInvite} className="space-y-4">
                  <input 
                    type="email"
                    placeholder="nama@email.com"
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="w-full py-5 bg-black text-white font-black rounded-2xl shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    Kirim Undangan
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
