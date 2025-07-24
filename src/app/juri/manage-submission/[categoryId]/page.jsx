"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Github,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";

const SubmissionCard = ({ submission }) => {
  const githubLink = submission.links?.find(
    (link) => link.link_type === "GITHUB"
  )?.url;
  const otherLink = submission.links?.[0]?.url;

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400";
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400";
      case "REVISION":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400";
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-black dark:text-white pr-2">
            {submission.project_name}
          </h3>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusClass(
              submission.status
            )}`}
          >
            {submission.status}
          </span>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
          <span className="font-semibold">Tim:</span> {submission.team_name}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          <span className="font-semibold">Kategori:</span>{" "}
          {submission.category.category_name}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-500 line-clamp-3">
          {submission.description}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {otherLink && !githubLink && (
            <a
              href={otherLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <LinkIcon className="w-5 h-5" />
            </a>
          )}
        </div>
        <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <FileText className="w-4 h-4" />
          <span>Beri Nilai</span>
        </button>
      </div>
    </div>
  );
};

export default function SubmissionByCategoryPage({ params }) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(null); // State untuk menyimpan categoryId
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 6, totalPages: 1 });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gunakan React.use() untuk mengakses params
  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setCategoryId(resolvedParams.categoryId);
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (!categoryId) return;

    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(
          `${BASE_URL}/submissions?category=${categoryId}`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data submission");
        }

        const result = await response.json();
        setSubmissions(result.data.submissions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [categoryId]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    if (categoryId) {
      // Arahkan ke halaman dinamis [categoryId]
      router.push(`/juri/manage-submission/${categoryId}`);
    } else {
      // Jika memilih "semua kategori", akan tetap di halaman ini
      router.push(`/juri/manage-submission`);
    }
  };

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
          Lihat, kelola, dan nilai semua karya yang telah dikumpulkan oleh
          peserta.
        </p>
      </div>

      {/* ===== DROPDOWN FILTER KATEGORI ===== */}
      <div className="max-w-xs">
        <label
          htmlFor="category-filter"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
        >
          Filter berdasarkan Kategori
        </label>
        <select
          id="category-filter"
          onChange={handleCategoryChange}
          className="block w-full px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
        >
          <option value="">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>
      {/* ==================================== */}

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

      {!loading && !error && submissions.length > 0 && (
        <>
          {/* Grid responsif untuk kartu submission */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission) => (
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

      {!loading && !error && submissions.length === 0 && (
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
