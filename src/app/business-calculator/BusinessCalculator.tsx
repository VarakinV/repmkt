"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import HeroParticles from "@/components/HeroParticles";
import styles from "./page.module.css";

const WEEKS_PER_MONTH = 4;
const MONTHS_PER_YEAR = 12;
const WEEKS_PER_YEAR = WEEKS_PER_MONTH * MONTHS_PER_YEAR;

type CalculatorValues = {
  pricePerShoot: number;
  listingsPerAgent: number;
  agents: number;
  shootsPerWeek: number;
};

const defaultValues: CalculatorValues = {
  pricePerShoot: 150,
  listingsPerAgent: 15,
  agents: 5,
  shootsPerWeek: 3,
};

const sliderConfig = [
  {
    key: "pricePerShoot",
    label: "Average Price Per Shoot",
    helper: "What do you typically charge per listing? Starting example: $150",
    min: 50,
    max: 500,
    step: 5,
    format: (value: number) => `$${value}`,
  },
  {
    key: "listingsPerAgent",
    label: "Average Listings Per Agent Per Year",
    helper: "Most active agents list 10–30 homes per year.",
    min: 1,
    max: 40,
    step: 1,
    format: (value: number) => `${value}`,
  },
  {
    key: "agents",
    label: "Number of Agents You Work With",
    helper: "How many agent relationships are currently active in your business?",
    min: 1,
    max: 50,
    step: 1,
    format: (value: number) => `${value}`,
  },
  {
    key: "shootsPerWeek",
    label: "Average Shoots Per Week",
    helper: "Set your current or target weekly shoot volume.",
    min: 1,
    max: 20,
    step: 1,
    format: (value: number) => `${value}`,
  },
] as const;

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

