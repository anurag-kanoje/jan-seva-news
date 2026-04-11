import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, Facebook, Twitter, Youtube, Instagram, Phone, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.jpg";

const navItems = [
  { name: "होम", href: "/" },
  { name: "खोजें", href: "/search" },
  { name: "हमारे बारे में", href: "/about" },
  { name: "संपर्क", href: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tickerItems, setTickerItems] = useState<string[]>([]);
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("articles")
      .select("title")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setTickerItems(data.map((a) => a.title));
        }
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const defaultTicker = [
    "श्री नन्देश्वर संस्थान द्वारा गौशाला में 100 गायों की सेवा जारी",
    "जनसेवा संदेश अब राष्ट्रीय स्तर पर विस्तार की ओर",
    "जरूरतमंदों की मदद के लिए नई पहल शुरू",
  ];

  const displayTicker = tickerItems.length > 0 ? tickerItems : defaultTicker;

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+918103282074" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Phone className="w-3 h-3" />
              <span className="hidden sm:inline">+91 81032 82074</span>
            </a>
            <span className="hidden md:inline text-primary-foreground/80">|</span>
            <span className="hidden md:inline text-primary-foreground/80">श्री नन्देश्वर शिक्षा एवं जनसेवा संस्थान</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-accent transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="hover:text-accent transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-accent transition-colors"><Youtube className="w-4 h-4" /></a>
            <a href="#" className="hover:text-accent transition-colors"><Instagram className="w-4 h-4" /></a>
          </div>
        </div>
      </div>

      <div className="bg-card shadow-md border-b border-border">
        <div className="container flex items-center justify-between py-3">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="JSS - Jan Seva Sandesh" className="h-14 md:h-16 object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.name} to={item.href} className="nav-link text-foreground font-hindi">{item.name}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
              <Search className="w-4 h-4" />
            </Button>
            {user ? (
              <>
                {(role === "admin" || role === "writer") && (
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm" className="hidden sm:flex gap-1">
                      <LayoutDashboard className="w-4 h-4" /> डैशबोर्ड
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-1">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">लॉगआउट</span>
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="gap-1">
                  <LogIn className="w-4 h-4" /> लॉगिन
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="icon" className="lg:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-border py-3 bg-card animate-fade-in-up">
            <form onSubmit={handleSearch} className="container flex gap-2 max-w-xl mx-auto">
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="समाचार खोजें..." autoFocus className="flex-1" />
              <Button type="submit" size="sm"><Search className="w-4 h-4" /></Button>
            </form>
          </div>
        )}

        {isMenuOpen && (
          <nav className="lg:hidden bg-card border-t border-border py-4 animate-fade-in-up">
            <div className="container flex flex-col gap-3">
              {navItems.map((item) => (
                <Link key={item.name} to={item.href} className="py-2 px-4 text-foreground hover:bg-muted hover:text-accent rounded-md transition-colors font-hindi" onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>
              ))}
              {user && (role === "admin" || role === "writer") && (
                <Link to="/dashboard" className="py-2 px-4 text-foreground hover:bg-muted rounded-md" onClick={() => setIsMenuOpen(false)}>
                  डैशबोर्ड
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>

      <div className="bg-breaking text-white overflow-hidden">
        <div className="container flex items-center py-2">
          <span className="bg-white text-breaking px-3 py-1 text-xs font-bold uppercase tracking-wider mr-4 rounded shrink-0">
            ब्रेकिंग
          </span>
          <div className="overflow-hidden flex-1">
            <div className="ticker-content whitespace-nowrap">
              {displayTicker.map((item, i) => (
                <span key={i} className="mx-8">🔴 {item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
