import { EventForm } from "./eventForm";
import { sendInvitesAction } from "./actions";

export default function AdminHome() {
  async function sendTest(formData: FormData) {
    "use server";
    await sendInvitesAction(formData);
  }
  return (
    <main className="min-h-screen bg-sand py-10 px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-soft p-6 border border-charcoal/10">
          <h1 className="font-display text-3xl text-deep mb-1">Admin</h1>
          <p className="text-charcoal/80 mb-6">Create the next event and send invites.</p>

          <h2 className="font-display text-2xl text-deep mb-3">Create Event</h2>
          <EventForm />

          <hr className="my-6 border-charcoal/10" />

          <h2 className="font-display text-2xl text-deep mb-3">Send Test SMS</h2>
          <p className="text-sm text-charcoal/70 mb-3">Enter an event ID and send only to your admin test number.</p>
          <form action={sendTest} className="grid gap-3">
            <input
              name="eventId"
              placeholder="Event ID (e.g., from database)"
              required
              className="rounded-xl border border-charcoal/20 px-4 py-3"
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="sendToMeOnly" defaultChecked />
              <span>Send only to me (uses ADMIN_TEST_NUMBER)</span>
            </label>
            <button className="rounded-xl bg-deep text-white px-5 py-3 w-full sm:w-auto">Send Test SMS</button>
          </form>
        </div>
      </div>
    </main>
  );
}