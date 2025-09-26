import React from "react";
import { Button } from "@/components/ui/button";
import { RocketIcon, DownloadIcon } from "@radix-ui/react-icons";

const ContactSection = () => (
  <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-red-700 dark:to-black relative overflow-hidden">
    {/* Background Pattern untuk Light Mode */}
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:hidden opacity-30"></div>

    {/* Background Pattern untuk Dark Mode */}
    <div className="hidden dark:block absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-50"></div>

    <div className="container mx-auto px-4 text-center relative z-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
          Siap Berkompetisi?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Jangan lewatkan kesempatan emas ini! Daftarkan diri Anda dan tunjukkan
          kreativitas terbaik Anda.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a
            href="https://drive.google.com/drive/folders/1x34lDmoqSFdOfsxUpxpe2KiAaGT2zk5m"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-3 text-lg cursor-pointer"
            >
              <DownloadIcon className="h-5 w-5 mr-2" />
              Download Panduan
            </Button>
          </a>
        </div>
      </div>
    </div>

    {/* Decorative Elements */}
    <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
    <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
  </section>
);

export default ContactSection;
