import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const AboutPage = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="हमारे बारे में - जन सेवा संदेश" description="जन सेवा संदेश — श्री नन्देश्वर शिक्षा एवं जनसेवा संस्थान द्वारा संचालित निष्पक्ष समाचार मंच।" />
    <Header />
    <main className="container py-12 max-w-3xl">
      <h1 className="text-3xl font-heading font-bold mb-6">हमारे बारे में</h1>
      <div className="prose prose-lg max-w-none text-foreground space-y-6">
        <p>
          <strong>जन सेवा संदेश (JSS)</strong> — श्री नन्देश्वर शिक्षा एवं जनसेवा संस्थान द्वारा संचालित एक निष्पक्ष और विश्वसनीय समाचार मंच है।
          हमारा उद्देश्य स्थानीय से लेकर राष्ट्रीय और अंतर्राष्ट्रीय स्तर तक सच्ची और निष्पक्ष पत्रकारिता प्रदान करना है।
        </p>
        <h2 className="text-2xl font-heading font-bold">हमारा मिशन</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>सत्य और निष्पक्ष समाचार प्रसारण</li>
          <li>समाज सेवा और जन जागरूकता</li>
          <li>शिक्षा और स्वास्थ्य के क्षेत्र में योगदान</li>
          <li>गौशाला सेवा और पर्यावरण संरक्षण</li>
          <li>जरूरतमंदों की सहायता</li>
        </ul>
        <h2 className="text-2xl font-heading font-bold">हमारी टीम</h2>
        <p>
          हमारी टीम अनुभवी पत्रकारों, लेखकों और समाजसेवियों से मिलकर बनी है जो सच्चाई की आवाज़ बनकर
          समाज के हर वर्ग तक समाचार पहुंचाने के लिए प्रतिबद्ध हैं।
        </p>
        <h2 className="text-2xl font-heading font-bold">संपर्क</h2>
        <p>
          ईमेल: <a href="mailto:shreenandeshwar4@gmail.com" className="text-accent hover:underline">shreenandeshwar4@gmail.com</a><br />
          फ़ोन: <a href="tel:+918103282074" className="text-accent hover:underline">+91 81032 82074</a>
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default AboutPage;
