import { useState } from "react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { MiniSparkline } from "./MiniSparkline";
import { motion } from "framer-motion";

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  icon: LucideIcon;
  sparkData: number[];
  index: number;
  variant?: "default" | "primary";
}

export function KPICard({ title, value, prefix, suffix, change, icon: Icon, sparkData, index }: KPICardProps) {
  const positive = change >= 0;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative rounded-2xl p-5 transition-all duration-300 cursor-default ${hovered
          ? "gradient-primary text-primary-foreground shadow-glow scale-[1.02]"
          : "bg-card shadow-card border border-border"
        }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className={`text-xs font-medium uppercase tracking-wide transition-colors duration-300 ${hovered ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}>
            {title}
          </span>
          <span className={`text-2xl font-bold font-heading transition-colors duration-300 ${hovered ? "text-primary-foreground" : "text-foreground"
            }`}>
            <AnimatedCounter target={value} prefix={prefix} suffix={suffix} />
          </span>
          <div className="flex items-center gap-1 mt-1">
            {positive ? (
              <TrendingUp className={`h-3.5 w-3.5 transition-colors duration-300 ${hovered ? "text-primary-foreground/80" : "text-success"
                }`} />
            ) : (
              <TrendingDown className={`h-3.5 w-3.5 transition-colors duration-300 ${hovered ? "text-primary-foreground/80" : "text-destructive"
                }`} />
            )}
            <span className={`text-xs font-semibold transition-colors duration-300 ${hovered
                ? "text-primary-foreground/80"
                : positive ? "text-success" : "text-destructive"
              }`}>
              {positive ? "+" : ""}{change}%
            </span>
            <span className={`text-xs transition-colors duration-300 ${hovered ? "text-primary-foreground/60" : "text-muted-foreground"
              }`}>
              vs last month
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${hovered ? "bg-primary-foreground/15" : "gradient-soft"
            }`}>
            <Icon className={`h-5 w-5 transition-colors duration-300 ${hovered ? "text-primary-foreground" : "text-primary"
              }`} />
          </div>
          <MiniSparkline
            data={sparkData}
            color={hovered ? "rgba(255,255,255,0.7)" : "#0F9D8A"}
          />
        </div>
      </div>
    </motion.div>
  );
}
