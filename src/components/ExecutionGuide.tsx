import React from 'react';
import { Terminal, AppWindow, CheckCircle2, Code2, Layers, Cpu, ShieldAlert, Sparkles } from 'lucide-react';

export const ExecutionGuide: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
          <Sparkles className="w-4 h-4" />
          <span>Guia do Desenvolvedor Sênior</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Arquitetura Limpa, PEP 8 e Instruções de Execução
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Esta calculadora foi estruturada seguindo rigorosamente as diretrizes da Engenharia de Software Moderna: separação de responsabilidades (SoC), desacoplamento de interfaces (Ports & Adapters), tipagem estática rigorosa (Type Hints) e documentação PEP 257.
        </p>
      </div>

      {/* Como Executar */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span>Instruções Práticas de Execução</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CLI */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200">1. Modo Linha de Comando (CLI)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                Padrão
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inicia o loop contínuo interativo no terminal com menu numérico, validação com <code className="text-blue-300 font-mono">try/except</code> e histórico em memória.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <code className="text-xs font-mono text-emerald-400 select-all block">
                python calculadora.py
              </code>
            </div>
          </div>

          {/* GUI */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200">2. Modo Interface Gráfica (GUI Tkinter)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                --gui
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Abre a janela desktop nativa via Tkinter com botões visuais, display de cálculo, alertas de divisão por zero e histórico secundário.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <code className="text-xs font-mono text-purple-300 select-all block">
                python calculadora.py --gui
              </code>
            </div>
          </div>

          {/* Testes */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200">3. Testes Automatizados (unittest)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Testes
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executa a suíte de 6 testes automatizados cobrindo as 4 operações básicas, divisão por zero e limites de histórico.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <code className="text-xs font-mono text-cyan-300 select-all block">
                python -m unittest test_calculadora.py -v
              </code>
            </div>
          </div>

          {/* Requisitos */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200">4. Requisitos de Ambiente</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                Zero Deps
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Python 3.8+ instalado. Não requer nenhuma biblioteca externa (<code className="text-slate-300 font-mono">pip install</code> não é necessário).
            </p>
            <div className="text-[11px] text-slate-500">
              * No Linux Ubuntu/Debian, caso o Tkinter não venha incluso: <code className="text-slate-400">sudo apt install python3-tk</code>
            </div>
          </div>
        </div>
      </div>

      {/* Pilares Arquiteturais */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>Estrutura e Conformidade com PEP 8</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold">
              <Cpu className="w-4 h-4" />
              <span>Desacoplamento Puro</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              O motor <code className="text-slate-200 font-mono">CalculatorEngine</code> e a entidade <code className="text-slate-200 font-mono">CalculationHistory</code> não contêm comandos <code className="text-blue-300 font-mono">print()</code> nem dependências gráficas. Podem ser consumidos por CLI, GUI, API REST ou microserviço.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Tratamento de Exceções</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Divisão por zero e raiz de números negativos lançam subclasses de <code className="text-slate-200 font-mono">CalculatorError</code>. As interfaces capturam essas falhas de forma amigável sem interromper a execução contínua.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold">
              <Code2 className="w-4 h-4" />
              <span>Type Hints & Docstrings</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              100% dos métodos e funções contêm anotações de tipo estáticas (<code className="text-slate-200 font-mono">float</code>, <code className="text-slate-200 font-mono">str</code>, <code className="text-slate-200 font-mono">List[OperationRecord]</code>) e docstrings sucintas conforme PEP 257.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
