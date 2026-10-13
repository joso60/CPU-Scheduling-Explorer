import type { Algorithm, PriorityMode, Process } from '../engine/types';

export interface Preset {
  id: string;
  title: string;
  algorithm: Algorithm;
  source: string;
  processes: Process[];
  quantum?: number;
  priorityMode?: PriorityMode;
  /** Exercise = slide gives no answer (good for quiz mode). */
  exercise?: boolean;
  note?: string;
}

const P = (pid: string, arrival: number, burst: number, priority = 0): Process => ({ pid, arrival, burst, priority });

const BASIC = [P('P1', 0, 24), P('P2', 0, 3), P('P3', 0, 3)];
const LATE = [P('P1', 0, 24), P('P2', 5, 3), P('P3', 8, 3)];
const IDLE = [P('P1', 5, 24), P('P2', 1, 3), P('P3', 8, 3)];
const FOUR = [P('P1', 0, 6), P('P2', 0, 8), P('P3', 0, 7), P('P4', 0, 3)];
const FIVE = [P('P0', 2, 2), P('P1', 1, 3), P('P2', 8, 14), P('P3', 4, 2), P('P4', 11, 5)];
/** "6PROC" student-exercise table (ties by HIGHEST priority number in that exercise). */
const SIX = [P('P0', 3, 7, 2), P('P1', 5, 10, 6), P('P2', 10, 2, 4), P('P3', 6, 9, 3), P('P4', 1, 5, 1), P('P5', 4, 6, 5)];
const PRIO5 = [P('P1', 1, 10, 3), P('P2', 1, 1, 1), P('P3', 1, 2, 4), P('P4', 1, 1, 5), P('P5', 1, 5, 2)];

export const PRESETS: Preset[] = [
  // FCFS
  { id: 'fcfs1', title: 'FCFS Example 01', algorithm: 'FCFS', source: 'FCFS slides', processes: BASIC },
  { id: 'fcfs2', title: 'FCFS Example 02', algorithm: 'FCFS', source: 'FCFS slides', processes: [P('P2', 0, 3), P('P3', 0, 3), P('P1', 0, 24)], note: 'Arrival order P2, P3, P1 (all at t = 0).' },
  { id: 'fcfs3', title: 'FCFS Example 03', algorithm: 'FCFS', source: 'FCFS slides', processes: IDLE },
  { id: 'fcfs4', title: 'FCFS Example 04', algorithm: 'FCFS', source: 'FCFS slides', processes: FIVE },
  { id: 'fcfs5', title: 'FCFS Exercise 05 (6 processes)', algorithm: 'FCFS', source: 'Students Exercise', processes: SIX, exercise: true },
  // SJF
  { id: 'sjf1', title: 'SJF Example 01', algorithm: 'SJF', source: 'SJF slides', processes: BASIC },
  { id: 'sjf2', title: 'SJF Example 02', algorithm: 'SJF', source: 'SJF slides', processes: LATE },
  { id: 'sjf3', title: 'SJF Example 03', algorithm: 'SJF', source: 'SJF slides', processes: IDLE },
  { id: 'sjf4', title: 'SJF Example 04', algorithm: 'SJF', source: 'SJF slides', processes: FOUR },
  { id: 'sjf5', title: 'SJF Exercise 05 (6 processes)', algorithm: 'SJF', source: 'Students Exercise', processes: SIX, exercise: true },
  { id: 'sjf6', title: 'SJF Exercise 06 (5 processes)', algorithm: 'SJF', source: 'Students Exercise', processes: FIVE, exercise: true },
  // SRTF
  { id: 'srtf1', title: 'SRTF Example 01', algorithm: 'SRTF', source: 'SRTF slides', processes: BASIC },
  { id: 'srtf2', title: 'SRTF Example 02', algorithm: 'SRTF', source: 'SRTF slides', processes: LATE },
  { id: 'srtf3', title: 'SRTF Example 03', algorithm: 'SRTF', source: 'SRTF slides', processes: IDLE },
  { id: 'srtf4', title: 'SRTF Example 04', algorithm: 'SRTF', source: 'SRTF slides', processes: FOUR },
  { id: 'srtf5', title: 'SRTF Exercise 05 (6 processes)', algorithm: 'SRTF', source: 'Students Exercise', processes: SIX, exercise: true },
  { id: 'srtf6', title: 'SRTF Exercise 06 (5 processes)', algorithm: 'SRTF', source: 'Students Exercise', processes: FIVE, exercise: true },
  // Priority NP
  { id: 'pnp1', title: 'Priority (NP) Example 01', algorithm: 'PRIORITY_NP', source: 'Priority slides', processes: [P('P1', 0, 24, 3), P('P2', 0, 3, 1), P('P3', 0, 3, 2)] },
  { id: 'pnp2', title: 'Priority (NP) Example 02', algorithm: 'PRIORITY_NP', source: 'Priority slides', processes: [P('P1', 2, 24, 3), P('P2', 5, 3, 2), P('P3', 8, 3, 1)], note: 'This slide computes throughput as 3/32 (last C.T); the app uses n / (last C.T − first A.T) = 3/30.' },
  { id: 'pnp3', title: 'Priority (NP) Example 03', algorithm: 'PRIORITY_NP', source: 'Priority slides', processes: PRIO5 },
  { id: 'pnp4', title: 'Priority Exercise 04 (6 processes)', algorithm: 'PRIORITY_NP', source: 'Students Exercise (slide 158/159)', processes: SIX, exercise: true },
  // Priority P
  { id: 'pp1', title: 'Priority (P) Example 01', algorithm: 'PRIORITY_P', source: 'Priority slides', processes: [P('P1', 0, 24, 3), P('P2', 0, 3, 1), P('P3', 0, 3, 2)] },
  { id: 'pp2', title: 'Priority (P) Example 02', algorithm: 'PRIORITY_P', source: 'Priority slides', processes: [P('P1', 2, 24, 3), P('P2', 5, 3, 2), P('P3', 7, 3, 1)], note: 'This slide computes throughput as 3/32 (last C.T); the app uses n / (last C.T − first A.T) = 3/30.' },
  { id: 'pp3', title: 'Priority (P) Example 03', algorithm: 'PRIORITY_P', source: 'Priority slides', processes: PRIO5, note: 'The slide’s result table mixes A.T = 0 with A.T = 1 completion times; the correct answer equals the non-preemptive result.' },
  { id: 'pp4', title: 'Priority Exercise 04 (6 processes, preemptive)', algorithm: 'PRIORITY_P', source: 'Students Exercise (slide 158/159)', processes: SIX, exercise: true },
  // RR
  { id: 'rr1', title: 'RR Example 01 (q = 4)', algorithm: 'RR', source: 'RR slides', processes: BASIC, quantum: 4 },
  { id: 'rr2', title: 'RR Example 02 (q = 4)', algorithm: 'RR', source: 'RR slides', processes: [P('P1', 2, 24), P('P2', 15, 6), P('P3', 5, 3)], quantum: 4 },
  { id: 'rr3', title: 'RR Exercise 03 (q = 2, 6 processes)', algorithm: 'RR', source: 'Students Exercise (slide 75/76)', processes: SIX, quantum: 2, exercise: true },
  { id: 'rr4', title: 'RR Exercise 04 (q = 3, 5 processes)', algorithm: 'RR', source: 'Students Exercise', processes: FIVE, quantum: 3, exercise: true },
];
