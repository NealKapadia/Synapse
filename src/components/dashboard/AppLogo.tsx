import Image from "next/image";

export function AppLogo() {
    return (
        <div className="relative group flex items-center justify-center">
            {/* Dynamic Glowing Border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

            {/* Image Container */}
            <div className="relative bg-white dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 p-1.5 rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                    src="/Synapse.png"
                    alt="Synapse Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                />
            </div>
        </div>
    );
}
