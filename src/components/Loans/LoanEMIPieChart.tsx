interface LoanEMIPieChartProps {
  principalAmount: number
  interestAmount: number
  totalEMI: number
  label?: string
}

export default function LoanEMIPieChart({
  principalAmount,
  interestAmount,
  totalEMI,
  label = 'Month 1 breakdown'
}: LoanEMIPieChartProps) {
  const principalPercent = totalEMI > 0 ? (principalAmount / totalEMI) * 100 : 0
  const interestPercent = totalEMI > 0 ? (interestAmount / totalEMI) * 100 : 0

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const principalLength = (principalPercent / 100) * circumference
  const interestLength = (interestPercent / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="120" height="120" viewBox="0 0 120 120" className="overflow-visible">
        {/* Principal segment - starts at top (90 degrees) and goes clockwise */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="12"
          strokeDasharray={`${principalLength} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />

        {/* Interest segment - starts after principal */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--warning)"
          strokeWidth="12"
          strokeDasharray={`${interestLength} ${circumference}`}
          strokeDashoffset={-principalLength}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />

        {/* Center text */}
        <text
          x="60"
          y="55"
          textAnchor="middle"
          className="font-display font-700 text-[14px]"
          fill="var(--foreground)"
        >
          {Math.round(principalPercent)}%
        </text>
        <text
          x="60"
          y="68"
          textAnchor="middle"
          className="text-[10px]"
          fill="var(--muted-foreground)"
        >
          Principal
        </text>
      </svg>

      {/* Legend */}
      <div className="text-center w-full">
        <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">{label}</div>
        <div className="text-[11px] text-[var(--muted-foreground)] mb-1">Interest: {Math.round(interestPercent)}%</div>
        <div className="space-y-0.5">
          <div className="text-[10px]">
            <span className="text-[var(--muted-foreground)]">Principal: </span>
            <span className="font-semibold text-[var(--primary)]">₹{Math.round(principalAmount).toLocaleString('en-IN')}</span>
          </div>
          <div className="text-[10px]">
            <span className="text-[var(--muted-foreground)]">Interest: </span>
            <span className="font-semibold text-[var(--warning)]">₹{Math.round(interestAmount).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
