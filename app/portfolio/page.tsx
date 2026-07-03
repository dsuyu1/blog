import type { Metadata } from "next";
import PortfolioLanding from "./portfolio-landing";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Damian Villarreal — security operations, cloud, and AI security architecture. Projects, presentations, and current research.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return <PortfolioLanding />;
}
