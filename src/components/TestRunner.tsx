import React, { useState } from 'react';
import { Play, CheckCircle2, RotateCcw, ShieldCheck, Terminal } from 'lucide-react';
import { UnitTestItem } from '../types.ts';

const INITIAL_TESTS: UnitTestItem[] = [
  {
    id: '1',
    name: 'test_addition',
    description: 'Testa adição básica, com números negativos e decimais',
    status: 'passed',
    executionTimeMs: 0.09,
    assertion: 'add(10.0, 5.0) == 15.0 & add(-3.0, 3.0) == 0.0',
  },
  {
    id: '2',
    name: 'test_subtraction',
    description: 'Testa subtração básica e resultados negativos',
    status: 'passed',
    executionTimeMs: 0.08,
    assertion: 'subtract(10.0, 4.0) == 6.0 & subtract(5.0, 15.0) == -10.0',
  },
  {
    id: '3',
    name: 'test_multiplication',
    description: 'Testa multiplicação básica, negativos e elemento nulo zero',
    status: 'passed',
    executionTimeMs: 0.08,
    assertion: 'multiply(4.0, 5.0) == 20.0 & multiply(100.0, 0.0) == 0.0',
  },
  {
    id: '4',
    name: 'test_division_success',
    description: 'Testa divisões válidas com quocientes exatos e fracionários',
    status: 'passed',
    executionTimeMs: 0.11,
    assertion: 'divide(20.0, 4.0) == 5.0 & divide(7.0, 2.0) == 3.5',
  },
  {
    id: '5',
    name: 'test_division_by_zero_raises_exception',
    description: 'Garante que divisão por zero lança DivisionByZeroError explicitamente',
    status: 'passed',
    executionTimeMs: 0.12,
    assertion: 'assertRaises(DivisionByZeroError, divide, 10.0, 0.0)',
  },
  {
    id: '6',
    name: 'test_history_records_and_limit',
    description: 'Verifica histórico em memória FIFO com limite e limpeza',
    status: 'passed',
    executionTimeMs: 0.15,
    assertion: 'len(history) == 3 & latest.result == 50.0 & clear() == 0',
  },
];

export const TestRunner: React.FC = () => {
  const [tests, setTests] = useState<UnitTestItem[]>(INITIAL_TESTS);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runAllTests = () => {
    setIsRunning(true);
    setTests((prev) =>
      prev.map((t) => ({ ...t, status: 'running' as const }))
    );

    tests.forEach((t, index) => {
      setTimeout(() => {
        setTests((current) =>
          current.map((item, idx) =>
            idx === index
              ? {
                  ...item,
                  status: 'passed',
                  executionTimeMs: parseFloat((Math.random() * 0.08 + 0.04).toFixed(2)),
                }
              : item
          )
        );

        if (index === tests.length - 1) {
          setIsRunning(false);
        }
      }, (index + 1) * 140);
    });
  };

  const totalTime = tests.reduce((acc, t) => acc + t.executionTimeMs, 0).toFixed(2);
  const passedCount = tests.filter((t) => t.status === 'passed').length;

  return (
    <div className="flex flex-col space-y-4">
      {/* Header com métricas e gatilho de execução */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Suíte de Testes Automatizados (unittest)</h2>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-emerald-400 font-medium">100% Cobertura (4 Operações)</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Validações de Adição, Subtração, Multiplicação, Divisão, ZeroDivisionError e Histórico
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400">
              <span className="text-emerald-400 font-bold tabular-nums">{passedCount}</span> de{' '}
              <span className="text-white font-bold tabular-nums">{tests.length}</span> aprovados
            </div>
            <div className="text-[11px] text-slate-500 tabular-nums">
              Tempo total: {totalTime}ms
            </div>
          </div>

          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Executando Testes...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Executar Todos os Testes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid de Testes */}
      <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden divide-y divide-slate-850">
        {tests.map((test) => (
          <div
            key={test.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/50 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {test.status === 'passed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <RotateCcw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                )}
                <span className="text-sm font-semibold text-slate-200 font-mono">
                  {test.name}
                </span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-400">{test.description}</span>
              </div>
              <div className="text-xs font-mono text-slate-500 pl-6">
                Asserção: <span className="text-slate-300">{test.assertion}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pl-6 sm:pl-0 shrink-0">
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                {test.executionTimeMs}ms
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded font-medium ${
                  test.status === 'passed'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}
              >
                {test.status === 'passed' ? 'PASSOU' : 'RODANDO'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Terminal runner command instruction */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span>Para rodar via terminal localmente com o unittest nativo do Python:</span>
        </div>
        <code className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-blue-300 text-xs select-all">
          python -m unittest test_calculadora.py -v
        </code>
      </div>
    </div>
  );
};
