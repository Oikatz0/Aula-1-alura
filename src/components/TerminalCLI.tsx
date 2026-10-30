import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { CalculatorEngineMirror, DivisionByZeroError } from '../calculatorEngine.ts';

interface TerminalCLIProps {
  engine: CalculatorEngineMirror;
  onOperationSuccess?: () => void;
}

type PromptStep =
  | { state: 'MENU' }
  | { state: 'WAIT_A'; op: string; prompt: string }
  | { state: 'WAIT_B'; op: string; a: number; prompt: string };

export const TerminalCLI: React.FC<TerminalCLIProps> = ({ engine, onOperationSuccess }) => {
  const getMenuLines = () => [
    "================================================",
    "     CALCULADORA DE OPERAÇÕES BÁSICAS (PEP 8)   ",
    "================================================",
    " 1. Adição (+)",
    " 2. Subtração (-)",
    " 3. Multiplicação (*)",
    " 4. Divisão (/)",
    " 5. Ver Histórico",
    " 6. Limpar Histórico",
    " 0. Sair",
    "================================================",
  ];

  const [historyLines, setHistoryLines] = useState<string[]>([
    "Iniciando Calculadora de Operações Básicas...",
    ...getMenuLines(),
  ]);

  const [currentPrompt, setCurrentPrompt] = useState<string>("Escolha uma opção (0 a 6): ");
  const [step, setStep] = useState<PromptStep>({ state: 'MENU' });
  const [inputValue, setInputValue] = useState<string>('');
  const [isTerminated, setIsTerminated] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historyLines, currentPrompt]);

  const handleRestart = () => {
    setIsTerminated(false);
    setStep({ state: 'MENU' });
    setCurrentPrompt("Escolha uma opção (0 a 6): ");
    setInputValue('');
    setHistoryLines([
      "Sessão reiniciada.",
      "Iniciando Calculadora de Operações Básicas...",
      ...getMenuLines(),
    ]);
  };

  const parseNumber = (val: string): number | null => {
    const sanitized = val.trim().replace(',', '.');
    if (sanitized === '' || isNaN(Number(sanitized))) {
      return null;
    }
    return Number(sanitized);
  };

  const processInput = (text: string) => {
    if (isTerminated) return;
    const sanitized = text.trim();
    const newLines = [...historyLines, `${currentPrompt}${text}`];

    if (step.state === 'MENU') {
      if (sanitized === '0') {
        newLines.push("\nEncerrando a calculadora. Até logo!");
        setHistoryLines(newLines);
        setIsTerminated(true);
        setCurrentPrompt("[Sessão Finalizada]");
        setInputValue('');
        return;
      }

      if (['1', '2', '3', '4'].includes(sanitized)) {
        const prompts: Record<string, string> = {
          '1': "Digite o primeiro número: ",
          '2': "Digite o primeiro número: ",
          '3': "Digite o primeiro número: ",
          '4': "Digite o dividendo: ",
        };
        setStep({ state: 'WAIT_A', op: sanitized, prompt: prompts[sanitized] });
        setCurrentPrompt(prompts[sanitized]);
        setHistoryLines(newLines);
        setInputValue('');
        return;
      }

      if (sanitized === '5') {
        const records = engine.getHistory();
        newLines.push("\n--- Histórico de Operações ---");
        if (records.length === 0) {
          newLines.push("  (Nenhuma operação realizada ainda)");
        } else {
          records.forEach((r) => {
            newLines.push(`  [${r.timestamp}] ${r.expression} = ${engine.fmt(r.result)}`);
          });
        }
        newLines.push("------------------------------\n");
        newLines.push(...getMenuLines());
        setHistoryLines(newLines);
        setCurrentPrompt("Escolha uma opção (0 a 6): ");
        setInputValue('');
        return;
      }

      if (sanitized === '6') {
        engine.clearHistory();
        newLines.push(" -> Histórico limpo com sucesso!\n");
        newLines.push(...getMenuLines());
        setHistoryLines(newLines);
        setCurrentPrompt("Escolha uma opção (0 a 6): ");
        setInputValue('');
        onOperationSuccess?.();
        return;
      }

      // Opção inválida
      newLines.push("  [AVISO] Opção inválida. Selecione uma opção entre 0 e 6.\n");
      newLines.push(...getMenuLines());
      setHistoryLines(newLines);
      setCurrentPrompt("Escolha uma opção (0 a 6): ");
      setInputValue('');
      return;
    }

    if (step.state === 'WAIT_A') {
      const numA = parseNumber(sanitized);
      if (numA === null) {
        newLines.push("  [ERRO] Entrada inválida! Digite um número válido.");
        setHistoryLines(newLines);
        setInputValue('');
        return;
      }

      const secondPrompts: Record<string, string> = {
        '1': "Digite o segundo número: ",
        '2': "Digite o segundo número: ",
        '3': "Digite o segundo número: ",
        '4': "Digite o divisor: ",
      };

      const promptB = secondPrompts[step.op];
      setStep({ state: 'WAIT_B', op: step.op, a: numA, prompt: promptB });
      setCurrentPrompt(promptB);
      setHistoryLines(newLines);
      setInputValue('');
      return;
    }

    if (step.state === 'WAIT_B') {
      const numB = parseNumber(sanitized);
      if (numB === null) {
        newLines.push("  [ERRO] Entrada inválida! Digite um número válido.");
        setHistoryLines(newLines);
        setInputValue('');
        return;
      }

      try {
        let result = 0;
        let exprStr = '';

        if (step.op === '1') {
          result = engine.add(step.a, numB);
          exprStr = `${engine.fmt(step.a)} + ${engine.fmt(numB)}`;
        } else if (step.op === '2') {
          result = engine.subtract(step.a, numB);
          exprStr = `${engine.fmt(step.a)} - ${engine.fmt(numB)}`;
        } else if (step.op === '3') {
          result = engine.multiply(step.a, numB);
          exprStr = `${engine.fmt(step.a)} * ${engine.fmt(numB)}`;
        } else if (step.op === '4') {
          result = engine.divide(step.a, numB);
          exprStr = `${engine.fmt(step.a)} / ${engine.fmt(numB)}`;
        }

        newLines.push(` -> Resultado: ${exprStr} = ${engine.fmt(result)}\n`);
        onOperationSuccess?.();
      } catch (err) {
        if (err instanceof DivisionByZeroError) {
          newLines.push(`  [ERRO MATEMÁTICO] ${err.message}\n`);
        } else {
          newLines.push(`  [ERRO INESPERADO] ${(err as Error).message}\n`);
        }
      }

      newLines.push(...getMenuLines());
      setHistoryLines(newLines);
      setStep({ state: 'MENU' });
      setCurrentPrompt("Escolha uma opção (0 a 6): ");
      setInputValue('');
      return;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processInput(inputValue);
    }
  };

  const runPreset = (sequence: string[]) => {
    if (isTerminated) {
      handleRestart();
    }
    sequence.forEach((val) => {
      processInput(val);
    });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Banner & Quick Validation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-semibold text-white">CLI Interativa (Operações Básicas)</h2>
          <span className="text-xs text-slate-500">·</span>
          <span className="text-xs text-slate-400">Loop contínuo com try/except</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => runPreset(['4', '10', '0'])}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/20 rounded-md transition-colors cursor-pointer"
            title="Demonstra a captura de divisão por zero sem interromper o loop"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Divisão por Zero (10/0)</span>
          </button>

          <button
            onClick={() => runPreset(['1', '125', '75'])}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/20 rounded-md transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Adição (125 + 75)</span>
          </button>

          <button
            onClick={() => runPreset(['3', '12', '8'])}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-md transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Multiplicação (12 * 8)</span>
          </button>

          <button
            onClick={() => runPreset(['2', '50', '80'])}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/20 rounded-md transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Subtração (50 - 80)</span>
          </button>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
            title="Reiniciar sessão do terminal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Terminal Display */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex-1 min-h-[460px] max-h-[580px] p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm overflow-y-auto cursor-text shadow-inner flex flex-col"
      >
        <div className="flex-1 space-y-1">
          {historyLines.map((line, index) => {
            const isError = line.includes('[ERRO') || line.includes('[AVISO');
            const isSuccess = line.includes('-> Resultado:');
            const isHeader = line.includes('CALCULADORA DE OPERAÇÕES BÁSICAS');
            const isDivider = line.startsWith('====') || line.startsWith('----');

            return (
              <div
                key={index}
                className={`leading-relaxed whitespace-pre-wrap ${
                  isError
                    ? 'text-red-400 font-semibold'
                    : isSuccess
                    ? 'text-emerald-400 font-semibold'
                    : isHeader
                    ? 'text-blue-400 font-bold'
                    : isDivider
                    ? 'text-slate-600'
                    : 'text-slate-300'
                }`}
              >
                {line}
              </div>
            );
          })}
        </div>

        {/* Live Prompt Line */}
        {!isTerminated ? (
          <div className="flex items-center gap-2 pt-2 text-slate-200 mt-2 border-t border-slate-900">
            <span className="text-blue-400 font-semibold shrink-0">{currentPrompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-0 outline-none text-white font-mono text-sm focus:ring-0 p-0"
              placeholder="Digite o número e pressione Enter..."
              autoFocus
            />
          </div>
        ) : (
          <div className="pt-3 text-slate-500 flex items-center justify-between">
            <span>Sessão encerrada. Clique no botão &apos;Reiniciar&apos; para executar novamente.</span>
            <button
              onClick={handleRestart}
              className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 cursor-pointer"
            >
              Reiniciar Sessão
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 px-2">
        <div className="flex items-center gap-2">
          <span>Python 3.8+ PEP 8</span>
          <span>·</span>
          <span>Operações Básicas: +, -, *, /</span>
          <span>·</span>
          <span>Histórico em memória</span>
        </div>
        <span>Pressione Enter para submeter cada etapa</span>
      </div>
    </div>
  );
};
