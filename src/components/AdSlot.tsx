import { useEffect, useRef } from "react";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  label?: string;
}

const AdSlot = ({ slot, format = "auto", className = "", label }: AdSlotProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isAdSenseLoaded = typeof (window as any).adsbygoogle !== "undefined";

  useEffect(() => {
    if (isAdSenseLoaded) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        // AdSense may throw if ad already loaded
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

  return (
    <div className={`border border-dashed border-border rounded-lg bg-muted/30 flex items-center justify-center text-muted-foreground text-xs ${className}`}>
      <div className="text-center py-4 px-2">
        <p className="font-medium">विज्ञापन स्थान</p>
        <p className="text-[10px] mt-1">{label || `Ad Slot: ${slot}`}</p>
      </div>
    </div>
  );
};

export default AdSlot;
