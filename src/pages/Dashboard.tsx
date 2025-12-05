import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useContacts } from "@/hooks/useContacts";
import { useLocation } from "@/hooks/useLocation";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import ListeningButton from "@/components/ListeningButton";
import StatusIndicator from "@/components/StatusIndicator";
import DraggableContactList from "@/components/DraggableContactList";
import AddContactForm from "@/components/AddContactForm";
import KeywordSettings from "@/components/KeywordSettings";
import LocationDisplay from "@/components/LocationDisplay";
import { AlertTriangle, Loader2 } from "lucide-react";

interface AlertStatus {
  calling: boolean;
  called: boolean;
  messaging: boolean;
  messageSent: boolean;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<"idle" | "listening" | "alert">("idle");
  const [keywords, setKeywords] = useState(["aurora", "help", "emergency"]);
  const [detectedText, setDetectedText] = useState("");
  const [alertStatuses, setAlertStatuses] = useState<Record<string, AlertStatus>>({});
  const [isSendingAlerts, setIsSendingAlerts] = useState(false);

  const { contacts, isLoading: contactsLoading, addContact, deleteContact, reorderContacts } = useContacts();
  const { location, error: locationError, isLoading: locationLoading, refreshLocation } = useLocation();

  const sendRealAlerts = useCallback(async (keyword: string, transcript: string) => {
    if (contacts.length === 0) {
      toast({
        title: "No Contacts",
        description: "Please add emergency contacts first.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingAlerts(true);

    // Initialize all statuses
    const initialStatuses: Record<string, AlertStatus> = {};
    contacts.forEach(c => {
      initialStatuses[c.id] = { calling: false, called: false, messaging: false, messageSent: false };
    });
    setAlertStatuses(initialStatuses);

    // Show messaging status for all contacts
    const messagingStatuses: Record<string, AlertStatus> = {};
    contacts.forEach((c, index) => {
      messagingStatuses[c.id] = { 
        calling: index === 0, 
        called: false, 
        messaging: true, 
        messageSent: false 
      };
    });
    setAlertStatuses(messagingStatuses);

    try {
      const { data, error } = await supabase.functions.invoke("send-emergency-alert", {
        body: {
          contacts: contacts.map((c, index) => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            isPrimary: index === 0,
          })),
          keyword,
          location: location ? { lat: location.lat, lng: location.lng } : undefined,
        },
      });

      if (error) throw error;

      console.log("Alert results:", data);

      // Update statuses based on results
      const finalStatuses: Record<string, AlertStatus> = {};
      data.results?.forEach((result: any) => {
        finalStatuses[result.contactId] = {
          calling: false,
          called: result.callStatus === "initiated",
          messaging: false,
          messageSent: result.smsStatus === "sent",
        };
      });
      setAlertStatuses(finalStatuses);

      toast({
        title: "Alerts Sent!",
        description: `Emergency alerts sent to ${contacts.length} contacts.`,
      });
    } catch (err: any) {
      console.error("Error sending alerts:", err);
      
      // Mark all as failed
      const failedStatuses: Record<string, AlertStatus> = {};
      contacts.forEach(c => {
        failedStatuses[c.id] = { calling: false, called: false, messaging: false, messageSent: false };
      });
      setAlertStatuses(failedStatuses);

      toast({
        title: "Alert Failed",
        description: err.message || "Failed to send emergency alerts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingAlerts(false);
    }
  }, [contacts, location, toast]);

  const handleKeywordDetected = useCallback((keyword: string, transcript: string) => {
    setStatus("alert");
    setDetectedText(transcript);
    
    toast({
      title: "🚨 Emergency Keyword Detected!",
      description: `Keyword "${keyword}" detected. Alerting your contacts now!`,
      variant: "destructive",
    });

    // Send real SMS and calls
    sendRealAlerts(keyword, transcript);

    // Reset after 10 seconds
    setTimeout(() => {
      setStatus("listening");
      setDetectedText("");
      setAlertStatuses({});
    }, 10000);
  }, [toast, sendRealAlerts]);

  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    error,
  } = useSpeechRecognition({
    keywords,
    onKeywordDetected: handleKeywordDetected,
  });

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setStatus("idle");
      toast({
        title: "Protection Paused",
        description: "Aurora is no longer listening for emergency keywords.",
      });
    } else {
      startListening();
      setStatus("listening");
      toast({
        title: "Protection Active",
        description: "Aurora is now listening for your safety keywords.",
      });
    }
  };

