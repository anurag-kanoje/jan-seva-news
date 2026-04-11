import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 1. Check for errors in hash or query params
        const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));
        const queryParams = new URLSearchParams(window.location.search);

        const authError =
          hashParams.get("error_description") ||
          hashParams.get("error") ||
          queryParams.get("error_description") ||
          queryParams.get("error");

        if (authError) {
          setStatus("error");
          setMessage(decodeURIComponent(authError));
          return;
        }

        // 2. Try PKCE token_hash verification (Supabase default for email links)
        const tokenHash = queryParams.get("token_hash");
        const type = queryParams.get("type");

        if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any,
          });

          if (error) {
            setStatus("error");
            setMessage(error.message);
            return;
          }

          setStatus("success");
          setMessage("आपका ईमेल सफलतापूर्वक सत्यापित हो गया है!");
          setTimeout(() => navigate("/login", { replace: true }), 3000);
          return;
        }

        // 3. Check for access_token in hash (implicit flow)
        const accessToken = hashParams.get("access_token");
        if (accessToken) {
          const { data, error } = await supabase.auth.getSession();
          if (error || !data.session) {
            setStatus("error");
            setMessage("सत्यापन विफल। कृपया पुनः प्रयास करें।");
            return;
          }
          setStatus("success");
          setMessage("आपका ईमेल सफलतापूर्वक सत्यापित हो गया है!");
          setTimeout(() => navigate("/login", { replace: true }), 3000);
          return;
        }

        // 4. Fallback — try getting existing session
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }
        if (!data.session) {
          setStatus("error");
          setMessage("यह verification link अमान्य या expired है। कृपया signup स्क्रीन से नया लिंक भेजें।");
          return;
        }

        setStatus("success");
        setMessage("आपका ईमेल सफलतापूर्वक सत्यापित हो गया है!");
        setTimeout(() => navigate("/login", { replace: true }), 3000);
      } catch {
        setStatus("error");
        setMessage("सत्यापन में त्रुटि हुई। कृपया पुनः प्रयास करें।");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <img src={logo} alt="JSS" className="h-16 mx-auto mb-4" loading="lazy" />
          <CardTitle className="text-2xl font-heading">ईमेल सत्यापन</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">सत्यापित हो रहा है...</p>
            </div>
          )}
          {status === "success" && (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="h-12 w-12 text-primary" />
              <p className="text-foreground font-medium">{message}</p>
              <p className="text-sm text-muted-foreground">आपको लॉगिन पेज पर भेजा जा रहा है...</p>
              <Button onClick={() => navigate("/login", { replace: true })}>लॉगिन करें</Button>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col items-center gap-3">
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="text-destructive font-medium">{message}</p>
              <Button onClick={() => navigate("/signup", { replace: true })}>साइन अप पर जाएं</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
