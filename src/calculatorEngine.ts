/**
 * Espelho em TypeScript do núcleo matemático CalculatorEngine (calculadora.py).
 * Contém exclusivamente as 4 operações básicas: Adição, Subtração, Multiplicação e Divisão.
 */

export class DivisionByZeroError extends Error {
  constructor(message = "Divisão por zero não é permitida.") {
    super(message);
    this.name = "DivisionByZeroError";
  }
}

export interface HistoryEntry {
  expression: string;
  result: number;
  timestamp: string;
}

export class CalculatorEngineMirror {
  private history: HistoryEntry[] = [];
  private readonly maxItems: number;

  constructor(maxItems = 50) {
    this.maxItems = maxItems;
  }

  public fmt(val: number): string {
    if (Number.isInteger(val)) {
      return val.toString();
    }
    return parseFloat(val.toPrecision(6)).toString();
  }

  private record(expression: string, result: number): void {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    this.history.push({
      expression,
      result,
      timestamp: timeStr,
    });
    if (this.history.length > this.maxItems) {
      this.history.shift();
    }
  }

  public add(a: number, b: number): number {
    const res = a + b;
    this.record(`${this.fmt(a)} + ${this.fmt(b)}`, res);
    return res;
  }

  public subtract(a: number, b: number): number {
    const res = a - b;
    this.record(`${this.fmt(a)} - ${this.fmt(b)}`, res);
    return res;
  }

  public multiply(a: number, b: number): number {
    const res = a * b;
    this.record(`${this.fmt(a)} * ${this.fmt(b)}`, res);
    return res;
  }

  public divide(a: number, b: number): number {
    if (b === 0) {
      throw new DivisionByZeroError("Divisão por zero não é permitida.");
    }
    const res = a / b;
    this.record(`${this.fmt(a)} / ${this.fmt(b)}`, res);
    return res;
  }

  public getHistory(): HistoryEntry[] {
    return [...this.history];
  }

  public clearHistory(): void {
    this.history = [];
  }
}
