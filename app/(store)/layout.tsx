import Navbar from "./(component)/Navbar";
import Footer from "./(component)/Footer";
import CartDrawer from "./(component)/CartDrawer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white font-[batica]">
      <Navbar />
      <main className="w-full flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
