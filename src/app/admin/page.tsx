import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className={styles.adminPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button type="submit" className={styles.logoutBtn}>
              <i className="fas fa-sign-out-alt"></i>
              Sign Out
            </button>
          </form>
        </div>

        <p className={styles.welcome}>
          Welcome back, <strong>{session.user.name}</strong> ({session.user.email})
        </p>

        <div className={styles.grid}>
          <Link href="/admin/markets" className={styles.card} style={{ textDecoration: "none" }}>
            <div className={styles.cardIcon}>📊</div>
            <h2 className={styles.cardTitle}>Markets</h2>
            <p className={styles.cardDescription}>
              Manage real estate markets, regions, and coverage areas.
            </p>
          </Link>

          <div className={styles.card}>
            <div className={styles.cardIcon}>👥</div>
            <span className={styles.badge}>Coming Soon</span>
            <h2 className={styles.cardTitle}>Users</h2>
            <p className={styles.cardDescription}>
              View and manage user accounts and permissions.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>⚙️</div>
            <span className={styles.badge}>Coming Soon</span>
            <h2 className={styles.cardTitle}>Settings</h2>
            <p className={styles.cardDescription}>
              Configure application settings and integrations.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

