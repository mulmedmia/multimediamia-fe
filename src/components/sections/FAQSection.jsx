"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChatBubbleIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Siapa saja yang bisa mengikuti kompetisi ini?",
      answer:
        "Kompetisi terbuka untuk siswa aktif tingkat SMA/SMK/MA/sederajat dan mahasiswa aktif jenjang D3/D4/S1 dari seluruh Indonesia. Peserta mahasiswa wajib melampirkan Kartu Tanda Mahasiswa (KTM), sedangkan peserta pelajar wajib melampirkan Kartu Pelajar yang masih berlaku.",
    },
    {
      question: "Apakah ada biaya pendaftaran?",
      answer:
        "Terdapat biaya pendaftaran yang sangat terjangkau untuk setiap cabang lomba. Biaya ini merupakan investasi terbaik karena peserta berkesempatan memenangkan total hadiah belasan juta rupiah, mendapat Free Domain & Token Cloud VPS senilai hingga Rp 500.000, sesi exclusive 1-on-1 mentoring, serta membangun portofolio incaran recruiter.",
    },
    {
      question: "Bagaimana cara mendaftar?",
      answer:
        "Klik tombol 'Daftar Sekarang' di bagian atas atau bawah halaman ini, buat akun, isi formulir pendaftaran tim, pilih cabang lomba yang diinginkan (UIA atau WIA), lalu ikuti petunjuk pembayaran yang tertera di layar.",
    },
    {
      question: "Apakah boleh mengikuti lebih dari satu kategori?",
      answer:
        "Ya, diperbolehkan. Namun, satu orang tidak boleh menjadi ketua di 2 cabang lomba sekaligus (hanya boleh menjadi ketua di 1 lomba dan anggota di lomba lain).",
    },
    {
      question: "Apa saja kriteria penilaian?",
      answer:
        "Setiap cabang dinilai melalui pendekatan Problem Based Design yang berfokus pada kualitas teknis dan dampak implementasi. Kriteria utama meliputi: kreativitas, relevansi solusi dengan kebutuhan industri, clean code (WIA), konsistensi desain (UIA), serta daya tarik pitching. Detail lengkap ada di Panduan Lomba (Guidebook).",
    },
    {
      question: "Kapan pengumuman pemenang dilakukan?",
      answer: (
        <span>
          Pengumuman pemenang akan dilakukan secara langsung pada Acara Puncak tanggal 28 November 2026 secara hybrid di Auditorium UPNVJ, serta dipublikasikan di website resmi dan Instagram{" "}
          <a
            href="https://www.instagram.com/multimedia.in.action/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E01C20] hover:text-[#FF4500] hover:underline font-semibold transition-colors inline-flex items-center gap-0.5"
          >
            @multimedia.in.action
          </a>
          .
        </span>
      ),
    },
  ];

  return (
    <section id="faq" className="py-20 relative scroll-mt-16 sm:scroll-mt-20 content-visibility-auto">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14 space-y-4">
          <div className="inline-block">
            <span className="mia-pill-badge shadow-md">
              <ChatBubbleIcon className="h-3.5 w-3.5 text-[#E01C20]" />
              <span>FAQ (Frequently Asked Questions)</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[32px] font-bold text-[#FFF9F5] tracking-tight">
            Pertanyaan yang <span className="text-[#E01C20]">Sering Diajukan</span>
          </h2>

          <p className="text-base md:text-[18px] text-[#AAB1BD] max-w-2xl mx-auto leading-relaxed">
            Temukan jawaban untuk pertanyaan umum seputar kompetisi MIA 2026.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="0"
          className="space-y-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <AccordionItem
                key={index}
                value={index.toString()}
                className="mia-card py-2 px-6"
              >
                <AccordionTrigger className="relative text-base sm:text-lg font-bold text-[#FFF9F5] hover:no-underline [&>svg]:hidden cursor-pointer group">
                  {faq.question}
                  <div
                    className={cn(
                      "absolute top-1/2 right-0 -translate-y-1/2 z-10",
                      "w-8 h-8 rounded-full bg-[#1E2939] flex items-center justify-center transition-transform duration-300 flex-shrink-0 border border-white/10",
                      "group-data-[state=open]:rotate-180 group-data-[state=open]:bg-[#E01C20]/20 group-data-[state=open]:text-[#E01C20]",
                      "group-data-[state=closed]text-[#AAB1BD]",
                    )}
                  >
                    <ChevronDownIcon className="h-5 w-5" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 text-sm sm:text-base text-[#AAB1BD] leading-relaxed border-t border-white/5 mt-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
