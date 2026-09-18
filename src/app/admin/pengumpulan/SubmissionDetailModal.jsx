import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Trophy,
  FileText,
  Link2,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
} from "lucide-react";

export default function SubmissionDetailModal({ open, onClose, data }) {
  if (!data) return null;

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detail Submission
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant={getStatusVariant(data?.status)}>
                {data?.status || "Pending"}
              </Badge>
              <div className="flex items-center gap-2">
                {data?.is_verified ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Terverifikasi</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-500">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm">Belum Terverifikasi</span>
                  </div>
                )}
              </div>
            </div>
            {data?.score && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Skor: {data.score}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  Identitas Peserta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Nama
                  </label>
                  <p className="text-sm break-words">{data?.user?.name || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-sm break-words">{data?.user?.email || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Nama Tim
                  </label>
                  <p className="text-sm break-words">{data?.team_name || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="min-w-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Trophy className="h-4 w-4" />
                  Info Lomba
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Kategori
                  </label>
                  <p className="text-sm break-words">
                    {data?.category?.category_name || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Kompetisi
                  </label>
                  <p className="text-sm break-words">{data?.category?.name || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Judul Proyek
                  </label>
                  <p className="text-sm break-words">
                    {data?.project_name || data?.title || "-"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deskripsi Proyek</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 min-h-[100px] text-sm break-words">
                {data?.description || (
                  <span className="text-muted-foreground italic">
                    Tidak ada deskripsi
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle className="text-base">Flow Aplikasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 min-h-[100px] text-sm break-words">
                  {data?.flow_application || (
                    <span className="text-muted-foreground italic">
                      Flow tidak tersedia
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="min-w-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Link2 className="h-4 w-4" />
                  Link Tambahan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data?.links && data.links.length > 0 ? (
                    data.links.map((link) => (
                      <div key={link.link_id} className="border rounded-lg p-3 min-w-0">
                        <div className="font-medium text-sm break-words">
                          {link.link_type}
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all text-xs"
                        >
                          {link.url}
                        </a>
                        {link.description && (
                          <div className="text-xs text-muted-foreground mt-1 break-words">
                            {link.description}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-muted-foreground italic text-sm">
                      Tidak ada link tambahan
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {data?.feedback && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm break-words">{data.feedback}</div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                Informasi Waktu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-muted-foreground">
                    Dibuat
                  </label>
                  <p>
                    {data?.created_at
                      ? new Date(data.created_at).toLocaleString("id-ID")
                      : "-"}
                  </p>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">
                    Terakhir Diupdate
                  </label>
                  <p>
                    {data?.updated_at
                      ? new Date(data.updated_at).toLocaleString("id-ID")
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
