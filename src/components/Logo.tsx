interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 40 40" 
      className={className}
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      
      <circle 
        cx="20" 
        cy="20" 
        r="18" 
        fill="url(#bgGradient)" 
        stroke="#047857" 
        strokeWidth="2"
      />
      
      {/* Thumbs up icon representing "Tudobem" (all good) */}
      <path 
        d="M16 28c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h1.5l2.5-4c.6-1 1.7-1.5 2.8-1.3 1.4.3 2.2 1.6 2.2 3v3h3c1.1 0 2 .9 2 2l-1.5 7c-.2.9-1 1.5-1.9 1.5H16z" 
        fill="#ffffff" 
        stroke="#e5e7eb" 
        strokeWidth="0.5"
      />
      
      {/* Portuguese flag accent - small decorative elements */}
      <circle 
        cx="12" 
        cy="14" 
        r="2" 
        fill="#dc2626" 
        opacity="0.8"
      />
      
      <circle 
        cx="28" 
        cy="26" 
        r="2" 
        fill="#fbbf24" 
        opacity="0.8"
      />
      
      {/* Success checkmark */}
      <path 
        d="M14 20l2 2 4-4" 
        stroke="#10b981" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}