"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Github,
  Youtube,
  Link as LinkIcon,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubmissionDetailPage({ params }) {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState(null); // State untuk menyimpan categoryId
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setCategoryId(resolvedParams.categoryId);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!categoryId) return;

    const fetchSubmissionById = async () => {
      setLoading(true);
      setError(null);
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${BASE_URL}/submissions/${categoryId}`);

        if (!response.ok) {
          throw new Error("Gagal mengambil data submission");
        }

        const result = await response.json();
        setSubmission(result.data || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionById();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <p className="ml-3 text-neutral-500 dark:text-neutral-400">
          Memuat data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
        role="alert"
      >
        <p className="font-bold">Terjadi Kesalahan</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Submission Tidak Ditemukan
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Tidak ada data pengumpulan untuk ID ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => router.push("/juri/manage-submission")}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 dark:to-black hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Detail Submission
        </h1>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 shadow-sm">
        <h3 className="text-lg font-bold text-black dark:text-white">
          {submission.project_name}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <span className="font-semibold">Tim:</span> {submission.team_name}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <span className="font-semibold">Kategori:</span>{" "}
          {submission.category.category_name}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <span className="font-semibold">Deskripsi:</span>{" "}
          {submission.description}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <span className="font-semibold">Flow Aplikasi:</span>{" "}
          {submission.flow_application}
        </p>
        <div className="mt-4 flex space-x-4">
          {submission.links.map((link) => {
            let Icon;
            switch (link.link_type) {
              case "GITHUB":
                Icon = Github;
                break;
              case "YOUTUBE":
                Icon = Youtube;
                break;
              default:
                Icon = LinkIcon;
            }
            return (
              <a
                key={link.link_id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-500 hover:underline"
              >
                <Icon className="w-5 h-5" />
                <span>{link.link_type}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
