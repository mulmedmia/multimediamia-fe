"use client";

import React, { useState, useEffect } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import TimelineSection from "@/components/sections/TimelineSection";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

// Helper function untuk format waktu
const formatTime = (time) => String(time).padStart(2, "0");

// Komponen kecil TimerBox
const TimerBox = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="text-4xl md:text-5xl font-bold text-white bg-black/50 dark:bg-black/80 p-4 rounded-lg shadow-lg w-20 h-20 flex items-center justify-center border border-gray-700">
      {value}
    </div>
    <span className="mt-2 text-sm text-gray-400 uppercase tracking-wider">
      {label}
    </span>
  </div>
);

const BrainIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* ...svg path... */}
    <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.25.52 2.4 1.38 3.25" />
    <path d="M12 2a4.5 4.5 0 0 1 4.5 4.5c0 1.25-.52 2.4-1.38 3.25" />
    <path d="M12 15a4.5 4.5 0 0 0 4.5-4.5c0-1.25-.52-2.4-1.38-3.25" />
    <path d="M12 15a4.5 4.5 0 0 1-4.5-4.5c0-1.25.52-2.4 1.38-3.25" />
    <path d="M17.5 10.5c1.13.85 1.88 2.22 1.88 3.75a4.5 4.5 0 0 1-4.5 4.5" />
    <path d="M6.5 10.5c-1.13.85-1.88 2.22-1.88 3.75a4.5 4.5 0 0 0 4.5 4.5" />
    <path d="M12 22v-3" />
    <path d="M12 15v-3" />
    <path d="M15 12.5v-2" />
    <path d="M9 12.5v-2" />
    <path d="M17.62 9.75 16.5 11" />
    <path d="M6.38 9.75 7.5 11" />
  </svg>
);

const CompetitionDetail = ({ categoryId }) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Fetch data kategori dari backend
  useEffect(() => {
    if (!categoryId) {
      setError("Kategori lomba tidak valid atau tidak ditemukan.");
      setLoading(false);
      return;
    }
    const fetchCategory = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API_URL}/categories/${categoryId}`);
        if (!res.ok) {
          throw new Error(`Gagal mengambil data: ${res.statusText}`);
        }
        const json = await res.json();
        setCategory(json.data);
      } catch (err) {
        console.error("Gagal fetch kategori:", err);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [categoryId]);

  // Timer
  useEffect(() => {
    if (!category?.endDate) return;

    const timer = setInterval(() => {
      const targetDate = new Date(category.endDate);
      const difference = targetDate - new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [category]);

  if (loading) {
    return <div className="text-center py-20">Memuat data kategori...</div>;
  }

  if (error || !category) {
    return (
      <div className="text-center py-20 text-red-500">
        {error || "Gagal memuat data kategori."}
      </div>
    );
  }

  return (
    <>
      <DashboardHeader />
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-indigo-50 dark:from-red-900 dark:via-black dark:to-black text-white p-4 pt-24">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Judul dan Hitung Mundur Waktu */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-7xl font-bold text-foreground dark:text-white mb-5 leading-tight">
              <span>
                <span className="inline">{category.title}</span>
                {/* <span className="inline bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  {category.name}
                </span> */}
              </span>
            </h1>
            <div className="flex gap-4 mt-6 mb-6 justify-center">
              <TimerBox value={formatTime(timeLeft.days)} label="Days" />
              <TimerBox value={formatTime(timeLeft.hours)} label="Hours" />
              <TimerBox value={formatTime(timeLeft.minutes)} label="Minutes" />
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <CalendarIcon />
              <span>
                {new Date(category.endDate).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  timeZone: "Asia/Jakarta",
                })}{" "}
                WIB
              </span>
            </div>
          </div>

          {/* Gambar dan Icon di sebelah kanan */}
          <div className="flex flex-col items-center">
            <img
              src={category.image}
              alt={category.category_name}
              className="w-48 h-48 object-contain mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            />
            <p className="max-w-md text-center text-gray-300 leading-relaxed">
              {category.description}
            </p>
          </div>

          {/* Button untuk Daftar dan Download Panduan */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-700 dark:to-black hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 shadow-lg text-white"
            >
              Daftar Lomba
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-red-600 text-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/40 dark:hover:text-white px-8 py-3 text-lg"
            >
              Download Panduan
            </Button>
          </div>
        </div>
      </section>
      <TimelineSection />
      <Footer />
    </>
  );
};

export default CompetitionDetail;
