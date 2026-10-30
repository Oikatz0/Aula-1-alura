/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { TopBar } from './components/TopBar.tsx';
import { TerminalCLI } from './components/TerminalCLI.tsx';
import { TkinterSimulator } from './components/TkinterSimulator.tsx';
import { CodeViewer } from './components/CodeViewer.tsx';
import { TestRunner } from './components/TestRunner.tsx';
import { ExecutionGuide } from './components/ExecutionGuide.tsx';
import { CalculatorEngineMirror } from './calculatorEngine.ts';
import { ActiveTab } from './types.ts';
import { Terminal, AppWindow, Code2, CheckCircle2, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cli');
  const engine = useMemo(() => new CalculatorEngineMirror(50), []);
  const [, setTick] = useState(0);

  const handleOperationSuccess = () => {
    setTick((prev) => prev + 1);
  };

  const tabsConfig = [
    { id: 'cli' as ActiveTab, label: 'Terminal CLI', icon: Terminal, desc: 'Menu interativo com loop contínuo' },
    { id: 'gui' as ActiveTab, label: 'Interface Gráfica (Tkinter)', icon: AppWindow, desc: 'Simulador desktop nativo' },
    { id: 'code' as ActiveTab, label: 'Código Python (PEP 8)', icon: Code2, desc: 'Código modular completo' },
    { id: 'tests' as ActiveTab, label: 'Testes Unitários', icon: CheckCircle2, desc: '6 testes automatizados' },
    { id: 'architecture' as ActiveTab, label: 'Guia de Execução', icon: BookOpen, desc: 'Comandos e arquitetura limpa' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar seguindo o Top Bar Contract de 3 zonas */}
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col space-y-6">
        {/* Sub-navigation bar para mobile e tablet */}
        <div className="flex lg:hidden overflow-x-auto pb-2 scrollbar-none gap-2 border-b border-slate-800">
          {tabsConfig.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Viewport Content */}
        <div className="flex-1">
          {activeTab === 'cli' && (
            <TerminalCLI engine={engine} onOperationSuccess={handleOperationSuccess} />
          )}

          {activeTab === 'gui' && (
            <TkinterSimulator engine={engine} onOperationSuccess={handleOperationSuccess} />
          )}

          {activeTab === 'code' && <CodeViewer />}

          {activeTab === 'tests' && <TestRunner />}

          {activeTab === 'architecture' && <ExecutionGuide />}
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Calculadora Modular em Python · Arquitetura Limpa & PEP 8</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Python 3.8+</span>
            <span aria-hidden="true">·</span>
            <span>Sem dependências externas</span>
            <span aria-hidden="true">·</span>
            <span>CLI + GUI Tkinter</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
