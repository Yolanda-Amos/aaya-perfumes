"use client";

/** One labelled input with inline, field-level error messaging. */
export default function Field({
  name,
  label,
  autoComplete,
  placeholder,
  error,
  type = "text",
  inputMode,
  maxLength,
  span,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
  inputMode?: "text" | "numeric" | "email" | "tel";
  maxLength?: number;
  span?: boolean;
}) {
  return (
    <div className={span ? "sm:col-span-2" : undefined}>
      <label htmlFor={name} className="mb-1.5 block text-[0.85rem] text-taupe">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className="field"
      />
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1.5 text-[0.8rem] text-[#d98b7a]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
