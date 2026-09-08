export default function FishLogo({ className = '' }: { className?: string }) {
  return (
    <div
      id="fish-logo-badge"
      className={`relative inline-flex flex-col items-center justify-center bg-[#070b0e] text-[#f4ba34] px-8 py-3.5 rounded-[40px] shadow-lg border-2 border-[#f4ba34]/40 select-none ${className}`}
    >
      {/* Title */}
      <span className="font-bebas tracking-wider text-xl sm:text-2xl text-[#f4ba34] uppercase font-bold leading-tight">
        PEIXARIA MANCHA
      </span>

      {/* Stylized Fish Graphic */}
      <div className="my-1 flex items-center justify-center">
        <svg
          className="w-16 h-5 sm:w-20 sm:h-6 text-[#ea580c]"
          viewBox="0 0 100 30"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fish Body */}
          <path
            d="M 5,15 Q 35,0 75,15 Q 35,30 5,15 Z"
            fill="#ea580c"
          />
          {/* Tail */}
          <path
            d="M 72,15 L 95,3 L 88,15 L 95,27 Z"
            fill="#ea580c"
          />
          {/* Top fin accent */}
          <path
            d="M 40,8 Q 50,2 58,7 L 50,11 Z"
            fill="#f97316"
          />
          {/* Eye */}
          <circle cx="20" cy="14" r="2.5" fill="#ffffff" />
          <circle cx="19.5" cy="14" r="1.2" fill="#000000" />
          {/* Gill arc */}
          <path
            d="M 30,10 Q 33,15 30,20"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Subtitle */}
      <span className="text-[11px] sm:text-xs tracking-widest text-white italic font-montserrat font-bold uppercase">
        QUALIDADE GARANTIDA!
      </span>
    </div>
  );
}
