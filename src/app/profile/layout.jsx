import UserDashboardLayout from "@/components/layout/UserDashboardLayout";

export const metadata = {
  title: "Profile",
};

export default function ProfileLayout({ children }) {
  return <UserDashboardLayout>{children}</UserDashboardLayout>;
}