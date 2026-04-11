import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import AdSlot from "@/components/AdSlot";
import ArticleCardPublic from "@/components/ArticleCardPublic";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, User, ArrowLeft, Share2 } from "lucide-react";
import { hasViewedArticle, markArticleViewed } from "@/lib/rate-limit";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ArticleDetail {
  id: string; title: string; content: string; excerpt: string | null;
  image_url: string | null; created_at: string; views: number;
  category_id: string | null; author_id: string; slug: string | null;
  category_name?: string; author_name?: string;
}

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!slug) return;
    const fetchArticle = async () => {
      setLoading(true);
      try {
        let data: any = null;
        const { data: d, error } = await supabase
          .from("articles")
          .select("*, profiles:author_id(full_name), categories:category_id(name)")
          .eq("slug", slug)
          .single();

        if (error) {
          // Fallback without joins
          const { data: fb } = await supabase.from("articles").select("*").eq("slug", slug).single();
          data = fb;
        } else {
          data = d;
        }

        if (data) {
          const a = data as any;
          setArticle({
            ...a,
            category_name: a.categories?.name ?? null,
            author_name: a.profiles?.full_name ?? null,
          });

          if (!hasViewedArticle(a.id)) {
            markArticleViewed(a.id);
            try {
              await supabase.rpc("increment_article_views", { article_id: a.id });
            } catch {
              console.warn("increment_article_views RPC not available");
            }
          }

          if (a.category_id) {
            try {
              const { data: rel } = await supabase
                .from("articles")
                .select("*, profiles:author_id(full_name), categories:category_id(name)")
                .eq("status", "approved")
                .eq("category_id", a.category_id)
                .neq("id", a.id)
                .order("created_at", { ascending: false })
                .limit(3);
              setRelated(
                (rel ?? []).map((r: any) => ({
                  ...r,
                  category_name: r.categories?.name ?? null,
                  author_name: r.profiles?.full_name ?? null,
                }))
              );
            } catch {
              setRelated([]);
            }
          }
        }
      } catch (err) {
        console.warn("Article fetch failed:", err);
      }
      setLoading(false);
    };
    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: article?.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "लिंक कॉपी किया गया!" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 max-w-4xl">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">लेख नहीं मिला</h1>
          <Link to="/" className="text-accent hover:underline">← होम पेज पर वापस जाएं</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const dateStr = new Date(article.created_at).toLocaleDateString("hi-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const insertInlineAds = (html: string): string => {
    const parts = html.split("</p>");
    const result: string[] = [];
    let pCount = 0;
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].trim()) {
        result.push(parts[i] + "</p>");
        pCount++;
        if (pCount % 3 === 0 && i < parts.length - 1) {
          result.push(
            `<div class="my-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 text-xs py-4"><span>विज्ञापन — In-Article</span></div>`
          );
        }
      }
    }
    return result.join("");
  };

  const contentWithAds = insertInlineAds(article.content);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${article.title} - जनसेवा संदेश`}
        description={article.excerpt || article.title}
        image={article.image_url || undefined}
      />
      <Header />
      <main className="container py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent">
            <ArrowLeft className="w-4 h-4" /> वापस जाएं
          </Link>
          <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1">
            <Share2 className="w-4 h-4" /> शेयर
          </Button>
        </div>
        <AdSlot slot="top-banner" format="horizontal" className="mb-6 min-h-[90px]" label="Top Banner" />
        {article.category_name && (
          <Link to={`/category/${article.category_id}`}>
            <Badge className="bg-accent text-accent-foreground mb-4">{article.category_name}</Badge>
          </Link>
        )}
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to={`/author/${article.author_id}`} className="flex items-center gap-1 hover:text-accent">
            <User className="w-4 h-4" /> {article.author_name || "अज्ञात"}
          </Link>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{dateStr}</span>
          <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{article.views} व्यू</span>
        </div>
        {article.image_url && (
          <img src={article.image_url} alt={article.title} className="w-full rounded-lg mb-6 max-h-[500px] object-cover" loading="lazy" />
        )}
        <article className="prose prose-lg max-w-none text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: contentWithAds }} />
        <AdSlot slot="bottom-banner" format="horizontal" className="mt-8 min-h-[90px]" label="Bottom Banner" />
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="section-title font-hindi">संबंधित समाचार</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (<ArticleCardPublic key={r.id} {...r} />))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;
