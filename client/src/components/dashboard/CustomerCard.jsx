import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { MoreHorizontal, Triangle } from 'lucide-react';
import { customerChartData } from '../../data/mockData';

export default function CustomerCard() {
    return (
        <div className="bg-[var(--cb-card)] border border-[var(--cb-border)] rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/30 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--cb-muted)]">Customer</h3>
                <button className="text-[var(--cb-muted)] opacity-50 hover:text-[var(--cb-text)] hover:opacity-100 transition-colors cursor-pointer">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* Metrics */}
            <div className="flex items-start gap-6 mb-4">
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Triangle size={10} className="text-[var(--cb-green)] fill-[var(--cb-green)]" />
                        <span className="text-[32px] font-semibold text-[var(--cb-text)] leading-none tracking-tight">2,4%</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--cb-muted)] opacity-70 mt-1">Web Surfing</p>
                </div>
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Triangle size={10} className="text-[var(--cb-orange)] fill-[var(--cb-orange)] rotate-180" />
                        <span className="text-[32px] font-semibold text-[var(--cb-text)] leading-none tracking-tight">1,1%</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--cb-muted)] opacity-70 mt-1">Radio Station</p>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 min-h-[70px] -mx-1 mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={customerChartData}>
                        <defs>
                            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#A3FF12" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#A3FF12" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF9D1E" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#FF9D1E" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="web" stroke="#A3FF12" strokeWidth={2} fill="url(#greenGrad)" dot={false} />
                        <Area type="monotone" dataKey="radio" stroke="#FF9D1E" strokeWidth={2} fill="url(#orangeGrad)" dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
