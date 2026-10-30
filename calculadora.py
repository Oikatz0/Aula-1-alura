"""Calculadora de operações fundamentais em Python seguindo PEP 8.

Este módulo implementa o núcleo matemático desacoplado de interfaces,
suportando exclusivamente as quatro operações básicas:
- Adição (+)
- Subtração (-)
- Multiplicação (*)
- Divisão (/)

Inclui histórico em memória, tratamento robusto de exceções e
interfaces tanto em Linha de Comando (CLI) quanto Gráfica (Tkinter).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
import sys
from typing import List, Optional


# ============================================================================
# EXCEÇÕES DE DOMÍNIO
# ============================================================================

class CalculatorError(Exception):
    """Exceção base para erros de cálculo da aplicação."""


class DivisionByZeroError(CalculatorError):
    """Lançada quando ocorre tentativa de divisão por zero."""


# ============================================================================
# MODELOS E HISTÓRICO EM MEMÓRIA
# ============================================================================

@dataclass(frozen=True)
class OperationRecord:
    """Registro imutável de uma operação matemática realizada."""

    expression: str
    result: float
    timestamp: datetime = field(default_factory=datetime.now)

    def formatted(self) -> str:
        """Retorna a representação formatada da operação."""
        time_str = self.timestamp.strftime("%H:%M:%S")
        f_res = float(self.result)
        result_str = f"{int(f_res)}" if f_res.is_integer() else f"{f_res:.4g}"
        return f"[{time_str}] {self.expression} = {result_str}"


class CalculationHistory:
    """Gerenciador em memória do histórico de operações com capacidade limitada."""

    def __init__(self, max_items: int = 50) -> None:
        """Inicializa o histórico com limite máximo de registros."""
        self._max_items: int = max_items
        self._records: List[OperationRecord] = []

    def add(self, expression: str, result: float) -> OperationRecord:
        """Adiciona uma nova operação ao histórico."""
        record = OperationRecord(expression=expression, result=result)
        self._records.append(record)
        if len(self._records) > self._max_items:
            self._records.pop(0)
        return record

    def get_all(self) -> List[OperationRecord]:
        """Retorna uma cópia da lista de registros do histórico."""
        return list(self._records)

    def get_latest(self) -> Optional[OperationRecord]:
        """Retorna a operação mais recente, se houver."""
        return self._records[-1] if self._records else None

    def clear(self) -> None:
        """Limpa todos os registros do histórico em memória."""
        self._records.clear()

    def __len__(self) -> int:
        """Retorna a quantidade de operações registradas."""
        return len(self._records)


# ============================================================================
# NÚCLEO DE CÁLCULO (MOTOR DESACOPLADO)
# ============================================================================

class CalculatorEngine:
    """Motor de cálculo desacoplado de qualquer interface gráfica ou terminal."""

    def __init__(self, history: Optional[CalculationHistory] = None) -> None:
        """Inicializa o motor com histórico opcional."""
        self.history: CalculationHistory = (
            history if history is not None else CalculationHistory()
        )

    def add(self, a: float, b: float) -> float:
        """Realiza adição entre dois números: a + b."""
        result = a + b
        self.history.add(f"{self._fmt(a)} + {self._fmt(b)}", result)
        return result

    def subtract(self, a: float, b: float) -> float:
        """Realiza subtração entre dois números: a - b."""
        result = a - b
        self.history.add(f"{self._fmt(a)} - {self._fmt(b)}", result)
        return result

    def multiply(self, a: float, b: float) -> float:
        """Realiza multiplicação entre dois números: a * b."""
        result = a * b
        self.history.add(f"{self._fmt(a)} * {self._fmt(b)}", result)
        return result

    def divide(self, a: float, b: float) -> float:
        """Realiza divisão entre dois números: a / b com validação explícita."""
        if b == 0.0:
            raise DivisionByZeroError("Divisão por zero não é permitida.")
        result = a / b
        self.history.add(f"{self._fmt(a)} / {self._fmt(b)}", result)
        return result

    @staticmethod
    def _fmt(val: float | int) -> str:
        """Formata valor numérico para exibição sucinta."""
        f_val = float(val)
        return f"{int(f_val)}" if f_val.is_integer() else f"{f_val:.4g}"


# ============================================================================
# INTERFACE EM LINHA DE COMANDO (CLI)
# ============================================================================

class CommandLineInterface:
    """Interface CLI interativa com loop contínuo e validação de entradas."""

    def __init__(self, engine: CalculatorEngine) -> None:
        """Inicializa a CLI vinculada a um motor de cálculo."""
        self.engine = engine

    def display_menu(self) -> None:
        """Exibe o menu de opções disponíveis no terminal."""
        print("\n" + "=" * 48)
        print("     CALCULADORA DE OPERAÇÕES BÁSICAS (PEP 8)   ")
        print("=" * 48)
        print(" 1. Adição (+)")
        print(" 2. Subtração (-)")
        print(" 3. Multiplicação (*)")
        print(" 4. Divisão (/)")
        print(" 5. Ver Histórico")
        print(" 6. Limpar Histórico")
        print(" 0. Sair")
        print("=" * 48)

    def read_float(self, prompt: str) -> float:
        """Solicita e valida uma entrada numérica via terminal."""
        while True:
            raw = input(prompt).strip().replace(",", ".")
            try:
                return float(raw)
            except ValueError:
                print("  [ERRO] Entrada inválida! Digite um número válido.")

    def run(self) -> None:
        """Executa o loop interativo da CLI até o usuário decidir sair."""
        print("Iniciando Calculadora de Operações Básicas...")
        while True:
            self.display_menu()
            option = input("Escolha uma opção (0 a 6): ").strip()

            if option == "0":
                print("\nEncerrando a calculadora. Até logo!")
                break

            try:
                if option == "1":
                    a = self.read_float("Digite o primeiro número: ")
                    b = self.read_float("Digite o segundo número: ")
                    res = self.engine.add(a, b)
                    print(f" -> Resultado: {self.engine._fmt(a)} + {self.engine._fmt(b)} = {self.engine._fmt(res)}")

                elif option == "2":
                    a = self.read_float("Digite o primeiro número: ")
                    b = self.read_float("Digite o segundo número: ")
                    res = self.engine.subtract(a, b)
                    print(f" -> Resultado: {self.engine._fmt(a)} - {self.engine._fmt(b)} = {self.engine._fmt(res)}")

                elif option == "3":
                    a = self.read_float("Digite o primeiro número: ")
                    b = self.read_float("Digite o segundo número: ")
                    res = self.engine.multiply(a, b)
                    print(f" -> Resultado: {self.engine._fmt(a)} * {self.engine._fmt(b)} = {self.engine._fmt(res)}")

                elif option == "4":
                    a = self.read_float("Digite o dividendo: ")
                    b = self.read_float("Digite o divisor: ")
                    res = self.engine.divide(a, b)
                    print(f" -> Resultado: {self.engine._fmt(a)} / {self.engine._fmt(b)} = {self.engine._fmt(res)}")

                elif option == "5":
                    self.show_history()

                elif option == "6":
                    self.engine.history.clear()
                    print(" -> Histórico limpo com sucesso!")

                else:
                    print("  [AVISO] Opção inválida. Selecione uma opção entre 0 e 6.")

            except DivisionByZeroError as err:
                print(f"  [ERRO MATEMÁTICO] {err}")
            except CalculatorError as err:
                print(f"  [ERRO GERAL] {err}")
            except Exception as err:
                print(f"  [ERRO INESPERADO] Ocorreu uma falha: {err}")

    def show_history(self) -> None:
        """Exibe o histórico de operações no terminal."""
        records = self.engine.history.get_all()
        print("\n--- Histórico de Operações ---")
        if not records:
            print("  (Nenhuma operação realizada ainda)")
        else:
            for rec in records:
                print(f"  {rec.formatted()}")
        print("-" * 30)


# ============================================================================
# INTERFACE GRÁFICA (GUI - TKINTER)
# ============================================================================

def run_tkinter_gui(engine: CalculatorEngine) -> None:
    """Inicia a interface gráfica Tkinter se o módulo estiver disponível."""
    try:
        import tkinter as tk
        from tkinter import messagebox
    except ImportError:
        print("[ERRO] O módulo Tkinter não está disponível neste ambiente.")
        print("Execute sem o argumento --gui para usar a interface CLI.")
        return

    root = tk.Tk()
    root.title("Calculadora Básica - PEP 8")
    root.geometry("360x520")
    root.resizable(False, False)
    root.configure(bg="#0F172A")

    display_var = tk.StringVar(value="0")
    pending_op: Optional[str] = None
    stored_value: Optional[float] = None
    reset_on_next: bool = False

    display_frame = tk.Frame(root, bg="#0F172A", padx=16, pady=16)
    display_frame.pack(fill="x")

    display_entry = tk.Entry(
        display_frame,
        textvariable=display_var,
        font=("Helvetica", 28, "bold"),
        justify="right",
        bd=0,
        bg="#1E293B",
        fg="#F8FAFC",
        insertbackground="#F8FAFC",
    )
    display_entry.pack(fill="x", ipady=12)

    def get_current_float() -> float:
        raw = display_var.get().replace(",", ".")
        return float(raw)

    def set_display(val: float) -> None:
        display_var.set(engine._fmt(val))

    def on_digit(digit: str) -> None:
        nonlocal reset_on_next
        current = display_var.get()
        if reset_on_next or current == "0":
            display_var.set(digit)
            reset_on_next = False
        else:
            display_var.set(current + digit)

    def on_decimal() -> None:
        nonlocal reset_on_next
        if reset_on_next:
            display_var.set("0.")
            reset_on_next = False
            return
        if "." not in display_var.get():
            display_var.set(display_var.get() + ".")

    def on_clear() -> None:
        nonlocal pending_op, stored_value, reset_on_next
        display_var.set("0")
        pending_op = None
        stored_value = None
        reset_on_next = False

    def on_binary_op(op_symbol: str) -> None:
        nonlocal pending_op, stored_value, reset_on_next
        try:
            stored_value = get_current_float()
            pending_op = op_symbol
            reset_on_next = True
        except ValueError:
            messagebox.showerror("Erro de Entrada", "Valor numérico inválido.")

    def on_equal() -> None:
        nonlocal pending_op, stored_value, reset_on_next
        if pending_op is None or stored_value is None:
            return

        try:
            second_val = get_current_float()
            if pending_op == "+":
                res = engine.add(stored_value, second_val)
            elif pending_op == "-":
                res = engine.subtract(stored_value, second_val)
            elif pending_op == "*":
                res = engine.multiply(stored_value, second_val)
            elif pending_op == "/":
                res = engine.divide(stored_value, second_val)
            else:
                return

            set_display(res)
            pending_op = None
            stored_value = None
            reset_on_next = True
        except DivisionByZeroError as err:
            messagebox.showwarning("Divisão por Zero", str(err))
            reset_on_next = True
        except ValueError:
            messagebox.showerror("Erro", "Valor de entrada inválido.")

    def show_gui_history() -> None:
        hist_window = tk.Toplevel(root)
        hist_window.title("Histórico de Operações")
        hist_window.geometry("340x380")
        hist_window.configure(bg="#0F172A")

        title = tk.Label(
            hist_window,
            text="Histórico em Memória",
            font=("Helvetica", 12, "bold"),
            bg="#0F172A",
            fg="#F8FAFC",
            pady=8,
        )
        title.pack()

        listbox = tk.Listbox(
            hist_window,
            bg="#1E293B",
            fg="#F8FAFC",
            selectbackground="#3B82F6",
            font=("Courier", 10),
            bd=0,
        )
        listbox.pack(fill="both", expand=True, padx=12, pady=6)

        records = engine.history.get_all()
        if not records:
            listbox.insert("end", " Nenhuma operação registrada.")
        else:
            for r in records:
                listbox.insert("end", f" {r.formatted()}")

        btn_clear = tk.Button(
            hist_window,
            text="Limpar Histórico",
            bg="#EF4444",
            fg="white",
            relief="flat",
            command=lambda: [engine.history.clear(), listbox.delete(0, "end")],
        )
        btn_clear.pack(pady=8)

    btn_frame = tk.Frame(root, bg="#0F172A", padx=16, pady=4)
    btn_frame.pack(fill="both", expand=True)

    keypad = [
        [("C", on_clear, "#EF4444"), ("CE", lambda: display_var.set("0"), "#475569"), ("/", lambda: on_binary_op("/"), "#2563EB"), ("*", lambda: on_binary_op("*"), "#2563EB")],
        [("7", lambda: on_digit("7"), "#1E293B"), ("8", lambda: on_digit("8"), "#1E293B"), ("9", lambda: on_digit("9"), "#1E293B"), ("-", lambda: on_binary_op("-"), "#2563EB")],
        [("4", lambda: on_digit("4"), "#1E293B"), ("5", lambda: on_digit("5"), "#1E293B"), ("6", lambda: on_digit("6"), "#1E293B"), ("+", lambda: on_binary_op("+"), "#2563EB")],
        [("1", lambda: on_digit("1"), "#1E293B"), ("2", lambda: on_digit("2"), "#1E293B"), ("3", lambda: on_digit("3"), "#1E293B"), ("=", on_equal, "#10B981")],
        [("0", lambda: on_digit("0"), "#1E293B"), (".", on_decimal, "#1E293B"), ("00", lambda: [on_digit("0"), on_digit("0")], "#1E293B"), ("=", on_equal, "#10B981")],
    ]

    for r_idx, row in enumerate(keypad):
        btn_frame.rowconfigure(r_idx, weight=1)
        for c_idx, (text, cmd, color) in enumerate(row):
            btn_frame.columnconfigure(c_idx, weight=1)
            b = tk.Button(
                btn_frame,
                text=text,
                command=cmd,
                bg=color,
                fg="white",
                font=("Helvetica", 14, "bold"),
                relief="flat",
                bd=0,
                activebackground="#475569",
                activeforeground="white",
            )
            b.grid(row=r_idx, column=c_idx, sticky="nsew", padx=3, pady=3)

    # Linha extra para 0, ponto e igual
    bottom_frame = tk.Frame(root, bg="#0F172A", padx=16, pady=8)
    bottom_frame.pack(fill="x")
    hist_btn = tk.Button(
        bottom_frame,
        text="Ver Histórico em Memória",
        command=show_gui_history,
        bg="#334155",
        fg="#F8FAFC",
        font=("Helvetica", 10),
        relief="flat",
    )
    hist_btn.pack(fill="x")

    root.mainloop()


# ============================================================================
# PONTO DE ENTRADA PRINCIPAL
# ============================================================================

def main() -> None:
    """Ponto de entrada do script com roteamento de interface."""
    engine = CalculatorEngine()

    if "--gui" in sys.argv:
        run_tkinter_gui(engine)
    else:
        cli = CommandLineInterface(engine)
        cli.run()


if __name__ == "__main__":
    main()
