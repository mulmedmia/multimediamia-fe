import React from "react";
import Image from "next/image";

const mediaPartners = [
  { name: "Ar-Risalah KSMI", src: "/media_partner/ar_risalah_logo.avif" },
  { name: "BEM Fasilkom UNSIKA", src: "/media_partner/bem_fasilkom_unsika_logo.avif" },
  { name: "BEM Fasilkom UPNVJT", src: "/media_partner/bem_fasilkom_upnvjt_logo.avif" },
  { name: "BEM FIK UPNVJ", src: "/media_partner/bem_fik_upnvj_logo.avif" },
  { name: "BEM FILKOM UB", src: "/media_partner/bem_filkom_ub_logo.avif" },
  { name: "BEM FMIPA Udayana", src: "/media_partner/bem_fmipa_udayana_logo.avif" },
  { name: "BEM FMIPA UNNES", src: "/media_partner/bem_fmipa_unnes_logo.avif" },
  { name: "BEM FSM UNDIP", src: "/media_partner/bem_fsm_undip_logo.avif" },
  { name: "BEM FST UNAIR", src: "/media_partner/bem_fst_unair_logo.avif" },
  { name: "BEM FTEIC ITS", src: "/media_partner/bem_fteic_its_logo.avif" },
  { name: "BEM FTI UNTAR", src: "/media_partner/bem_fti_untar_logo.avif" },
  { name: "BEM FTI UPNVY", src: "/media_partner/bem_fti_upnvy_logo.avif" },
  { name: "BEM FT UNESA", src: "/media_partner/bem_ft_unesa_logo.avif" },
  { name: "BEM KEMA FPMIPA UPI", src: "/media_partner/bem_kema_fpmipa_upi_logo.avif" },
  { name: "BEM KM Universitas Andalas", src: "/media_partner/bem_km_andalas_logo.avif" },
  { name: "BEM UPNVJ", src: "/media_partner/bem_upnvj_logo.avif" },
  { name: "HIMATIK PNJ", src: "/media_partner/himatik_pnj_logo.avif" },
  { name: "HIMA D3 SI UPNVJ", src: "/media_partner/hima_d3_si_upnvj_logo.avif" },
  { name: "HIMA SI UNIKOM", src: "/media_partner/hima_si_unikom_logo.avif?v=3" },
  { name: "HIMSI UIN", src: "/media_partner/himsi_uin_logo.avif" },
  { name: "HIVE UIN", src: "/media_partner/hive_uin_logo.avif" },
  { name: "Lombakan", src: "/media_partner/lombakan_logo.avif" },
  { name: "Lomba Tekno", src: "/media_partner/lomba_tekno_logo.avif" },
  { name: "Lomba UI/UX", src: "/media_partner/lomba_uiux_logo.avif" },
  { name: "Robotik UPNVJ", src: "/media_partner/robotik_upnvj_logo.avif" },
  { name: "Senat Mahasiswa FIK", src: "/media_partner/senat_fik_logo.avif" },
  { name: "Tekno Event Campus", src: "/media_partner/teknoevent_campus_logo.avif" },
  { name: "Tekno Event", src: "/media_partner/teknoevent_logo.avif" },
  { name: "Veterantech UPNVJ", src: "/media_partner/veterantech_upnvj_logo.avif" },
];

const MediaPartnerSection = () => {
  return (
    <section id="media-partner" className="py-16 sm:py-20 relative content-visibility-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14 space-y-4">
          <div className="inline-block">
            <span className="mia-pill-badge shadow-md">
              <span className="text-[#06B6D4]">◆</span>
              <span>Media Partner</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[32px] font-bold text-[#FFF9F5] tracking-tight">
            Jaringan <span className="text-[#06B6D4]">Publikasi Kami</span>
          </h2>

          <p className="text-base md:text-[18px] text-[#AAB1BD] max-w-3xl mx-auto leading-relaxed">
            Rangkaian kegiatan dan keseruan MIA 2026 turut disuarakan secara luas oleh rekan-rekan media partner dan komunitas digital di seluruh Indonesia.
          </p>
        </div>

        {/* Static Logos Grid */}
        <div className="max-w-6xl mx-auto bg-[#0C0F17]/60 border border-white/5 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-sm shadow-2xl">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 sm:gap-4 md:gap-5 items-center justify-center">
            {mediaPartners.map((partner, index) => {
              const isUnikom = partner.name === "HIMA SI UNIKOM";
              return (
                <div
                  key={index}
                  className="group relative flex flex-col items-center justify-center h-20 sm:h-24 p-2.5 sm:p-3 rounded-xl bg-[#141824]/70 border border-white/5 hover:border-[#06B6D4]/40 hover:bg-[#181D2D] transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5"
                  title={partner.name}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={partner.src}
                      alt={partner.name}
                      width={100}
                      height={60}
                      className={`max-h-full max-w-full object-contain opacity-85 group-hover:opacity-100 transition-all duration-300 ${
                        isUnikom
                          ? "scale-130 group-hover:scale-140"
                          : "group-hover:scale-105"
                      }`}
                    />
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

export default MediaPartnerSection;
