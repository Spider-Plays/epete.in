import { Header } from "./Header";
import { Footer } from "./Footer";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 w-full pt-[8.5rem] md:pt-[10.5rem]">{children}</main>
      <Footer />
    </div>
  );
}
