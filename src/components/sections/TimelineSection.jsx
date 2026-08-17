"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  CheckIcon,
  GearIcon,
  LightningBoltIcon,
  FileTextIcon,
  EyeOpenIcon,
  ChatBubbleIcon,
  StarIcon,
} from "@radix-ui/react-icons";

const TimelineSection = () => {
  const timelineEvents = [
    {
      date: "19 Oktober 2025",
      title: "Learn It (Best Practice UI/UX & Web Dev)",
      description:
        "Sesi bimbingan mentoring kedua yang dibimbing oleh para ahli di bidang UI/UX dan Web Development.",
      status: "completed",
      icon: LightningBoltIcon,
    },
    {
      date: "20 Okt - 02 Nov 2025",
      title: "Build It",
      description:
        "Peserta mengerjakan dan melampirkan hasil karya sesuai tema dari sesi mentoring.",
      status: "active",
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
    <section id="timeline" className="py-20 bg-transparent relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-block">
            <span className="mia-pill-badge">
              <CalendarIcon className="h-3.5 w-3.5 text-[#E01C20]" />
              <span>Timeline Kegiatan</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[30.56px] font-bold text-[#FFF9F5] tracking-tight">
            Timeline Proyek <span className="text-[#E01C20]">MIA 2025</span>
          </h2>

          <p className="text-base md:text-[18.89px] text-[#AAB1BD] max-w-2xl mx-auto leading-relaxed">
            Catat tanggal-tanggal penting ini agar kamu tidak ketinggalan!
          </p>
        </div>

        {/* Horizontal Scrollable Timeline for Desktop */}
        <div className="relative hidden md:block">
          <div className="overflow-x-auto pb-6 scrollbar-thin">
            <div className="relative min-w-max px-4">
              {/* Connecting Horizontal Line */}
              <div className="absolute top-6 left-12 right-12 h-0.5 bg-gradient-to-r from-[#00B445]/50 via-[#E01C20]/50 to-white/10" />

              {/* Items row */}
              <div className="flex gap-6">
                {timelineEvents.map((event, i) => {
                  const isCompleted = event.status === "completed";
                  const isActive = event.status === "active";

                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center w-[280px] flex-shrink-0"
                    >
                      {/* Node Icon */}
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-lg mb-6 border transition-transform hover:scale-110",
                          isCompleted
                            ? "bg-[#00B445] border-[#00B445] text-white shadow-green-900/40"
                            : isActive
                            ? "bg-[#E01C20] border-[#FF4500] text-white animate-pulse ring-4 ring-[#E01C20]/30 shadow-red-900/50"
                            : "bg-[#1E2939] border-white/10 text-[#AAB1BD]"
                        )}
                      >
                        <event.icon className="h-5 w-5" />
                      </div>

                      {/* Event Detail Card */}
                      <div className="mia-card p-5 w-full flex flex-col justify-between h-[210px] hover:border-white/20 transition-all">
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-[#E01C20] block">
                            {event.date}
                          </span>
                          <h3 className="text-sm font-bold text-[#FFF9F5] line-clamp-2 leading-snug">
                            {event.title}
                          </h3>
                          <p className="text-xs text-[#AAB1BD] line-clamp-3 leading-relaxed">
                            {event.description}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div className="pt-2">
                          <span
                            className={cn(
                              "text-[11px] font-semibold px-2.5 py-1 rounded-full inline-block",
                              isCompleted
                                ? "bg-[#00B445]/20 text-[#00B445] border border-[#00B445]/30"
                                : isActive
                                ? "bg-[#E01C20]/20 text-[#E01C20] border border-[#E01C20]/30"
                                : "bg-[#1E2939] text-[#99A1AF] border border-white/10"
                            )}
                          >
                            {isCompleted
                              ? "Selesai"
                              : isActive
                              ? "Berlangsung"
                              : "Akan Datang"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center items-center gap-2 mt-6 text-xs text-[#AAB1BD]">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E01C20]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF4500]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#FED700]" />
            </div>
            <span>Scroll horizontal untuk melihat timeline lengkap</span>
          </div>
        </div>

        {/* Vertical Timeline for Mobile */}
        <div className="block md:hidden mt-8 relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00B445]/50 via-[#E01C20]/50 to-white/10" />

          <div className="space-y-6">
            {timelineEvents.map((event, i) => {
              const isCompleted = event.status === "completed";
              const isActive = event.status === "active";

              return (
                <div key={i} className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-md flex-shrink-0 border",
                      isCompleted
                        ? "bg-[#00B445] border-[#00B445] text-white"
                        : isActive
                        ? "bg-[#E01C20] border-[#FF4500] text-white animate-pulse"
                        : "bg-[#1E2939] border-white/10 text-[#AAB1BD]"
                    )}
                  >
                    <event.icon className="h-4 w-4" />
                  </div>

                  <div className="mia-card p-4 flex-1 space-y-2">
                    <span className="text-xs font-semibold text-[#E01C20]">
                      {event.date}
                    </span>
                    <h3 className="text-sm font-bold text-[#FFF9F5]">
                      {event.title}
                    </h3>
                    <p className="text-xs text-[#AAB1BD] leading-relaxed">
                      {event.description}
                    </p>
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-2",
                        isCompleted
                          ? "bg-[#00B445]/20 text-[#00B445]"
                          : isActive
                          ? "bg-[#E01C20]/20 text-[#E01C20]"
                          : "bg-[#1E2939] text-[#99A1AF]"
                      )}
                    >
                      {isCompleted
                        ? "Selesai"
                        : isActive
                        ? "Berlangsung"
                        : "Akan Datang"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;

