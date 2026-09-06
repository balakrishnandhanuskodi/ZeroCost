interface LoanEMIPieChartProps {
  principalAmount: number
  interestAmount: number
  totalEMI: number
}

export default function LoanEMIPieChart({
  principalAmount,
  interestAmount,
  totalEMI
}: LoanEMIPieChartProps) {
  const principalPercent = totalEMI > 0 ? (principalAmount / totalEMI) * 100 : 0
  const interestPercent = totalEMI > 0 ? (interestAmount / totalEMI) * 100 : 0

  const radius = 45
  const circumference = 2 * Math.PI * radius
  const principalOffset = circumference - (principalPercent / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="120" height="120" viewBox="0 0 120 120" className="overflow-visible">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
        />

        {/* Principal segment */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={principalOffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />

        {/* Interest segment */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--warning)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={-((principalPercent / 100) * circumference)}
          strokeLinecap="round"
          transform={`rotate(${(principalPercent / 100) * 360 - 90} 60 60)`}
        />

        {/* Center text */}
        <text
          x="60"
          y="55"
          textAnchor="middle"
          className="font-display font-700 text-[10px]"
          fill="var(--foreground)"
        >
          {Math.round(principalPercent)}%
        </text>
        <text
          x="60"
          y="68"
          textAnchor="middle"
          className="text-[7px]"
          fill="var(--muted-foreground)"
        >
          Principal
        </text>
      </svg>

      {/* Legend */}
      <div className="text-center w-full">
        <div className="text-[8px] text-[var(--muted-foreground)] mb-0.5">Interest: {Math.round(interestPercent)}%</div>
        <div className="text-[8px] font-semibold text-[var(--primary)]">
          ₹{Math.round(principalAmount)} | ₹{Math.round(interestAmount)}
        </div>
      </div>
    </div>
  )
}
