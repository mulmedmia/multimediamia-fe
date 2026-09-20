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

const getStatus = (startStr, endStr) => {
  const now = new Date();
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (now > end) return "completed";
  if (now >= start && now <= end) return "active";
  return "upcoming";
};

const TimelineSection = () => {
  const timelineEvents = [
    {
      date: "24 Sep - 05 Okt 2026",
      title: "Pendaftaran Batch 1",
      description: "Gelombang pendaftaran pertama resmi dibuka.",
      status: getStatus("2026-09-24T00:00:00+07:00", "2026-10-05T23:59:59+07:00"),
      icon: CalendarIcon,
    },
    {
      date: "06 - 16 Okt 2026",
      title: "Pendaftaran Batch 2",
      description:
        "Kesempatan terakhir untuk mendaftarkan tim sebelum kompetisi dimulai.",
      status: getStatus("2026-10-06T00:00:00+07:00", "2026-10-16T23:59:59+07:00"),
      icon: CalendarIcon,
    },
    {
      date: "17 Oktober 2026",
      title: "Grand Opening & Technical Meeting",
      description:
        "Pembukaan resmi acara sekaligus penjelasan teknis lomba kepada seluruh peserta.",
      status: getStatus("2026-10-17T00:00:00+07:00", "2026-10-17T23:59:59+07:00"),
      icon: StarIcon,
    },
    {
      date: "18 Oktober 2026",
      title: "Learn It (Sesi Mentoring Awal)",
      description:
        "Sesi pembekalan materi dan best practice dari praktisi industri sebelum peserta mulai mengerjakan proyek.",
      status: getStatus("2026-10-18T00:00:00+07:00", "2026-10-18T23:59:59+07:00"),
      icon: LightningBoltIcon,
    },
    {
      date: "19 Okt - 01 Nov 2026",
      title: "Build It",
      description:
        "Peserta mengembangkan proyek dan solusi digital secara tim berdasarkan tantangan dari industry partner.",
      status: getStatus("2026-10-19T00:00:00+07:00", "2026-11-01T23:59:59+07:00"),
      icon: GearIcon,
    },
    {
      date: "02 November 2026",
      title: "Submit Karya Sementara",
      description:
        "Batas akhir bagi peserta untuk mengumpulkan hasil karya sementara.",
      status: getStatus("2026-11-02T00:00:00+07:00", "2026-11-02T23:59:59+07:00"),
      icon: FileTextIcon,
    },
    {
      date: "03 - 06 Nov 2026",
      title: "Review It",
      description:
        "Mentor profesional memberikan evaluasi dan feedback terhadap hasil karya sementara peserta.",
      status: getStatus("2026-11-03T00:00:00+07:00", "2026-11-06T23:59:59+07:00"),
      icon: EyeOpenIcon,
    },
    {
      date: "07 November 2026",
      title: "Share Evaluation Report",
      description:
        "Pengumuman laporan evaluasi dan masukan dibagikan kepada seluruh peserta.",
      status: getStatus("2026-11-07T00:00:00+07:00", "2026-11-07T23:59:59+07:00"),
      icon: FileTextIcon,
    },
    {
      date: "08 November 2026",
      title: "Consultation Session",
      description: "Sesi konsultasi terbatas bersama mentor.",
      status: getStatus("2026-11-08T00:00:00+07:00", "2026-11-08T23:59:59+07:00"),
      icon: ChatBubbleIcon,
    },
    {
      date: "08 - 10 Nov 2026",
      title: "Fix It",
      description:
        "Peserta melakukan revisi dan penyempurnaan karya final berdasarkan feedback yang telah diberikan.",
      status: getStatus("2026-11-08T00:00:00+07:00", "2026-11-10T23:59:59+07:00"),
      icon: GearIcon,
    },
    {
      date: "11 November 2026",
      title: "Submit Karya Final",
      description:
        "Batas akhir pengumpulan hasil karya final berupa Video Pitching, desain, atau repository code.",
      status: getStatus("2026-11-11T00:00:00+07:00", "2026-11-11T23:59:59+07:00"),
      icon: CheckIcon,
    },
    {
      date: "12 - 20 Nov 2026",
      title: "Show It (Proses Penjurian)",
      description:
        "Proses seleksi dan penjurian untuk menentukan 10 finalis terbaik dari masing-masing cabang lomba.",
      status: getStatus("2026-11-12T00:00:00+07:00", "2026-11-20T23:59:59+07:00"),
      icon: EyeOpenIcon,
    },
    {
      date: "21 November 2026",
      title: "Pengumuman 10 Finalis",
      description:
        "Pengumuman resmi tim yang berhasil lolos ke tahap Grand Finale.",
      status: getStatus("2026-11-21T00:00:00+07:00", "2026-11-21T23:59:59+07:00"),
      icon: StarIcon,
    },
    {
      date: "28 November 2026",
      title: "Acara Puncak (Show It)",
      description:
        "Onsite Pitching Day, Talkshow, Booth Sponsor, dan penyerahan hadiah yang diselenggarakan di Auditorium UPNVJ.",
      status: getStatus("2026-11-28T00:00:00+07:00", "2026-11-28T23:59:59+07:00"),
      icon: StarIcon,
    },
  ];

  return (
    <section id="timeline" className="py-20 bg-transparent relative scroll-mt-16 sm:scroll-mt-20">
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
            Timeline Proyek <span className="text-[#E01C20]">MIA 2026</span>
          </h2>

          <p className="text-base md:text-[18.89px] text-[#AAB1BD] max-w-2xl mx-auto leading-relaxed">
            Catat tanggal-tanggal penting ini agar kamu tidak ketinggalan!
          </p>
        </div>

        {/* Horizontal Scrollable Timeline for Desktop */}
        <div className="relative hidden md:block">
          <div className="overflow-x-auto pb-6 scrollbar-thin py-2">
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
                              : "bg-[#1E2939] border-white/10 text-[#AAB1BD]",
                        )}
                      >
                        <event.icon className="h-5 w-5" />
                      </div>

                      {/* Event Detail Card */}
                      <div className="mia-card p-5 w-full flex flex-col justify-between h-[230px] hover:border-white/20 transition-all">
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-[#E01C20] block">
                            {event.date}
                          </span>
                          <h3 className="text-sm font-bold text-[#FFF9F5] line-clamp-2 leading-snug">
                            {event.title}
                          </h3>
                          <p className="text-xs text-[#AAB1BD] line-clamp-4 leading-relaxed">
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
                                  : "bg-[#1E2939] text-[#99A1AF] border border-white/10",
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
                          : "bg-[#1E2939] border-white/10 text-[#AAB1BD]",
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
                            : "bg-[#1E2939] text-[#99A1AF]",
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
