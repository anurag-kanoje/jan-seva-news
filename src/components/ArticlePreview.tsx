import { Badge } from "@/components/ui/badge";
import { Clock, User, Eye } from "lucide-react";
import AdSlot from "./AdSlot";

interface ArticlePreviewProps {
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  categoryName?: string;
  authorName?: string;
}

const ArticlePreview = ({ title, content, excerpt, imageUrl, categoryName, authorName }: ArticlePreviewProps) => {
  const now = new Date().toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" });

  // Insert ad after every 3 paragraphs
  const insertAdsInContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const elements = Array.from(doc.body.children);
    const parts: string[] = [];
    let paragraphCount = 0;

    elements.forEach((el) => {
      parts.push(el.outerHTML);
      if (el.tagName === "P" || el.tagName.match(/^H[1-6]$/)) {
        paragraphCount++;
        if (paragraphCount % 3 === 0) {
          parts.push(`<div class="ad-marker" data-ad-index="${paragraphCount / 3}"></div>`);
        }
      }
    });

    return parts.join("");
  };

  const contentWithAds = insertAdsInContent(content);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Top Ad */}
        <AdSlot slot="top-banner" format="horizontal" className="mb-6 min-h-[90px]" />

        {categoryName && <Badge className="bg-accent text-accent-foreground mb-4">{categoryName}</Badge>}
        
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">{title || "शीर्षक यहाँ दिखेगा"}</h1>
        
        {excerpt && <p className="text-lg text-muted-foreground mb-4 italic border-l-4 border-accent pl-4">{excerpt}</p>}

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 flex-wrap">
          <span className="flex items-center gap-1"><User className="w-4 h-4" /> {authorName || "लेखक"}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {now}</span>
          <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> 0 व्यू</span>
        </div>

        {imageUrl && (
          <img src={imageUrl} alt={title} className="w-full rounded-lg mb-6 max-h-[500px] object-cover" />
        )}

        {/* Article content with inline ads */}
        <article
          className="prose prose-lg max-w-none text-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: contentWithAds }}
        />

        {/* Bottom Ad */}
        <AdSlot slot="bottom-banner" format="horizontal" className="mt-8 min-h-[90px]" />
      </div>
    </div>
  );
};

export default ArticlePreview;
