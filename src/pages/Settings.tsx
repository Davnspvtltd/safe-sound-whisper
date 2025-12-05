import { useState } from "react";
import { MapPin, Volume2, Bell, Clock } from "lucide-react";
import Header from "@/components/Header";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [soundFeedback, setSoundFeedback] = useState(true);
  const [autoCall, setAutoCall] = useState(false);
  const [sensitivity, setSensitivity] = useState([50]);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Configure how Aurora protects you</p>
          </div>

          {/* Location Settings */}
          <div className="p-6 bg-card rounded-xl border border-border shadow-soft space-y-6">
            <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Location Settings
            </h2>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="location" className="text-foreground font-medium">
                  Share Location in Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Include your GPS coordinates when sending emergency alerts
                </p>
              </div>
              <Switch
                id="location"
                checked={locationEnabled}
                onCheckedChange={setLocationEnabled}
              />
            </div>
          </div>

          {/* Audio Settings */}
          <div className="p-6 bg-card rounded-xl border border-border shadow-soft space-y-6">
            <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              Audio Settings
            </h2>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound" className="text-foreground font-medium">
                  Sound Feedback
                </Label>
                <p className="text-sm text-muted-foreground">
                  Play a sound when protection is activated or paused
                </p>
              </div>
              <Switch
                id="sound"
                checked={soundFeedback}
                onCheckedChange={setSoundFeedback}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-0.5">
                <Label className="text-foreground font-medium">
                  Detection Sensitivity
                </Label>
                <p className="text-sm text-muted-foreground">
                  Higher sensitivity may catch more keywords but increase false positives
                </p>
              </div>
              <Slider
                value={sensitivity}
                onValueChange={setSensitivity}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-right">
                {sensitivity[0]}%
              </p>
            </div>
          </div>

          {/* Alert Settings */}
          <div className="p-6 bg-card rounded-xl border border-border shadow-soft space-y-6">
            <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Alert Settings
            </h2>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autocall" className="text-foreground font-medium">
                  Auto-Call First Contact
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically call your primary contact after sending alerts
                </p>
              </div>
              <Switch
                id="autocall"
                checked={autoCall}
                onCheckedChange={setAutoCall}
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="p-6 bg-secondary/50 rounded-xl border border-border space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Response Time
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Aurora typically detects keywords within 1-2 seconds and sends alerts within 3 seconds. 
              Actual delivery times depend on network conditions and carrier response.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
