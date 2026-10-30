import React, { useState } from 'react';
import { AppWindow, Clock, Trash2, X, AlertCircle } from 'lucide-react';
import { CalculatorEngineMirror, DivisionByZeroError } from '../calculatorEngine.ts';

interface TkinterSimulatorProps {
  engine: CalculatorEngineMirror;
  onOperationSuccess?: () => void;
}

export const TkinterSimulator: React.FC<TkinterSimulatorProps> = ({ engine, onOperationSuccess }) => {
  const [display, setDisplay] = useState<string>('0');
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [resetOnNext, setResetOnNext] = useState<boolean>(false);

  // Modal de Histórico (simulando Toplevel do Tkinter)
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  // Modal de Alerta (simulando messagebox.showwarning do Tkinter)
  const [alertInfo, setAlertInfo] = useState<{ title: string; message: string } | null>(null);

  const getFloat = (): number => {
    const raw = display.replace(',', '.');
    return parseFloat(raw);
  };

  const handleDigit = (digit: string) => {
    if (resetOnNext || display === '0') {
      setDisplay(digit);
      setResetOnNext(false);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleDecimal = () => {
    if (resetOnNext) {
      setDisplay('0.');
      setResetOnNext(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPendingOp(null);
    setStoredValue(null);
    setResetOnNext(false);
  };

  const handleClearEntry = () => {
    setDisplay('0');
    setResetOnNext(false);
  };

  const handleBinaryOp = (op: string) => {
    try {
      const val = getFloat();
      setStoredValue(val);
      setPendingOp(op);
      setResetOnNext(true);
    } catch {
      setAlertInfo({ title: "Erro de Entrada", message: "Valor numérico inválido." });
    }
  };

  const handleEqual = () => {
    if (pendingOp === null || storedValue === null) {
      return;
    }

    try {
      const secondVal = getFloat();
      let res = 0;

      if (pendingOp === '+') res = engine.add(storedValue, secondVal);
      else if (pendingOp === '-') res = engine.subtract(storedValue, secondVal);
      else if (pendingOp === '*') res = engine.multiply(storedValue, secondVal);
      else if (pendingOp === '/') res = engine.divide(storedValue, secondVal);

      setDisplay(engine.fmt(res));
      setPendingOp(null);
      setStoredValue(null);
      setResetOnNext(true);
      onOperationSuccess?.();
    } catch (err) {
      if (err instanceof DivisionByZeroError) {
        setAlertInfo({
          title: "Divisão por Zero",
          message: err.message,
        });
      }
      setResetOnNext(true);
    }
  };

  const history = engine.getHistory();

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
      {/* Container simulador Tkinter Desktop Frame */}
      <div className="w-full max-w-[360px] mx-auto rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden relative">
        {/* Title Bar do Tkinter (Linux/Windows style) */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700 select-none">
          <div className="flex items-center gap-2">
            <AppWindow className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-200">Calculadora Básica - PEP 8</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600 hover:bg-slate-500 cursor-pointer" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600 hover:bg-slate-500 cursor-pointer" />
            <div
              onClick={handleClear}
              className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-400 cursor-pointer"
              title="Fechar / Limpar"
            />
          </div>
        </div>

        {/* Display Screen (Tkinter Entry) */}
        <div className="p-4 bg-slate-900">
          <div className="flex flex-col justify-end items-end h-24 p-3 bg-slate-950 border border-slate-800 rounded-lg text-right font-mono">
            {pendingOp && storedValue !== null && (
              <span className="text-xs text-slate-500 font-mono mb-1">
                {engine.fmt(storedValue)} {pendingOp}
              </span>
            )}
            <span className="text-3xl font-bold text-white tracking-tight tabular-nums break-all overflow-hidden">
              {display}
            </span>
          </div>
        </div>

        {/* Keypad Grid (Tkinter Buttons Grid) */}
        <div className="p-4 pt-0 grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <button
            onClick={handleClear}
            className="h-13 font-semibold text-sm bg-red-600/90 hover:bg-red-500 active:scale-95 text-white rounded-lg transition-all cursor-pointer shadow-sm"
          >
            C
          </button>
          <button
            onClick={handleClearEntry}
            className="h-13 font-semibold text-sm bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 rounded-lg transition-all cursor-pointer"
          >
            CE
          </button>
          <button
            onClick={() => handleBinaryOp('/')}
            className={`h-13 font-semibold text-base rounded-lg transition-all cursor-pointer ${
              pendingOp === '/' ? 'bg-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
            }`}
          >
            /
          </button>
          <button
            onClick={() => handleBinaryOp('*')}
            className={`h-13 font-semibold text-base rounded-lg transition-all cursor-pointer ${
              pendingOp === '*' ? 'bg-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
            }`}
          >
            *
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleDigit('7')}
            className="h-13 font-semibold text-base bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-lg transition-all cursor-pointer"
          >
            7
          </button>
          <button
            onClick={() => handleDigit('8')}
            className="h-13 font-semibold text-base bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-lg transition-all cursor-pointer"
          >
            8
          </button>
          <button
            onClick={() => handleDigit('9')}
            className="h-13 font-semibold text-base bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-lg transition-all cursor-pointer"
          >
            9
          </button>
          <button
            onClick={() => handleBinaryOp('-')}
            className={`h-13 font-semibold text-base rounded-lg transition-all cursor-pointer ${
              pendingOp === '-' ? 'bg-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
            }`}
          >
            -
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleDigit('4')}
            className="h-13 font-semibold text-base bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-lg transition-all cursor-pointer"
          >
            4
          </button>
          <button
            onClick={() => handleDigit('5')}
            className="h-13 font-semibold text-base bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-lg transition-all cursor-pointer"
          >
            5
          </button>
          <button
            onClick={() => handleDigit('6')}
            className="h-13 font-semibold text-base bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-lg transition-all cursor-pointer"
          >
            6
          </button>
          <button
            onClick={() => handleBinaryOp('+')}
            className={`h-13 font-semibold text-base rounded-lg transition-all cursor-pointer ${
              pendingOp === '+' ? 'bg-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
            }`}
          >
            +
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleDigit('1')}
            className="h-13 font-semibold text-base bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-lg transition-all cursor-pointer"
          >
            1
          </button>
          <button
            onClick={() => handleDigit('2')}
            className="h-13 font-semibold text-base bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-lg transition-all cursor-pointer"
          >
            2
          </button>
          <button
            onClick={() => handleDigit('3')}
            className="h-13 font-semibold text-base bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-lg transition-all cursor-pointer"
          >
            3
          </button>
          <button
            onClick={handleEqual}
            className="h-13 font-semibold text-base bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-lg transition-all cursor-pointer shadow-md row-span-2 flex items-center justify-center"
          >
            =
          </button>

          {/* Row 5 */}
          <button
            onClick={() => handleDigit('0')}
            className="h-13 font-semibold text-base bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-lg transition-all cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleDecimal}
            className="h-13 font-semibold text-base bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-lg transition-all cursor-pointer"
          >
            .
          </button>
          <button
            onClick={() => {
              handleDigit('0');
              handleDigit('0');
            }}
            className="h-13 font-semibold text-sm bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-lg transition-all cursor-pointer"
          >
            00
          </button>
        </div>

        {/* Bottom Utility Bar */}
        <div className="p-4 pt-0">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Ver Histórico em Memória ({history.length})</span>
          </button>
        </div>

        {/* Modal Simulado de Histórico (Tkinter Toplevel) */}
        {showHistoryModal && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs p-4 flex flex-col z-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-white">Histórico de Operações</span>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2 font-mono text-xs">
              {history.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500">
                  Nenhuma operação registrada ainda.
                </div>
              ) : (
                history.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <span className="text-slate-300">{item.expression}</span>
                    <span className="text-emerald-400 font-semibold tabular-nums">
                      = {engine.fmt(item.result)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  engine.clearHistory();
                  onOperationSuccess?.();
                }}
                disabled={history.length === 0}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-red-600/80 hover:bg-red-500 disabled:opacity-40 text-white rounded-md transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Limpar Histórico</span>
              </button>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Modal Simulado messagebox.showwarning do Tkinter */}
        {alertInfo && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 z-30">
            <div className="w-full max-w-[300px] bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h4 className="text-sm font-semibold">{alertInfo.title}</h4>
              </div>
              <p className="text-xs text-slate-300 mb-4">{alertInfo.message}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setAlertInfo(null)}
                  className="px-4 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Painel lateral explicativo sobre a integração Tkinter */}
      <div className="flex-1 w-full max-w-xl space-y-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <AppWindow className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Interface Gráfica Focada nas 4 Operações</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            A função <code className="text-blue-300 font-mono">run_tkinter_gui(engine)</code> em <code className="text-slate-300 font-mono">calculadora.py</code> foi refinada para focar exclusivamente nas contas fundamentais: <code className="text-emerald-400 font-mono">+</code>, <code className="text-emerald-400 font-mono">-</code>, <code className="text-emerald-400 font-mono">*</code> e <code className="text-emerald-400 font-mono">/</code>.
          </p>

          <div className="space-y-2 pt-2">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 text-xs space-y-1">
              <span className="font-semibold text-slate-200">1. Desacoplamento Limpo:</span>
              <p className="text-slate-400">
                A UI delega cada cálculo ao motor <code className="text-blue-300 font-mono">CalculatorEngine</code>, mantendo a regra de negócio livre de qualquer dependência visual.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 text-xs space-y-1">
              <span className="font-semibold text-slate-200">2. Proteção contra Divisão por Zero:</span>
              <p className="text-slate-400">
                Caso o usuário tente dividir por zero, o erro é capturado e exibido via diálogo nativo <code className="text-amber-300 font-mono">messagebox.showwarning</code>, sem fechar a calculadora.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 text-xs space-y-1">
              <span className="font-semibold text-slate-200">3. Histórico de Sessão:</span>
              <p className="text-slate-400">
                Todas as operações computadas são gravadas em uma lista de registros <code className="text-blue-300 font-mono">OperationRecord</code> com carimbo de hora.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-blue-300 flex items-center justify-between">
          <span>Para abrir a interface gráfica Tkinter localmente:</span>
          <code className="px-2 py-1 bg-slate-900 rounded font-mono text-white text-[11px]">
            python calculadora.py --gui
          </code>
        </div>
      </div>
    </div>
  );
};