export default function BusinessCalculator() {
  const [values, setValues] = useState<CalculatorValues>(defaultValues);

  const calculations = useMemo(() => {
    const weeklyRevenue = values.pricePerShoot * values.shootsPerWeek;
    const monthlyRevenue = weeklyRevenue * WEEKS_PER_MONTH;
    const yearlyRevenue = monthlyRevenue * MONTHS_PER_YEAR;
    const annualListingsFromAgents = values.listingsPerAgent * values.agents;
    const marketRevenueFromAgentBase = annualListingsFromAgents * values.pricePerShoot;
    const agentsNeededForWeeklyGoal = Math.ceil((values.shootsPerWeek * WEEKS_PER_YEAR) / values.listingsPerAgent);
    const shootsNeededForSelectedAgents = annualListingsFromAgents / WEEKS_PER_YEAR;
    const tenAgentShootsPerYear = values.listingsPerAgent * 10;
    const tenAgentRevenue = tenAgentShootsPerYear * values.pricePerShoot;
    const twentyAgentRevenue = values.listingsPerAgent * 20 * values.pricePerShoot;

    return {
      weeklyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      annualListingsFromAgents,
      marketRevenueFromAgentBase,
      agentsNeededForWeeklyGoal,
      shootsNeededForSelectedAgents,
      tenAgentShootsPerYear,
      tenAgentRevenue,
      twentyAgentRevenue,
    };
  }, [values]);

  const handleChange = (key: keyof CalculatorValues, value: number) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <HeroParticles />
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>The Real Estate Photography Business Calculator</span>
            <h1>How Much Could You Earn Shooting Real Estate in Your City?</h1>
            <p className={styles.subheadline}>
              Use this free calculator to estimate your potential real estate photography income.
            </p>

            <div className={styles.purposeGrid}>
              <div className={styles.purposeItem}>Potential revenue in your market</div>
              <div className={styles.purposeItem}>How many agents you actually need</div>
              <div className={styles.purposeItem}>How many shoots per week your business can support</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.calculatorSection}>
        <div className="container">
          <div className={styles.calculatorLayout}>
            <div className={styles.inputCard}>
              <h2>Calculator Inputs</h2>
              <div className={styles.sliderList}>
                {sliderConfig.map((field) => {
                  const value = values[field.key];

                  return (
                    <div key={field.key} className={styles.sliderGroup}>
                      <div className={styles.sliderHeader}>
                        <div>
                          <h3>{field.label}</h3>
                          <p>{field.helper}</p>
                        </div>
                        <span className={styles.sliderValue}>{field.format(value)}</span>
                      </div>

                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={value}
                        onChange={(event) => handleChange(field.key, Number(event.target.value))}
                        className={styles.slider}
                        aria-label={field.label}
                      />

                      <div className={styles.sliderScale}>
                        <span>{field.format(field.min)}</span>
                        <span>{field.format(field.max)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.outputColumn}>
              <div className={styles.outputCard}>
                <h2>Revenue Estimate</h2>
                <div className={styles.outputGrid}>
                  <div className={styles.outputItem}>
                    <span className={styles.outputLabel}>Weekly revenue</span>
                    <strong>{formatCurrency(calculations.weeklyRevenue)}</strong>
                  </div>
                  <div className={styles.outputItem}>
                    <span className={styles.outputLabel}>Monthly revenue</span>
                    <strong>{formatCurrency(calculations.monthlyRevenue)}</strong>
                  </div>
                  <div className={styles.outputItem}>
                    <span className={styles.outputLabel}>Yearly revenue</span>
                    <strong>{formatCurrency(calculations.yearlyRevenue)}</strong>
                  </div>
                </div>
              </div>

              <div className={styles.outputCard}>
                <h2>Business Math</h2>
                <div className={styles.outputGrid}>
                  <div className={styles.outputItem}>
                    <span className={styles.outputLabel}>Annual listings from your current agents</span>
                    <strong>{formatNumber(calculations.annualListingsFromAgents)}</strong>
                  </div>
                  <div className={styles.outputItem}>
                    <span className={styles.outputLabel}>Agents needed for your weekly goal</span>
                    <strong>{formatNumber(calculations.agentsNeededForWeeklyGoal)}</strong>
                  </div>
                  <div className={styles.outputItem}>
                    <span className={styles.outputLabel}>Shoots per week supported by your agent base</span>
                    <strong>{formatNumber(calculations.shootsNeededForSelectedAgents)}</strong>
                  </div>
                  <div className={`${styles.outputItem} ${styles.outputHighlight}`}>
                    <span className={styles.outputLabel}>Annual revenue from your current agent base</span>
                    <strong>{formatCurrency(calculations.marketRevenueFromAgentBase)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.conversionSection}>
        <div className="container">
          <div className={styles.conversionCard}>
            <div className={styles.conversionHeader}>
              <h2>Opportunity in Your Market</h2>
              <p>
                If you worked with 10 active agents who list {values.listingsPerAgent} homes per year:
              </p>
            </div>

            <div className={styles.opportunityGrid}>
              <div className={styles.opportunityItem}>
                <span className={styles.outputLabel}>Potential shoots per year</span>
                <strong>{formatNumber(calculations.tenAgentShootsPerYear)}</strong>
              </div>
              <div className={styles.opportunityItem}>
                <span className={styles.outputLabel}>Potential revenue</span>
                <strong>{formatCurrency(calculations.tenAgentRevenue)}</strong>
              </div>
              <div className={`${styles.opportunityItem} ${styles.opportunityHighlight}`}>
                <span className={styles.outputLabel}>If you worked with 20 agents</span>
                <strong>{formatCurrency(calculations.twentyAgentRevenue)}+</strong>
              </div>
            </div>

            <div className={styles.insightSection}>
              <div className={styles.insightCard}>
                <h3>Key Insight</h3>
                <p>
                  Most real estate photographers don&apos;t need hundreds of clients. They only need 10–20 active agents.
                </p>
              </div>

              <div className={styles.systemCard}>
                <h3>How Photographers Reach This Level</h3>
                <div className={styles.systemSteps}>
                  <div className={styles.systemStep}><span>1️⃣</span><p>Find agents listing homes in your city</p></div>
                  <div className={styles.systemStep}><span>2️⃣</span><p>Introduce your services</p></div>
                  <div className={styles.systemStep}><span>3️⃣</span><p>Follow up consistently</p></div>
                  <div className={styles.systemStep}><span>4️⃣</span><p>Build long-term relationships</p></div>
                </div>
                <p className={styles.systemNote}>
                  When this process becomes a system, bookings become predictable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2>Ready to build the system behind these numbers?</h2>
            <p>
              Inside the community I show photographers the systems used to find agents, get bookings, and grow their photography business.
            </p>
            <Link href="/join" className="btn btn-cta-primary">
              Join the Free Real Estate Photographer Community
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}