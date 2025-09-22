import { EventForm } from "./eventForm";

export default function AdminHome() {
  return (
    <main className="min-h-screen bg-sand py-10 px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-soft p-6 border border-charcoal/10">
          <h1 className="font-display text-3xl text-deep mb-1">Admin</h1>
          <p className="text-charcoal/80 mb-6">Create the next event and send invites.</p>

          <h2 className="font-display text-2xl text-deep mb-3">Create Event</h2>
          <EventForm />
        </div>
      </div>
    </main>
  );
}