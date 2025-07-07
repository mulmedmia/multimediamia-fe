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
} from "@radix-ui/react-icons";

interface CompetitionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  prize: string;
  requirements: string[];
  color: string;
  deadline: string;
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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <StarIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Multimedia in Action
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#beranda" className="text-gray-600 hover:text-red-600 transition-colors">
              Beranda
            </a>
            <a href="#lomba" className="text-gray-600 hover:text-red-600 transition-colors">
              Kategori Lomba
            </a>
            <a href="#timeline" className="text-gray-600 hover:text-red-600 transition-colors">
              Timeline
            </a>
            <a href="#hadiah" className="text-gray-600 hover:text-red-600 transition-colors">
              Hadiah
            </a>
          </nav>

          <div className="flex items-center space-x-4">
             <Button className="hidden md:flex px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">
                <span>✨ Daftar Sekarang</span>
             </Button>

            <Button
              variant="ghost"
              className="md:hidden text-gray-900"
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
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <a href="#beranda" className="text-gray-600 hover:text-red-600">Beranda</a>
              <a href="#lomba" className="text-gray-600 hover:text-red-600">Kategori Lomba</a>
              <a href="#timeline" className="text-gray-600 hover:text-red-600">Timeline</a>
              <a href="#hadiah" className="text-gray-600 hover:text-red-600">Hadiah</a>
              <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
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
  return (
    <section
      id="beranda"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-indigo-100"
    >
      <div className="container mx-auto px-4 mt-20 mb-10 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="destructive" className="mb-6">
            <StarIcon className="h-4 w-4 mr-2" />
            Kompetisi Digital Indonesia 2025
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Kompetisi Digital Creative
            <br />
            <span className="text-red-600">Tingkat Nasional</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tunjukkan kreativitas dan inovasi Anda dalam 4 kategori lomba:
            Website Development, UI/UX Design, Digital Poster, dan Essay Writing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              <StarIcon className="h-5 w-5 mr-2" />
              Daftar Lomba
            </Button>
            <Button size="lg" variant="outline">
              <DownloadIcon className="h-5 w-5 mr-2" />
              Download Panduan
            </Button>
          </div>
          
           <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
             <Card>
                 <CardContent className="p-6 text-center">
                     <CalendarIcon className="h-8 w-8 text-red-600 mb-3 mx-auto" />
                     <div className="text-2xl font-bold text-gray-900 mb-1">25 Agustus</div>
                     <div className="text-sm text-gray-600">Deadline Pendaftaran</div>
                 </CardContent>
             </Card>
             <Card>
                 <CardContent className="p-6 text-center">
                     <PersonIcon className="h-8 w-8 text-red-600 mb-3 mx-auto" />
                     <div className="text-2xl font-bold text-gray-900 mb-1">1000+</div>
                     <div className="text-sm text-gray-600">Peserta Terdaftar</div>
                 </CardContent>
             </Card>
             <Card>
                 <CardContent className="p-6 text-center">
                     <StarIcon className="h-8 w-8 text-red-600 mb-3 mx-auto" />
                     <div className="text-2xl font-bold text-gray-900 mb-1">3 Juta</div>
                     <div className="text-sm text-gray-600">Total Hadiah</div>
                 </CardContent>
             </Card>
           </div>
        </div>
      </div>
    </section>
  );
};

