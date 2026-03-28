"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LISTING_PROVIDERS } from "@/lib/agent-finder/contracts";
import { createMarket, updateMarket } from "@/lib/actions/markets";
import styles from "./page.module.css";

type MarketData = {
  id?: string;
  label: string;
  countryCode: string;
  regionCode: string;
  city: string;
  provider: string;
  startUrl: string;
  isActive: boolean;
};

export function MarketForm({ market }: { market?: MarketData }) {
  const router = useRouter();
  const isEditing = !!market?.id;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = isEditing
      ? await updateMarket(market!.id!, formData)
      : await createMarket(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/admin/markets");
  }

  return (
    <div className={styles.formCard}>
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldGroup}>
          <label htmlFor="label" className={styles.label}>Label</label>
          <input
            id="label"
            name="label"
            type="text"
            required
            className={styles.input}
            defaultValue={market?.label || ""}
            placeholder="e.g. Toronto, ON"
          />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label htmlFor="countryCode" className={styles.label}>Country Code</label>
            <input
              id="countryCode"
              name="countryCode"
              type="text"
              required
              maxLength={2}
              className={styles.input}
              defaultValue={market?.countryCode || ""}
              placeholder="CA"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="regionCode" className={styles.label}>Region Code</label>
            <input
              id="regionCode"
              name="regionCode"
              type="text"
              required
              maxLength={5}
              className={styles.input}
              defaultValue={market?.regionCode || ""}
              placeholder="ON"
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="city" className={styles.label}>City</label>
          <input
            id="city"
            name="city"
            type="text"
            required
            className={styles.input}
            defaultValue={market?.city || ""}
            placeholder="Toronto"
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="provider" className={styles.label}>Listing Provider</label>
          <select
            id="provider"
            name="provider"
            required
            className={styles.select}
            defaultValue={market?.provider || ""}
          >
            <option value="">Select a provider…</option>
            {LISTING_PROVIDERS.map((p) => (
              <option key={p} value={p}>
                {p.replace(/_/g, ".")}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="startUrl" className={styles.label}>Start URL</label>
          <input
            id="startUrl"
            name="startUrl"
            type="url"
            required
            className={styles.input}
            defaultValue={market?.startUrl || ""}
            placeholder="https://www.realtor.ca/..."
          />
        </div>

        {isEditing && (
          <div className={styles.checkboxGroup}>
            <input
              id="isActive"
              name="isActive"
              type="hidden"
              value={market?.isActive ? "true" : "false"}
            />
            <input
              id="isActiveCheckbox"
              type="checkbox"
              defaultChecked={market?.isActive}
              onChange={(e) => {
                const hidden = document.getElementById("isActive") as HTMLInputElement;
                hidden.value = e.target.checked ? "true" : "false";
              }}
            />
            <label htmlFor="isActiveCheckbox" className={styles.label}>Active</label>
          </div>
        )}

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Saving…" : isEditing ? "Save Changes" : "Create Market"}
          </button>
          <a href="/admin/markets" className={styles.cancelBtn}>
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}

