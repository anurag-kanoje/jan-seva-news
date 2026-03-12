import { useEffect, useState } from "react";
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
  const [userType, setUserType] = useState<"reader" | "writer" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const { signUp, resendVerificationEmail, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast({ title: "कृपया अपना नाम दर्ज करें", variant: "destructive" });
      return;
    }

    if (!userType) {
      toast({ title: "कृपया यूज़र टाइप चुनें", description: "आप पाठक हैं या लेखक, यह चुनना आवश्यक है।", variant: "destructive" });
      return;
    }

    if (password.length < 6) {
      toast({ title: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { error, needsVerification } = await signUp(cleanEmail, password, fullName.trim(), userType);

      if (error) {
        toast({ title: "साइन अप विफल", description: error, variant: "destructive" });
      } else if (needsVerification) {
        setVerificationEmail(cleanEmail);
        setShowVerificationStep(true);
        toast({
          title: "ईमेल सत्यापन आवश्यक है",
          description: "हमने आपके ईमेल पर verification link भेजा है। कृपया inbox/spam दोनों जांचें।",
        });
      } else {
        toast({ title: "खाता बन गया!", description: "आप अब लॉगिन कर सकते हैं।" });
        navigate("/login", { replace: true });
      }
    } catch {
      toast({ title: "नेटवर्क त्रुटि", description: "कृपया इंटरनेट कनेक्शन जांचें", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const targetEmail = verificationEmail || email.trim().toLowerCase();
    if (!targetEmail) {
      toast({ title: "ईमेल नहीं मिला", description: "कृपया पहले साइन अप करें।", variant: "destructive" });
      return;
    }

    setIsResending(true);
    const { error } = await resendVerificationEmail(targetEmail);
    setIsResending(false);

    if (error) {
      toast({ title: "ईमेल दोबारा भेजना विफल", description: error, variant: "destructive" });
      return;
    }

    toast({ title: "ईमेल भेज दिया गया", description: "Verification link दोबारा भेज दिया गया है।" });
  };

  if (showVerificationStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img src={logo} alt="JSS" className="h-16 mx-auto mb-4" loading="lazy" />
            <CardTitle className="text-2xl font-heading">ईमेल वेरिफाई करें</CardTitle>
            <CardDescription>
              हमने <span className="font-medium text-foreground">{verificationEmail}</span> पर वेरिफिकेशन लिंक भेजा है।
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Inbox और Spam/Promotions दोनों फ़ोल्डर जांचें।</p>
            <p>• ईमेल में दिए गए लिंक पर क्लिक करने के बाद आप login कर पाएंगे।</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="button" className="w-full" onClick={handleResendVerification} disabled={isResending}>
              {isResending ? "ईमेल भेज रहे हैं..." : "वेरिफिकेशन ईमेल दोबारा भेजें"}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/login", { replace: true })}>
              मैंने वेरिफाई कर लिया, लॉगिन पर जाएं
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => setShowVerificationStep(false)}>
              वापस जाकर विवरण बदलें
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
            <div className="space-y-2">
              <Label htmlFor="name">पूरा नाम</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">ईमेल</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">पासवर्ड</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
            </div>
            <div className="space-y-3">
              <Label>आप कौन हैं? (ज़रूरी)</Label>
              <RadioGroup value={userType ?? ""} onValueChange={(v) => setUserType(v as "reader" | "writer")} className="flex gap-4">
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
                {userType === "writer"
                  ? "लेखक के रूप में आप लेख लिख और प्रकाशित कर सकते हैं।"
                  : userType === "reader"
                    ? "पाठक के रूप में आप सभी लेख पढ़ सकते हैं।"
                    : "साइन अप से पहले अपना यूज़र टाइप चुनें।"}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "खाता बना रहे हैं..." : "साइन अप"}
            </Button>
            <p className="text-sm text-muted-foreground">
              पहले से खाता है?{" "}
              <Link to="/login" className="text-accent hover:underline">लॉगिन करें</Link>
            </p>
            <Link to="/" className="text-sm text-muted-foreground hover:text-accent">← होम पेज पर वापस जाएं</Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
