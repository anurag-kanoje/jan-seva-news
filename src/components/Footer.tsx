import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <img src={logo} alt="JSS Logo" className="h-16 mb-4 bg-white rounded-lg p-2" />
            <p className="text-primary-foreground/80 text-sm mb-4 font-body">
              जन सेवा संदेश - सच्चाई की आवाज़। स्थानीय से वैश्विक स्तर तक निष्पक्ष समाचार।
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors"><Youtube className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors"><Instagram className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-4">त्वरित लिंक</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm font-hindi">होम</Link></li>
              <li><Link to="/about" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm font-hindi">हमारे बारे में</Link></li>
              <li><Link to="/search" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm font-hindi">समाचार खोजें</Link></li>
              <li><Link to="/contact" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm font-hindi">संपर्क करें</Link></li>
              <li><Link to="/login" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm font-hindi">लॉगिन</Link></li>
              <li><Link to="/signup" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm font-hindi">साइन अप</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-4">समाचार श्रेणियां</h4>
            <ul className="space-y-2">
              {["राजनीति", "खेल", "व्यापार", "मनोरंजन", "प्रौद्योगिकी", "स्वास्थ्य"].map((item) => (
                <li key={item}>
                  <Link to={`/search?q=${encodeURIComponent(item)}`} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm font-hindi">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-4">संपर्क करें</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 mt-1 shrink-0 text-accent" />
                <span className="text-primary-foreground/70 font-hindi">श्री नन्देश्वर शिक्षा एवं जनसेवा संस्थान, मुख्य कार्यालय</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 shrink-0 text-accent" />
                <a href="tel:+918103282074" className="text-primary-foreground/70 hover:text-accent transition-colors">+91 81032 82074</a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 shrink-0 text-accent" />
                <a href="mailto:shreenandeshwar4@gmail.com" className="text-primary-foreground/70 hover:text-accent transition-colors">shreenandeshwar4@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm text-center md:text-left">
            © 2025 JSS - जन सेवा संदेश। सर्वाधिकार सुरक्षित।
          </p>
          <div className="flex gap-4 text-sm">
            <Link to="/privacy" className="text-primary-foreground/60 hover:text-accent transition-colors">गोपनीयता नीति</Link>
            <Link to="/terms" className="text-primary-foreground/60 hover:text-accent transition-colors">नियम व शर्तें</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
