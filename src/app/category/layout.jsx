import PublicLayout from "@/components/layout/PublicLayout";

export const metadata = {
  title: "Kategori Perlombaan",
  description:
    "Pilihan cabang kompetisi digital creative di Multimedia in Action 2026.",
  openGraph: {
    title: "Kategori Perlombaan | Multimedia in Action 2026",
    description:
      "Pilihan cabang kompetisi digital creative di Multimedia in Action 2026.",
  },
};

export default function CategoryLayout({ children }) {
  return <PublicLayout>{children}</PublicLayout>;
}
