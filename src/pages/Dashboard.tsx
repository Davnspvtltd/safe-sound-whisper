import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import Header from "@/components/Header";
import ListeningButton from "@/components/ListeningButton";
import StatusIndicator from "@/components/StatusIndicator";
import ContactCard from "@/components/ContactCard";
import AddContactForm from "@/components/AddContactForm";
import KeywordSettings from "@/components/KeywordSettings";
import { AlertTriangle } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface AlertStatus {
  calling: boolean;
  called: boolean;
  messaging: boolean;
  messageSent: boolean;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<"idle" | "listening" | "alert">("idle");
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "Mom", phone: "+1 (555) 123-4567" },
    { id: "2", name: "Best Friend", phone: "+1 (555) 987-6543" },
  ]);
  const [keywords, setKeywords] = useState(["aurora", "help", "emergency"]);
  const [detectedText, setDetectedText] = useState("");
  const [alertStatuses, setAlertStatuses] = useState<Record<string, AlertStatus>>({});

  const simulateAlertSequence = useCallback((contactsList: Contact[]) => {
    // Reset all statuses
    const initialStatuses: Record<string, AlertStatus> = {};
    contactsList.forEach(c => {
      initialStatuses[c.id] = { calling: false, called: false, messaging: false, messageSent: false };
    });
    setAlertStatuses(initialStatuses);

    // Primary contact (first one) - start calling
    if (contactsList.length > 0) {
      const primaryId = contactsList[0].id;
      
      // Start calling primary contact
      setTimeout(() => {
        setAlertStatuses(prev => ({
          ...prev,
          [primaryId]: { ...prev[primaryId], calling: true }
        }));
      }, 500);

      // Call complete after 2 seconds
      setTimeout(() => {
        setAlertStatuses(prev => ({
          ...prev,
          [primaryId]: { ...prev[primaryId], calling: false, called: true }
        }));
      }, 2500);
    }

    // Send SMS to all contacts with staggered timing
    contactsList.forEach((contact, index) => {
      // Start sending SMS
      setTimeout(() => {
        setAlertStatuses(prev => ({
          ...prev,
          [contact.id]: { ...prev[contact.id], messaging: true }
        }));
      }, 800 + (index * 400));

      // SMS sent
      setTimeout(() => {
        setAlertStatuses(prev => ({
          ...prev,
          [contact.id]: { ...prev[contact.id], messaging: false, messageSent: true }
        }));
      }, 1800 + (index * 400));
    });
  }, []);

  const handleKeywordDetected = useCallback((keyword: string, transcript: string) => {
    setStatus("alert");
    setDetectedText(transcript);
    
    toast({
      title: "🚨 Emergency Keyword Detected!",
      description: `Keyword "${keyword}" detected. Alerting your contacts now!`,
      variant: "destructive",
    });

    // Start the alert sequence
    simulateAlertSequence(contacts);

    // In a real app, this would trigger actual SMS/call alerts
    console.log("ALERT! Sending to contacts:", contacts);
    console.log("Detected keyword:", keyword);
    console.log("Full transcript:", transcript);

    // Reset after 8 seconds
    setTimeout(() => {
      setStatus("listening");
      setDetectedText("");
      setAlertStatuses({});
    }, 8000);
  }, [contacts, toast, simulateAlertSequence]);

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

  const addContact = (name: string, phone: string) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      phone,
    };
    setContacts([...contacts, newContact]);
    toast({
      title: "Contact Added",
      description: `${name} will now receive emergency alerts.`,
    });
  };

  const deleteContact = (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    setContacts(contacts.filter((c) => c.id !== id));
    toast({
      title: "Contact Removed",
      description: `${contact?.name} has been removed from your emergency contacts.`,
    });
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
                <p className="text-sm text-destructive/60">
                  Contacting {contacts.length} emergency contacts...
                </p>
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
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                Emergency Contacts
                {isAlerting && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-destructive text-destructive-foreground animate-pulse">
                    ALERTING
                  </span>
                )}
              </h2>
              
              {contacts.length > 0 ? (
                <div className="space-y-3">
                  {contacts.map((contact, index) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onDelete={deleteContact}
                      isPrimary={index === 0}
                      alertStatus={isAlerting ? alertStatuses[contact.id] : undefined}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground">No contacts added yet</p>
                </div>
              )}
              
              {!isAlerting && <AddContactForm onAdd={addContact} />}
            </section>

            {/* Settings Column */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Settings</h2>
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
                <h3 className="font-semibold text-foreground mb-2">How to test</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Click the microphone button to start</li>
                  <li>Allow microphone access when prompted</li>
                  <li>Say any of your keywords: "{keywords.join('", "')}"</li>
                  <li>Watch alerts trigger on your contacts!</li>
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
