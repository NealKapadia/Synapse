import { Activity, Sparkles } from "lucide-react";

export function AppLogo() {
    return (
        <div className="relative group">
            {/* Dynamic Glowing Border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

            {/* Icon Container */}
            <div className="relative bg-white dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 p-2 rounded-lg flex items-center justify-center gap-1">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 absolute -top-1 -right-1" strokeWidth={3} />
            </div>
        </div>
    );
}
