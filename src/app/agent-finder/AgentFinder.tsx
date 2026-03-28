"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import HeroParticles from "@/components/HeroParticles";
import styles from "./page.module.css";
import type { AgentFinderJobView, AgentFinderMarketOption, ListingProviderValue } from "@/lib/agent-finder/contracts";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

type MarketResponse = { markets: AgentFinderMarketOption[] };

type ProgressMeta = {
  progress: number;
  label: string;
  detail: string;
};

const STAGE_PROGRESS: Record<string, ProgressMeta> = {
  waiting: { progress: 0, label: "Waiting to start", detail: "Ready to launch a new Agent Finder job." },
  queued: { progress: 5, label: "Queued", detail: "The job has been created and is waiting to start." },
  scraping_listings: { progress: 18, label: "Scraping leads", detail: "Pulling recent listing data from the selected provider." },
  normalizing_listings: { progress: 32, label: "Normalizing listings", detail: "Splitting listings into clean agent and brokerage lead records." },
  deterministic_lookup: { progress: 52, label: "Checking websites", detail: "Looking for emails on the listing page, brokerage site, and agent site." },
  perplexity_enrichment: { progress: 68, label: "Enriching with Perplexity", detail: "Searching public web sources for missing business emails." },
  uproc_enrichment: { progress: 80, label: "Enriching with uProc", detail: "Running uProc email enrichment for any remaining missing emails." },
  email_verification: { progress: 90, label: "Verifying emails", detail: "Checking found email addresses before ranking the results." },
  dedupe_and_rank: { progress: 97, label: "Finalizing results", detail: "Deduplicating leads and ranking the best results." },
  completed: { progress: 100, label: "Completed", detail: "The Agent Finder job finished successfully." },
  failed: { progress: 100, label: "Failed", detail: "The Agent Finder job stopped before it could finish." },
};

const providerLabels: Record<ListingProviderValue, string> = {
  REALTOR_CA: "Realtor.ca",
  REALTOR_COM: "Realtor.com",
  ZILLOW: "Zillow",
};

const TABLE_COLUMNS = ["First Name", "Last Name", "Brokerage", "Email", "Phone", "Listing Url", "Listing Address", "Listed"];

const SKELETON_CELL_WIDTHS = ["5.5rem", "5.5rem", "10rem", "14rem", "8rem", "7rem", "12rem", "6rem"];

const HOW_IT_WORKS_STEPS = [
  {
    title: "Choose your source",
    detail: "Pick a market or paste a custom search URL.",
  },
  {
    title: "Run the finder",
    detail: "We scrape listings and turn them into agent leads.",
  },
  {
    title: "Export your shortlist",
    detail: "Review the results and export your CSV.",
  },
] as const;

const INSTRUCTION_VIDEOS: Record<string, { src: string; poster: string; title: string }> = {
  US: {
    src: "https://repmkt.s3.ca-central-1.amazonaws.com/repmkt-videos/Agent-Finder-Tool-Realtor-COM.mp4",
    poster: "https://repmkt.s3.ca-central-1.amazonaws.com/repmkt-videos/Agent-Finder-Tool-US.jpg",
    title: "How to find a Realtor.com search URL",
  },
  CA: {
    src: "https://repmkt.s3.ca-central-1.amazonaws.com/repmkt-videos/Agent-Finder-Tool-Realtor-CA.mp4",
    poster: "https://repmkt.s3.ca-central-1.amazonaws.com/repmkt-videos/Agent-Finder-Tool-CA.jpg",
    title: "How to find a Realtor.ca search URL",
  },
};

function getProgressMeta(job: AgentFinderJobView | null, loading: boolean): ProgressMeta {
  if (!job) {
    return loading ? STAGE_PROGRESS.queued : STAGE_PROGRESS.waiting;
  }

  const stage = String(job.resultSummary?.stage ?? (job.status === "FAILED" ? "failed" : "queued")).toLowerCase();
  return STAGE_PROGRESS[stage] ?? STAGE_PROGRESS.queued;
}

