import Footer from "./Footer";
import Header from "./Header";

export default function PublicLayout({ children }) {
  return (
    <>
      <div className="min-h-screen bg-mia-bg mia-connected-bg text-mia-text flex flex-col justify-between selection:bg-mia-red selection:text-white">
        <Header />
        {children}
      </div>

      <Footer />
    </>
  );
}