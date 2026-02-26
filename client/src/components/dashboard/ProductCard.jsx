import { MoreHorizontal, Triangle } from 'lucide-react';
import { dotMatrixData } from '../../data/mockData';

const dotColorMap = {
    green: 'bg-[#A3FF12]',
    orange: 'bg-[#FF9D1E]',
    white: 'bg-white/50',
};

export default function ProductCard() {
    return (
        <div className="bg-[var(--cb-card)] border border-[var(--cb-border)] rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/30 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--cb-muted)]">Product</h3>
                <button className="text-[var(--cb-muted)] opacity-50 hover:text-[var(--cb-text)] hover:opacity-100 transition-colors cursor-pointer">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* Metrics */}
            <div className="flex items-start gap-6 mb-5">
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Triangle size={10} className="text-[var(--cb-green)] fill-[var(--cb-green)]" />
                        <span className="text-[32px] font-semibold text-[var(--cb-text)] leading-none tracking-tight">2,8%</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--cb-muted)] opacity-70 mt-1">Partners</p>
                </div>
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Triangle size={10} className="text-[var(--cb-orange)] fill-[var(--cb-orange)] rotate-180" />
                        <span className="text-[32px] font-semibold text-[var(--cb-text)] leading-none tracking-tight">3,2%</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--cb-muted)] opacity-70 mt-1">Owners</p>
                </div>
            </div>

            {/* Dot Matrix */}
            <div className="flex flex-col gap-[5px] mt-auto">
                {dotMatrixData.map((row, rIdx) => (
                    <div key={rIdx} className="flex gap-[5px]">
                        {row.map((color, cIdx) => (
                            <div
                                key={cIdx}
                                className={`w-[10px] h-[10px] rounded-full ${dotColorMap[color]}`}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
