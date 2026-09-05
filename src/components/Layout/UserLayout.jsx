import { Outlet } from "react-router-dom";
import Footer from "../Common/Footer";
import Header from "../Common/Header";

export default function UserLayout() {
  return (
    <div
    // className="bg-amber-50 min-h-screen"
    >
      {/* Header   */}
      <Header />
      {/* main content  */}
      <main>
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
