import { useState } from 'react';
import { Search, Monitor, MessageSquare, CheckSquare, BarChart3 } from 'lucide-react';

const navItems = [
    { label: 'Check Box', icon: CheckSquare },
    { label: 'Monitoring', icon: BarChart3 },
    { label: 'Support', icon: MessageSquare },
];

export default function DashboardNavbar() {
    const [active, setActive] = useState('Check Box');

    return (
        <nav className="w-full flex items-center justify-between px-5 py-3 bg-[var(--cb-bg)] border-b border-[var(--cb-border)] sticky top-0 z-50">
            {/* Left: Logo */}
            <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <span className="text-[var(--cb-bg)] font-black text-lg leading-none">N</span>
                </div>
            </div>

            {/* Center: Nav Pills */}
            <div className="hidden md:flex items-center gap-1.5 bg-white/[0.03] rounded-full p-1 border border-white/[0.06]">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.label;
                    return (
                        <button
                            key={item.label}
                            onClick={() => setActive(item.label)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${isActive
                                    ? 'bg-white/[0.12] text-[var(--cb-text)] shadow-[0_0_12px_rgba(255,255,255,0.05)]'
                                    : 'text-[var(--cb-muted)] hover:bg-white/[0.06] hover:text-[var(--cb-text)]'
                                }`}
                        >
                            <Icon size={15} strokeWidth={2} />
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Right: Search + User */}
            <div className="flex items-center gap-3 shrink-0">
                <button className="w-9 h-9 rounded-full bg-white/[0.05] text-[var(--cb-muted)] hover:bg-white/[0.1] hover:text-[var(--cb-text)] transition-all duration-300 cursor-pointer flex items-center justify-center">
                    <Search size={16} />
                </button>
                <div className="flex items-center gap-2.5">
                    <div className="text-right hidden sm:block">
                        <p className="text-[13px] font-semibold text-[var(--cb-text)] leading-none mb-0.5">Bogdan Nikitin</p>
                        <p className="text-[11px] text-[var(--cb-muted)] leading-none">@Nixtio</p>
                    </div>
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 flex items-center justify-center ring-2 ring-white/[0.08]">
                            <span className="text-white font-bold text-xs">BN</span>
                        </div>
                        <div className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center ring-2 ring-[var(--cb-bg)]">
                            <span className="text-white text-[9px] font-bold leading-none">2</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
