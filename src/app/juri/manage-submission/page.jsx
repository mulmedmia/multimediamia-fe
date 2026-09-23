"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Github,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { useUserProfile } from "@/hooks/user-use-profile";
import YouTubePreview from "@/components/common/YouTubePreview";
import api from "@/lib/api";

// Komponen untuk menampilkan setiap kartu submission
const SubmissionCard = ({ submission }) => {
  const githubLink = submission.links?.find(
    (link) => link.link_type === "GITHUB",
  )?.url;
  const otherLink = submission.links?.[0]?.url;

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400";
      case "REVISION":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400";
    }
  };

  return (
    <div
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer h-full group"
      onClick={() =>
        (window.location.href = `/juri/manage-submission/${submission.submission_id}`)
      }
    >
      <div className="flex-grow">
        {/* Preview Video YouTube Karya (Bisa di-play langsung) */}
        <YouTubePreview
          submission={submission}
          title={`Video Karya ${submission.project_name}`}
          showFallback={false}
          className="rounded-lg mb-3 border border-neutral-200 dark:border-neutral-800"
        />

        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-lg font-bold text-black dark:text-white pr-2 min-w-0 break-words line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {submission.project_name}
          </h3>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${getStatusClass(
              submission.status,
            )}`}
          >
            {submission.status}
          </span>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">Tim:</span> {submission.team_name}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2.5">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">Kategori:</span>{" "}
          {submission.category?.category_name || submission.category?.name || "-"}
        </p>

        <p className="text-xs text-neutral-500 dark:text-neutral-500 line-clamp-3">
          {submission.description}
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          Status: {submission.status}
        </span>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 dark:to-black hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors w-fit">
          <FileText className="w-4 h-4" />
          <span>Lihat Karya</span>
        </button>
      </div>
    </div>
  );
};

// Komponen utama halaman
export default function ManageSubmissionPage() {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [meta, setMeta] = useState({ page: 1, limit: 6, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const userCategoryId = profile?.category?.category_id || profile?.category_id;
  const categoryName =
    profile?.category?.category_name ||
    profile?.category?.name ||
    profile?.category?.title ||
    categories.find((c) => c.category_id === (selectedCategory || userCategoryId))
      ?.category_name ||
    (isProfileLoading ? "Memuat..." : "-");

  useEffect(() => {
    if (userCategoryId && !selectedCategory) {
      setSelectedCategory(userCategoryId);
    }
  }, [userCategoryId]);

  // Fungsi untuk mengambil data kategori dari API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories?limit=50&page=1");
        if (res.data?.status) {
          setCategories(res.data.data.categories || []);
        }
      } catch (err) {
        console.error("Gagal mengambil data kategori:", err?.message);
      }
    };
    fetchCategories();
  }, []);

  // Fungsi untuk mengambil data submission dari API berdasarkan category_id
  useEffect(() => {
    if (isProfileLoading) return;

    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const targetCategory = selectedCategory || userCategoryId;
        const params = {
          limit: meta.limit,
          page: meta.page,
        };
        if (targetCategory) {
          params.category_id = targetCategory;
        }

        const res = await api.get("/submissions", { params });
        const result = res.data;

        if (result?.status) {
          setSubmissions(result.data.submissions || []);
          setFilteredSubmissions(result.data.submissions || []);
          setMeta(result.data.meta || { page: 1, limit: 6, totalPages: 1 });
        } else {
          throw new Error(result?.message || "Gagal memuat data");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [meta.page, isProfileLoading, userCategoryId, selectedCategory]);

  const handleNextPage = () => {
    if (meta.page < meta.totalPages) {
      setMeta((prevMeta) => ({ ...prevMeta, page: prevMeta.page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (meta.page > 1) {
      setMeta((prevMeta) => ({ ...prevMeta, page: prevMeta.page - 1 }));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
          Kelola Pengumpulan
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
          Lihat dan periksa semua karya yang telah dikumpulkan oleh peserta.
        </p>
      </div>

      {/* ===== KATEGORI JURI ===== */}
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Kategori
        </label>
        <div className="block w-full px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-sm sm:text-sm font-semibold text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
          {categoryName}
        </div>
      </div>
      {/* ========================= */}

      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <p className="ml-3 text-neutral-500 dark:text-neutral-400">
            Memuat data...
          </p>
        </div>
      )}

      {error && !loading && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
          role="alert"
        >
          <p className="font-bold">Terjadi Kesalahan</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filteredSubmissions.length > 0 && (
        <>
          {/* Grid responsif untuk kartu submission */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubmissions.map((submission) => (
              <SubmissionCard
                key={submission.submission_id}
                submission={submission}
              />
            ))}
          </div>

          {/* Kontrol Paginasi */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handlePrevPage}
              disabled={meta.page <= 1}
              className="flex items-center justify-center px-4 h-10 text-base font-medium text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Sebelumnya
            </button>
            <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
              Halaman{" "}
              <span className="font-semibold text-black dark:text-white">
                {meta.page}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-black dark:text-white">
                {meta.totalPages}
              </span>
            </span>
            <button
              onClick={handleNextPage}
              disabled={meta.page >= meta.totalPages}
              className="flex items-center justify-center px-4 h-10 text-base font-medium text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
            >
              Berikutnya
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </>
      )}

      {!loading && !error && filteredSubmissions.length === 0 && (
        <div className="text-center py-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Belum Ada Submission
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Saat ini belum ada karya yang dikumpulkan.
          </p>
        </div>
      )}
    </div>
  );
}
