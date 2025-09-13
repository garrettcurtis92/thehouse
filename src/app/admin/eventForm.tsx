"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { createEventAction } from "./actions";

export function EventForm() {
  const [pending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        const res = await createEventAction(formData);
        if (res?.ok) {
          toast.success("Event created!");
        } else {
          toast.error("Failed to create event.");
        }
      } catch (e) {
        console.error(e);
        toast.error("Error creating event.");
      }
    });
  }

  return (
    <form action={onSubmit} className="grid gap-3">
      <input name="title" placeholder="Title (e.g., Thursday Night)" required className="rounded-xl border border-charcoal/20 px-4 py-3" />
      <input name="starts_at" type="datetime-local" required className="rounded-xl border border-charcoal/20 px-4 py-3" />
      <input name="location" placeholder="Location" className="rounded-xl border border-charcoal/20 px-4 py-3" />
      <textarea name="notes" placeholder="Notes (optional)" className="rounded-xl border border-charcoal/20 px-4 py-3" />
      <button disabled={pending} className="rounded-xl bg-deep text-white px-5 py-3 w-full sm:w-auto">
        {pending ? "Creating…" : "Create"}
      </button>
    </form>
  );
}