import { CustomerAuthRedirect as DaalLandingAuthRedirect } from "@/components/customer-dashboard/auth-redirect";
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
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

function Home() {
  return (
    <PanelProvider>
      <ScrollRail />

      <Header /><DaalLandingAuthRedirect />

      <main id="main-content" className="min-w-0 flex-1">
        <Hero />
        <Services />
        <Showcase />
        <Packages />
        <Process />
        <Support />
        <Faq />
      </main>

      <Footer />

      {/* Space for the mobile navigation */}
      <div
        aria-hidden="true"
        className="h-[calc(76px+env(safe-area-inset-bottom))] md:hidden"
      />

      <MobileBottomNav />
    </PanelProvider>
  );
}
// DAAL-V62-PUBLIC-LANDING
export default async function DaalCustomerLandingPage() {

  return <><Home /></>;
}