const CompetitionCard = ({ icon, title, description, prize, requirements, color, deadline }: CompetitionCardProps) => {
    return (
        <Card className="relative flex flex-col items-start justify-center overflow-hidden rounded-xl bg-white p-6 shadow-sm border">
            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${color} text-white`}>
                {icon}
            </div>

            <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>

            <div className="space-y-3 mb-4 w-full">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Hadiah Utama</span>
                    <span className="text-lg font-bold text-green-600">{prize}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Deadline</span>
                    <Badge variant="destructive">{deadline}</Badge>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Persyaratan:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                    {requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <CheckCircledIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <Button className="w-full bg-red-600 hover:bg-red-700">
                <span>Daftar Sekarang</span>
                <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
        </Card>
    );
};

const CompetitionSection = () => {
    const competitions = [
        {
            icon: <DesktopIcon className="h-6 w-6" />,
            title: "Website Development",
            description: "Buat website responsif dan inovatif dengan teknologi terkini.",
            prize: "Rp 3.000.000",
            deadline: "20 Agustus 2025",
            requirements: ["Mahasiswa/Pelajar aktif", "Tim maksimal 3 orang", "Menggunakan framework modern"],
            color: "bg-red-600",
        },
        {
            icon: <MixerHorizontalIcon className="h-6 w-6" />,
            title: "UI/UX Design",
            description: "Ciptakan pengalaman pengguna yang luar biasa dengan desain intuitif.",
            prize: "Rp 3.000.000",
            deadline: "18 Agustus 2025",
            requirements: ["Portofolio desain", "Individu atau tim (max 2)", "Prototype interaktif"],
            color: "bg-purple-600",
        },
        {
            icon: <FileTextIcon className="h-6 w-6" />,
            title: "Digital Poster",
            description: "Buat poster digital yang menarik dengan pesan yang kuat.",
            prize: "Rp 3.000.000",
            deadline: "15 Agustus 2025",
            requirements: ["Resolusi 300 DPI", "Tema: Teknologi Masa Depan", "Karya original"],
            color: "bg-pink-600",
        },
        {
            icon: <Pencil2Icon className="h-6 w-6" />,
            title: "Essay Writing",
            description: "Tulis esai inspiratif tentang dampak teknologi digital.",
            prize: "Rp 3.000.000",
            deadline: "25 Agustus 2025",
            requirements: ["1000-1500 kata", "Referensi akademik", "Plagiarisme maks 10%"],
            color: "bg-green-600",
        },
    ];

    return (
        <section id="lomba" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                     <Badge variant="outline" className="mb-6">
                        <StarIcon className="h-4 w-4 text-red-600 mr-2" />
                        Kategori Lomba
                     </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Pilih Kategori Lomba Anda
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Empat kategori lomba yang menantang kreativitas dan kemampuan teknis Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        { date: "1 Agustus 2025", title: "Pembukaan Pendaftaran", description: "Pendaftaran dibuka untuk semua kategori.", status: "completed" },
        { date: "25 Agustus 2025", title: "Penutupan Pendaftaran", description: "Batas akhir pendaftaran lomba.", status: "active" },
        { date: "26 Agu - 5 Sep 2025", title: "Pengumpulan Karya", description: "Periode pengumpulan karya.", status: "upcoming" },
        { date: "6 - 15 Sep 2025", title: "Proses Penilaian", description: "Penilaian oleh tim juri ahli.", status: "upcoming" },
        { date: "20 September 2025", title: "Pengumuman Pemenang", description: "Pengumuman pemenang dan acara puncak.", status: "upcoming" },
    ];

    return (
        <section id="timeline" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-6">
                        <CalendarIcon className="h-4 w-4 text-red-600 mr-2" />
                        Timeline
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Jadwal Lomba</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Catat tanggal-tanggal penting, dari pendaftaran hingga pengumuman.
                    </p>
                </div>
                {/* Komponen Timeline dari Magic UI bisa ditambahkan di sini jika tersedia */}
                <div className="max-w-3xl mx-auto">
                    <div className="relative space-y-8">
                      <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                        {timelineEvents.map((event, i) => (
                            <div key={i} className="flex items-start gap-6">
                                <div className={cn(
                                    "flex-shrink-0 w-4 h-4 rounded-full mt-1.5 z-10",
                                    event.status === "completed" ? "bg-green-500" : 
                                    event.status === "active" ? "bg-red-500 animate-pulse" : "bg-gray-300"
                                )}></div>
                                <div className="flex-1">
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="text-sm text-red-600 font-medium mb-2">{event.date}</div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                            <p className="text-gray-600">{event.description}</p>
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
        { category: "Website Development", awards: [{ place: "Juara 1", amount: "Rp 3.000.000", icon: "🥇" }, { place: "Juara 2", amount: "Rp 2.000.000", icon: "🥈" }, { place: "Juara 3", amount: "Rp 1.000.000", icon: "🥉" }] },
        { category: "UI/UX Design", awards: [{ place: "Juara 1", amount: "Rp 3.000.000", icon: "🥇" }, { place: "Juara 2", amount: "Rp 2.000.000", icon: "🥈" }, { place: "Juara 3", amount: "Rp 1.000.000", icon: "🥉" }] },
        { category: "Digital Poster", awards: [{ place: "Juara 1", amount: "Rp 3.000.000", icon: "🥇" }, { place: "Juara 2", amount: "Rp 2.000.000", icon: "🥈" }, { place: "Juara 3", amount: "Rp 1.000.000", icon: "🥉" }] },
        { category: "Essay Writing", awards: [{ place: "Juara 1", amount: "Rp 3.000.000", icon: "🥇" }, { place: "Juara 2", amount: "Rp 2.000.000", icon: "🥈" }, { place: "Juara 3", amount: "Rp 1.000.000", icon: "🥉" }] },
    ];

    return (
        <section id="hadiah" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                     <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 mb-6 hover:bg-yellow-200">
                        <StarIcon className="h-4 w-4 text-yellow-600 mr-2" />
                        Total Hadiah 3+ Juta
                     </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hadiah Menarik Menanti</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Raih kesempatan memenangkan hadiah jutaan rupiah dan pengakuan nasional.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {prizes.map((prize, i) => (
                        <Card key={i} className="bg-gray-50">
                           <CardHeader>
                              <CardTitle className="text-center">{prize.category}</CardTitle>
                           </CardHeader>
                           <CardContent className="space-y-4">
                                {prize.awards.map((award, j) => (
                                    <div key={j} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{award.icon}</span>
                                            <span className="text-gray-900 font-medium">{award.place}</span>
                                        </div>
                                        <span className="text-lg font-bold text-green-600">{award.amount}</span>
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

const ContactSection = () => (
    <section className="py-20 bg-red-600">
        <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Siap Berkompetisi?</h2>
                <p className="text-xl text-red-100 mb-8">
                    Jangan lewatkan kesempatan emas ini! Daftarkan diri Anda atau tim Anda sekarang.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                      <span>✨ Daftar Sekarang</span>
                   </Button>
                    <Button size="lg" variant="destructive" className="bg-red-700 hover:bg-red-800">
                        <DownloadIcon className="h-5 w-5 mr-2" />
                        Download Panduan
                    </Button>
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
           <div className="flex items-center space-x-2 mb-4">
               <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <StarIcon className="h-5 w-5 text-white" />
               </div>
               <span className="text-xl font-bold">Multimedia in Action</span>
           </div>
          <p className="text-gray-400 mb-6 max-w-md">
            Platform kompetisi digital untuk mengembangkan bakat dan kreativitas generasi muda Indonesia.
          </p>
        </div>
        
        <div>
           <h4 className="text-white font-semibold mb-4">Kategori Lomba</h4>
           <ul className="space-y-2 text-gray-400">
              <li><a href="#lomba" className="hover:text-white">Website Development</a></li>
              <li><a href="#lomba" className="hover:text-white">UI/UX Design</a></li>
              <li><a href="#lomba" className="hover:text-white">Digital Poster</a></li>
              <li><a href="#lomba" className="hover:text-white">Essay Writing</a></li>
           </ul>
        </div>

        <div>
           <h4 className="text-white font-semibold mb-4">Informasi</h4>
           <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Panduan Lomba</a></li>
              <li><a href="#" className="hover:text-white">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Kontak</a></li>
           </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Multimedia in Action. Hak Cipta Dilindungi.</p>
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
      `}</style>
      
      <Header />
      <main>
        <HeroSection />
        <CompetitionSection />
        <TimelineSection />
        <PrizeSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}