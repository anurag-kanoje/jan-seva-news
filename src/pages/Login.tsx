import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSending, setForgotSending] = useState(false);
  const { signIn, resetPasswordForEmail, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (user) { navigate("/dashboard", { replace: true }); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { toast({ title: "कृपया ईमेल और पासवर्ड दर्ज करें", variant: "destructive" }); return; }
    setIsLoading(true);
    try {
      const { error } = await signIn(email.trim(), password);
      if (error) { toast({ title: "लॉगिन विफल", description: error, variant: "destructive" }); }
      else { toast({ title: "सफलतापूर्वक लॉगिन हुआ" }); navigate("/dashboard", { replace: true }); }
    } catch { toast({ title: "नेटवर्क त्रुटि", description: "कृपया इंटरनेट कनेक्शन जांचें", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) { toast({ title: "कृपया ईमेल दर्ज करें", variant: "destructive" }); return; }
    setForgotSending(true);
    const { error } = await resetPasswordForEmail(forgotEmail.trim());
    setForgotSending(false);
    if (error) {
      toast({ title: "त्रुटि", description: error, variant: "destructive" });
    } else {
      toast({ title: "पासवर्ड रीसेट ईमेल भेजा गया", description: "कृपया अपना ईमेल चेक करें।" });
      setShowForgot(false);
    }
  };

  if (showForgot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img src={logo} alt="JSS" className="h-16 mx-auto mb-4" loading="lazy" />
            <CardTitle className="text-2xl font-heading">पासवर्ड भूल गए?</CardTitle>
            <CardDescription>अपना ईमेल दर्ज करें, हम आपको रीसेट लिंक भेजेंगे</CardDescription>
          </CardHeader>
          <form onSubmit={handleForgotPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgotEmail">ईमेल</Label>
                <Input id="forgotEmail" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required autoComplete="email" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={forgotSending}>
                {forgotSending ? "भेज रहा है..." : "रीसेट लिंक भेजें"}
              </Button>
              <button type="button" onClick={() => setShowForgot(false)} className="text-sm text-accent hover:underline">
                ← लॉगिन पर वापस जाएं
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src={logo} alt="JSS" className="h-16 mx-auto mb-4" loading="lazy" />
          <CardTitle className="text-2xl font-heading">लॉगिन करें</CardTitle>
          <CardDescription>जन सेवा संदेश डैशबोर्ड में प्रवेश करें</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label htmlFor="email">ईमेल</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></div>
            <div className="space-y-2"><Label htmlFor="password">पासवर्ड</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></div>
            <button type="button" onClick={() => { setShowForgot(true); setForgotEmail(email); }} className="text-sm text-accent hover:underline">
              पासवर्ड भूल गए?
            </button>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "लॉगिन हो रहा है..." : "लॉगिन"}</Button>
            <p className="text-sm text-muted-foreground">खाता नहीं है?{" "}<Link to="/signup" className="text-accent hover:underline">साइन अप करें</Link></p>
            <Link to="/" className="text-sm text-muted-foreground hover:text-accent">← होम पेज पर वापस जाएं</Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
export default Login;
