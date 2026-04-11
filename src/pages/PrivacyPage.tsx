import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const PrivacyPage = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="गोपनीयता नीति - जन सेवा संदेश" description="जन सेवा संदेश की गोपनीयता नीति — आपकी निजता हमारी प्राथमिकता है।" />
    <Header />
    <main className="container py-12 max-w-3xl">
      <h1 className="text-3xl font-heading font-bold mb-6">गोपनीयता नीति</h1>
      <div className="prose prose-lg max-w-none text-foreground space-y-6">
        <p><strong>अंतिम अपडेट:</strong> अप्रैल 2026</p>
        <h2 className="text-xl font-heading font-bold">1. जानकारी का संग्रह</h2>
        <p>हम केवल वही जानकारी एकत्र करते हैं जो सेवा प्रदान करने के लिए आवश्यक है — जैसे नाम, ईमेल, और ब्राउज़िंग डेटा।</p>
        <h2 className="text-xl font-heading font-bold">2. जानकारी का उपयोग</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>खाता प्रबंधन और प्रमाणीकरण</li>
          <li>समाचार वितरण और वैयक्तिकरण</li>
          <li>वेबसाइट सुधार और विश्लेषण</li>
        </ul>
        <h2 className="text-xl font-heading font-bold">3. डेटा सुरक्षा</h2>
        <p>आपका डेटा एन्क्रिप्टेड और सुरक्षित सर्वर पर संग्रहीत है। हम तीसरे पक्ष को आपकी व्यक्तिगत जानकारी नहीं बेचते।</p>
        <h2 className="text-xl font-heading font-bold">4. कुकीज़</h2>
        <p>वेबसाइट कुकीज़ का उपयोग सत्र प्रबंधन और विज्ञापन प्रदर्शन के लिए करती है।</p>
        <h2 className="text-xl font-heading font-bold">5. संपर्क</h2>
        <p>गोपनीयता संबंधी प्रश्नों के लिए: <a href="mailto:shreenandeshwar4@gmail.com" className="text-accent hover:underline">shreenandeshwar4@gmail.com</a></p>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPage;
