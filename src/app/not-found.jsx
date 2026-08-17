import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#151C28] text-[#FFF9F5] p-4 text-center">
      <h1 className="text-6xl font-bold text-[#E01C20] mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-[#AAB1BD] mb-6 max-w-md">
        Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="mia-btn-primary px-6 py-3 text-sm inline-flex items-center justify-center cursor-pointer"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
