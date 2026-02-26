import { ChevronDown, Printer } from 'lucide-react';

const filters = [
    { label: 'Date:', value: 'Now' },
    { label: 'Product:', value: 'All' },
    { label: 'Profile:', value: 'Bogdan' },
];

export default function FilterBar() {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* Title */}
            <h1 className="text-3xl font-black text-[var(--cb-text)] tracking-tight uppercase leading-none">
                Check Box
            </h1>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
                {filters.map((f) => (
                    <button
                        key={f.label}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/[0.08] text-sm text-[var(--cb-muted)] hover:bg-white/[0.04] hover:border-white/[0.12] hover:text-[var(--cb-text)] transition-all duration-300 cursor-pointer"
                    >
                        <span className="opacity-70">{f.label}</span>
                        <span className="text-[var(--cb-text)] font-medium">{f.value}</span>
                        <ChevronDown size={13} className="opacity-50" />
                    </button>
                ))}
                <button className="w-9 h-9 rounded-full border border-white/[0.08] text-[var(--cb-muted)] opacity-60 hover:bg-white/[0.04] hover:text-[var(--cb-text)] hover:opacity-100 transition-all duration-300 cursor-pointer flex items-center justify-center">
                    <Printer size={15} />
                </button>
            </div>
        </div>
    );
}
