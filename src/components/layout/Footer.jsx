import React from "react";
import {
  LightningBoltIcon,
  InstagramLogoIcon,
  TwitterLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";

const Footer = () => (
  <footer className="bg-black text-white py-12 border-t border-gray-800">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg">
              <LightningBoltIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">Multimedia in Action</span>
              <div className="text-sm text-gray-400">
                Digital Competition 2025
              </div>
            </div>
          </div>
          <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
            Platform kompetisi digital terdepan untuk mengembangkan bakat dan
            kreativitas generasi muda Indonesia.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <InstagramLogoIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <TwitterLogoIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <LinkedInLogoIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Kategori Lomba</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#lomba" className="hover:text-white transition-colors">
                Website Development
              </a>
            </li>
            <li>
              <a href="#lomba" className="hover:text-white transition-colors">
                UI/UX Design
              </a>
            </li>
            <li>
              <a href="#lomba" className="hover:text-white transition-colors">
                Digital Poster
              </a>
            </li>
            <li>
              <a href="#lomba" className="hover:text-white transition-colors">
                Essay Writing
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Informasi</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Panduan Lomba
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Syarat & Ketentuan
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-white transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Kontak
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400 mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Multimedia in Action. Hak Cipta
          Dilindungi.
        </p>
        <div className="flex space-x-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Cookie Policy
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;