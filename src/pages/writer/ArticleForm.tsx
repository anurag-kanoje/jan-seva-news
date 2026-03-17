import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/ImageUpload";
import RichTextEditor from "@/components/RichTextEditor";
import ArticlePreview from "@/components/ArticlePreview";
import { generateUniqueSlug } from "@/lib/slug";
import { canSubmitArticle } from "@/lib/rate-limit";
import {
  Save, Send, Eye, ArrowLeft, Settings, FileText, Image as ImageIcon,
  Tag, Clock, CheckCircle, AlertCircle, Loader2
} from "lucide-react";

interface Category { id: string; name: string; }

const ArticleForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [enableAds, setEnableAds] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [articleStatus, setArticleStatus] = useState<string>("draft");

  // Word count
  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    return text ? text.split(/\s+/).length : 0;
  }, [content]);

  const charCount = useMemo(() => {
    return content.replace(/<[^>]*>/g, "").length;
  }, [content]);

  const readTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount]);

  // Load categories
  useEffect(() => {
    supabase.from("categories").select("id, name").then(({ data }) => setCategories(data ?? []));
  }, []);

  // Load existing article
  useEffect(() => {
    if (id) {
      supabase.from("articles").select("*").eq("id", id).single().then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setExcerpt(data.excerpt ?? "");
          setCategoryId(data.category_id ?? "");
          setImageUrl(data.image_url ?? "");
          setArticleStatus(data.status);
          setTags((data as any).tags ?? "");
          setEnableAds((data as any).enable_ads !== false);
        }
      });
    }
  }, [id]);

  // Auto-generate excerpt from content
  useEffect(() => {
    if (!excerpt && content) {
      const plainText = content.replace(/<[^>]*>/g, "").trim();
      if (plainText.length > 20) {
        setExcerpt(plainText.substring(0, 150) + (plainText.length > 150 ? "..." : ""));
      }
    }
  }, [content]);

  const categoryName = categories.find(c => c.id === categoryId)?.name;

  // Save as draft
  const handleSaveDraft = async () => {
    if (!user) return;
    if (title.trim().length < 3) {
      toast({ title: "शीर्षक कम से कम 3 अक्षर का होना चाहिए", variant: "destructive" });
      return;
    }
    setSaving(true);
    const articleData: any = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim(),
      category_id: categoryId || null,
      image_url: imageUrl.trim() || null,
      author_id: user.id,
      status: "draft",
    };

    let error;
    if (isEditing) {
      ({ error } = await supabase.from("articles").update(articleData).eq("id", id!));
    } else {
      articleData.slug = generateUniqueSlug(title);
      articleData.views = 0;
      ({ error } = await supabase.from("articles").insert(articleData));
    }
    setSaving(false);
    if (error) {
      toast({ title: "त्रुटि", description: error.message, variant: "destructive" });
    } else {
      setLastSaved(new Date());
      setArticleStatus("draft");
      toast({ title: "ड्राफ्ट सहेजा गया", description: "आपका लेख ड्राफ्ट के रूप में सहेजा गया है" });
    }
  };

  // Submit for review / publish
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return;
    if (title.trim().length < 5) {
      toast({ title: "शीर्षक कम से कम 5 अक्षर का होना चाहिए", variant: "destructive" });
      return;
    }
    if (charCount < 50) {
      toast({ title: "सामग्री कम से कम 50 अक्षर की होनी चाहिए", variant: "destructive" });
      return;
    }
    if (!categoryId) {
      toast({ title: "कृपया एक श्रेणी चुनें", variant: "destructive" });
      return;
    }
    if (!canSubmitArticle()) {
      toast({ title: "कृपया कुछ सेकंड प्रतीक्षा करें", variant: "destructive" });
      return;
    }
    setSaving(true);
    const articleData: any = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim(),
      category_id: categoryId || null,
      image_url: imageUrl.trim() || null,
      author_id: user.id,
      status: "pending",
    };

    let error;
    if (isEditing) {
      ({ error } = await supabase.from("articles").update(articleData).eq("id", id!));
    } else {
      articleData.slug = generateUniqueSlug(title);
      articleData.views = 0;
      ({ error } = await supabase.from("articles").insert(articleData));
    }
    setSaving(false);
    if (error) {
      toast({ title: "त्रुटि", description: error.message, variant: "destructive" });
    } else {
      setArticleStatus("pending");
      toast({ title: "लेख सबमिट हुआ!", description: "आपका लेख समीक्षा के लिए भेजा गया है" });
      navigate("/writer/articles");
    }
  };

  const getStatusBadge = () => {
    switch (articleStatus) {
      case "draft": return <Badge variant="outline" className="gap-1"><Clock className="w-3 h-3" /> ड्राफ्ट</Badge>;
      case "pending": return <Badge className="bg-yellow-600 gap-1"><AlertCircle className="w-3 h-3" /> समीक्षा में</Badge>;
      case "approved": return <Badge className="bg-green-600 gap-1"><CheckCircle className="w-3 h-3" /> प्रकाशित</Badge>;
      case "rejected": return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" /> अस्वीकृत</Badge>;
      default: return <Badge variant="outline">नया</Badge>;
    }
  };

  return (
    <DashboardLayout type="writer">
      <div className="space-y-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/writer/articles")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-heading font-bold">
                {isEditing ? "लेख संपादित करें" : "नया लेख लिखें"}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge()}
                {lastSaved && (
                  <span className="text-xs text-muted-foreground">
                    अंतिम बार सहेजा: {lastSaved.toLocaleTimeString("hi-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              ड्राफ्ट सहेजें
            </Button>
            <Button onClick={() => handleSubmit()} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              प्रकाशन के लिए भेजें
            </Button>
          </div>
        </div>

        {/* Main Editor Area */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="write" className="gap-1"><FileText className="w-4 h-4" /> लिखें</TabsTrigger>
            <TabsTrigger value="settings" className="gap-1"><Settings className="w-4 h-4" /> सेटिंग्स</TabsTrigger>
            <TabsTrigger value="preview" className="gap-1"><Eye className="w-4 h-4" /> प्रीव्यू</TabsTrigger>
          </TabsList>

          {/* Write Tab */}
          <TabsContent value="write" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
              <div className="space-y-4">
                {/* Title */}
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="लेख का शीर्षक लिखें..."
                  className="text-2xl font-heading font-bold h-14 border-none shadow-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
                  maxLength={200}
                />
                
                <Separator />

                {/* Rich Text Editor */}
                <RichTextEditor content={content} onChange={setContent} />

                {/* Stats bar */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
                  <span>{wordCount} शब्द</span>
                  <span>{charCount} अक्षर</span>
                  <span>~{readTime} मिनट पठन समय</span>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2"><ImageIcon className="w-4 h-4" /> कवर छवि</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {imageUrl && (
                      <img src={imageUrl} alt="Cover" className="w-full h-40 object-cover rounded-lg" />
                    )}
                    {user && <ImageUpload userId={user.id} currentUrl={imageUrl} onUpload={setImageUrl} />}
                    <Input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="या URL डालें..."
                      className="text-xs"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2"><Tag className="w-4 h-4" /> श्रेणी</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger><SelectValue placeholder="श्रेणी चुनें" /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">सारांश</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="लेख का संक्षिप्त विवरण..."
                      rows={3}
                      maxLength={300}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{excerpt.length}/300</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">प्रकाशन सेटिंग्स</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">विज्ञापन सक्षम करें</Label>
                    <p className="text-xs text-muted-foreground mt-1">लेख में विज्ञापन दिखाए जाएंगे</p>
                  </div>
                  <Switch checked={enableAds} onCheckedChange={setEnableAds} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-sm font-medium">टैग्स</Label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="कॉमा से अलग करें: राजनीति, चुनाव, भारत"
                  />
                  <p className="text-xs text-muted-foreground">SEO और खोज के लिए टैग्स जोड़ें</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-sm font-medium">SEO प्रीव्यू</Label>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                    <p className="text-accent text-sm font-medium truncate">{title || "शीर्षक यहाँ दिखेगा"}</p>
                    <p className="text-xs text-green-700">jansewasandesh.com/article/{title ? generateUniqueSlug(title).substring(0, 40) : "..."}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{excerpt || "सारांश यहाँ दिखेगा..."}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">विज्ञापन प्लेसमेंट गाइड</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <p><strong>टॉप बैनर:</strong> लेख शीर्षक के ऊपर एक हॉरिज़ॉन्टल विज्ञापन</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <p><strong>इन-आर्टिकल:</strong> हर 3 पैराग्राफ़ के बाद स्वचालित विज्ञापन</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <p><strong>बॉटम बैनर:</strong> लेख के अंत में एक हॉरिज़ॉन्टल विज्ञापन</p>
                </div>
                <p className="text-xs italic mt-2">विज्ञापन Google AdSense द्वारा प्रबंधित होंगे। एडमिन से AdSense कोड सेटअप करवाएं।</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Eye className="w-4 h-4" /> यह आपका लेख प्रकाशित होने के बाद ऐसा दिखेगा
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ArticlePreview
                  title={title}
                  content={content}
                  excerpt={excerpt}
                  imageUrl={imageUrl}
                  categoryName={categoryName}
                  authorName={user?.user_metadata?.full_name || "लेखक"}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ArticleForm;
