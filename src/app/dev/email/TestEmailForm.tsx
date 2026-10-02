"use client";

import { useActionState } from "react";
import { sendTestEmail, type TestEmailState } from "@/app/checkout/actions";
import Field from "@/components/Field";

const initialState: TestEmailState = { ok: false, message: "" };

/**
 * Dev-only page for previewing the confirmation email. Sends a sample to
 * any address without saving an order.
 */
export default function TestEmailForm() {
  const [state, formAction, pending] = useActionState(sendTestEmail, initialState);

  return (
    <form action={formAction} className="max-w-md space-y-5">
      <Field
        name="email"
        label="Send a sample to"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
      />

      <button type="submit" disabled={pending} className="btn btn-primary" aria-busy={pending}>
        {pending ? "Sending…" : "Send sample email"}
      </button>

      {state.message && (
        <p
          role="status"
          className="border px-4 py-3 text-[0.9rem]"
          style={{
            borderColor: state.ok
              ? "color-mix(in oklab, #3f4a3c 45%, transparent)"
              : "color-mix(in oklab, #b4573f 45%, transparent)",
            color: state.ok ? "#3f4a3c" : "#b4573f",
          }}
        >
          {state.message}
        </p>
      )}

      <p className="text-[0.8rem] text-taupe">
        No order is saved. This only sends the email so you can check the design.
      </p>
    </form>
  );
}
