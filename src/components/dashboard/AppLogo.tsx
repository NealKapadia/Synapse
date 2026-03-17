import Image from "next/image";

export function AppLogo() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 rounded-xl blur-md" />
      <div className="relative bg-white/5 ring-1 ring-white/10 p-1.5 rounded-xl flex items-center justify-center">
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
