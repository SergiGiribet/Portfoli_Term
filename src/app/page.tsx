import { StoreProvider } from "@/lib/store";
import IntlProvider from "@/components/ui/IntlProvider";
import DotCanvas from "@/components/ui/DotCanvas";
import HudCursor from "@/components/ui/HudCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BootScreen from "@/components/ui/BootScreen";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Profile from "@/components/sections/Profile";
import Work from "@/components/sections/Work";
import Contact from "@/components/sections/Contact";
import DetailPanel from "@/components/ui/DetailPanel";
import Terminal from "@/components/ui/Terminal";
import CvModal from "@/components/ui/CvModal";

export default function Home() {
  return (
    <StoreProvider>
      <IntlProvider>
        <div
          style={{
            fontFamily: "'Chakra Petch',sans-serif",
            background: "#0a0b0a",
            color: "#e8e9e4",
            minHeight: "100vh",
            position: "relative",
            overflowX: "hidden",
            isolation: "isolate",
          }}
        >
          {/* global bg fx */}
          <DotCanvas />
          <div style={{ position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none", background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.022) 0 1px, transparent 1px 3px)", animation: "gq-scan 8s linear infinite", mixBlendMode: "overlay" }} />
          <div style={{ position: "fixed", inset: 0, zIndex: 9997, pointerEvents: "none", background: "radial-gradient(130% 100% at 50% 0%, transparent 62%, rgba(0,0,0,0.42) 100%)" }} />

          <ScrollProgress />
          <HudCursor />
          <BootScreen />

          <Nav />
          <main>
            <Hero />
            <Marquee />
            <Profile />
            <Work />
            <Contact />
          </main>

          {/* overlays */}
          <DetailPanel />
          <Terminal />
          <CvModal />
        </div>
      </IntlProvider>
    </StoreProvider>
  );
}
