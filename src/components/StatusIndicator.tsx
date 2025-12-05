import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "listening" | "alert";

interface StatusIndicatorProps {
  status: Status;
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const config = {
    idle: {
      icon: Shield,
      label: "Protection Off",
      description: "Tap the button to start monitoring",
      bgClass: "bg-muted",
      textClass: "text-muted-foreground",
      iconClass: "text-muted-foreground",
    },
    listening: {
      icon: ShieldCheck,
      label: "Protection Active",
      description: "Listening for emergency keywords",
      bgClass: "gradient-safe",
      textClass: "text-primary-foreground",
      iconClass: "text-primary-foreground",
    },
    alert: {
      icon: ShieldAlert,
      label: "Alert Triggered!",
      description: "Sending emergency alerts now",
      bgClass: "gradient-alert",
      textClass: "text-accent-foreground",
      iconClass: "text-accent-foreground animate-pulse",
    },
  };

  const { icon: Icon, label, description, bgClass, textClass, iconClass } = config[status];

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-500",
        bgClass,
        status === "listening" && "shadow-glow-primary",
        status === "alert" && "shadow-glow-accent"
      )}
    >
      <Icon className={cn("w-8 h-8 flex-shrink-0", iconClass)} />
      <div>
        <p className={cn("font-semibold text-lg", textClass)}>{label}</p>
        <p className={cn("text-sm opacity-80", textClass)}>{description}</p>
      </div>
    </div>
  );
};

export default StatusIndicator;
