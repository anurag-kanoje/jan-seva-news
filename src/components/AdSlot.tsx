import { useEffect, useRef } from "react";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

/**
 * Google AdSense Ad Slot component.
 * To activate: 
 * 1. Add your AdSense script to index.html: <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX" crossorigin="anonymous"></script>
 * 2. Replace the slot prop with your actual ad slot ID
 * 
 * For now it renders a placeholder.
 */
const AdSlot = ({ slot, format = "auto", className = "" }: AdSlotProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isAdSenseLoaded = typeof (window as any).adsbygoogle !== "undefined";

  useEffect(() => {
    if (isAdSenseLoaded) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [isAdSenseLoaded]);

  if (isAdSenseLoaded) {
    return (
      <div className={`ad-container ${className}`} ref={adRef}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format={format}
          data-ad-slot={slot}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Placeholder when AdSense is not loaded
  return (
    <div className={`border border-dashed border-border rounded-lg bg-muted/30 flex items-center justify-center text-muted-foreground text-xs ${className}`}>
      <div className="text-center py-4 px-2">
        <p className="font-medium">विज्ञापन स्थान</p>
        <p className="text-[10px] mt-1">Ad Slot: {slot}</p>
      </div>
    </div>
  );
};

export default AdSlot;
