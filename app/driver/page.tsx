// app/driver/page.tsx

"use client";

import { useState } from "react";

const buses = [
  {
    id: "bus-01",
    name: "Dunamis Bus 01",
    plate: "ENU-482-GH",
    location: "Enugu",
    lastUpdated: "2 min ago",
    active: true,
  },
  {
    id: "bus-02",
    name: "Dunamis Bus 02",
    plate: "ENU-731-KD",
    location: "Enugu",
    lastUpdated: "4 min ago",
    active: true,
  },
  {
    id: "bus-03",
    name: "Dunamis Bus 03",
    plate: "ABJ-218-AB",
    location: "Abuja",
    lastUpdated: "12 min ago",
    active: true,
  },
  {
    id: "bus-04",
    name: "Dunamis Bus 04",
    plate: "NSK-905-XM",
    location: "Nsukka",
    lastUpdated: "31 min ago",
    active: true,
  },
];

export default function DriverPage() {
  const [selectedBus, setSelectedBus] = useState<
    (typeof buses)[number] | null
  >(null);

  const [pinOpen, setPinOpen] = useState(false);

  const [pin, setPin] = useState("");

  const [error, setError] = useState("");

  function selectBus(bus: (typeof buses)[number]) {
    setSelectedBus(bus);
    setPin("");
    setError("");
    setPinOpen(true);
  }

  function verifyPin() {
    if (pin === "1234") {
      setPinOpen(false);
      setPin("");
      setError("");
      return;
    }

    setError("Incorrect PIN. Please try again.");
  }

  return (
    <main className="min-h-screen bg-[#07100c] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[140px]" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-white/[0.06]">
          <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 sm:px-8">
            <a href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-[#06100b]">
                <BusIcon />
              </div>

              <div>
                <div className="text-[15px] font-semibold">
                  Dunamis
                </div>

                <div className="text-[11px] text-white/35">
                  Bus Tracker
                </div>
              </div>
            </a>

            <a
              href="/"
              className="flex items-center gap-2 text-xs text-white/35 transition hover:text-white"
            >
              <BackIcon />
              Back to tracker
            </a>
          </div>
        </header>

        {/* Page */}
        <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400/80">
              Driver portal
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
              Update your bus location.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/35 sm:text-base">
              Select the bus assigned to you. You will need its driver PIN
              before you can update its current location.
            </p>
          </div>

          {/* Notice */}
          <div className="mt-9 flex gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.045] p-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
              <LocationIcon />
            </div>

            <div>
              <p className="text-xs font-medium text-white/75">
                Location permission required
              </p>

              <p className="mt-1 text-xs leading-5 text-white/30">
                Your browser will ask for permission to access your current
                location when you update the bus.
              </p>
            </div>
          </div>

          {/* Bus list */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">
                  Select your bus
                </h2>

                <p className="mt-1 text-xs text-white/25">
                  {buses.length} buses available
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {buses.map((bus) => (
                <button
                  key={bus.id}
                  onClick={() => selectBus(bus)}
                  disabled={!bus.active}
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-white/45 transition group-hover:bg-emerald-400/10 group-hover:text-emerald-400">
                        <BusIcon />
                      </div>

                      <div>
                        <h3 className="text-sm font-medium">
                          {bus.name}
                        </h3>

                        <p className="mt-1 font-mono text-[10px] text-white/25">
                          {bus.plate}
                        </p>
                      </div>
                    </div>

                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/[0.07] px-2 py-1 text-[9px] text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.05] pt-3">
                    <span className="text-[10px] text-white/25">
                      {bus.location}
                    </span>

                    <span className="text-[10px] text-white/25">
                      Updated {bus.lastUpdated}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Help */}
          <div className="mt-10 text-center">
            <p className="text-xs text-white/20">
              Don't know your bus PIN?
            </p>

            <button className="mt-2 text-xs font-medium text-emerald-400/70 transition hover:text-emerald-300">
              Contact your administrator
            </button>
          </div>
        </section>
      </div>

      {/* PIN Modal */}
      {pinOpen && selectedBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0a1510] p-6 shadow-2xl shadow-black/50">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  <LockIcon />
                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  Enter bus PIN
                </h2>

                <p className="mt-1 text-xs text-white/30">
                  {selectedBus.name} · {selectedBus.plate}
                </p>
              </div>

              <button
                onClick={() => setPinOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/[0.06] hover:text-white"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-7">
              <label className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                Driver PIN
              </label>

              <input
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") verifyPin();
                }}
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter PIN"
                className={`mt-2 h-14 w-full rounded-xl border bg-white/[0.03] px-4 text-center text-xl tracking-[0.5em] text-white outline-none transition placeholder:text-xs placeholder:tracking-normal placeholder:text-white/20 ${
                  error
                    ? "border-red-400/30 focus:border-red-400/50"
                    : "border-white/10 focus:border-emerald-400/40"
                }`}
              />

              {error && (
                <p className="mt-2 text-center text-[11px] text-red-300">
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={verifyPin}
              disabled={pin.length < 4}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-emerald-400 text-sm font-semibold text-[#06100b] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Continue
              <ArrowIcon />
            </button>

            <p className="mt-4 text-center text-[10px] leading-5 text-white/20">
              This PIN is assigned specifically to this bus.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

function BusIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 17h12" />
      <path d="M5 17V6.5C5 4.57 6.57 3 8.5 3h7C17.43 3 19 4.57 19 6.5V17" />
      <path d="M5 8h14" />
      <path d="M7 17v2" />
      <path d="M17 17v2" />
      <path d="M8 12h.01" />
      <path d="M16 12h.01" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="ml-2"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}