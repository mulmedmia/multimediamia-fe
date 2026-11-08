import UserDashboardLayout from "@/components/layout/UserDashboardLayout";

export const metadata = {
  title: "Riwayat Tukar Hadiah",
};

export default function HistoryPesananLayout({ children }) {
  return <UserDashboardLayout>{children}</UserDashboardLayout>;
}