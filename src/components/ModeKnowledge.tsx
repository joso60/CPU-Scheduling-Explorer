import React, { useState } from 'react';
import { KNOWLEDGE, COMPARISON } from '../data/knowledge';
import { scheduleMultilevel, type MLProcess } from '../engine/multilevel';
import { BookOpen, Check, X, Layers, GitCompare } from 'lucide-react';

export const ModeKnowledge: React.FC = () => {
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('FCFS');
  const [activeSubTab, setActiveSubTab] = useState<'theory' | 'comparison' | 'mlfq'>('theory');

  // MLFQ interactive mini-demo state
  const [mlfqFeedback, setMlfqFeedback] = useState<boolean>(true);
  const [mlfqAging, setMlfqAging] = useState<number>(10);
  const [mlfqProcs] = useState<MLProcess[]>([
    { pid: 'P1', arrival: 0, burst: 18, priority: 1, queue: 0 },
    { pid: 'P2', arrival: 4, burst: 5, priority: 1, queue: 0 },
    { pid: 'P3', arrival: 10, burst: 25, priority: 1, queue: 0 },
  ]);

  const mlfqResult = React.useMemo(() => {
    return scheduleMultilevel(mlfqProcs, {
      queues: [
        { name: 'Queue 0 (RR)', type: 'RR', quantum: 4 },
        { name: 'Queue 1 (RR)', type: 'RR', quantum: 8 },
        { name: 'Queue 2 (FCFS)', type: 'FCFS', quantum: 0 },
      ],
      feedback: mlfqFeedback,
      agingThreshold: mlfqAging,
    });
  }, [mlfqProcs, mlfqFeedback, mlfqAging]);

  const currentAlgo = KNOWLEDGE.find((a) => a.id === selectedAlgoId) || KNOWLEDGE[0];

  return (
    <div className="space-y-6">
      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveSubTab('theory')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'theory'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4" /> Algorithm Deep Dive & Slides Analysis
        </button>
        <button
          onClick={() => setActiveSubTab('comparison')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'comparison'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <GitCompare className="h-4 w-4" /> Comparison Matrix
        </button>
        <button
          onClick={() => setActiveSubTab('mlfq')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'mlfq'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="h-4 w-4" /> Multilevel Queue (MLQ / MLFQ) Simulator
        </button>
      </div>

      {/* SubTab 1: Algorithm Deep Dive */}
      {activeSubTab === 'theory' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Algorithm sidebar selector */}
          <div className="space-y-1.5 md:border-r border-slate-200 dark:border-slate-800 pr-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2 block">
              Algorithms
            </span>
            {KNOWLEDGE.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAlgoId(a.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedAlgoId === a.id
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{a.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
                      selectedAlgoId === a.id
                        ? 'bg-indigo-700 text-indigo-100'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {a.type}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Details area */}
          <div className="md:col-span-3 space-y-5 animate-in fade-in duration-150">
            {/* Header info */}
            <div className="card space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentAlgo.name} ({currentAlgo.short})
                </h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Type: {currentAlgo.type}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentAlgo.concept}
              </p>
            </div>

            {/* Execution Steps */}
            <div className="card space-y-3">
              <h4 className="card-title mb-1">Execution Mechanism & Rules</h4>
              <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300 list-decimal pl-4">
                {currentAlgo.steps.map((st, i) => (
                  <li key={i} className="leading-relaxed">
                    {st}
                  </li>
                ))}
              </ol>
            </div>

            {/* Advantages and Disadvantages Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Advantages */}
              <div className="card border-l-4 border-l-emerald-500 space-y-3 bg-emerald-50/15 dark:bg-emerald-950/10">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                  <Check className="h-4 w-4" />
                  <span>Advantages (Directly from Slides)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {currentAlgo.advantages.map((adv, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">&bull;</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disadvantages */}
              <div className="card border-l-4 border-l-rose-500 space-y-3 bg-rose-50/15 dark:bg-rose-950/10">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                  <X className="h-4 w-4" />
                  <span>Disadvantages & Trade-offs</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {currentAlgo.disadvantages.map((dis, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">&bull;</span>
                      <span>{dis}</span>
                    </li>
                  ))}
                </ul>
                {currentAlgo.solution && (
                  <div className="mt-2 pt-2 border-t border-rose-200 dark:border-rose-900/60 text-xs">
                    <strong className="text-rose-700 dark:text-rose-300">Proposed Solution: </strong>
                    <span className="text-slate-700 dark:text-slate-300">{currentAlgo.solution}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pseudocode / Logic Trace */}
            <div className="card space-y-2">
              <h4 className="card-title mb-1">Algorithm Pseudocode Trace</h4>
              <pre className="rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {currentAlgo.pseudo}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Side-by-Side Comparison */}
      {activeSubTab === 'comparison' && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="card-title mb-0">Cross-Algorithm Comparison Matrix</h3>
            <span className="text-xs text-slate-400 italic">Academic Overview & Criteria Comparison</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 uppercase">
                <tr>
                  <th className="px-3.5 py-2.5">Algorithm</th>
                  <th className="px-3.5 py-2.5">Preemptive</th>
                  <th className="px-3.5 py-2.5">Starvation Risk</th>
                  <th className="px-3.5 py-2.5">Convoy Effect</th>
                  <th className="px-3.5 py-2.5">Overhead</th>
                  <th className="px-3.5 py-2.5">Complexity</th>
                  <th className="px-3.5 py-2.5">Ideal Environment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {COMPARISON.map((row) => (
                  <tr key={row.algo} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-3.5 py-2 font-bold text-slate-800 dark:text-slate-100">{row.algo}</td>
                    <td className="px-3.5 py-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${row.preemptive.includes('Yes') ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        {row.preemptive}
                      </span>
                    </td>
                    <td className="px-3.5 py-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${row.starvation.includes('Yes') ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'}`}>
                        {row.starvation}
                      </span>
                    </td>
                    <td className="px-3.5 py-2">{row.convoy}</td>
                    <td className="px-3.5 py-2">{row.overhead}</td>
                    <td className="px-3.5 py-2">{row.complexity}</td>
                    <td className="px-3.5 py-2 text-slate-500 dark:text-slate-400">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 3: MLQ & MLFQ Interactive Simulator */}
      {activeSubTab === 'mlfq' && (
        <div className="space-y-6">
          <div className="card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Multilevel Feedback Queue (MLFQ) Architecture
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Slide Model: Q0 (RR q=4) &rarr; Q1 (RR q=8) &rarr; Q2 (FCFS). Demonstrates process demotion and aging!
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <label className="inline-flex items-center gap-1.5 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mlfqFeedback}
                    onChange={(e) => setMlfqFeedback(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span>Enable Feedback Demotion (MLFQ)</span>
                </label>

                {mlfqFeedback && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Aging Threshold:</span>
                    <input
                      type="number"
                      min={0}
                      value={mlfqAging}
                      onChange={(e) => setMlfqAging(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="input w-16 text-center text-xs font-mono"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Visual Gantt Chart for MLFQ */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400">Execution Schedule</span>
              <div className="flex h-14 w-full rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                {mlfqResult.slices.map((slice, idx) => {
                  const duration = slice.end - slice.start;
                  const widthPct = (duration / mlfqResult.lastCT) * 100;
                  const queueColors = ['bg-indigo-500', 'bg-sky-500', 'bg-amber-500'];
                  const color = slice.level !== null ? queueColors[slice.level] || 'bg-slate-500' : 'bg-green-500';

                  return (
                    <div
                      key={idx}
                      style={{ width: `${widthPct}%` }}
                      className={`relative flex flex-col items-center justify-center border-r last:border-r-0 text-white font-mono text-xs font-bold ${color}`}
                      title={`${slice.pid ?? 'IDLE'} [${slice.start} → ${slice.end}] (Level: Q${slice.level})`}
                    >
                      <span>{slice.pid ?? 'IDLE'}</span>
                      <span className="text-[9px] opacity-80">
                        {slice.level !== null ? `Q${slice.level}` : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Results Table for MLFQ */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="px-3 py-2">Process</th>
                    <th className="px-3 py-2">Arrival (A.T)</th>
                    <th className="px-3 py-2">Burst (B.T)</th>
                    <th className="px-3 py-2">Completion (C.T)</th>
                    <th className="px-3 py-2">Turnaround (T.A.T)</th>
                    <th className="px-3 py-2">Waiting (W.T)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {mlfqResult.results.map((r) => (
                    <tr key={r.pid}>
                      <td className="px-3 py-1.5 font-bold">{r.pid}</td>
                      <td className="px-3 py-1.5">{r.arrival}</td>
                      <td className="px-3 py-1.5">{r.burst}</td>
                      <td className="px-3 py-1.5 font-bold text-indigo-600">{r.completion}</td>
                      <td className="px-3 py-1.5">{r.turnaround}</td>
                      <td className="px-3 py-1.5">{r.waiting}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
