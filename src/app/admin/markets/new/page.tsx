import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MarketForm } from "../MarketForm";
import styles from "../page.module.css";

export default async function NewMarketPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Link href="/admin/markets" className={styles.backLink}>
              <i className="fas fa-arrow-left"></i> Markets
            </Link>
            <h1 className={styles.title}>Add Market</h1>
          </div>
        </div>

        <MarketForm />
      </div>
    </main>
  );
}

