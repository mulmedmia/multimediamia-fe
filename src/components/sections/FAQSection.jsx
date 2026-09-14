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
                <AccordionContent className="pt-1 text-sm sm:text-base text-[#AAB1BD] leading-relaxed border-t border-white/5 mt-1 cursor-pointer">
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
