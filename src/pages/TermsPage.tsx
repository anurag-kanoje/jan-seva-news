import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const TermsPage = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="नियम व शर्तें - जन सेवा संदेश" description="जन सेवा संदेश वेबसाइट के उपयोग के नियम और शर्तें।" />
    <Header />
    <main className="container py-12 max-w-3xl">
      <h1 className="text-3xl font-heading font-bold mb-6">नियम व शर्तें</h1>
      <div className="prose prose-lg max-w-none text-foreground space-y-6">
        <p><strong>अंतिम अपडेट:</strong> अप्रैल 2026</p>
        <h2 className="text-xl font-heading font-bold">1. स्वीकृति</h2>
        <p>इस वेबसाइट का उपयोग करके आप इन नियमों और शर्तों से सहमत होते हैं।</p>
        <h2 className="text-xl font-heading font-bold">2. सामग्री</h2>
        <p>वेबसाइट पर प्रकाशित सभी समाचार और लेख कॉपीराइट संरक्षित हैं। बिना अनुमति के पुनर्प्रकाशन निषिद्ध है।</p>
        <h2 className="text-xl font-heading font-bold">3. उपयोगकर्ता आचरण</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>आपत्तिजनक या भ्रामक सामग्री पोस्ट न करें</li>
          <li>दूसरों की निजता का सम्मान करें</li>
          <li>किसी भी अवैध गतिविधि के लिए सेवा का उपयोग न करें</li>
        </ul>
        <h2 className="text-xl font-heading font-bold">4. लेखक दायित्व</h2>
        <p>लेखक अपने द्वारा प्रकाशित सामग्री के लिए स्वयं जिम्मेदार हैं। संपादकीय टीम सामग्री की समीक्षा करती है।</p>
        <h2 className="text-xl font-heading font-bold">5. विज्ञापन</h2>
        <p>वेबसाइट पर विज्ञापन तीसरे पक्ष (Google AdSense) द्वारा प्रदर्शित किए जाते हैं।</p>
        <h2 className="text-xl font-heading font-bold">6. दायित्व सीमा</h2>
        <p>जन सेवा संदेश किसी भी प्रत्यक्ष या अप्रत्यक्ष हानि के लिए उत्तरदायी नहीं है।</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsPage;
