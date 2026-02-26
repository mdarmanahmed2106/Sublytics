import { MoreHorizontal } from 'lucide-react';
import { productStatusColumns } from '../../data/mockData';

const colorMap = {
    green: 'bg-[#A3FF12]',
    orange: 'bg-[#FF9D1E]',
    white: 'bg-white/60',
};

const textColorMap = {
    green: 'text-[#1a3300]',
    orange: 'text-[#3d2500]',
    white: 'text-[#0B0F14]',
};

const glowMap = {
    green: 'shadow-[0_2px_8px_rgba(163,255,18,0.2)]',
    orange: 'shadow-[0_2px_8px_rgba(255,157,30,0.2)]',
    white: 'shadow-[0_2px_8px_rgba(255,255,255,0.05)]',
};

export default function ProductStatusMatrix() {
    return (
        <div className="bg-[var(--cb-card)] border border-[var(--cb-border)] rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/30 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--cb-muted)]">Product</h3>
                <button className="text-[var(--cb-muted)] opacity-50 hover:text-[var(--cb-text)] hover:opacity-100 transition-colors cursor-pointer">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* Matrix Grid */}
            <div className="flex items-end justify-between gap-2 mb-5 flex-1 overflow-x-auto">
                {productStatusColumns.map((col, cIdx) => (
                    <div key={cIdx} className="flex flex-col items-center gap-1.5 flex-1 min-w-[32px]">
                        {col.values.map((item, vIdx) => {
                            const height = 35 + item.num * 0.8;
                            return (
                                <div
                                    key={vIdx}
                                    className={`w-8 rounded-full flex items-center justify-center text-[11px] font-bold ${colorMap[item.color]} ${textColorMap[item.color]} ${glowMap[item.color]} transition-all duration-300 hover:scale-105`}
                                    style={{ height: `${height}px` }}
                                >
                                    {item.num}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between pt-3.5 border-t border-white/[0.05]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-white/60" />
                        <span className="text-[11px] text-[var(--cb-muted)] opacity-70">Resources</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#A3FF12]" />
                        <span className="text-[11px] text-[var(--cb-muted)] opacity-70">Valid</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#FF9D1E]" />
                        <span className="text-[11px] text-[var(--cb-muted)] opacity-70">Invalid</span>
                    </div>
                </div>
                <div className="text-[12px] text-[var(--cb-muted)] opacity-70">
                    Total: <span className="text-[var(--cb-text)] font-semibold">1,012</span>
                </div>
            </div>
        </div>
    );
}
