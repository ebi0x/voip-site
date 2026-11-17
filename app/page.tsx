import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Packages } from "@/components/packages";
import { PanelProvider } from "@/components/panels/panel-provider";
import { Process } from "@/components/process";
import { ScrollRail } from "@/components/scroll-rail";
import { Services } from "@/components/services";
import { Showcase } from "@/components/showcase";
import { Support } from "@/components/support";

export default function Home() {
  return (
    <PanelProvider>
      <ScrollRail />
      <Header />
      <main id="main-content" className="flex-1">
        <Hero />
        <Services />
        <Showcase />
        <Packages />
        <Process />
        <Support />
        <Faq />
      </main>
      <Footer />
    </PanelProvider>
  );
}