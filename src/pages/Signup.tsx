import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpg";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<"reader" | "writer">("reader");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (user) { navigate("/dashboard", { replace: true }); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { toast({ title: "कृपया अपना नाम दर्ज करें", variant: "destructive" }); return; }
    if (password.length < 6) { toast({ title: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए", variant: "destructive" }); return; }
    setIsLoading(true);
    try {
      const { error, needsVerification } = await signUp(email.trim(), password, fullName.trim(), userType);
      if (error) { toast({ title: "साइन अप विफल", description: error, variant: "destructive" }); }
      else if (needsVerification) { toast({ title: "सफल!", description: "कृपया अपने ईमेल में भेजे गए लिंक पर क्लिक करके ईमेल verify करें।" }); }
      else { toast({ title: "खाता बन गया!", description: "आप अब लॉगिन कर सकते हैं।" }); navigate("/login", { replace: true }); }
    } catch { toast({ title: "नेटवर्क त्रुटि", description: "कृपया इंटरनेट कनेक्शन जांचें", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src={logo} alt="JSS" className="h-16 mx-auto mb-4" loading="lazy" />
          <CardTitle className="text-2xl font-heading">साइन अप करें</CardTitle>
          <CardDescription>जन सेवा संदेश पर नया खाता बनाएं</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label htmlFor="name">पूरा नाम</Label><Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoComplete="name" /></div>
            <div className="space-y-2"><Label htmlFor="email">ईमेल</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></div>
            <div className="space-y-2"><Label htmlFor="password">पासवर्ड</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" /></div>
            <div className="space-y-3">
              <Label>आप कौन हैं?</Label>
              <RadioGroup value={userType} onValueChange={(v) => setUserType(v as "reader" | "writer")} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reader" id="reader" />
                  <Label htmlFor="reader" className="cursor-pointer font-normal">पाठक (Reader)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="writer" id="writer" />
                  <Label htmlFor="writer" className="cursor-pointer font-normal">लेखक (Writer)</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                {userType === "writer" ? "लेखक के रूप में आप लेख लिख और प्रकाशित कर सकते हैं।" : "पाठक के रूप में आप सभी लेख पढ़ सकते हैं।"}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "खाता बना रहे हैं..." : "साइन अप"}</Button>
            <p className="text-sm text-muted-foreground">पहले से खाता है?{" "}<Link to="/login" className="text-accent hover:underline">लॉगिन करें</Link></p>
            <Link to="/" className="text-sm text-muted-foreground hover:text-accent">← होम पेज पर वापस जाएं</Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
export default Signup;
