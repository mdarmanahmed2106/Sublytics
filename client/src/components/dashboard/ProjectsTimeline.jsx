import { useEffect, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { timelineEntries } from '../../data/mockData';

const barColorMap = {
    green: 'bg-[#A3FF12]',
    orange: 'bg-[#FF9D1E]',
    gray: 'bg-gray-500',
};

const barGlowMap = {
    green: 'shadow-[0_2px_12px_rgba(163,255,18,0.2)]',
    orange: 'shadow-[0_2px_12px_rgba(255,157,30,0.2)]',
    gray: 'shadow-none',
};

const badgeColorMap = {
    green: 'bg-[#A3FF12] text-[#1a3300]',
    orange: 'bg-[#FF9D1E] text-[#3d2500]',
    gray: 'bg-gray-500 text-white',
};

export default function ProjectsTimeline() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 150);
        return () => clearTimeout(t);
    }, []);

    const maxValue = Math.max(...timelineEntries.flatMap((e) => e.bars.map((b) => b.value)));

    return (
        <div className="bg-[var(--cb-card)] border border-[var(--cb-border)] rounded-2xl p-5 shadow-lg shadow-black/30 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--cb-muted)]">
                    Projects Timeline
                </h3>
                <button className="text-[var(--cb-muted)] opacity-50 hover:text-[var(--cb-text)] hover:opacity-100 transition-colors cursor-pointer">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* Timeline Rows */}
            <div className="space-y-3 flex-1">
                {timelineEntries.map((entry, eIdx) => (
                    <div
                        key={eIdx}
                        className="flex items-center gap-3 group hover:scale-[1.01] transition-transform duration-300 origin-left"
                    >
                        {/* Date */}
                        <span className="text-[13px] text-[var(--cb-muted)] opacity-70 font-medium w-11 shrink-0 tabular-nums">{entry.date}</span>

                        {/* Bars */}
                        <div className="flex-1 flex flex-col gap-1">
                            {entry.bars.map((bar, bIdx) => {
                                const widthPercent = (bar.value / maxValue) * 100;
                                return (
                                    <div key={bIdx} className="flex items-center gap-2">
                                        {/* Bar */}
                                        <div
                                            className={`h-8 rounded-full flex items-center gap-1.5 px-2.5 ${barColorMap[bar.color]} ${barGlowMap[bar.color]} transition-all duration-700 ease-out overflow-hidden`}
                                            style={{
                                                width: mounted ? `${Math.max(widthPercent, 22)}%` : '0%',
                                                transitionDelay: `${eIdx * 100}ms`,
                                            }}
                                        >
                                            {/* Icon circle */}
                                            {bar.icon && (
                                                <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center shrink-0">
                                                    <span className="text-[11px] leading-none">{bar.icon}</span>
                                                </div>
                                            )}
                                            {/* Avatars */}
                                            {bar.avatars.length > 0 && (
                                                <div className="flex -space-x-1.5">
                                                    {bar.avatars.map((a, aIdx) => (
                                                        <div
                                                            key={aIdx}
                                                            className="w-5 h-5 rounded-full bg-[var(--cb-bg)]/60 border-[1.5px] border-white/20 flex items-center justify-center"
                                                        >
                                                            <span className="text-[8px] font-bold text-[var(--cb-text)] leading-none">{a}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {/* Value Badge */}
                                        <span
                                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badgeColorMap[bar.color]} shrink-0 transition-all duration-500`}
                                            style={{
                                                opacity: mounted ? 1 : 0,
                                                transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
                                                transitionDelay: `${eIdx * 100 + 400}ms`,
                                            }}
                                        >
                                            {bar.value}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* X-axis Scale */}
            <div className="flex items-center mt-4 pl-14">
                <div className="flex-1 flex justify-between text-[10px] text-[var(--cb-muted)] opacity-40 tabular-nums">
                    {[0, 5, 10, 15, 20, 25, 30].map((n) => (
                        <span key={n}>{n}</span>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-3 pt-3.5 border-t border-white/[0.05]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#A3FF12]" />
                        <span className="text-[11px] text-[var(--cb-muted)] opacity-70">Customer</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#FF9D1E]" />
                        <span className="text-[11px] text-[var(--cb-muted)] opacity-70">Product</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gray-500" />
                        <span className="text-[11px] text-[var(--cb-muted)] opacity-70">Web</span>
                    </div>
                </div>
                <div className="text-[12px] text-[#A3FF12] font-semibold">
                    Total: 284
                </div>
            </div>
        </div>
    );
}
