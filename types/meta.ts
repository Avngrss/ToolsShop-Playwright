export type Severity = "blocker" | "critical" | "normal" | "minor" | "trivial";
export type Priority = "P0" | "P1" | "P2" | "P3";

export interface AllureMeta {
  title?: string;
  description?: string;
  severity: Severity;
  owner: string;
  priority: Priority;
  suite?: string;
  feature?: string;
  qaseCaseId?: string;
  parameters?: Record<string, string>;
}
