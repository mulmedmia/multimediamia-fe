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
} from "@radix-ui/react-icons";

const TimelineSection = () => {
  const timelineEvents = [
    {
      date: "1 Juli - 20 Agustus 2025",
      title: "Pembukaan Pendaftaran",
      description: "Pendaftaran dibuka untuk semua kategori lomba.",
      status: "completed",
      icon: RocketIcon,
    },
    {
      date: "25 Agustus 2025",
      title: "Penutupan Pendaftaran",
      description: "Batas akhir pendaftaran untuk semua kategori.",
      status: "active",
      icon: ClockIcon,
    },
    {
      date: "26 Agu - 5 Sep 2025",
      title: "Babak Penyisihan (Show It)",
      description:
        "Periode pengumpulan karya dan showcase untuk penilaian awal.",
      status: "upcoming",
      icon: FileTextIcon,
    },
    {
      date: "6 - 15 Sep 2025",
      title: "Proses Penilaian Final",
      description:
        "Penilaian mendalam oleh tim juri ahli untuk menentukan finalis.",
      status: "upcoming",
      icon: PersonIcon,
    },
    {
      date: "20 September 2025",
      title: "Pengumuman Pemenang",
      description: "Acara puncak dan pengumuman pemenang secara live.",
      status: "upcoming",
      icon: StarIcon,
    },
  ];

  return (
    <section id="timeline" className="py-16 bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 border-red-200 text-red-600 dark:border-red-800 dark:text-red-400"
          >
            <CalendarIcon className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
            Timeline
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-3">
            Jadwal Penting Kompetisi
          </h2>
          <p className="text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
            Catat tanggal-tanggal penting ini agar kamu tidak ketinggalan!
          </p>
        </div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-red-200 via-red-300 to-red-200 dark:from-red-700 dark:via-red-900 dark:to-red-700"></div>
            
            {/* Timeline Items */}
            <div className="grid grid-cols-5 gap-4">
              {timelineEvents.map((event, i) => (
                <div key={i} className="flex flex-col items-center">
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
                      <h3 className="text-base font-bold text-foreground dark:text-white mb-2 min-h-[2.5rem]">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-gray-400 mb-3 flex-grow">
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

        {/* Mobile & Tablet Timeline - Vertical */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-200 via-red-300 to-red-200 dark:from-red-700 dark:via-red-900 dark:to-red-700"></div>
            
            {/* Timeline Items */}
            <div className="space-y-8">
              {timelineEvents.map((event, i) => (
                <div key={i} className="flex items-start">
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-md mr-6",
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
                  <div className="flex-1">
                    <Card className="shadow-md hover:shadow-lg transition-all duration-300 bg-card dark:bg-gray-900/50 border dark:border-gray-800">
                      <CardContent className="p-4">
                        <div className="text-xs text-red-600 dark:text-red-400 font-semibold mb-2">
                          {event.date}
                        </div>
                        <h3 className="text-lg font-bold text-foreground dark:text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground dark:text-gray-400 mb-3">
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