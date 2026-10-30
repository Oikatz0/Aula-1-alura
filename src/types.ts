export interface OperationItem {
  id: string;
  expression: string;
  result: number;
  timestamp: string;
}

export type ActiveTab = 'cli' | 'gui' | 'code' | 'tests' | 'architecture';

export interface TerminalEntry {
  id: string;
  type: 'output' | 'input' | 'error' | 'success' | 'system' | 'banner';
  text: string;
}

export interface UnitTestItem {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'pending' | 'running';
  executionTimeMs: number;
  assertion: string;
}
