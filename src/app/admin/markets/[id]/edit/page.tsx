import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getMarketById } from "@/lib/actions/markets";
import { MarketForm } from "../../MarketForm";
import styles from "../../page.module.css";

export default async function EditMarketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Link href="/admin/markets" className={styles.backLink}>
              <i className="fas fa-arrow-left"></i> Markets
            </Link>
            <h1 className={styles.title}>Edit Market</h1>
          </div>
        </div>

        <MarketForm
          market={{
            id: market.id,
            label: market.label,
            countryCode: market.countryCode,
            regionCode: market.regionCode,
            city: market.city,
            provider: market.provider,
            startUrl: market.startUrl,
            isActive: market.isActive,
          }}
        />
      </div>
    </main>
  );
}

