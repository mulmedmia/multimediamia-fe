"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChatBubbleIcon, ChevronDownIcon } from "@radix-ui/react-icons";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Siapa saja yang bisa mengikuti kompetisi ini?",
      answer:
        "Kompetisi terbuka untuk seluruh mahasiswa aktif jenjang D3/D4/S1 dari universitas di seluruh Indonesia. Peserta wajib melampirkan Kartu Tanda Mahasiswa (KTM) yang masih berlaku.",
    },
    {
      question: "Apakah ada biaya pendaftaran?",
      answer:
        "Terdapat biaya pendaftaran yang terjangkau untuk setiap cabang lomba. Biaya pendaftaran ini merupakan investasi terbaik karena peserta mendapatkan mentoring session eksklusif, e-certificate, dan kesempatan rekomendasi magang di LinkAja.",
    },
    {
      question: "Bagaimana cara mendaftar?",
      answer:
        "Klik tombol 'Daftar Sekarang' di bagian atas atau bawah halaman ini, buat akun, isi formulir pendaftaran tim, pilih cabang lomba yang diinginkan, lalu ikuti petunjuk pembayaran.",
    },
    {
      question: "Apakah boleh mengikuti lebih dari satu kategori?",
      answer:
        "Ya, peserta diperbolehkan mengikuti lebih dari satu kategori lomba. Namun, satu orang tidak boleh menjadi ketua di 2 cabang lomba sekaligus (hanya boleh menjadi ketua di 1 lomba dan anggota di lomba lain).",
    },
    {
      question: "Apa saja kriteria penilaian?",
      answer:
        "Setiap cabang memiliki kriteria khusus: kreativitas & inovasi, kegunaan (usability), kualitas teknis, serta daya tarik presentasi. Detail lengkap dapat dibaca di guidebook.",
    },
    {
      question: "Kapan pengumuman pemenang dilakukan?",
      answer:
        "Pengumuman pemenang akan dilakukan pada Acara Puncak tanggal 28 November 2025 secara hybrid, serta dipublikasikan di website resmi dan Instagram @multimedia.in.action.",
    },
  ];

  return (
    <section id="faq" className="py-20 relative">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-block">
            <span className="mia-pill-badge">
              <ChatBubbleIcon className="h-3.5 w-3.5 text-[#E01C20]" />
              <span>FAQ</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[30.56px] font-bold text-[#FFF9F5] tracking-tight">
            Pertanyaan yang <span className="text-[#E01C20]">Sering Diajukan</span>
          </h2>

          <p className="text-base md:text-[18.89px] text-[#AAB1BD] max-w-2xl mx-auto leading-relaxed">
            Temukan jawaban untuk pertanyaan umum seputar kompetisi MIA 2025.
          </p>
        </div>

        {/* Accordion Stack */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={cn(
                  "mia-card transition-all duration-300 overflow-hidden",
                  isOpen ? "border-[#E01C20]/40 bg-[#0A0D14]/80" : "hover:border-white/20"
                )}
              >
                <button
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="text-base sm:text-lg font-bold text-[#FFF9F5]">
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full bg-[#1E2939] flex items-center justify-center transition-transform duration-300 flex-shrink-0 border border-white/10",
                      isOpen ? "rotate-180 bg-[#E01C20]/20 text-[#E01C20]" : "text-[#AAB1BD]"
                    )}
                  >
                    <ChevronDownIcon className="h-5 w-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#AAB1BD] leading-relaxed border-t border-white/5 mt-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;