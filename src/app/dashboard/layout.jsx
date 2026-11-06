import UserDashboardLayout from "@/components/layout/UserDashboardLayout";

export const metadata = {
  title: "Lomba Diikuti",
};

export default function CompeDashboardLayout({ children }) {
  return <UserDashboardLayout>{children}</UserDashboardLayout>;
}
