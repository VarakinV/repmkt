import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getMarkets } from "@/lib/actions/markets";
import { ToggleActiveButton } from "./ToggleActiveButton";
import styles from "./page.module.css";

export default async function MarketsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const markets = await getMarkets();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Link href="/admin" className={styles.backLink}>
              <i className="fas fa-arrow-left"></i> Dashboard
            </Link>
            <h1 className={styles.title}>Markets</h1>
          </div>
          <div className={styles.headerActions}>
            <Link href="/admin/markets/new" className={styles.addBtn}>
              <i className="fas fa-plus"></i> Add Market
            </Link>
          </div>
        </div>

        {markets.length === 0 ? (
          <div className={styles.empty}>
            <p>No markets yet. Add your first market to get started.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Label</th>
                <th>Country</th>
                <th>Region</th>
                <th>City</th>
                <th>Provider</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((market) => (
                <tr key={market.id}>
                  <td>{market.label}</td>
                  <td>{market.countryCode}</td>
                  <td>{market.regionCode}</td>
                  <td>{market.city}</td>
                  <td>
                    <span className={styles.providerBadge}>
                      {market.provider.replace(/_/g, ".")}
                    </span>
                  </td>
                  <td>
                    <span className={market.isActive ? styles.statusActive : styles.statusInactive}>
                      {market.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/markets/${market.id}/edit`}
                        className={styles.actionBtn}
                      >
                        Edit
                      </Link>
                      <ToggleActiveButton
                        marketId={market.id}
                        isActive={market.isActive}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

