import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Send, Loader2 } from "lucide-react";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: "कृपया सभी फ़ील्ड भरें", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      if (error) throw error;
      toast({ title: "संदेश भेजा गया!", description: "हम जल्द ही आपसे संपर्क करेंगे।" });
      setName(""); setEmail(""); setMessage("");
    } catch {
      toast({ title: "संदेश भेजने में त्रुटि", description: "कृपया बाद में प्रयास करें।", variant: "destructive" });
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="संपर्क करें - जन सेवा संदेश" description="जन सेवा संदेश से संपर्क करें।" />
      <Header />
      <main className="container py-12">
        <h1 className="text-3xl font-heading font-bold mb-8 text-center">संपर्क करें</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader><CardTitle>संपर्क फ़ॉर्म</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">नाम</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="आपका नाम" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">ईमेल</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="आपका ईमेल" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">संदेश</Label>
                  <textarea
                    id="message" value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="अपना संदेश लिखें..."
                    rows={5} required
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={sending}>
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  भेजें
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent mt-1 shrink-0" />
                  <p className="text-sm text-muted-foreground">श्री नन्देश्वर शिक्षा एवं जनसेवा संस्थान, मुख्य कार्यालय</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent shrink-0" />
                  <a href="tel:+918103282074" className="text-sm text-muted-foreground hover:text-accent">+91 81032 82074</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent shrink-0" />
                  <a href="mailto:shreenandeshwar4@gmail.com" className="text-sm text-muted-foreground hover:text-accent">shreenandeshwar4@gmail.com</a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
