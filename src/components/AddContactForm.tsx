import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddContactFormProps {
  onAdd: (name: string, phone: string) => void;
}

const AddContactForm = ({ onAdd }: AddContactFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      onAdd(name.trim(), phone.trim());
      setName("");
      setPhone("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-card rounded-xl border border-border shadow-soft">
      <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-primary" />
        Add Emergency Contact
      </h3>
      
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-foreground">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Contact name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-background border-input"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-foreground">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-background border-input"
        />
      </div>
      
      <Button type="submit" variant="hero" className="w-full">
        Add Contact
      </Button>
    </form>
  );
};

export default AddContactForm;
