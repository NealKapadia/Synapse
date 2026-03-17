import Image from "next/image";

export function AppLogo() {
  return (
    <div className="relative group flex items-center justify-center">
      <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500/25 via-cyan-400/20 to-violet-500/25 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-white/[0.04] ring-1 ring-white/10 p-2 rounded-2xl flex items-center justify-center backdrop-blur-sm">
        <Image
          src="/Synapse.png"
          alt="Synapse Logo"
          width={32}
          height={32}
          className="object-contain"
        />
      </div>
    </div>
  );
}
