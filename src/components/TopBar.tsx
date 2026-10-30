import React from 'react';
import { Download, Terminal, AppWindow, Code2, CheckCircle2, BookOpen } from 'lucide-react';
import { ActiveTab } from '../types.ts';
import { CALCULADORA_PY_CODE } from '../pythonCode.ts';

interface TopBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activeTab, onTabChange }) => {
  const handleDownload = () => {
    const blob = new Blob([CALCULADORA_PY_CODE], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'calculadora.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const navItems = [
    { id: 'cli' as ActiveTab, label: 'Terminal CLI', icon: Terminal },
    { id: 'gui' as ActiveTab, label: 'Simulador Tkinter', icon: AppWindow },
    { id: 'code' as ActiveTab, label: 'Código-Fonte', icon: Code2 },
    { id: 'tests' as ActiveTab, label: 'Testes Unitários', icon: CheckCircle2 },
    { id: 'architecture' as ActiveTab, label: 'Guia de Execução', icon: BookOpen },
  ];

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono font-bold text-sm">
          py
        </div>
        <button
          onClick={() => onTabChange('cli')}
          className="text-base font-semibold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-blue-400 transition-colors"
        >
          Calculadora Python PEP 8
        </button>
      </div>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'text-blue-400 font-semibold'
                  : 'hover:text-slate-200 text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Baixar calculadora.py</span>
        </button>
      </div>
    </header>
  );
};
