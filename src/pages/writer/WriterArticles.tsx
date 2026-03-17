import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Trash2, Edit, PenLine, Eye, Clock, CheckCircle, XCircle,
  FileText, MoreVertical, ExternalLink, AlertCircle
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface Article {
  id: string; title: string; status: string; views: number;
  created_at: string; category_id: string | null; slug: string | null;
  excerpt: string | null; image_url: string | null;
}

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  draft: { label: "ड्राफ्ट", icon: Clock, className: "bg-muted text-muted-foreground" },
  pending: { label: "समीक्षा में", icon: AlertCircle, className: "bg-yellow-600 text-white" },
  approved: { label: "प्रकाशित", icon: CheckCircle, className: "bg-green-600 text-white" },
  rejected: { label: "अस्वीकृत", icon: XCircle, className: "bg-destructive text-destructive-foreground" },
};

const WriterArticles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchArticles = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("articles")
      .select("id, title, status, views, created_at, category_id, slug, excerpt, image_url")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });
    setArticles(data ?? []);
  };

  useEffect(() => { fetchArticles(); }, [user]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("articles").delete().eq("id", deleteId);
    if (error) {
      toast({ title: "हटाने में त्रुटि", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "लेख हटा दिया गया" });
      fetchArticles();
    }
    setDeleteId(null);
  };

  const filtered = activeFilter === "all" ? articles : articles.filter(a => a.status === activeFilter);
  const counts = {
    all: articles.length,
    draft: articles.filter(a => a.status === "draft").length,
    pending: articles.filter(a => a.status === "pending").length,
    approved: articles.filter(a => a.status === "approved").length,
    rejected: articles.filter(a => a.status === "rejected").length,
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    return <Badge className={`${config.className} gap-1`}><Icon className="w-3 h-3" />{config.label}</Badge>;
  };

  return (
    <DashboardLayout type="writer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-heading font-bold">मेरे लेख</h1>
            <p className="text-sm text-muted-foreground mt-1">कुल {articles.length} लेख</p>
          </div>
          <Link to="/writer/new">
            <Button className="gap-2"><PenLine className="w-4 h-4" /> नया लेख लिखें</Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeFilter} onValueChange={setActiveFilter}>
          <TabsList>
            <TabsTrigger value="all">सभी ({counts.all})</TabsTrigger>
            <TabsTrigger value="draft">ड्राफ्ट ({counts.draft})</TabsTrigger>
            <TabsTrigger value="pending">समीक्षा में ({counts.pending})</TabsTrigger>
            <TabsTrigger value="approved">प्रकाशित ({counts.approved})</TabsTrigger>
            <TabsTrigger value="rejected">अस्वीकृत ({counts.rejected})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Articles Grid */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-heading font-bold mb-2">कोई लेख नहीं</h3>
              <p className="text-muted-foreground mb-4">
                {activeFilter === "all" ? "अभी तक कोई लेख नहीं लिखा। नया लेख लिखना शुरू करें!" : `${statusConfig[activeFilter]?.label || ""} श्रेणी में कोई लेख नहीं`}
              </p>
              <Link to="/writer/new"><Button><PenLine className="w-4 h-4 mr-2" /> नया लेख लिखें</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <Card key={a.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                {/* Image */}
                <div className="relative h-40 bg-muted overflow-hidden">
                  {a.image_url ? (
                    <img src={a.image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <FileText className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/writer/edit/${a.id}`)}>
                          <Edit className="w-4 h-4 mr-2" /> संपादित करें
                        </DropdownMenuItem>
                        {a.status === "approved" && a.slug && (
                          <DropdownMenuItem onClick={() => window.open(`/article/${a.slug}`, "_blank")}>
                            <ExternalLink className="w-4 h-4 mr-2" /> लेख देखें
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(a.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> हटाएं
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4 space-y-2">
                  <h3
                    className="font-heading font-bold text-card-foreground line-clamp-2 cursor-pointer hover:text-accent transition-colors"
                    onClick={() => navigate(`/writer/edit/${a.id}`)}
                  >
                    {a.title}
                  </h3>
                  {a.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(a.created_at).toLocaleDateString("hi-IN")}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{a.views} व्यू</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>क्या आप सुनिश्चित हैं?</AlertDialogTitle>
              <AlertDialogDescription>
                यह लेख स्थायी रूप से हटा दिया जाएगा। इस क्रिया को पूर्ववत नहीं किया जा सकता।
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>रद्द करें</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                हटाएं
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default WriterArticles;