  const handleAddContact = async (name: string, phone: string) => {
    await addContact(name, phone);
  };

  const updateKeywords = (newKeywords: string[]) => {
    setKeywords(newKeywords);
    toast({
      title: "Keywords Updated",
      description: "Your emergency keywords have been saved.",
    });
  };

  const isAlerting = status === "alert";

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-5xl mx-auto">
          {/* Browser Support Warning */}
          {!isSupported && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">
                Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Main Control */}
          <section className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-2">Protection Dashboard</h1>
            <p className="text-muted-foreground mb-8">Control your safety settings and manage contacts</p>
            
            <div className="flex flex-col items-center gap-6">
              <ListeningButton 
                isListening={isListening} 
                onClick={toggleListening}
                disabled={!isSupported}
              />
              <p className="text-lg font-medium text-foreground">
                {isListening ? "Tap to pause protection" : "Tap to activate protection"}
              </p>
            </div>
          </section>

          {/* Live Transcript */}
          {isListening && !isAlerting && (
            <section className="mb-8">
              <div className="p-6 bg-card rounded-xl border border-border shadow-soft">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live Transcript
                </h3>
                <p className="text-muted-foreground min-h-[2rem]">
                  {transcript || "Listening... speak now"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Keywords: {keywords.join(", ")}
                </p>
              </div>
            </section>
          )}

          {/* Alert Display */}
          {isAlerting && detectedText && (
            <section className="mb-8">
              <div className="p-6 bg-destructive/10 rounded-xl border-2 border-destructive/50 shadow-glow-accent">
                <h3 className="font-bold text-destructive text-xl mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                  Emergency Alert Triggered!
                </h3>
                <p className="text-destructive/80 mb-2">
                  Detected: "{detectedText}"
                </p>
                <p className="text-sm text-destructive/60 flex items-center gap-2">
                  {isSendingAlerts ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending real SMS and calls to {contacts.length} contacts...
                    </>
                  ) : (
                    `Alerts sent to ${contacts.length} emergency contacts`
                  )}
                </p>
                {location && (
                  <p className="text-xs text-destructive/50 mt-2">
                    Location shared: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Status */}
          <section className="mb-12">
            <StatusIndicator status={status} />
          </section>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contacts Column */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  Emergency Contacts
                  {isAlerting && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-destructive text-destructive-foreground animate-pulse">
                      ALERTING
                    </span>
                  )}
                </h2>
                {!isAlerting && contacts.length > 1 && (
                  <span className="text-xs text-muted-foreground">
                    Drag to reorder priority
                  </span>
                )}
              </div>
              
              {contactsLoading ? (
                <div className="p-8 text-center bg-card rounded-xl border border-border">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground mt-2">Loading contacts...</p>
                </div>
              ) : contacts.length > 0 ? (
                <DraggableContactList
                  contacts={contacts}
                  onReorder={reorderContacts}
                  onDelete={deleteContact}
                  isAlerting={isAlerting}
                  alertStatuses={alertStatuses}
                />
              ) : (
                <div className="p-8 text-center bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground">No contacts added yet</p>
                </div>
              )}
              
              {!isAlerting && <AddContactForm onAdd={handleAddContact} />}
            </section>

            {/* Settings Column */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Settings</h2>
              
              {/* Location Display */}
              <LocationDisplay
                location={location}
                error={locationError}
                isLoading={locationLoading}
                onRefresh={refreshLocation}
              />

              <KeywordSettings keywords={keywords} onUpdate={updateKeywords} />
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-xl border border-border shadow-soft text-center">
                  <p className="text-3xl font-bold text-primary">{contacts.length}</p>
                  <p className="text-sm text-muted-foreground">Contacts</p>
                </div>
                <div className="p-4 bg-card rounded-xl border border-border shadow-soft text-center">
                  <p className="text-3xl font-bold text-primary">{keywords.length}</p>
                  <p className="text-sm text-muted-foreground">Keywords</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                <h3 className="font-semibold text-foreground mb-2">How it works</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Add emergency contacts (drag to set priority)</li>
                  <li>Allow location access for GPS sharing</li>
                  <li>Click the microphone to start listening</li>
                  <li>Say any keyword: "{keywords.join('", "')}"</li>
                  <li>Real SMS and calls sent instantly!</li>
                </ol>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
