"""Suíte de testes unitários para a calculadora básica em Python (PEP 8).

Cobre exclusivamente as operações fundamentais:
- Adição
- Subtração
- Multiplicação
- Divisão (incluindo validação explícita de DivisionByZeroError)
- Histórico em memória
"""

import unittest
from calculadora import (
    CalculatorEngine,
    CalculationHistory,
    DivisionByZeroError,
)


class TestBasicCalculatorEngine(unittest.TestCase):
    """Testes unitários para o motor desacoplado CalculatorEngine."""

    def setUp(self) -> None:
        """Inicializa um motor novo antes de cada teste."""
        self.engine = CalculatorEngine()

    def test_addition(self) -> None:
        """Testa adição básica, com números negativos e decimais."""
        self.assertEqual(self.engine.add(10.0, 5.0), 15.0)
        self.assertEqual(self.engine.add(-3.0, 3.0), 0.0)
        self.assertAlmostEqual(self.engine.add(0.1, 0.2), 0.3, places=5)

    def test_subtraction(self) -> None:
        """Testa subtração básica e resultados negativos."""
        self.assertEqual(self.engine.subtract(10.0, 4.0), 6.0)
        self.assertEqual(self.engine.subtract(5.0, 15.0), -10.0)
        self.assertEqual(self.engine.subtract(0.0, 7.5), -7.5)

    def test_multiplication(self) -> None:
        """Testa multiplicação básica, com números negativos e elemento nulo."""
        self.assertEqual(self.engine.multiply(4.0, 5.0), 20.0)
        self.assertEqual(self.engine.multiply(100.0, 0.0), 0.0)
        self.assertEqual(self.engine.multiply(-6.0, 3.0), -18.0)

    def test_division_success(self) -> None:
        """Testa divisões válidas com quocientes inteiros e fracionários."""
        self.assertEqual(self.engine.divide(20.0, 4.0), 5.0)
        self.assertEqual(self.engine.divide(7.0, 2.0), 3.5)
        self.assertEqual(self.engine.divide(-15.0, 3.0), -5.0)

    def test_division_by_zero_raises_exception(self) -> None:
        """Garante que divisão por zero lança DivisionByZeroError sem crash."""
        with self.assertRaises(DivisionByZeroError):
            self.engine.divide(10.0, 0.0)

    def test_history_records_and_limit(self) -> None:
        """Verifica se as operações básicas são registradas no histórico."""
        history = CalculationHistory(max_items=3)
        engine = CalculatorEngine(history=history)

        engine.add(10.0, 20.0)
        engine.subtract(50.0, 15.0)
        engine.multiply(4.0, 2.5)
        self.assertEqual(len(history), 3)

        # Inserção além da capacidade máxima deve descartar o mais antigo (FIFO)
        engine.divide(100.0, 2.0)
        self.assertEqual(len(history), 3)
        latest = history.get_latest()
        self.assertIsNotNone(latest)
        self.assertEqual(latest.result, 50.0)

        # Limpeza do histórico
        history.clear()
        self.assertEqual(len(history), 0)


if __name__ == "__main__":
    unittest.main()
