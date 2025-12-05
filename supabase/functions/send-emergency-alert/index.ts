import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmergencyAlertRequest {
  contacts: Array<{
    id: string;
    name: string;
    phone: string;
    isPrimary: boolean;
  }>;
  keyword: string;
  location?: {
    lat: number;
    lng: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.error("Missing Twilio credentials");
      throw new Error("Twilio credentials not configured");
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const { contacts, keyword, location }: EmergencyAlertRequest = await req.json();

    console.log("Received emergency alert request:", { 
      contactCount: contacts.length, 
      keyword, 
      hasLocation: !!location 
    });

    const results: Array<{
      contactId: string;
      contactName: string;
      smsStatus: string;
      callStatus?: string;
      error?: string;
    }> = [];

    // Build location string for message
    let locationString = "";
    if (location) {
      locationString = `\n\nLocation: https://www.google.com/maps?q=${location.lat},${location.lng}`;
    }

    // Process each contact
    for (const contact of contacts) {
      const result: any = {
        contactId: contact.id,
        contactName: contact.name,
        smsStatus: "pending",
      };

      // Clean phone number - remove spaces and special characters except +
      const cleanPhone = contact.phone.replace(/[\s()-]/g, "");
      
      const emergencyMessage = `🚨 EMERGENCY ALERT!\n\nAurora detected the keyword "${keyword}".\n\n${contact.name}, please check on this person immediately!${locationString}`;

      try {
        // Send SMS to all contacts
        console.log(`Sending SMS to ${contact.name} at ${cleanPhone}`);
        
        const smsResponse = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
          {
            method: "POST",
            headers: {
              "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              To: cleanPhone,
              From: twilioPhoneNumber,
              Body: emergencyMessage,
            }),
          }
        );

        const smsData = await smsResponse.json();
        console.log("SMS Response:", smsData);

        if (smsData.sid) {
          result.smsStatus = "sent";
          
          // Log to database
          await supabase.from("emergency_alerts").insert({
            contact_id: contact.id,
            contact_name: contact.name,
            contact_phone: contact.phone,
            alert_type: "sms",
            keyword_detected: keyword,
            location_lat: location?.lat,
            location_lng: location?.lng,
            status: "sent",
          });
        } else {
          result.smsStatus = "failed";
          result.error = smsData.message || "SMS failed";
          
          await supabase.from("emergency_alerts").insert({
            contact_id: contact.id,
            contact_name: contact.name,
            contact_phone: contact.phone,
            alert_type: "sms",
            keyword_detected: keyword,
            location_lat: location?.lat,
            location_lng: location?.lng,
            status: "failed",
            error_message: smsData.message,
          });
        }

        // Make voice call only to primary contact
        if (contact.isPrimary) {
          console.log(`Making call to primary contact ${contact.name} at ${cleanPhone}`);
          
          const twimlMessage = `<Response><Say voice="alice">Emergency alert! The keyword ${keyword} was detected. Please check on this person immediately.</Say><Pause length="1"/><Say voice="alice">I repeat, this is an emergency alert. Please respond immediately.</Say></Response>`;
          
          const callResponse = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Calls.json`,
            {
              method: "POST",
              headers: {
                "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                To: cleanPhone,
                From: twilioPhoneNumber,
                Twiml: twimlMessage,
              }),
            }
          );

          const callData = await callResponse.json();
          console.log("Call Response:", callData);

          if (callData.sid) {
            result.callStatus = "initiated";
            
            await supabase.from("emergency_alerts").insert({
              contact_id: contact.id,
              contact_name: contact.name,
              contact_phone: contact.phone,
              alert_type: "call",
              keyword_detected: keyword,
              location_lat: location?.lat,
              location_lng: location?.lng,
              status: "sent",
            });
          } else {
            result.callStatus = "failed";
            result.error = (result.error || "") + " " + (callData.message || "Call failed");
            
            await supabase.from("emergency_alerts").insert({
              contact_id: contact.id,
              contact_name: contact.name,
              contact_phone: contact.phone,
              alert_type: "call",
              keyword_detected: keyword,
              location_lat: location?.lat,
              location_lng: location?.lng,
              status: "failed",
              error_message: callData.message,
            });
          }
        }
      } catch (contactError: any) {
        console.error(`Error processing contact ${contact.name}:`, contactError);
        result.smsStatus = "failed";
        result.error = contactError.message;
      }

      results.push(result);
    }

    console.log("Emergency alert processing complete:", results);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        message: `Alerts sent to ${contacts.length} contacts` 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-emergency-alert function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
