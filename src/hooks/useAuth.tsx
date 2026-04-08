import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

type AppRole = "admin" | "writer" | null;

interface AuthContextType {
  user: User | null;
  role: AppRole;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, userType?: string) => Promise<{ error: string | null; needsVerification: boolean }>;
  resendVerificationEmail: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (userId: string) => {
    try {
      // Check if there's a pending writer role to assign
      const pendingWriterId = localStorage.getItem("pending_writer_role");
      if (pendingWriterId === userId) {
        localStorage.removeItem("pending_writer_role");
        // Try to insert writer role (ignore if already exists)
        await supabase.from("user_roles").upsert(
          { user_id: userId, role: "writer" },
          { onConflict: "user_id,role" }
        );
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      setRole(data?.role ?? null);
    } catch (err) {
      console.error("Failed to fetch role:", err);
      setRole(null);
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setTimeout(() => fetchRole(currentUser.id), 0);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchRole(currentUser.id).then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return { error: "ईमेल या पासवर्ड गलत है।" };
      }
      if (error.message.includes("Email not confirmed")) {
        return { error: "कृपया पहले अपना ईमेल सत्यापित करें।" };
      }
      return { error: error.message };
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string, userType: string = "reader") => {
    const redirectUrl = window.location.origin + "/auth/callback";
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName, user_type: userType },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return { error: "यह ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें।", needsVerification: false };
      }
      if (error.message.includes("security purposes") || error.message.includes("rate limit")) {
        return { error: "बहुत जल्दी-जल्दी अनुरोध हो रहे हैं। कृपया 1 मिनट बाद फिर प्रयास करें।", needsVerification: false };
      }
      if (error.message.includes("Failed to fetch")) {
        return { error: "नेटवर्क समस्या के कारण साइन अप पूरा नहीं हुआ। कृपया दोबारा प्रयास करें।", needsVerification: false };
      }
      return { error: error.message, needsVerification: false };
    }

    const needsVerification = !!(data.user && !data.user.email_confirmed_at);

    // If writer and user was created, insert role (will work after email verification when they first log in)
    if (data.user && userType === "writer") {
      // Store intent — role will be assigned on first login via onAuthStateChange
      localStorage.setItem("pending_writer_role", data.user.id);
    }

    return { error: null, needsVerification };
  };

  const resendVerificationEmail = async (email: string) => {
    const redirectUrl = window.location.origin + "/auth/callback";
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      if (error.message.includes("security purposes") || error.message.includes("rate limit")) {
        return { error: "वेरिफिकेशन ईमेल बार-बार नहीं भेजा जा सकता। कृपया 1 मिनट बाद पुनः प्रयास करें।" };
      }
      return { error: error.message };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signUp, resendVerificationEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
