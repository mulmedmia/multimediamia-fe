"use client";

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChatBubbleIcon } from '@radix-ui/react-icons';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    {
      question: "Siapa saja yang bisa mengikuti kompetisi ini?",
      answer:
        "Kompetisi terbuka untuk pelajar SMA/SMK dan mahasiswa aktif di seluruh Indonesia. Peserta harus memiliki KTM/Kartu Pelajar yang masih berlaku.",
    },
    {
      question: "Apakah ada biaya pendaftaran?",
      answer:
        "Tidak ada biaya pendaftaran! Kompetisi ini gratis untuk semua peserta. Kami percaya bahwa kreativitas tidak boleh dibatasi oleh biaya.",
    },
    {
      question: "Bagaimana cara mendaftar?",
      answer:
        "Klik tombol 'Daftar Sekarang' di website ini, isi formulir pendaftaran, upload dokumen yang diperlukan, dan tunggu konfirmasi dari tim panitia.",
    },
    {
      question: "Apakah boleh mengikuti lebih dari satu kategori?",
      answer:
        "Ya, peserta diperbolehkan mengikuti maksimal 2 kategori lomba. Namun, pastikan Anda dapat mengelola waktu dengan baik untuk kedua kategori tersebut.",
    },
    {
      question: "Apa saja kriteria penilaian?",
      answer:
        "Setiap kategori memiliki kriteria berbeda: kreativitas, teknis, inovasi, dan presentasi. Detail lengkap tersedia di panduan lomba yang dapat diunduh.",
    },
    {
      question: "Kapan pengumuman pemenang?",
      answer:
        "Pengumuman pemenang akan dilakukan pada 20 September 2025 melalui website resmi dan media sosial. Ceremony puncak akan diadakan secara hybrid.",
    },
  ];

  return (
    <section id="faq" className="py-16 bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 border-red-200 text-red-600 dark:border-red-800 dark:text-red-400"
          >
            <ChatBubbleIcon className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
            FAQ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-3">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum seputar kompetisi ini.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="shadow-md hover:shadow-lg transition-all duration-300 bg-card dark:bg-gray-900/50 border dark:border-gray-800"
            >
              <CardContent className="p-0">
                <button
                  className="w-full p-5 text-left flex items-center justify-between hover:bg-accent dark:hover:bg-gray-800/50 transition-colors"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  <span className="text-base font-semibold text-foreground dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      "transition-transform duration-300 flex-shrink-0",
                      openIndex === index ? "rotate-180" : ""
                    )}
                  >
                    <svg
                      className="h-5 w-5 text-muted-foreground dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
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

export default FAQSection;