function formatPhone(value: string | null) {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  // Format 10-digit numbers as XXX-XXX-XXXX
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  // Format 11-digit numbers starting with 1 as X-XXX-XXX-XXXX
  if (digits.length === 11 && digits[0] === "1") {
    return `${digits[0]}-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  // Already formatted or other format — return as-is
  return value;
}

function formatListed(value: string | null) {
  if (!value) return "";
  // If it already looks like relative text (e.g. "2 hours ago"), return as-is
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return value;
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return value;
  const diff = Date.now() - then;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function formatStreetAddress(value: string | null) {
  if (!value) {
    return "";
  }

  return value.split(",")[0]?.trim() ?? value;
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 5h5v5" />
      <path d="M10 14 19 5" />
      <path d="M19 14v5h-14v-14h5" />
    </svg>
  );
}

function buildCsv(job: AgentFinderJobView): string {
  const rows = [
    ["First Name", "Last Name", "Brokerage", "Email", "Phone", "Listing Url", "Listing Address", "Listed"],
    ...job.leads.map((lead) => [lead.firstName ?? "", lead.lastName ?? "", lead.brokerageName ?? "", lead.email ?? "", formatPhone(lead.phone), lead.listingUrl ?? "", lead.listingAddress ?? "", formatListed(lead.listed)]),
  ];
  return rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
}

function getCsvFilename(job: AgentFinderJobView): string {
  return `${(job.city || job.countryCode).toLowerCase().replace(/\s+/g, "-")}-agent-finder.csv`;
}

function triggerDownload(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function executeRecaptcha(siteKey: string, action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error("reCAPTCHA not loaded"));
      return;
    }
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(siteKey, { action }).then(resolve, reject);
    });
  });
}

export default function AgentFinder({ recaptchaSiteKey }: { recaptchaSiteKey: string }) {
  const [markets, setMarkets] = useState<AgentFinderMarketOption[]>([]);
  const [mode, setMode] = useState<"MARKET" | "CUSTOM_URL">("MARKET");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [regionCode, setRegionCode] = useState("");
  const [city, setCity] = useState("");
  const [maxListings, setMaxListings] = useState(10);
  const [job, setJob] = useState<AgentFinderJobView | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showExportGate, setShowExportGate] = useState(false);
  const [exportFirstName, setExportFirstName] = useState("");
  const [exportEmail, setExportEmail] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const progressMeta = getProgressMeta(job, loading);
  const videoInfo = INSTRUCTION_VIDEOS[countryCode] ?? INSTRUCTION_VIDEOS.US;
  const showProgress = loading || Boolean(job);
  const hasLeads = Boolean(job?.leads.length);
  const showResultsShell = loading || Boolean(job);
  const showSkeleton = showResultsShell && !hasLeads && job?.status !== "FAILED" && job?.status !== "COMPLETED";
  const showEmptyState = Boolean(job) && !hasLeads && !showSkeleton;

  // Cascading filter options
  const countries = useMemo(() => [...new Set(markets.map((m) => m.countryCode))].sort(), [markets]);
  const regions = useMemo(() => [...new Set(markets.filter((m) => m.countryCode === selectedCountry).map((m) => m.regionCode))].sort(), [markets, selectedCountry]);
  const cities = useMemo(() => [...new Set(markets.filter((m) => m.countryCode === selectedCountry && m.regionCode === selectedRegion).map((m) => m.city))].sort(), [markets, selectedCountry, selectedRegion]);
  const selectedMarket = useMemo(() => markets.find((m) => m.countryCode === selectedCountry && m.regionCode === selectedRegion && m.city === selectedCity) ?? null, [markets, selectedCountry, selectedRegion, selectedCity]);

  useEffect(() => {
    fetch("/api/agent-finder/markets")
      .then((response) => response.json())
      .then((data: MarketResponse) => {
        setMarkets(data.markets);
        if (data.markets[0]) {
          setSelectedCountry(data.markets[0].countryCode);
          setSelectedRegion(data.markets[0].regionCode);
          setSelectedCity(data.markets[0].city);
        }
      })
      .catch(() => setError("Unable to load supported markets."));
  }, []);

  useEffect(() => {
    if (!jobId) {
      return;
    }

    let cancelled = false;
    let timeoutId: number | null = null;

    const poll = async () => {
      const response = await fetch(`/api/agent-finder/jobs/${jobId}`, { cache: "no-store" });
      if (!response.ok || cancelled) {
        return;
      }
      const payload = (await response.json()) as AgentFinderJobView;
      if (cancelled) {
        return;
      }
      setJob(payload);
      if (payload.status === "COMPLETED" || payload.status === "FAILED") {
        setLoading(false);
        return;
      }

      timeoutId = window.setTimeout(() => void poll(), 2500);
    };

    void poll();
    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [jobId]);

  const previewLocation = useMemo(() => {
    if (mode === "MARKET" && selectedMarket) {
      return [selectedMarket.city, selectedMarket.regionCode].filter(Boolean).join(", ");
    }
    const parts = [city, regionCode].filter(Boolean).join(", ");
    return parts || (countryCode === "CA" ? "Canada" : "United States");
  }, [city, countryCode, mode, regionCode, selectedMarket]);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    const firstRegion = markets.find((m) => m.countryCode === value)?.regionCode ?? "";
    setSelectedRegion(firstRegion);
    const firstCity = markets.find((m) => m.countryCode === value && m.regionCode === firstRegion)?.city ?? "";
    setSelectedCity(firstCity);
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    const firstCity = markets.find((m) => m.countryCode === selectedCountry && m.regionCode === value)?.city ?? "";
    setSelectedCity(firstCity);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setJob(null);

    if (mode === "MARKET" && !selectedMarket) {
      setLoading(false);
      setError("Please choose a supported market.");
      return;
    }

    // Get reCAPTCHA token
    let recaptchaToken = "";
    try {
      recaptchaToken = await executeRecaptcha(recaptchaSiteKey, "find_agents");
    } catch {
      setLoading(false);
      setError("reCAPTCHA verification failed. Please refresh and try again.");
      return;
    }

    const requestBody =
      mode === "MARKET"
        ? {
            mode,
            marketId: selectedMarket!.id,
            maxListings,
            countryCode: selectedMarket!.countryCode,
            regionCode: selectedMarket!.regionCode,
            city: selectedMarket!.city,
            recaptchaToken,
          }
        : {
            mode,
            provider: countryCode === "CA" ? "REALTOR_CA" : "REALTOR_COM",
            customStartUrl: customUrl,
            maxListings,
            countryCode,
            regionCode,
            city,
            recaptchaToken,
          };

    const response = await fetch("/api/agent-finder/jobs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const payload = await response.json();
    if (!response.ok) {
      setLoading(false);
      setError(payload.error || "Unable to start Agent Finder job.");
      return;
    }

    setJobId(payload.jobId);
    setTimeout(() => {
      if (resultsRef.current) {
        const top = resultsRef.current.getBoundingClientRect().top + window.scrollY - 250;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100);
  };

  const handleExport = async () => {
    if (!job || !exportFirstName.trim() || !exportEmail.trim()) return;
    setExporting(true);
    try {
      const csv = buildCsv(job);
      const filename = getCsvFilename(job);

      // Get reCAPTCHA token
      let recaptchaToken = "";
      try {
        recaptchaToken = await executeRecaptcha(recaptchaSiteKey, "export_csv");
      } catch {
        alert("reCAPTCHA verification failed. Please refresh and try again.");
        setExporting(false);
        return;
      }

      const res = await fetch("/api/agent-finder/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: exportFirstName, email: exportEmail, csv, filename, recaptchaToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Export failed.");
        setExporting(false);
        return;
      }

      // Trigger direct download in browser
      triggerDownload(csv, filename);
      setShowExportGate(false);
      setExportDone(true);
      setTimeout(() => setExportDone(false), 3000);
    } catch {
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
    <Script src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`} strategy="afterInteractive" />
    <main className={styles.page}>
      <section className={styles.hero}>
        <HeroParticles />
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Demo Tool</span>
            <h1>Agent Finder Tool</h1>
            <p className={styles.subheadline}>
              Find recently active agents in a supported market, enrich contact data, verify emails, and export a ranked lead list.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.layout}>
            <form className={`${styles.card} ${styles.formCard}`} onSubmit={handleSubmit}>
              <div className={styles.modeSwitch}>
                <button type="button" className={mode === "MARKET" ? styles.modeActive : styles.modeButton} onClick={() => setMode("MARKET")}>Supported market</button>
                <button type="button" className={mode === "CUSTOM_URL" ? styles.modeActive : styles.modeButton} onClick={() => setMode("CUSTOM_URL")}>Paste custom URL</button>
              </div>

              {mode === "MARKET" ? (
                <>
                  <label className={styles.field}>
                    <span>Country</span>
                    <select value={selectedCountry} onChange={(e) => handleCountryChange(e.target.value)}>
                      <option value="" disabled>Select country</option>
                      {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>State / Province</span>
                    <select value={selectedRegion} onChange={(e) => handleRegionChange(e.target.value)} disabled={!selectedCountry}>
                      <option value="" disabled>Select state / province</option>
                      {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>City</span>
                    <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedRegion}>
                      <option value="" disabled>Select city</option>
                      {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                  <p className={styles.fieldHint}>We add support for new markets all the time. If you don&apos;t see your market, please use the custom URL option.</p>
                </>
              ) : (
                <>
                  <label className={styles.field}>
                    <span>Country</span>
                    <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                  </label>
                  <div className={styles.fieldGrid}>
                    <label className={styles.field}><span>State / Province</span><input value={regionCode} onChange={(e) => setRegionCode(e.target.value)} /></label>
                    <label className={styles.field}><span>City</span><input value={city} onChange={(e) => setCity(e.target.value)} /></label>
                  </div>
                  <label className={styles.field}>
                    <span className={styles.fieldLabelRow}>
                      Search URL
                      <button type="button" className={styles.helpLink} onClick={() => setShowVideoModal(true)}>
                        <i className="fas fa-play-circle" aria-hidden="true"></i> How to find the search URL
                      </button>
                    </span>
                    <textarea rows={5} value={customUrl} onChange={(event) => setCustomUrl(event.target.value)} />
                  </label>
                </>
              )}

              <label className={styles.field}>
                <span>Max listings</span>
                <select value={maxListings} onChange={(e) => setMaxListings(Number(e.target.value))}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </label>
              {maxListings > 10 && <p className={styles.fieldWarning}>Please note, selecting more than 10 listings will result in longer processing times.</p>}

              <div className={styles.formActions}>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Running…" : "Find Agents"}</button>
                {error ? <p className={styles.error}>{error}</p> : null}
              </div>
            </form>

            <div className={`${styles.card} ${styles.infoCard}`}>
              <div className={styles.infoHeader}>
                <span className={styles.infoEyebrow}>How It Works</span>
                <h2 className={styles.cardTitle}>Find active agent leads without manual prospecting</h2>
                <p className={styles.cardIntro}>
                  Choose a source, run the search, and export your leads.
                </p>
              </div>

              <ol className={styles.stepsList}>
                {HOW_IT_WORKS_STEPS.map((step) => (
                  <li key={step.title} className={styles.stepItem}>
                    <strong>{step.title}</strong>
                    <p>{step.detail}</p>
                  </li>
                ))}
              </ol>

              {mode === "CUSTOM_URL" && (
                <div className={styles.infoVideo}>
                  <h3 className={styles.infoVideoTitle}>{videoInfo.title}</h3>
                  <video controls preload="none" poster={videoInfo.poster} className={styles.infoVideoPlayer}>
                    <source src={videoInfo.src} type="video/mp4" />
                  </video>
                </div>
              )}
            </div>
          </div>

          {showProgress ? (
            <div ref={resultsRef} className={`${styles.card} ${styles.progressCard}`}>
              <div className={styles.statusBox}>
                <div className={styles.progressHeader}>
                  <strong>{progressMeta.label}</strong>
                  <span>{progressMeta.progress}%</span>
                </div>
                <div className={styles.progressTrack} aria-hidden="true">
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progressMeta.progress}%` }}
                  />
                </div>
                <p className={styles.progressDetail}>{progressMeta.detail}</p>
              </div>
            </div>
          ) : null}

          {showResultsShell ? (
            <div className={styles.resultsCard}>
              <div className={styles.resultsHeader}>
                <div>
                  <h2>{job ? `Results for ${[job.city, job.regionCode].filter(Boolean).join(", ") || job.countryCode}` : previewLocation ? `Results for ${previewLocation}` : "Results"}</h2>
                  <p>{job ? `${job.leads.length} leads · ${providerLabels[job.provider]}` : "Live results will appear here as soon as leads start coming in."}</p>
                </div>
                {hasLeads && job ? <button className="btn btn-outline" onClick={() => { setExportDone(false); setShowExportGate(true); }}>Export CSV</button> : null}
              </div>

              {job?.status === "FAILED" ? <p className={styles.error}>{job.errorMessage}</p> : null}

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {TABLE_COLUMNS.map((column) => (
                        <th key={column}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {showSkeleton
                      ? Array.from({ length: 6 }).map((_, rowIndex) => (
                          <tr key={`skeleton-${rowIndex}`} className={styles.skeletonRow}>
                            {TABLE_COLUMNS.map((column, columnIndex) => (
                              <td key={`${column}-${rowIndex}`}>
                                <span className={styles.skeletonBlock} style={{ width: SKELETON_CELL_WIDTHS[columnIndex] }} />
                              </td>
                            ))}
                          </tr>
                        ))
                      : hasLeads && job
                        ? job.leads.map((lead) => (
                            <tr key={lead.id}>
                              <td>{lead.firstName ?? ""}</td>
                              <td>{lead.lastName ?? ""}</td>
                              <td>{lead.brokerageName ?? ""}</td>
                              <td className={`${styles.cellNoWrap} ${styles.noSelect}`}>{lead.email ?? ""}</td>
                              <td className={`${styles.cellNoWrap} ${styles.noSelect}`}>{formatPhone(lead.phone)}</td>
                              <td>
                                {lead.listingUrl ? (
                                  <a className={styles.linkButton} href={lead.listingUrl} target="_blank" rel="noreferrer">
                                    <span>View listing</span>
                                    <ExternalLinkIcon />
                                  </a>
                                ) : (
                                  ""
                                )}
                              </td>
                              <td>{formatStreetAddress(lead.listingAddress)}</td>
                              <td className={styles.cellNoWrap}>{formatListed(lead.listed)}</td>
                            </tr>
                          ))
                        : showEmptyState
                          ? (
                              <tr>
                                <td className={styles.emptyState} colSpan={TABLE_COLUMNS.length}>
                                  {job?.status === "FAILED"
                                    ? "This run stopped before any leads could be returned."
                                    : "No leads were returned for this search. Try another market, URL, or listing limit."}
                                </td>
                              </tr>
                            )
                          : null}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

        </div>
      </section>

      {showResultsShell ? (
        <section className={styles.leadsToClients}>
          <div className={styles.leadsContainer}>
            <div className={styles.leadsHeader}>
              <span className={styles.sectionBadge}>THE NEXT STEP</span>
              <h2 className={styles.leadsHeadline}>You Found the Agents.<br />Now What?</h2>
              <p className={styles.leadsSubheadline}>
                Right now, you&apos;re looking at agents who are actively listing properties in your market.<br />
                These are <strong>real opportunities</strong> — not random leads.
              </p>
              <div className={styles.demoNote}>
                <i className="fas fa-info-circle" aria-hidden="true"></i> This is just a demo.
              </div>
            </div>

            <div className={styles.leadsCards}>
              <div className={styles.valueCard}>
                <div className={styles.cardIcon}><i className="fas fa-robot" aria-hidden="true"></i></div>
                <h3>Build the System</h3>
                <p>Reach out to agents automatically — no manual cold calls, no spreadsheets.</p>
              </div>
              <div className={styles.valueCard}>
                <div className={styles.cardIcon}><i className="fas fa-comment-dots" aria-hidden="true"></i></div>
                <h3>Get Real Responses</h3>
                <p>Messages that feel helpful, not spammy. Agents actually reply.</p>
              </div>
              <div className={styles.valueCard}>
                <div className={styles.cardIcon}><i className="fas fa-handshake" aria-hidden="true"></i></div>
                <h3>Turn Leads Into Clients</h3>
                <p>From first booking to repeat work. Build long‑term relationships.</p>
              </div>
            </div>

            <div className={styles.promiseRow}>
              <i className="fas fa-chart-line" aria-hidden="true"></i>
              <span>You already have the leads. Now it&apos;s time to turn them into bookings.</span>
            </div>

            <div className={styles.leadsCta}>
              <p className={styles.ctaPretext}>
                If you want to build a system that consistently brings you new clients (without chasing or guessing),<br />
                that&apos;s exactly what we focus on inside the <strong>free Skool community</strong> for real estate photographers.
              </p>
              <a className="btn btn-primary" href="https://www.skool.com/repmkt/" target="_blank" rel="noreferrer">
                Join Free &amp; Get The Full System →
              </a>
              <p className={styles.ctaFootnote}>
                <i className="fas fa-users" aria-hidden="true"></i> Join photographers already building their client pipeline
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {showVideoModal && (
        <div className={styles.videoModal} onClick={() => setShowVideoModal(false)}>
          <div className={styles.videoModalContent} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.videoModalClose} onClick={() => setShowVideoModal(false)} aria-label="Close">&times;</button>
            <h3>{videoInfo.title}</h3>
            <video controls autoPlay poster={videoInfo.poster} className={styles.videoModalPlayer}>
              <source src={videoInfo.src} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {showExportGate && (
        <div className={styles.videoModal} onClick={() => setShowExportGate(false)}>
          <div className={styles.videoModalContent} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.videoModalClose} onClick={() => setShowExportGate(false)} aria-label="Close">&times;</button>
            <h3>Download Your Leads</h3>
            <p className={styles.gateSubtext}>Enter your name and email to download the CSV file.</p>
            <div className={styles.gateForm}>
              <label className={styles.field}>
                <span>First Name</span>
                <input value={exportFirstName} onChange={(e) => setExportFirstName(e.target.value)} placeholder="Your first name" />
              </label>
              <label className={styles.field}>
                <span>Email</span>
                <input type="email" value={exportEmail} onChange={(e) => setExportEmail(e.target.value)} placeholder="you@example.com" />
              </label>
              <button className="btn btn-primary" disabled={exporting || !exportFirstName.trim() || !exportEmail.trim()} onClick={handleExport}>
                {exporting ? "Processing…" : "Download CSV"}
              </button>
            </div>
          </div>
        </div>
      )}

      {exportDone && (
        <div className={styles.videoModal} onClick={() => setExportDone(false)}>
          <div className={`${styles.videoModalContent} ${styles.exportConfirmation}`} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.videoModalClose} onClick={() => setExportDone(false)} aria-label="Close">&times;</button>
            <p className={styles.confirmLine}>✅ Download completed!</p>
            <p className={styles.confirmLine}>📩 We also sent the file to your email.</p>
            <p className={styles.confirmLine}>Thank you for using our tool!</p>
          </div>
        </div>
      )}
    </main>
    </>
  );
}