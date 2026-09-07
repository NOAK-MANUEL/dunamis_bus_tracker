// app/driver/track/page.tsx

"use client";

import { useEffect, useState } from "react";

const bus = {
  name: "Dunamis Bus 01",
  plate: "ENU-482-GH",
  location: "Enugu",
  lastUpdated: "2 min ago",
};

export default function DriverTrackPage() {
  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  async function updateLocation() {
    setUpdating(true);
    setUpdated(false);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationEnabled(true);

          setTimeout(() => {
            setUpdating(false);
            setUpdated(true);
          }, 900);
        },
        () => {
          setUpdating(false);
          setLocationEnabled(false);
        }
      );
    } else {
      setTimeout(() => {
        setUpdating(false);
        setUpdated(true);
      }, 900);
    }
  }

  useEffect(() => {
    if (!updated) return;

    const timer = setTimeout(() => setUpdated(false), 4000);

    return () => clearTimeout(timer);
  }, [updated]);

  return (
    <main className="min-h-screen bg-[#07100c] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-350px] h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[150px]" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-white/[0.06]">
          <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-5 sm:px-8">
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
              href="/driver"
              className="flex items-center gap-2 text-xs text-white/35 transition hover:text-white"
            >
              <SwitchIcon />
              Change bus
            </a>
          </div>
        </header>

        <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
          {/* Bus identity */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
                <span className="text-xs text-emerald-300">
                  Driver mode
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {bus.name}
              </h1>

              <p className="mt-2 text-sm text-white/35">
                {bus.plate} · {bus.location}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
              <div className="text-[9px] uppercase tracking-wider text-white/20">
                Last update
              </div>

              <div className="mt-1 text-xs text-white/55">
                {updated ? "Just now" : bus.lastUpdated}
              </div>
            </div>
          </div>

          {/* Main tracker */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025]">
            {/* Map */}
            <div className="relative h-[300px] overflow-hidden bg-[#0a1510] sm:h-[360px]">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
                  `,
                  backgroundSize: "42px 42px",
                }}
              />

              <div className="absolute left-[-10%] top-[45%] h-[3px] w-[120%] rotate-[-18deg] bg-white/[0.035]" />
              <div className="absolute left-[-10%] top-[25%] h-[2px] w-[120%] rotate-[24deg] bg-white/[0.025]" />
              <div className="absolute left-[48%] top-[-20%] h-[140%] w-[3px] rotate-[17deg] bg-white/[0.035]" />

              {/* Current position */}
              <div className="absolute left-1/2 top-1/2">
                <div className="absolute -inset-10 rounded-full bg-emerald-400/[0.04]" />
                <div className="absolute -inset-6 rounded-full border border-emerald-400/10 animate-pulse" />

                <div className="relative flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#07100c] bg-emerald-400 text-[#06100b] shadow-[0_0_30px_rgba(52,211,153,0.25)]">
                  <BusIcon />
                </div>
              </div>

              {/* Position label */}
              <div className="absolute left-1/2 top-1/2 mt-10 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-[#07100c]/90 px-3 py-2 backdrop-blur-xl">
                <div className="text-[10px] font-medium">
                  Current bus position
                </div>
                <div className="mt-0.5 text-[9px] text-white/30">
                  {locationEnabled
                    ? "Location detected"
                    : "Location not updated yet"}
                </div>
              </div>

              <div className="absolute left-4 top-4 rounded-xl border border-white/10 bg-[#07100c]/80 px-3 py-2 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-white/60">
                    Your bus
                  </span>
                </div>
              </div>

              <div className="absolute bottom-3 right-4 text-[8px] text-white/15">
                Map preview
              </div>
            </div>

            {/* Controls */}
            <div className="p-5 sm:p-7">
              <div className="grid gap-3 sm:grid-cols-3">
                <InfoCard
                  icon={<LocationIcon />}
                  label="Location"
                  value={bus.location}
                />

                <InfoCard
                  icon={<SignalIcon />}
                  label="Tracking"
                  value={locationEnabled ? "Ready" : "Waiting"}
                />

                <InfoCard
                  icon={<ClockIcon />}
                  label="Last update"
                  value={updated ? "Just now" : bus.lastUpdated}
                />
              </div>

              {/* Update button */}
              <button
                onClick={updateLocation}
                disabled={updating}
                className="mt-5 flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 text-sm font-semibold text-[#06100b] shadow-xl shadow-emerald-500/[0.08] transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60"
              >
                {updating ? (
                  <>
                    <Spinner />
                    Getting your location...
                  </>
                ) : updated ? (
                  <>
                    <CheckIcon />
                    Location updated
                  </>
                ) : (
                  <>
                    <TargetIcon />
                    Set current location
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[10px] leading-5 text-white/20">
                Press the button whenever you need to update your bus
                position.
              </p>
            </div>
          </div>

          {/* Permission/status */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StatusCard
              title="Location permission"
              description={
                locationEnabled
                  ? "Your browser location is available."
                  : "Location access will be requested when you update."
              }
              active={locationEnabled}
            />

            <StatusCard
              title="Bus assignment"
              description={`${bus.name} is currently assigned to you.`}
              active
            />
          </div>

          {/* Warning */}
          <div className="mt-8 flex gap-3 rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.035] p-4">
            <div className="mt-0.5 text-yellow-300/70">
              <WarningIcon />
            </div>

            <div>
              <p className="text-xs font-medium text-white/65">
                Keep location accurate
              </p>

              <p className="mt-1 text-[11px] leading-5 text-white/25">
                Only update your location when you are actually operating
                this bus. Your latest position will be visible to people
                checking this location.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/35">
        {icon}
      </div>

      <div className="min-w-0">
        <div className="text-[9px] uppercase tracking-wider text-white/20">
          {label}
        </div>
        <div className="mt-1 truncate text-xs text-white/60">
          {value}
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  title,
  description,
  active,
}: {
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div
        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
          active
            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
            : "bg-white/20"
        }`}
      />

      <div>
        <p className="text-xs font-medium text-white/60">
          {title}
        </p>

        <p className="mt-1 text-[10px] leading-5 text-white/25">
          {description}
        </p>
      </div>
    </div>
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
      width="16"
      height="16"
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

function SignalIcon() {
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
      <path d="M2 8.5a15 15 0 0 1 20 0" />
      <path d="M5 12a10.5 10.5 0 0 1 14 0" />
      <path d="M8.5 15.5a6 6 0 0 1 7 0" />
      <path d="M12 19h.01" />
    </svg>
  );
}

function ClockIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function TargetIcon() {
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
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="8" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity=".25"
        strokeWidth="2"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SwitchIcon() {
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
      <path d="M17 3h4v4" />
      <path d="m21 3-7 7" />
      <path d="M7 21H3v-4" />
      <path d="m3 21 7-7" />
    </svg>
  );
}

function WarningIcon() {
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
      <path d="m10.3 3.7-8 14A2 2 0 0 0 4 20.7h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}