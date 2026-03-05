interface MiniSparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export function MiniSparkline({ data, color = "currentColor", height = 32, width = 80 }: MiniSparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height * 0.8) - height * 0.1;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        opacity="0.7"
      />
    </svg>
  );
}
