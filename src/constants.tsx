import React from 'react';
import { 
  Calculator, 
  BookText, 
  FlaskConical, 
  History, 
  Palette, 
  AlertTriangle, 
  CheckSquare, 
  HelpCircle,
  LucideIcon
} from 'lucide-react';
import { Category } from './types';

export const CATEGORY_CONFIG: Record<Category, { icon: LucideIcon, color: string, bgColor: string }> = {
  'Matematika': { icon: Calculator, color: '#2563eb', bgColor: 'bg-blue-50' },
  'Bahasa': { icon: BookText, color: '#4f46e5', bgColor: 'bg-indigo-50' },
  'Sains': { icon: FlaskConical, color: '#10b981', bgColor: 'bg-emerald-50' },
  'Sejarah': { icon: History, color: '#f59e0b', bgColor: 'bg-amber-50' },
  'Seni': { icon: Palette, color: '#d946ef', bgColor: 'bg-magenta-50' },
  'Ujian': { icon: AlertTriangle, color: '#ef4444', bgColor: 'bg-red-50' },
  'Tugas': { icon: CheckSquare, color: '#6366f1', bgColor: 'bg-violet-50' },
  'Lainnya': { icon: HelpCircle, color: '#64748b', bgColor: 'bg-slate-50' }
};
