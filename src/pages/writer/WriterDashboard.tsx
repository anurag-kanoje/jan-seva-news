import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Clock, CheckCircle, XCircle, Eye, PenLine,
  TrendingUp, Edit, ArrowRight
} from "lucide-react";

interface Article {
  id: string; title: string; status: string; views: number;
  created_at: string; slug: string | null;
}

const WriterDashboard = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState({ total: 0, drafts: 0, pending: 0, approved: 0, rejected: 0, views: 0 });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("articles")
      .select("id, title, status, views, created_at, slug")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.warn("Writer articles fetch error:", error.message); }
        const items = data ?? [];
        setArticles(items);
        setStats({
          total: items.length,
          drafts: items.filter(a => a.status === "draft").length,
          pending: items.filter(a => a.status === "pending").length,
          approved: items.filter(a => a.status === "approved").length,
          rejected: items.filter(a => a.status === "rejected").length,
          views: items.reduce((sum, a) => sum + (a.views || 0), 0),
        });
      });
  }, [user]);

  const statCards = [
    { label: "कुल लेख", value: stats.total, icon: FileText, color: "text-primary" },
    { label: "ड्राफ्ट", value: stats.drafts, icon: Clock, color: "text-muted-foreground" },
    { label: "समीक्षा में", value: stats.pending, icon: Clock, color: "text-yellow-600" },
    { label: "प्रकाशित", value: stats.approved, icon: CheckCircle, color: "text-green-600" },
    { label: "अस्वीकृत", value: stats.rejected, icon: XCircle, color: "text-destructive" },
    { label: "कुल व्यू", value: stats.views, icon: TrendingUp, color: "text-accent" },
  ];

  const recentArticles = articles.slice(0, 5);
  const topArticles = [...articles].filter(a => a.status === "approved").sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <DashboardLayout type="writer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-heading font-bold">लेखक डैशबोर्ड</h1>
            <p className="text-sm text-muted-foreground mt-1">
              नमस्ते, {user?.user_metadata?.full_name || "लेखक"}! आज कुछ नया लिखें।
            </p>
          </div>
          <Link to="/writer/new">
            <Button className="gap-2"><PenLine className="w-4 h-4" /> नया लेख लिखें</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
                <span className="text-2xl font-bold">{s.value}</span>
                <span className="text-xs text-muted-foreground mt-1">{s.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/writer/new" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed border-2 border-accent/30 hover:border-accent">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  <PenLine className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-bold">नया लेख लिखें</h3>
                <p className="text-xs text-muted-foreground mt-1">रिच टेक्स्ट एडिटर के साथ</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/writer/articles" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold">मेरे लेख</h3>
                <p className="text-xs text-muted-foreground mt-1">सभी लेख देखें और प्रबंधित करें</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/profile" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-heading font-bold">प्रोफ़ाइल</h3>
                <p className="text-xs text-muted-foreground mt-1">अपनी प्रोफ़ाइल अपडेट करें</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent & Top Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">हाल के लेख</CardTitle>
              <Link to="/writer/articles" className="text-sm text-accent hover:underline flex items-center gap-1">
                सभी देखें <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentArticles.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">कोई लेख नहीं — नया लेख लिखकर शुरू करें!</p>
              ) : recentArticles.map(a => (
                <Link key={a.id} to={`/writer/edit/${a.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate group-hover:text-accent transition-colors">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString("hi-IN")}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Badge variant="outline" className="text-[10px]">
                      {a.status === "approved" ? "प्रकाशित" : a.status === "pending" ? "समीक्षा में" : a.status === "rejected" ? "अस्वीकृत" : "ड्राफ्ट"}
                    </Badge>
                    <Edit className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-accent" /> सबसे लोकप्रिय</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topArticles.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">अभी तक कोई प्रकाशित लेख नहीं</p>
              ) : topArticles.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-2xl font-bold text-muted-foreground/30 w-8 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3" />{a.views} व्यू</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WriterDashboard;
