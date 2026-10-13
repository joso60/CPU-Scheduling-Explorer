import React, { useState, useEffect, useMemo } from 'react';
import type { Algorithm, PriorityMode, Process } from '../engine/types';
import { ALGORITHM_LABELS, usesPriority } from '../engine/types';
import { schedule, validateProcesses } from '../engine/scheduler';
import { PRESETS } from '../data/presets';
import { ProcessTable } from './ProcessTable';
import { GanttChart } from './GanttChart';
import { ReadyQueueTimeline } from './ReadyQueueTimeline';
import { ResultsTable } from './ResultsTable';
import { Settings, Sparkles, AlertCircle } from 'lucide-react';

export const ModeSimulator: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<Algorithm>('FCFS');
  const [quantum, setQuantum] = useState<number>(4);
  const [priorityMode, setPriorityMode] = useState<PriorityMode>('LOW_IS_HIGH');
  const [processes, setProcesses] = useState<Process[]>([
    { pid: 'P1', arrival: 0, burst: 24, priority: 3 },
    { pid: 'P2', arrival: 0, burst: 3, priority: 1 },
    { pid: 'P3', arrival: 0, burst: 3, priority: 2 },
  ]);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hoveredPid, setHoveredPid] = useState<string | null>(null);
  const [isGanttSynced, setIsGanttSynced] = useState<boolean>(true);

  // Validate processes
  const validationError = useMemo(() => validateProcesses(processes), [processes]);

  // Run the schedule calculation
  const result = useMemo(() => {
    if (validationError) return null;
    return schedule(processes, algorithm, { quantum, priorityMode });
  }, [processes, algorithm, quantum, priorityMode, validationError]);

  // Reset or adjust current step when snapshots change
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [algorithm, processes, quantum, priorityMode]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || !result) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= result.snapshots.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, result]);

  const handleLoadPreset = (presetId: string) => {
    const p = PRESETS.find((x) => x.id === presetId);
    if (!p) return;
    setAlgorithm(p.algorithm);
    setProcesses(p.processes.map((proc) => ({ ...proc })));
    if (p.quantum) setQuantum(p.quantum);
    if (p.priorityMode) setPriorityMode(p.priorityMode);
  };

  const handleSetAllZeroArrival = () => {
    setProcesses((prev) => prev.map((p) => ({ ...p, arrival: 0 })));
  };

  return (
    <div className="space-y-6">
      {/* Controls & Preset Selection */}
      <div className="card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-slate-800 dark:text-white">
              Algorithm & Simulation Controls
            </h3>
          </div>

          {/* Quick Course Slide Presets */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Slides Presets:
            </span>
            <select
              onChange={(e) => handleLoadPreset(e.target.value)}
              defaultValue=""
              className="input text-xs w-auto py-1 pr-6 cursor-pointer bg-slate-50 dark:bg-slate-800"
            >
              <option value="" disabled>
                Select Course Example...
              </option>
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.algorithm})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Algorithm options & settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Algorithm selector */}
          <div className="space-y-1">
            <label className="label">Scheduling Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
              className="input font-semibold"
            >
              {(Object.keys(ALGORITHM_LABELS) as Algorithm[]).map((alg) => (
                <option key={alg} value={alg}>
                  {ALGORITHM_LABELS[alg]}
                </option>
              ))}
            </select>
          </div>

          {/* Round Robin Time Quantum */}
          {algorithm === 'RR' && (
            <div className="space-y-1 animate-in fade-in duration-200">
              <label className="label">Time Quantum (q)</label>
              <input
                type="number"
                min={1}
                value={quantum}
                onChange={(e) => setQuantum(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="input font-mono font-bold"
              />
            </div>
          )}

          {/* Priority Mode Convention */}
          {usesPriority(algorithm) && (
            <div className="space-y-1 animate-in fade-in duration-200">
              <label className="label">Priority Convention</label>
              <select
                value={priorityMode}
                onChange={(e) => setPriorityMode(e.target.value as PriorityMode)}
                className="input text-xs"
              >
                <option value="LOW_IS_HIGH">Smallest integer = Highest (Standard)</option>
                <option value="HIGH_IS_HIGH">Largest integer = Highest (Exercise Variant)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Process Table Input */}
      <div className="card">
        <ProcessTable
          processes={processes}
          onChange={setProcesses}
          showPriority={usesPriority(algorithm)}
          onSetAllZeroArrival={handleSetAllZeroArrival}
        />
      </div>

      {validationError && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Simulation Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-250">
          {/* Synchronized Ready Queue Tape Section (Placed on top like lecture slides) */}
          <div className="card space-y-3 border-2 border-sky-300/60 dark:border-sky-800/60">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="card-title mb-0">1. Ready Queue Step-by-Step State</h3>
              <span className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                Step-by-step cumulative arrivals (Items never removed)
              </span>
            </div>
            <ReadyQueueTimeline
              snapshots={result.snapshots}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onReset={() => {
                setIsPlaying(false);
                setCurrentStep(0);
              }}
            />
          </div>

          {/* Connected Gantt Chart Section (Directly below Ready Queue, connected in real-time!) */}
          <div className="card space-y-3">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 gap-2">
              <div className="flex items-center gap-2">
                <h3 className="card-title mb-0">2. Execution Gantt Chart</h3>
                {isGanttSynced && (
                  <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Connected to Ready Queue Playback
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                  Span: 0 &rarr; {result.lastCT} (Total Duration: {result.totalTime})
                </span>
                <button
                  type="button"
                  onClick={() => setIsGanttSynced(!isGanttSynced)}
                  className="btn-ghost text-xs px-2.5 py-1 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {isGanttSynced ? 'Show Full Gantt Chart' : 'Sync With Playback'}
                </button>
              </div>
            </div>

            <GanttChart
              slices={result.slices}
              totalTime={result.lastCT}
              currentTime={result.snapshots[currentStep]?.time ?? 0}
              isSynchronized={isGanttSynced}
              highlightPid={hoveredPid}
              onSliceHover={setHoveredPid}
            />
          </div>

          {/* Process Metrics & Calculation Table */}
          <div className="card">
            <h3 className="card-title">3. Process Completion & Wait Metrics</h3>
            <ResultsTable
              results={result.results}
              showPriority={usesPriority(algorithm)}
              avgTAT={result.avgTAT}
              avgWT={result.avgWT}
              throughput={result.throughput}
              totalTime={result.totalTime}
              lastCT={result.lastCT}
              firstAT={result.firstAT}
              highlightPid={hoveredPid}
              onHoverPid={setHoveredPid}
            />
          </div>
        </div>
      )}
    </div>
  );
};
