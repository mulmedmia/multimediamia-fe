import { Button } from "@/components/ui/button";
import { X, User, Trophy, FileText, Link2, Clock, CheckCircle2, XCircle, Star } from "lucide-react";

export default function SubmissionDetailModal({ open, onClose, data }) {
  if (!open || !data) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'terverifikasi':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
      case 'menunggu':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected':
      case 'ditolak':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-0 min-w-[320px] max-w-4xl w-full mx-4 max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-red-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Detail Submission</h2>
              <p className="text-red-100 text-sm">ID: {data?.submission_id}</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          
          {/* Status Card */}
          <div className="mb-6 p-4 rounded-xl border-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(data?.status)}`}>
                  {data?.status || 'Pending'}
                </div>
                <div className="flex items-center gap-2">
                  {data?.is_verified ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 size={16} />
                      <span className="text-sm font-medium">Terverifikasi</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-500">
                      <XCircle size={16} />
                      <span className="text-sm font-medium">Belum Terverifikasi</span>
                    </div>
                  )}
                </div>
              </div>
              {data?.score && (
                <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <Star size={16} className="text-yellow-500" />
                  <span className="font-semibold text-yellow-700 dark:text-yellow-300">Skor: {data.score}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* Identitas Peserta */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <User size={18} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Identitas Peserta</h3>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nama</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{data?.user?.name || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{data?.user?.email || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nama Tim</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{data?.team_name || '-'}</span>
                </div>
              </div>
            </div>

            {/* Info Lomba */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Trophy size={18} className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Info Lomba</h3>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Kategori</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{data?.category?.category_name || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Kompetisi</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{data?.category?.name || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Judul Proyek</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{data?.project_name || data?.title || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deskripsi Full Width */}
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <h4 className="font-semibold text-base mb-3 text-gray-900 dark:text-white">Deskripsi Proyek</h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[100px] text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {data?.description || <span className="text-gray-400 italic">Tidak ada deskripsi</span>}
              </div>
            </div>
          </div>

          {/* Flow Application & Links */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <h4 className="font-semibold text-base mb-3 text-gray-900 dark:text-white">Flow Aplikasi</h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[100px] text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {data?.flow_application || <span className="text-gray-400 italic">Flow tidak tersedia</span>}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Link2 size={16} className="text-blue-600" />
                <h4 className="font-semibold text-base text-gray-900 dark:text-white">Link Tambahan</h4>
              </div>
              <div className="text-sm space-y-2">
                {data?.links && data.links.length > 0 ? (
                  data.links.map((link) => (
                    <div key={link.link_id} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="font-medium text-blue-900 dark:text-blue-300">{link.link_type}</div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all text-xs"
                      >
                        {link.url}
                      </a>
                      {link.description && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{link.description}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 italic">Tidak ada link tambahan</span>
                )}
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          {data?.feedback && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700 p-5 mb-6">
              <h4 className="font-semibold text-base mb-3 text-amber-900 dark:text-amber-300">Feedback</h4>
              <div className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                {data.feedback}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-gray-500" />
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Informasi Waktu</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex flex-col">
                <span className="font-medium text-gray-500 dark:text-gray-400">Dibuat</span>
                <span>{data?.created_at ? new Date(data.created_at).toLocaleString("id-ID") : "-"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-500 dark:text-gray-400">Terakhir Diupdate</span>
                <span>{data?.updated_at ? new Date(data.updated_at).toLocaleString("id-ID") : "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
          <Button 
            variant="outline" 
            className="w-full py-3 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
            onClick={onClose}
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}