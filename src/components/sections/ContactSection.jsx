import React from 'react';
import { Button } from '@/components/ui/button';
import { RocketIcon, DownloadIcon } from '@radix-ui/react-icons';

const ContactSection = () => (
  <section className="py-20 bg-gradient-to-br from-red-700 to-black relative overflow-hidden">
    <div className="container mx-auto px-4 text-center relative z-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Siap Berkompetisi?
        </h2>
        <p className="text-xl text-red-200 mb-8 leading-relaxed">
          Jangan lewatkan kesempatan emas ini! Daftarkan diri Anda dan tunjukkan
          kreativitas terbaik Anda.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            size="lg"
            className="bg-white text-red-600 hover:bg-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-3 text-lg"
          >
            <RocketIcon className="h-5 w-5 mr-2" />
            Daftar Sekarang
          </Button>
          <Button
            size="lg"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-3 text-lg"
          >
            <DownloadIcon className="h-5 w-5 mr-2" />
            Download Panduan
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default ContactSection;