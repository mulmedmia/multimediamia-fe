"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  CalendarIcon,
  Cross1Icon,
  HamburgerMenuIcon,
  PersonIcon,
  StarIcon,
  FileTextIcon,
  Pencil2Icon,
  DesktopIcon,
  MixerHorizontalIcon,
  DownloadIcon,
  CheckCircledIcon,
  ArrowRightIcon,
  LightningBoltIcon,
  RocketIcon,
  ChatBubbleIcon,
  EnvelopeClosedIcon,
  InstagramLogoIcon,
  TwitterLogoIcon,
  LinkedInLogoIcon,
  ClockIcon,
  GroupIcon,
} from "@radix-ui/react-icons";

interface CompetitionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  prize: string;
  requirements: string[];
  color: string;
  deadline: string;
  participants: string;
  difficulty: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#beranda", label: "Beranda" },
    { href: "#lomba", label: "Kategori Lomba" },
    { href: "#timeline", label: "Timeline" },
    { href: "#hadiah", label: "Hadiah" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <LightningBoltIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Multimedia in Action
              </span>
              <div className="text-xs text-gray-500 font-medium">Digital Competition 2025</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-red-600 transition-colors font-medium relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button className="hidden md:flex px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300">
              <RocketIcon className="h-4 w-4 mr-2" />
              <span>Daftar Sekarang</span>
            </Button>

            <Button
              variant="ghost"
              className="md:hidden text-gray-900 hover:bg-red-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <Cross1Icon className="h-6 w-6" />
              ) : (
                <HamburgerMenuIcon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-red-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg">
                <RocketIcon className="h-4 w-4 mr-2" />
                Daftar Sekarang
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

const HeroSection = () => {
  const [currentStat, setCurrentStat] = useState(0);
  const stats = [
    { icon: CalendarIcon, value: "25 Agustus", label: "Deadline Pendaftaran", color: "text-red-600" },
    { icon: PersonIcon, value: "1000+", label: "Peserta Terdaftar", color: "text-blue-600" },
    { icon: StarIcon, value: "24 Juta", label: "Total Hadiah", color: "text-green-600" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <section
      id="beranda"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-indigo-50 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 mt-20 mb-10 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-gradient-to-r from-red-600 to-red-700 text-white border-0 px-4 py-2 text-sm font-medium shadow-lg">
            <StarIcon className="h-4 w-4 mr-2" />
            Kompetisi Digital Indonesia 2025
          </Badge>

          <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span>
              <span className="inline">Multimedia </span>
              <span className="inline bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                in Action
              </span>
            </span>

            <span className="block text-3xl md:text-4xl mt-2 text-gray-600">
              Kompetisi Digital Creative
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Tunjukkan kreativitas dan inovasi Anda dalam 4 kategori lomba:
            <span className="font-semibold text-red-600"> Website Development, UI/UX Design, Digital Poster, dan Essay Writing</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-3 text-lg">
              <RocketIcon className="h-5 w-5 mr-2" />
              Daftar Lomba
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 text-lg">
              <DownloadIcon className="h-5 w-5 mr-2" />
              Download Panduan
            </Button>
          </div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className={cn(
                "transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer",
                currentStat === index ? "ring-2 ring-red-500 ring-opacity-50 animate-pulse bg-gradient-to-br from-red-50 to-white" : "hover:bg-gradient-to-br hover:from-gray-50 hover:to-white"
              )}>
                <CardContent className="p-6 text-center relative overflow-hidden">
                  {currentStat === index && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-100 via-transparent to-red-100 animate-pulse opacity-30"></div>
                  )}
                  <div className={cn(
                    "relative z-10 transition-all duration-300",
                    currentStat === index ? "transform scale-110" : ""
                  )}>
                    <stat.icon className={cn("h-8 w-8 mb-3 mx-auto transition-all duration-300", stat.color, currentStat === index ? "animate-bounce" : "")} />
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CompetitionCard = ({ icon, title, description, prize, requirements, color, deadline, participants, difficulty }: CompetitionCardProps) => {
  return (
    <Card className="relative flex flex-col overflow-hidden rounded-xl bg-white p-5 shadow-lg border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full opacity-20 -mr-12 -mt-12"></div>
      
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${color} text-white shadow-lg`}>
        {icon}
      </div>

      <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">{description}</p>

      <div className="space-y-2 mb-4 w-full">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Hadiah Utama</span>
          <span className="text-sm font-bold text-green-600">{prize}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Deadline</span>
          <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 text-xs px-2 py-1">
            <ClockIcon className="h-2 w-2 mr-1" />
            {deadline}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Peserta</span>
          <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs px-2 py-1">
            <GroupIcon className="h-2 w-2 mr-1" />
            {participants}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Tingkat</span>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs px-2 py-1">
            {difficulty}
          </Badge>
        </div>
      </div>

      <div className="mb-4 flex-1">
        <h4 className="text-xs font-semibold text-gray-900 mb-2">Persyaratan:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          {requirements.slice(0, 3).map((req, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircledIcon className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{req}</span>
            </li>
          ))}
          {requirements.length > 3 && (
            <li className="text-xs text-gray-400 italic">+{requirements.length - 3} persyaratan lainnya</li>
          )}
        </ul>
      </div>

      <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300 text-sm py-2">
        <span>Daftar Sekarang</span>
        <ArrowRightIcon className="h-3 w-3 ml-2" />
      </Button>
    </Card>
  );
};

const CompetitionSection = () => {
  const competitions = [
    {
      icon: <DesktopIcon className="h-6 w-6" />,
      title: "Website Development",
      description: "Buat website responsif dan inovatif dengan teknologi terkini seperti React, Next.js, atau Vue.js.",
      prize: "Rp 8.000.000",
      deadline: "20 Agustus 2025",
      participants: "Tim 1-3",
      difficulty: "Advanced",
      requirements: ["Mahasiswa/Pelajar aktif", "Tim maksimal 3 orang", "Menggunakan framework modern", "Responsive design wajib"],
      color: "bg-gradient-to-br from-red-600 to-red-700",
    },
    {
      icon: <MixerHorizontalIcon className="h-6 w-6" />,
      title: "UI/UX Design",
      description: "Ciptakan pengalaman pengguna yang luar biasa dengan desain intuitif dan user-friendly.",
      prize: "Rp 6.000.000",
      deadline: "18 Agustus 2025",
      participants: "Tim 1-2",
      difficulty: "Intermediate",
      requirements: ["Portofolio desain", "Individu atau tim (max 2)", "Prototype interaktif", "Design system lengkap"],
      color: "bg-gradient-to-br from-purple-600 to-purple-700",
    },
    {
      icon: <FileTextIcon className="h-6 w-6" />,
      title: "Digital Poster",
      description: "Buat poster digital yang menarik dengan pesan yang kuat dan visual yang memukau.",
      prize: "Rp 5.000.000",
      deadline: "15 Agustus 2025",
      participants: "Individual",
      difficulty: "Beginner",
      requirements: ["Resolusi 300 DPI", "Tema: Teknologi Masa Depan", "Karya original", "Format PDF dan PNG"],
      color: "bg-gradient-to-br from-pink-600 to-pink-700",
    },
    {
      icon: <Pencil2Icon className="h-6 w-6" />,
      title: "Essay Writing",
      description: "Tulis esai inspiratif tentang dampak teknologi digital dalam kehidupan sehari-hari.",
      prize: "Rp 5.000.000",
      deadline: "25 Agustus 2025",
      participants: "Individual",
      difficulty: "Intermediate",
      requirements: ["1000-1500 kata", "Referensi akademik", "Plagiarisme maks 10%", "Bahasa Indonesia/Inggris"],
      color: "bg-gradient-to-br from-green-600 to-green-700",
    },
  ];

  return (
    <section id="lomba" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 border-red-200 text-red-600">
            <StarIcon className="h-4 w-4 text-red-600 mr-2" />
            Kategori Lomba
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Pilih Kategori Lomba Anda
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Empat kategori lomba yang menantang kreativitas dan kemampuan teknis Anda. Setiap kategori dirancang untuk mengembangkan skill yang berbeda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {competitions.map((competition, i) => (
            <CompetitionCard key={i} {...competition} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TimelineSection = () => {
  const timelineEvents = [
    { 
      date: "1 Agustus 2025", 
      title: "Pembukaan Pendaftaran", 
      description: "Pendaftaran dibuka untuk semua kategori lomba.", 
      status: "completed",
      icon: RocketIcon
    },
    { 
      date: "25 Agustus 2025", 
      title: "Penutupan Pendaftaran", 
      description: "Batas akhir pendaftaran untuk semua kategori.", 
      status: "active",
      icon: ClockIcon
    },
    { 
      date: "26 Agu - 5 Sep 2025", 
      title: "Pengumpulan Karya", 
      description: "Periode pengumpulan karya dan dokumentasi.", 
      status: "upcoming",
      icon: FileTextIcon
    },
    { 
      date: "6 - 15 Sep 2025", 
      title: "Proses Penilaian", 
      description: "Penilaian oleh tim juri ahli industri.", 
      status: "upcoming",
      icon: StarIcon
    },
    { 
      date: "20 September 2025", 
      title: "Pengumuman Pemenang", 
      description: "Pengumuman pemenang dan ceremony puncak.", 
      status: "upcoming",
      icon: StarIcon
    },
  ];

  return (
    <section id="timeline" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-red-200 text-red-600">
            <CalendarIcon className="h-4 w-4 text-red-600 mr-2" />
            Timeline
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Jadwal Lomba</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Catat tanggal-tanggal penting dalam perjalanan kompetisi Anda.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative space-y-6">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-red-200 via-red-300 to-red-200"></div>
            {timelineEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-md",
                  event.status === "completed" ? "bg-gradient-to-br from-green-500 to-green-600" : 
                  event.status === "active" ? "bg-gradient-to-br from-red-500 to-red-600 animate-pulse" : 
                  "bg-gradient-to-br from-gray-300 to-gray-400"
                )}>
                  <event.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <Card className="shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="text-xs text-red-600 font-semibold mb-1">{event.date}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      <Badge variant={event.status === "completed" ? "default" : event.status === "active" ? "destructive" : "secondary"} className="text-xs">
                        {event.status === "completed" ? "Selesai" : event.status === "active" ? "Berlangsung" : "Akan Datang"}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const PrizeSection = () => {
  const prizes = [
    { 
      category: "Website Development", 
      total: "Rp 15.000.000",
      awards: [
        { place: "Juara 1", amount: "Rp 8.000.000", icon: "🥇" }, 
        { place: "Juara 2", amount: "Rp 4.000.000", icon: "🥈" }, 
        { place: "Juara 3", amount: "Rp 3.000.000", icon: "🥉" }
      ] 
    },
    { 
      category: "UI/UX Design", 
      total: "Rp 12.000.000",
      awards: [
        { place: "Juara 1", amount: "Rp 6.000.000", icon: "🥇" }, 
        { place: "Juara 2", amount: "Rp 3.500.000", icon: "🥈" }, 
        { place: "Juara 3", amount: "Rp 2.500.000", icon: "🥉" }
      ] 
    },
    { 
      category: "Digital Poster", 
      total: "Rp 10.000.000",
      awards: [
        { place: "Juara 1", amount: "Rp 5.000.000", icon: "🥇" }, 
        { place: "Juara 2", amount: "Rp 3.000.000", icon: "🥈" }, 
        { place: "Juara 3", amount: "Rp 2.000.000", icon: "🥉" }
      ] 
    },
    { 
      category: "Essay Writing", 
      total: "Rp 10.000.000",
      awards: [
        { place: "Juara 1", amount: "Rp 5.000.000", icon: "🥇" }, 
        { place: "Juara 2", amount: "Rp 3.000.000", icon: "🥈" }, 
        { place: "Juara 3", amount: "Rp 2.000.000", icon: "🥉" }
      ] 
    },
  ];

  return (
    <section id="hadiah" className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 mb-4 px-4 py-2 shadow-lg">
            <StarIcon className="h-4 w-4 mr-2" />
            Total Hadiah 47 Juta Rupiah
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Hadiah Menarik Menanti</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Raih kesempatan memenangkan hadiah puluhan juta rupiah dan pengakuan nasional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {prizes.map((prize, i) => (
            <Card key={i} className="bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg font-bold text-gray-900">{prize.category}</CardTitle>
                <div className="text-xl font-bold text-green-600">{prize.total}</div>
              </CardHeader>
              <CardContent className="space-y-3">
                {prize.awards.map((award, j) => (
                  <div key={j} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{award.icon}</span>
                      <span className="text-sm text-gray-900 font-semibold">{award.place}</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">{award.amount}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Siapa saja yang bisa mengikuti kompetisi ini?",
      answer: "Kompetisi terbuka untuk pelajar SMA/SMK dan mahasiswa aktif di seluruh Indonesia. Peserta harus memiliki KTM/Kartu Pelajar yang masih berlaku."
    },
    {
      question: "Apakah ada biaya pendaftaran?",
      answer: "Tidak ada biaya pendaftaran! Kompetisi ini gratis untuk semua peserta. Kami percaya bahwa kreativitas tidak boleh dibatasi oleh biaya."
    },
    {
      question: "Bagaimana cara mendaftar?",
      answer: "Klik tombol 'Daftar Sekarang' di website ini, isi formulir pendaftaran, upload dokumen yang diperlukan, dan tunggu konfirmasi dari tim panitia."
    },
    {
      question: "Apakah boleh mengikuti lebih dari satu kategori?",
      answer: "Ya, peserta diperbolehkan mengikuti maksimal 2 kategori lomba. Namun, pastikan Anda dapat mengelola waktu dengan baik untuk kedua kategori tersebut."
    },
    {
      question: "Apa saja kriteria penilaian?",
      answer: "Setiap kategori memiliki kriteria berbeda: kreativitas, teknis, inovasi, dan presentasi. Detail lengkap tersedia di panduan lomba yang dapat diunduh."
    },
    {
      question: "Kapan pengumuman pemenang?",
      answer: "Pengumuman pemenang akan dilakukan pada 20 September 2025 melalui website resmi dan media sosial. Ceremony puncak akan diadakan secara hybrid."
    }
  ];

  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-red-200 text-red-600">
            <ChatBubbleIcon className="h-4 w-4 text-red-600 mr-2" />
            FAQ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Pertanyaan yang Sering Diajukan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum seputar kompetisi Multimedia in Action 2025.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <button
                  className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-base font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <div className={cn(
                    "transition-transform duration-300 flex-shrink-0",
                    openIndex === index ? "rotate-180" : ""
                  )}>
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => (
  <section className="py-20 bg-gradient-to-br from-red-600 to-red-700 relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-10 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white opacity-10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
    </div>

    <div className="container mx-auto px-4 text-center relative z-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Siap Berkompetisi?</h2>
        <p className="text-xl text-red-100 mb-8 leading-relaxed">
          Jangan lewatkan kesempatan emas ini! Daftarkan diri Anda atau tim Anda sekarang dan tunjukkan kreativitas terbaik Anda.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-3 text-lg">
            <RocketIcon className="h-5 w-5 mr-2" />
            Daftar Sekarang
          </Button>
          <Button
            size="lg"
            className="bg-white text-red-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-3 text-lg"
          >
            <DownloadIcon className="h-5 w-5 mr-2" />
            Download Panduan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-opacity-30 transition-all duration-300">
              <EnvelopeClosedIcon className="h-8 w-8 text-red" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
            <p className="text-red-100">info@multimediainaction.com</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-opacity-30 transition-all duration-300">
              <ChatBubbleIcon className="h-8 w-8 text-red" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">WhatsApp</h3>
            <p className="text-red-100">+62 812-3456-7890</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-opacity-30 transition-all duration-300">
              <InstagramLogoIcon className="h-8 w-8 text-red" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Instagram</h3>
            <p className="text-red-100">@multimediainaction</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <LightningBoltIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">Multimedia in Action</span>
              <div className="text-sm text-gray-400">Digital Competition 2025</div>
            </div>
          </div>
          <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
            Platform kompetisi digital terdepan untuk mengembangkan bakat dan kreativitas generasi muda Indonesia dalam era digital.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
              <InstagramLogoIcon className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
              <TwitterLogoIcon className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
              <LinkedInLogoIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Kategori Lomba</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#lomba" className="hover:text-white transition-colors">Website Development</a></li>
            <li><a href="#lomba" className="hover:text-white transition-colors">UI/UX Design</a></li>
            <li><a href="#lomba" className="hover:text-white transition-colors">Digital Poster</a></li>
            <li><a href="#lomba" className="hover:text-white transition-colors">Essay Writing</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Informasi</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Panduan Lomba</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
            <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400 mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Multimedia in Action. Hak Cipta Dilindungi.
        </p>
        <div className="flex space-x-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function CompetitionWebsite() {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #dc2626, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
      <Header />
      <main>
        <HeroSection />
        <CompetitionSection />
        <TimelineSection />
        <PrizeSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}