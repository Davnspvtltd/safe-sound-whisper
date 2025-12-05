import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  priority: number;
  created_at?: string;
  updated_at?: string;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchContacts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("priority", { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (err: any) {
      console.error("Error fetching contacts:", err);
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const addContact = async (name: string, phone: string) => {
    try {
      // Get the highest priority and add 1
      const maxPriority = contacts.length > 0 
        ? Math.max(...contacts.map(c => c.priority)) + 1 
        : 0;

      const { data, error } = await supabase
        .from("contacts")
        .insert({ name, phone, priority: maxPriority })
        .select()
        .single();

      if (error) throw error;
      
      setContacts([...contacts, data]);
      toast({
        title: "Contact Added",
        description: `${name} will now receive emergency alerts.`,
      });
      return data;
    } catch (err: any) {
      console.error("Error adding contact:", err);
      toast({
        title: "Error",
        description: "Failed to add contact",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteContact = async (id: string) => {
    const contact = contacts.find(c => c.id === id);
    try {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setContacts(contacts.filter(c => c.id !== id));
      toast({
        title: "Contact Removed",
        description: `${contact?.name} has been removed from your emergency contacts.`,
      });
    } catch (err: any) {
      console.error("Error deleting contact:", err);
      toast({
        title: "Error",
        description: "Failed to remove contact",
        variant: "destructive",
      });
    }
  };

  const reorderContacts = async (newOrder: Contact[]) => {
    // Optimistic update
    setContacts(newOrder);

    try {
      // Update priorities in database
      const updates = newOrder.map((contact, index) => 
        supabase
          .from("contacts")
          .update({ priority: index })
          .eq("id", contact.id)
      );

      await Promise.all(updates);
      
      toast({
        title: "Contacts Reordered",
        description: "Contact priority order has been updated.",
      });
    } catch (err: any) {
      console.error("Error reordering contacts:", err);
      // Revert on error
      fetchContacts();
      toast({
        title: "Error",
        description: "Failed to reorder contacts",
        variant: "destructive",
      });
    }
  };

  return {
    contacts,
    isLoading,
    addContact,
    deleteContact,
    reorderContacts,
    refetch: fetchContacts,
  };
};
