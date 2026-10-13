import React from 'react';
import type { Snapshot } from '../engine/types';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface ReadyQueueTimelineProps {
  snapshots: Snapshot[];
  currentStep: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
}

export const ReadyQueueTimeline: React.FC<ReadyQueueTimelineProps> = ({
  snapshots,
  currentStep,
  onStepChange,
  isPlaying,
  onTogglePlay,
  onReset,
}) => {
  if (!snapshots.length) return null;

  const currentSnapshot = snapshots[currentStep] || snapshots[0];
  const finalSnapshot = snapshots[snapshots.length - 1];

  // The full sequence of processes that will ever enter the queue across this schedule
  const totalQueueSequence = finalSnapshot?.cumulativeQueue || [];
  const maxSlots = Math.max(3, totalQueueSequence.length);

  // The cumulative queue at this specific step (NEVER deletes what came before!)
  const stepQueue = currentSnapshot.cumulativeQueue || [];

  return (
    <div className="space-y-4">
      {/* Playback Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="btn-ghost p-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
            title="Reset to Start (Step 1)"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => onStepChange(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="btn-ghost p-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
            title="Step Back"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onTogglePlay}
            className="btn-primary px-3 py-1.5 text-xs cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play Simulation'}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Auto-Play
              </>
            )}
          </button>
          <button
            onClick={() => onStepChange(Math.min(snapshots.length - 1, currentStep + 1))}
            disabled={currentStep === snapshots.length - 1}
            className="btn-ghost p-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
            title="Step Forward"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 pl-2">
            Step <strong className="text-indigo-600 dark:text-indigo-400">{currentStep + 1}</strong> of{' '}
            {snapshots.length} &bull; Time <code className="font-mono font-bold text-slate-900 dark:text-white">t = {currentSnapshot.time}</code>
          </span>
        </div>

        {/* Timeline Slider */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="range"
            min={0}
            max={snapshots.length - 1}
            value={currentStep}
            onChange={(e) => onStepChange(Number(e.target.value))}
            className="h-2 w-48 cursor-pointer accent-indigo-600"
          />
        </div>
      </div>

      {/* Course Slide Authentic Ready Queue Strip (Blue Boxes that accumulate step-by-step without deletion!) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-sky-600 dark:text-sky-400 font-bold">Ready Queue (Slide Tape)</span>
            <span className="text-[11px] font-normal normal-case text-slate-400">
              (Cumulative addition &mdash; previous entries are never removed)
            </span>
          </div>
          <span className="text-slate-400 text-[11px] lowercase italic">
            slots filled: {stepQueue.length} / {totalQueueSequence.length}
          </span>
        </div>

        {/* The Slide-Style Continuous Box Strip */}
        <div className="overflow-x-auto pb-2 pt-1">
          <div className="inline-flex min-w-full items-stretch rounded-xl border-2 border-sky-400/70 dark:border-sky-600/60 bg-sky-50/40 dark:bg-sky-950/20 p-2 shadow-xs">
            {Array.from({ length: maxSlots }).map((_, slotIdx) => {
              const pid = stepQueue[slotIdx];
              const isFilled = pid !== undefined;
              const isLatestAdded = slotIdx === stepQueue.length - 1 && isFilled;

              return (
                <div
                  key={slotIdx}
                  className={`relative flex items-center justify-center min-w-16 sm:min-w-20 h-14 border-r last:border-r-0 border-sky-300 dark:border-sky-700/80 transition-all duration-200 ${
                    isFilled
                      ? 'bg-gradient-to-b from-sky-500 to-sky-600 dark:from-sky-600 dark:to-sky-700 text-white font-black text-lg shadow-inner'
                      : 'bg-transparent border-dashed text-slate-300 dark:text-slate-700'
                  } ${
                    isLatestAdded
                      ? 'ring-2 ring-indigo-400 dark:ring-indigo-300 z-10 scale-[1.02] brightness-110'
                      : ''
                  }`}
                >
                  {isFilled ? (
                    <div className="flex flex-col items-center justify-center">
                      <span className="font-mono tracking-tight">{pid}</span>
                      {isLatestAdded && (
                        <span className="text-[8px] uppercase tracking-wider opacity-90 font-sans font-medium text-sky-100">
                          (Added)
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs font-mono select-none opacity-40">
                      [{slotIdx + 1}]
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live State Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Currently Running Process */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3.5 flex flex-col justify-between">
          <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
            Currently on CPU
          </span>
          <div className="mt-2 flex items-center gap-2">
            {currentSnapshot.running ? (
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {currentSnapshot.running}
              </span>
            ) : (
              <span className="text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-950/60 px-2.5 py-1 rounded-md border border-green-500/30">
                IDLE (Waiting)
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            {currentSnapshot.running ? `Running at time instant t = ${currentSnapshot.time}` : 'CPU is waiting for processes'}
          </span>
        </div>

        {/* Transient Active Waiting Queue (Memory view) */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3.5 flex flex-col justify-between">
          <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
            Waiting in Queue Right Now
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5 min-h-7 items-center">
            {currentSnapshot.queue.length === 0 ? (
              <span className="text-xs text-slate-400 italic font-mono">[ Empty ]</span>
            ) : (
              currentSnapshot.queue.map((p, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800"
                >
                  {p}
                </span>
              ))
            )}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            Head to tail currently awaiting dispatch
          </span>
        </div>

        {/* Event Logs & Diagnostic Narrative */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3.5">
          <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
            Step Details & Events
          </span>
          <div className="mt-2 space-y-1.5 max-h-24 overflow-y-auto pr-1">
            {currentSnapshot.events.map((ev, i) => (
              <p key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5 leading-tight">
                <span className="text-indigo-500 font-bold">&bull;</span>
                <span>{ev}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
