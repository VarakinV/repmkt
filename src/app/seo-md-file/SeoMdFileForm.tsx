"use client";

import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
};

type FieldName = keyof FormValues;
type FieldErrors = Partial<Record<FieldName, string>>;
type RecaptchaWindow = Window & {
  grecaptcha?: {
    ready: (cb: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
  };
};

const emptyForm: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  businessName: "",
};

const fieldLabels: Record<FieldName, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  businessName: "Business Name",
};

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function validateField(name: FieldName, value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return `${fieldLabels[name]} is required.`;
  }

  if (name === "email") {
    return emailPattern.test(trimmed) ? "" : "Please enter a valid email address.";
  }

  if (trimmed.length < 2) {
    return `${fieldLabels[name]} must be at least 2 characters.`;
  }

  return "";
}

function validateForm(values: FormValues): FieldErrors {
  return (Object.keys(values) as FieldName[]).reduce<FieldErrors>((errors, fieldName) => {
    const error = validateField(fieldName, values[fieldName]);

    if (error) {
      errors[fieldName] = error;
    }

    return errors;
  }, {});
}

function executeRecaptcha(siteKey: string, action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const recaptcha = (window as RecaptchaWindow).grecaptcha;

    if (!recaptcha) {
      reject(new Error("reCAPTCHA not loaded"));
      return;
    }

    recaptcha.ready(() => {
      recaptcha.execute(siteKey, { action }).then(resolve, reject);
    });
  });
}

export default function SeoMdFileForm({ recaptchaSiteKey }: { recaptchaSiteKey: string }) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isSubmitting = status === "submitting";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as FieldName;

    setValues((current) => ({ ...current, [fieldName]: value }));

    if (errors[fieldName]) {
      setErrors((current) => ({
        ...current,
        [fieldName]: validateField(fieldName, value),
      }));
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const fieldName = event.target.name as FieldName;
    setErrors((current) => ({
      ...current,
      [fieldName]: validateField(fieldName, event.target.value),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(values);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setMessage("Please fix the highlighted fields and try again.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      if (!recaptchaSiteKey) {
        throw new Error("reCAPTCHA is not configured. Please try again later.");
      }

      const recaptchaToken = await executeRecaptcha(recaptchaSiteKey, "seo_md_file_download");

      const response = await fetch("/api/seo-md-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          recaptchaToken,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setValues(emptyForm);
      setErrors({});
      setStatus("success");
      setMessage("Thanks! Redirecting you to the next step...");
      router.push("/seo-md-file/success");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {recaptchaSiteKey ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
          strategy="afterInteractive"
        />
      ) : null}

      <form className={styles.leadForm} onSubmit={handleSubmit} noValidate>
        <div className={styles.formGrid}>
          <label>
            <span>First Name</span>
            <input
              name="firstName"
              type="text"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? "seo-md-firstName-error" : undefined}
              disabled={isSubmitting}
              autoComplete="given-name"
              className={errors.firstName ? styles.inputError : ""}
            />
            {errors.firstName ? (
              <span id="seo-md-firstName-error" className={styles.fieldError}>{errors.firstName}</span>
            ) : null}
          </label>
          <label>
            <span>Last Name</span>
            <input
              name="lastName"
              type="text"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? "seo-md-lastName-error" : undefined}
              disabled={isSubmitting}
              autoComplete="family-name"
              className={errors.lastName ? styles.inputError : ""}
            />
            {errors.lastName ? (
              <span id="seo-md-lastName-error" className={styles.fieldError}>{errors.lastName}</span>
            ) : null}
          </label>
        </div>

        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "seo-md-email-error" : undefined}
            disabled={isSubmitting}
            autoComplete="email"
            className={errors.email ? styles.inputError : ""}
          />
          {errors.email ? <span id="seo-md-email-error" className={styles.fieldError}>{errors.email}</span> : null}
        </label>

        <label>
          <span>Business Name</span>
          <input
            name="businessName"
            type="text"
            value={values.businessName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.businessName)}
            aria-describedby={errors.businessName ? "seo-md-businessName-error" : undefined}
            disabled={isSubmitting}
            autoComplete="organization"
            className={errors.businessName ? styles.inputError : ""}
          />
          {errors.businessName ? (
            <span id="seo-md-businessName-error" className={styles.fieldError}>{errors.businessName}</span>
          ) : null}
        </label>

        <button type="submit" className={`btn btn-primary ${styles.submitButton}`} disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Me the File"}
        </button>

        {message && <p className={status === "success" ? styles.successMessage : styles.errorMessage}>{message}</p>}

        <p className={styles.recaptchaNote}>
          This form is protected by Google reCAPTCHA to help prevent spam submissions.
        </p>

        <p className={styles.disclaimer}>
          No spam. I&apos;ll occasionally share new videos, tools, automations, and SEO/AI tips for real estate photographers.
        </p>
      </form>
    </>
  );
}