import { MapPin, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LocationDisplayProps {
  location: {
    lat: number;
    lng: number;
    accuracy: number;
  } | null;
  error: string | null;
  isLoading: boolean;
  onRefresh: () => void;
}

const LocationDisplay = ({ location, error, isLoading, onRefresh }: LocationDisplayProps) => {
  return (
    <div className="p-4 bg-card rounded-xl border border-border shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Your Location
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-8 w-8"
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
        </Button>
      </div>

      {error ? (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : location ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>Location available</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Lat: {location.lat.toFixed(6)}</p>
            <p>Lng: {location.lng.toFixed(6)}</p>
            <p>Accuracy: ±{Math.round(location.accuracy)}m</p>
          </div>
          <a
            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            <MapPin className="w-3 h-3" />
            View on Google Maps
          </a>
        </div>
      ) : isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Getting location...</span>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Location not available</p>
      )}

      <p className="text-xs text-muted-foreground mt-3">
        Your location will be shared with emergency contacts when alerts are triggered.
      </p>
    </div>
  );
};

export default LocationDisplay;
