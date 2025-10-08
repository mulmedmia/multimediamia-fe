import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarIcon,
  RocketIcon,
  ClockIcon,
  FileTextIcon,
  PersonIcon,
  StarIcon,
  CheckIcon,
  LightningBoltIcon,
  GearIcon,
  EyeOpenIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";

const TimelineSection = () => {
  const timelineEvents = [
    {
      date: "26 Sep - 07 Okt 2025",
      title: "Registrasi Batch 1",
      description:
        "Pendaftaran dibuka untuk semua kategori lomba dengan biaya paling murah (Rp45.000 per tim).",
      status: "completed",
      icon: RocketIcon,
    },
    {
      date: "08 Okt - 17 Okt 2025",
      title: "Registrasi Batch 2",
      description:
        "Pendaftaran dibuka untuk semua kategori lomba dengan biaya lebih tinggi dari batch 1 (Rp75.000 per tim).",
      status: "active",
      icon: ClockIcon,
    },
    {
      date: "18 Oktober 2025",
      title: "Grand Opening & Technical Meeting",
      description:
        "Pembukaan acara resmi dan sosialisasi permasalahan lomba kepada semua peserta.",
      status: "upcoming",
      icon: StarIcon,
    },
    {
      date: "19 Oktober 2025",
      title: "Learn It (Best Practice UI/UX & Web Dev)",
      description:
        "Sesi bimbingan mentoring kedua yang dibimbing oleh para ahli di bidang UI/UX dan Web Development.",
      status: "upcoming",
      icon: LightningBoltIcon,
    },
    {
      date: "20 Okt - 02 Nov 2025",
      title: "Build It",
      description:
        "Peserta mengerjakan dan melampirkan hasil karya sesuai tema dari sesi mentoring.",
      status: "upcoming",
      icon: GearIcon,
    },
    {
      date: "03 November 2025",
      title: "Submit Karya Sementara",
      description:
        "Peserta wajib mengirimkan hasil karya sementara untuk mendapatkan feedback dari mentor.",
      status: "upcoming",
      icon: FileTextIcon,
    },
    {
      date: "04 November 2025",
      title: "Learn It (Best Practice Public Speaking)",
      description:
        "Sesi mentoring pertama yang dibimbing oleh para ahli di bidang Public Speaking.",
      status: "upcoming",
      icon: LightningBoltIcon,
    },
    {
      date: "04 Nov - 06 Nov 2025",
      title: "Review It",
      description:
        "Mentor memberikan feedback kepada hasil karya sementara peserta secara asynchronous.",
      status: "upcoming",
      icon: EyeOpenIcon,
    },
    {
      date: "07 November 2025",
      title: "Share Evaluation Report",
      description: "Laporan feedback dibagikan kepada semua peserta.",
      status: "upcoming",
      icon: FileTextIcon,
    },
    {
      date: "08 November 2025",
      title: "Consultation Session",
      description:
        "Sesi konsultasi 1-on-1 bersama mentor secara synchronous yang didapatkan dari tiket konsultasi.",
      status: "upcoming",
      icon: ChatBubbleIcon,
    },
    {
      date: "09 Nov - 15 Nov 2025",
      title: "Fix It",
      description:
        "Peserta memperbaiki hasil karya berdasarkan feedback dari mentor.",
      status: "upcoming",
      icon: GearIcon,
    },
    {
      date: "16 November 2025",
      title: "Submit Karya Akhir",
      description:
        "Peserta mengumpulkan hasil karya akhir untuk dinilai oleh para juri & stakeholder.",
      status: "upcoming",
      icon: CheckIcon,
    },
    {
      date: "17 Nov - 21 Nov 2025",
      title: "Show It",
      description: "Proses seleksi transparan untuk memilih tim terbaik.",
      status: "upcoming",
      icon: EyeOpenIcon,
    },
    {
      date: "22 Nov 2025",
      title: "Pengumuman 10 Finalis",
      description:
        "Pengumuman resmi 10 tim yang berhasil lolos ke tahap selanjutnya.",
      status: "upcoming",
      icon: StarIcon,
    },
    {
      date: "23 Nov - 27 Nov 2025",
      title: "2nd Fix It",
      description:
        "Para finalis diberi kesempatan terakhir untuk memperbaiki karya berdasarkan komentar juri.",
      status: "upcoming",
      icon: GearIcon,
    },
    {
      date: "28 November 2025",
      title: "Acara Puncak",
      description:
        "Seminar seputar teknologi dan seleksi akhir untuk menentukan 3 tim terbaik.",
      status: "upcoming",
      icon: StarIcon,
    },
  ];

  return (
    <section id="timeline" className="py-16 bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 border-red-200 text-red-600 dark:border-red-800 dark:text-red-400"
          >
            <CalendarIcon className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
            Timeline
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-3">
            Timeline Proyek MIA 2025
          </h2>
          <p className="text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
            Catat tanggal-tanggal penting ini agar kamu tidak ketinggalan!
          </p>
        </div>

        {/* Horizontal Scrollable Timeline */}
        <div className="relative hidden md:block">
          {/* Scroll Container */}
          <div className="overflow-x-auto pb-4">
            <div className="relative min-w-max">
              {/* Timeline Line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-red-200 via-red-300 to-red-200 dark:from-red-700 dark:via-red-900 dark:to-red-700"></div>

              {/* Timeline Items */}
              <div className="flex gap-6 px-6">
                {timelineEvents.map((event, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center min-w-[280px] max-w-[320px]"
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-md mb-4",
                        event.status === "completed"
                          ? "bg-gradient-to-br from-green-500 to-green-600"
                          : event.status === "active"
                          ? "bg-gradient-to-br from-red-500 to-red-700 animate-pulse"
                          : "bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-800"
                      )}
                    >
                      <event.icon className="h-5 w-5 text-white" />
                    </div>

                    {/* Card */}
                    <Card className="shadow-md hover:shadow-lg transition-all duration-300 bg-card dark:bg-gray-900/50 border dark:border-gray-800 h-full flex flex-col w-full">
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="text-xs text-red-600 dark:text-red-400 font-semibold mb-2">
                          {event.date}
                        </div>
                        <h3 className="text-sm font-bold text-foreground dark:text-white mb-2 min-h-[2.5rem] leading-tight">
                          {event.title}
                        </h3>
                        <p className="text-xs text-muted-foreground dark:text-gray-400 mb-3 flex-grow leading-relaxed">
                          {event.description}
                        </p>
                        <Badge
                          variant={
                            event.status === "completed"
                              ? "default"
                              : event.status === "active"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs self-center"
                        >
                          {event.status === "completed"
                            ? "Selesai"
                            : event.status === "active"
                            ? "Berlangsung"
                            : "Akan Datang"}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-300"></div>
                <div className="w-2 h-2 rounded-full bg-red-200"></div>
                <div className="w-2 h-2 rounded-full bg-red-100"></div>
              </div>
              <span>Scroll untuk melihat timeline lengkap</span>
            </div>
          </div>
        </div>

        {/* Mobile Timeline - Vertical (for better mobile experience) */}
        <div className="block md:hidden mt-8">
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-200 via-red-300 to-red-200 dark:from-red-700 dark:via-red-900 dark:to-red-700"></div>

            {/* Timeline Items */}
            <div className="space-y-6">
              {timelineEvents.map((event, i) => (
                <div key={i} className="flex items-start">
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-md mr-4",
                      event.status === "completed"
                        ? "bg-gradient-to-br from-green-500 to-green-600"
                        : event.status === "active"
                        ? "bg-gradient-to-br from-red-500 to-red-700 animate-pulse"
                        : "bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-800"
                    )}
                  >
                    <event.icon className="h-4 w-4 text-white" />
                  </div>

                  {/* Card */}
                  <div className="flex-1">
                    <Card className="shadow-md hover:shadow-lg transition-all duration-300 bg-card dark:bg-gray-900/50 border dark:border-gray-800">
                      <CardContent className="p-4">
                        <div className="text-xs text-red-600 dark:text-red-400 font-semibold mb-2">
                          {event.date}
                        </div>
                        <h3 className="text-sm font-bold text-foreground dark:text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-xs text-muted-foreground dark:text-gray-400 mb-3 leading-relaxed">
                          {event.description}
                        </p>
                        <Badge
                          variant={
                            event.status === "completed"
                              ? "default"
                              : event.status === "active"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {event.status === "completed"
                            ? "Selesai"
                            : event.status === "active"
                            ? "Berlangsung"
                            : "Akan Datang"}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
