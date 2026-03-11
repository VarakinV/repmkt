import type { Metadata } from "next";
import BusinessCalculator from "./BusinessCalculator";

export const metadata: Metadata = {
  title: "The Real Estate Photography Business Calculator | RE Photography Growth Lab",
  description: "Estimate your real estate photography revenue, agent needs, and weekly shoot volume.",
};

export default function BusinessCalculatorPage() {
  return <BusinessCalculator />;
}