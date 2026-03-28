"use client";

import { useRouter } from "next/navigation";
import { toggleMarketActive } from "@/lib/actions/markets";
import styles from "./page.module.css";

export function ToggleActiveButton({
  marketId,
  isActive,
}: {
  marketId: string;
  isActive: boolean;
}) {
  const router = useRouter();

  async function handleClick() {
    await toggleMarketActive(marketId);
    router.refresh();
  }

  return (
    <button className={styles.actionBtn} onClick={handleClick}>
      {isActive ? "Deactivate" : "Activate"}
    </button>
  );
}

