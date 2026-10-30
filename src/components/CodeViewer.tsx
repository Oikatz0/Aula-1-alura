import React, { useState } from 'react';
import { Copy, Check, Download, FileCode2, CheckCircle2 } from 'lucide-react';
import { CALCULADORA_PY_CODE, TEST_CALCULADORA_PY_CODE } from '../pythonCode.ts';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<'calculadora' | 'testes'>('calculadora');
  const [copied, setCopied] = useState(false);

  const currentCode = selectedFile === 'calculadora' ? CALCULADORA_PY_CODE : TEST_CALCULADORA_PY_CODE;
  const currentFileName = selectedFile === 'calculadora' ? 'calculadora.py' : 'test_calculadora.py';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', currentFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = currentCode.split('\n');

  return (
    <div className="flex flex-col space-y-4">
      {/* File selector & Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          {/* Functional tab selectors */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setSelectedFile('calculadora')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedFile === 'calculadora'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>calculadora.py (Principal)</span>
            </button>
            <button
              onClick={() => setSelectedFile('testes')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedFile === 'testes'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>test_calculadora.py (Unit Tests)</span>
            </button>
          </div>
          <span className="text-xs text-slate-500">·</span>
          <span className="text-xs text-slate-400 font-mono">{lines.length} linhas</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Código</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar {currentFileName}</span>
          </button>
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
        <div className="overflow-x-auto max-h-[620px] font-mono text-xs leading-relaxed p-4">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                  <td className="text-right pr-4 select-none text-slate-600 tabular-nums w-10 text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre text-slate-200">
                    {/* Basic syntax color highlight simulation for Python */}
                    {line.startsWith('#') || line.includes('"""') ? (
                      <span className="text-slate-500 italic">{line}</span>
                    ) : line.includes('class ') ? (
                      <span className="text-amber-300 font-semibold">{line}</span>
                    ) : line.includes('def ') ? (
                      <span className="text-blue-400">{line}</span>
                    ) : line.includes('import ') || line.includes('from ') ? (
                      <span className="text-purple-400">{line}</span>
                    ) : line.includes('raise ') || line.includes('except ') ? (
                      <span className="text-red-400">{line}</span>
                    ) : line.includes('return ') ? (
                      <span className="text-cyan-400">{line}</span>
                    ) : (
                      line
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
