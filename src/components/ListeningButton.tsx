import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListeningButtonProps {
  isListening: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const ListeningButton = ({ isListening, onClick, disabled }: ListeningButtonProps) => {
  return (
    <div className="relative">
      {/* Pulse rings when listening */}
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full gradient-hero animate-pulse-ring" />
          <div className="absolute inset-0 rounded-full gradient-hero animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
          <div className="absolute inset-0 rounded-full gradient-hero animate-pulse-ring" style={{ animationDelay: '1s' }} />
        </>
      )}
      
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500",
          "focus:outline-none focus:ring-4 focus:ring-primary/30",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isListening
            ? "gradient-hero shadow-glow-primary scale-110"
            : "bg-card border-2 border-border shadow-medium hover:shadow-lg hover:scale-105"
        )}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        {isListening ? (
          <Mic className="w-12 h-12 text-primary-foreground animate-pulse" />
        ) : (
          <MicOff className="w-12 h-12 text-muted-foreground" />
        )}
      </button>
    </div>
  );
};

export default ListeningButton;
