import type { Metadata } from "next";
import LearningMap from "./learning-map";

export const metadata: Metadata = {
  title: "Learning",
  description:
    "An interactive map of what I'm learning across multi-cloud and hybrid cloud architecture.",
  alternates: { canonical: "/learning" },
};

export default function LearningPage() {
  return <LearningMap />;
}
