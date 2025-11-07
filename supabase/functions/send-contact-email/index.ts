import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  area?: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData: ContactFormData = await req.json();

    const emailBody = `
Neue Kontaktanfrage von ReinGlanz B&E Website

═══════════════════════════════════════
KONTAKTINFORMATION
═══════════════════════════════════════

Name: ${formData.name}
E-Mail: ${formData.email}
${formData.phone ? `Telefon: ${formData.phone}\n` : ""}${formData.company ? `Firma/Einrichtung: ${formData.company}\n` : ""}
═══════════════════════════════════════
ANFRAGEDETAILS
═══════════════════════════════════════

Art der Reinigung: ${formData.service}
${formData.area ? `Fläche: ${formData.area} m²\n` : ""}
Nachricht:
${formData.message}

═══════════════════════════════════════
Zeitpunkt: ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}
    `.trim();

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY nicht konfiguriert");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "ReinGlanz B&E <onboarding@resend.dev>",
        to: ["reinglanzbe@gmail.com"],
        reply_to: formData.email,
        subject: `Neues Angebot: ${formData.service} - ${formData.name}`,
        text: emailBody,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Resend API Error:", errorData);
      throw new Error(`E-Mail konnte nicht gesendet werden: ${emailResponse.status}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Ihr Angebot wurde erfolgreich versendet!" 
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten" 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});