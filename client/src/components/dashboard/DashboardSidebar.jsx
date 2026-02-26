import { useState } from 'react';
import { Heart, CalendarDays, Diamond, Settings, Plus } from 'lucide-react';

const sidebarIcons = [
    { icon: Heart, label: 'Favorites' },
    { icon: CalendarDays, label: 'Calendar' },
    { icon: Diamond, label: 'Premium' },
    { icon: Settings, label: 'Settings' },
];

export default function DashboardSidebar() {
    const [activeIdx, setActiveIdx] = useState(0);

    return (
        <aside className="hidden lg:flex flex-col items-center justify-between py-6 w-[60px] shrink-0 bg-[var(--cb-bg)] border-r border-[var(--cb-border)] sticky top-[52px] h-[calc(100vh-52px)]">
            {/* Icons */}
            <div className="flex flex-col items-center gap-3">
                {sidebarIcons.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = idx === activeIdx;
                    return (
                        <button
                            key={item.label}
                            onClick={() => setActiveIdx(idx)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${isActive
                                    ? 'bg-[var(--cb-green)]/15 text-[var(--cb-green)] shadow-[0_0_20px_rgba(163,255,18,0.15)]'
                                    : 'text-[var(--cb-muted)]/60 hover:text-[var(--cb-text)] hover:bg-white/[0.06]'
                                }`}
                            title={item.label}
                        >
                            <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
                        </button>
                    );
                })}
            </div>

            {/* Bottom Action */}
            <button className="w-11 h-11 rounded-full border border-white/[0.08] text-[var(--cb-muted)]/60 hover:bg-white/[0.06] hover:text-[var(--cb-text)] hover:border-white/[0.15] transition-all duration-300 flex items-center justify-center cursor-pointer">
                <Plus size={20} strokeWidth={1.8} />
            </button>
        </aside>
    );
}
