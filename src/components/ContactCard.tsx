import { Phone, Trash2, User, MessageSquare, PhoneCall, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  phone: string;
  priority?: number;
}

interface AlertStatus {
  calling: boolean;
  called: boolean;
  messaging: boolean;
  messageSent: boolean;
}

interface ContactCardProps {
  contact: Contact;
  onDelete: (id: string) => void;
  alertStatus?: AlertStatus;
  isPrimary?: boolean;
}

const ContactCard = ({ contact, onDelete, alertStatus, isPrimary }: ContactCardProps) => {
  const isAlerting = alertStatus?.calling || alertStatus?.messaging;
  const isComplete = alertStatus?.called || alertStatus?.messageSent;

  return (
    <div 
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border shadow-soft transition-all duration-300 group",
        isAlerting && "border-accent bg-accent/5 shadow-glow-accent animate-pulse",
        isComplete && "border-green-500/50 bg-green-500/5",
        !isAlerting && !isComplete && "bg-card border-border hover:shadow-medium"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
          isPrimary ? "gradient-hero" : "bg-secondary",
          isAlerting && "gradient-alert",
          isComplete && "bg-green-500"
        )}>
          {isAlerting ? (
            <Loader2 className="w-6 h-6 text-accent-foreground animate-spin" />
          ) : isComplete ? (
            <CheckCircle2 className="w-6 h-6 text-white" />
          ) : (
            <User className={cn(
              "w-6 h-6",
              isPrimary ? "text-primary-foreground" : "text-secondary-foreground"
            )} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground">{contact.name}</p>
            {isPrimary && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full gradient-hero text-primary-foreground">
                Primary
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {contact.phone}
          </p>
          
          {/* Alert Status */}
          {alertStatus && (
            <div className="flex items-center gap-3 mt-2">
              {/* Calling Status */}
              {isPrimary && (
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  alertStatus.calling && "text-accent",
                  alertStatus.called && "text-green-600"
                )}>
                  {alertStatus.calling ? (
                    <>
                      <PhoneCall className="w-3 h-3 animate-pulse" />
                      <span>Calling...</span>
                    </>
                  ) : alertStatus.called ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Called</span>
                    </>
                  ) : null}
                </div>
              )}
              
              {/* Message Status */}
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                alertStatus.messaging && "text-accent",
                alertStatus.messageSent && "text-green-600"
              )}>
                {alertStatus.messaging ? (
                  <>
                    <MessageSquare className="w-3 h-3 animate-pulse" />
                    <span>Sending SMS...</span>
                  </>
                ) : alertStatus.messageSent ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>SMS Sent</span>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {!alertStatus && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(contact.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
          aria-label={`Delete ${contact.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default ContactCard;
