export function RecallMeshLogo({ className = "size-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="RecallMesh X Logo"
    >
      <defs>
        <linearGradient id="rmx-grad-1" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="rmx-glow" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Hexagonal Outer Lattice Shield */}
      <path
        d="M16 2.5L28.5 9.7V22.3L16 29.5L3.5 22.3V9.7L16 2.5Z"
        stroke="url(#rmx-grad-1)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Internal Intelligence Mesh Nodes & Links */}
      <path
        d="M16 7L24 11.5V20.5L16 25L8 20.5V11.5L16 7Z"
        fill="url(#rmx-glow)"
        fillOpacity="0.15"
        stroke="url(#rmx-grad-1)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Core "X" Mesh Interlink */}
      <path
        d="M11 11L21 21M21 11L11 21"
        stroke="url(#rmx-grad-1)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Synaptic Central Node */}
      <circle cx="16" cy="16" r="2.2" fill="#38bdf8" />
    </svg>
  );
}
