import { DashboardHeader } from "./DashboardHeader";
import Footer from "./Footer";

export default function UserDashboardLayout({ children }) {
  return (
    <>
      <DashboardHeader />
      <div className="min-h-screen bg-mia-bg mia-connected-bg text-mia-text flex flex-col justify-between selection:bg-mia-red selection:text-white">
        <div className="-mt-16 sm:-mt-20">{children}</div>
      </div>

      <Footer />
    </>
  );
}