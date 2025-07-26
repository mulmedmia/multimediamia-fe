import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle } from "lucide-react";

// Helper untuk deteksi tablet
function isTabletScreen() {
  if (typeof window === "undefined") return false;
  const width = window.innerWidth;
  return width >= 768 && width < 1024;
}

export function getPendaftarColumns({ isMobile, setDetailData, setVerifyData }) {
  // Mobile & Tablet: card-style layout dengan padding yang lebih baik
  if (isMobile || (typeof window !== "undefined" && isTabletScreen())) {
    return [
      {
        header: "Pendaftar",
        accessorKey: "user.name",
        cell: ({ row }) => (
          <div className="flex gap-3 items-start bg-white dark:bg-gray-900 rounded-lg shadow border p-4 max-w-full md:max-w-2xl mx-auto">
            {/* Avatar placeholder atau initial */}
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-gray-600 dark:text-gray-300 font-semibold text-sm">
                {row.original.user?.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Nama */}
              <div className="font-bold text-base mb-1 text-gray-900 dark:text-white">
                {row.original.user?.name || "Nama tidak tersedia"}
              </div>
              
              {/* Email */}
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">
                {row.original.user?.email || "Email tidak tersedia"}
              </div>
              
              {/* Kategori */}
              <div className="text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Kategori:</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {row.original.category?.category_name || "Tidak ada kategori"}
                </span>
              </div>
              
              {/* Competition Name */}
              <div className="text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Kompetisi:</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {row.original.competition_name || "Tidak ada nama kompetisi"}
                </span>
              </div>
              
              {/* Status */}
              <div className="mb-3">
                <Badge
                  variant={row.original.is_verified ? "default" : "secondary"}
                  className={`text-xs px-2 py-1 ${
                    row.original.is_verified
                      ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                  }`}
                >
                  {row.original.is_verified ? "Terverifikasi" : "Belum Terverifikasi"}
                </Badge>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col gap-2 mt-3 w-full">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full justify-center"
                  onClick={() => setDetailData(row.original)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Detail
                </Button>
                <Button 
                  size="sm" 
                  variant="default" 
                  className="w-full justify-center"
                  onClick={() => setVerifyData(row.original)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verifikasi
                </Button>
              </div>
            </div>
          </div>
        ),
      },
    ];
  }

  // Desktop: kolom lengkap dalam tabel
  return [
    {
      header: "Nama",
      accessorKey: "user.name",
      cell: ({ row }) => (
        <div className="font-medium truncate max-w-[180px] text-gray-900 dark:text-white">
          {row.original.user?.name || "Nama tidak tersedia"}
        </div>
      ),
    },
    {
      header: "Email",
      accessorKey: "user.email",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
          {row.original.user?.email || "Email tidak tersedia"}
        </div>
      ),
    },
    {
      header: "Kategori",
      accessorKey: "category.category_name",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs px-2 py-1 truncate max-w-[120px]">
          {row.original.category?.category_name || "Tidak ada kategori"}
        </Badge>
      ),
    },
    {
      header: "Kompetisi",
      accessorKey: "competition_name",
      cell: ({ row }) => (
        <div className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
          {row.original.competition_name || "Tidak ada nama kompetisi"}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "is_verified",
      cell: ({ row }) => (
        <Badge
          variant={row.original.is_verified ? "default" : "secondary"}
          className="text-xs px-2 py-1"
        >
          {row.original.is_verified ? "Terverifikasi" : "Belum Terverifikasi"}
        </Badge>
      ),
    },
    {
      header: "Aksi",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDetailData(row.original)}
            className="h-8 px-3"
          >
            <Eye className="h-4 w-4 mr-1" />
            Detail
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setVerifyData(row.original)}
            className="h-8 px-3"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Verifikasi
          </Button>
        </div>
      ),
    },
  ];
}