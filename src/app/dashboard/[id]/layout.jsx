import UserDashboardLayout from "@/components/layout/UserDashboardLayout";

export const metadata = {
  title: "Lomba Diikuti",
};

export default function CompeDashboardLayoutId({ children }) {
  return <UserDashboardLayout>{children}</UserDashboardLayout>;
}
