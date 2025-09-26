"use client";

import React, { useState, useEffect } from "react";
import { useCategoryById } from "@/hooks/user-use-category";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Calendar,
  User,
  ArrowLeft,
  Download,
  Trophy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";

function CategoryDetailSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-gray-100 dark:border-gray-900 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="border border-gray-100 dark:border-gray-900 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Skeleton className="h-64 w-full" />
          </Card>
          <Card className="border border-gray-100 dark:border-gray-900 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      const difference = new Date(targetDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600 dark:text-red-400 font-semibold">
          Pendaftaran Telah Ditutup
        </p>
      </div>
    );
  }

  return (
    <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-white dark:from-primary/20 dark:to-gray-900 rounded-lg border border-primary/20">
      <h3 className="font-semibold mb-3 text-primary">
        Sisa Waktu Pendaftaran
      </h3>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-bold text-primary">{timeLeft.days}</div>
          <div className="text-xs text-muted-foreground">Hari</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-bold text-primary">{timeLeft.hours}</div>
          <div className="text-xs text-muted-foreground">Jam</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-bold text-primary">
            {timeLeft.minutes}
          </div>
          <div className="text-xs text-muted-foreground">Menit</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-bold text-primary">
            {timeLeft.seconds}
          </div>
          <div className="text-xs text-muted-foreground">Detik</div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryDetailPage(props) {
  const router = useRouter();
  const params =
    typeof props.params?.then === "function"
      ? React.use(props.params)
      : props.params;
  const categoryId = params?.categoryId;

  const {
    data: category,
    isLoading,
    isError,
    error,
  } = useCategoryById(categoryId);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy 'pukul' HH:mm", {
        locale: id,
      });
    } catch {
      return "Tanggal tidak valid";
    }
  };

  const isDeadlinePassed = (deadlineString) => {
    return new Date(deadlineString) < new Date();
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "VERIFIED":
        return {
          icon: CheckCircle,
          variant: "success",
          text: "Terverifikasi",
          color: "text-green-600",
        };
      case "NOT_VERIFIED":
        return {
          icon: AlertCircle,
          variant: "secondary",
          text: "Belum Terverifikasi",
          color: "text-yellow-600",
        };
      default:
        return {
          icon: XCircle,
          variant: "destructive",
          text: "Status Tidak Diketahui",
          color: "text-red-600",
        };
    }
  };

  if (isLoading) return <CategoryDetailSkeleton />;

  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertTitle>Gagal Memuat Detail Kategori</AlertTitle>
          <AlertDescription>
            {error?.message ||
              "Terjadi kesalahan saat memuat detail kategori. Silakan coba lagi."}
          </AlertDescription>
        </Alert>
        <div className="text-center mt-6">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertTitle>Kategori Tidak Ditemukan</AlertTitle>
          <AlertDescription>
            Kategori yang Anda cari tidak ditemukan atau mungkin telah dihapus.
          </AlertDescription>
        </Alert>
        <div className="text-center mt-6">
          <Link href="/category">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Kategori
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(category.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="transition hover:-translate-x-1 cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4 " />
          Kembali
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-gray-100 dark:border-gray-900 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2 text-red-700 dark:text-red-400 font-extrabold tracking-tight">
                    {category.title || category.category_name}
                  </CardTitle>
                  <p className="text-muted-foreground text-base">
                    {category.category_name}
                  </p>
                </div>
                <Badge
                  variant={statusConfig.variant}
                  className="flex items-center gap-1 px-3 py-1 text-base font-semibold"
                >
                  <StatusIcon className="h-4 w-4" />
                  {statusConfig.text}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-lg">Deskripsi</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                    {category.description ||
                      "Tidak ada deskripsi tersedia untuk kategori ini."}
                  </p>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-100 dark:border-gray-900">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Diselenggarakan oleh
                    </p>
                    <p className="font-semibold">
                      {category.organizer || "Penyelenggara tidak diketahui"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-100 dark:border-gray-900">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Jenis Tim</p>
                    <p className="font-semibold">
                      {category.team_type === "GROUP" ? "Tim" : "Individu"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-100 dark:border-gray-900 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <Calendar className="h-5 w-5" />
                Jadwal Lomba
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-100 dark:border-gray-900">
                    <div className="text-sm text-muted-foreground mb-1">
                      Pendaftaran Mulai
                    </div>
                    <div className="font-semibold">
                      {formatDate(category.startDate)}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-900 border-yellow-200 dark:border-yellow-800">
                    <div className="text-sm text-muted-foreground mb-1">
                      Deadline Pendaftaran
                    </div>
                    <div className="font-semibold text-yellow-700 dark:text-yellow-400">
                      {formatDate(category.deadline)}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-100 dark:border-gray-900">
                    <div className="text-sm text-muted-foreground mb-1">
                      Lomba Berakhir
                    </div>
                    <div className="font-semibold">
                      {formatDate(category.endDate)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="overflow-hidden border border-gray-100 dark:border-gray-900 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="relative h-64 rounded-lg flex items-center justify-center">
              <img
                src={category.image || "/placeholder-image.jpg"}
                alt={category.category_name}
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
            </div>
          </Card>
          <Card className="border border-gray-100 dark:border-gray-900 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="p-6">
              <CountdownTimer targetDate={category.deadline} />
            </CardContent>
          </Card>
          <Card className="border border-gray-100 dark:border-gray-900 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="p-6 space-y-4 gap-1 flex flex-col">
              {category.status === "VERIFIED" ? (
                <>
                  {/* Button Daftar dengan kondisi disabled */}
                  <div
                    className={
                      isDeadlinePassed(category.deadline)
                        ? "cursor-not-allowed inline-block"
                        : ""
                    }
                    style={{
                      cursor: isDeadlinePassed(category.deadline)
                        ? "not-allowed"
                        : "default",
                    }}
                  >
                    <Link
                      href={
                        isDeadlinePassed(category.deadline)
                          ? "#"
                          : `/competition-registration?category=${category.category_id}`
                      }
                      className={
                        isDeadlinePassed(category.deadline)
                          ? "pointer-events-none"
                          : ""
                      }
                    >
                      <Button
                        className={`w-full font-bold text-lg py-3 rounded-lg transition ${
                          isDeadlinePassed(category.deadline)
                            ? "opacity-50 cursor-not-allowed bg-gray-400 dark:bg-gray-600 pointer-events-none"
                            : "bg-gradient-to-r from-red-600 to-red-700 dark:from-red-400 dark:to-black text-white hover:scale-105"
                        }`}
                        disabled={isDeadlinePassed(category.deadline)}
                        style={{
                          cursor: isDeadlinePassed(category.deadline)
                            ? "not-allowed"
                            : "pointer",
                        }}
                      >
                        <Trophy className="mr-2 h-4 w-4" />
                        {isDeadlinePassed(category.deadline)
                          ? "Pendaftaran Telah Ditutup"
                          : "Daftar Sekarang"}
                      </Button>
                    </Link>
                  </div>

                  {/* Button Download Panduan - tetap aktif */}
                  <Button
                    variant="outline"
                    className="w-full font-semibold text-lg py-3 rounded-lg transition hover:scale-105"
                    size="lg"
                    asChild
                  >
                    <a
                      href={category.file_url || "https://drive.google.com/drive/folders/1x34lDmoqSFdOfsxUpxpe2KiAaGT2zk5m"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Panduan
                    </a>
                  </Button>
                </>
              ) : (
                <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-900 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-yellow-700 dark:text-yellow-400 font-semibold">
                    Kategori Belum Terverifikasi
                  </p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-1">
                    Pendaftaran akan tersedia setelah kategori diverifikasi
                    admin
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="border border-gray-100 dark:border-gray-900 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-lg">Informasi Tambahan</h3>
              <div className="space-y-3 text-sm">
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Kategori:</span>
                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {category.category_id}
                  </span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nama Kompetisi:</span>
                  <span>{category.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dibuat:</span>
                  <span>{formatDate(category.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Terakhir Diupdate:
                  </span>
                  <span>{formatDate(category.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
