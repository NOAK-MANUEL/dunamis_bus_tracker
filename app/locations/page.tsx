// app/location/[id]/page.tsx

"use client";

import { useMemo, useState } from "react";

const location = {
  name: "Enugu",
  region: "Enugu State",
  updated: "2 minutes ago",
};

const buses = [
  {
    id: "bus-01",
    name: "Dunamis Bus 01",
    plate: "ENU-482-GH",
    status: "live",
    updated: "2 min ago",
    latitude: 6.4584,
    longitude: 7.5464,
  },
  {
    id: "bus-02",
    name: "Dunamis Bus 02",
    plate: "ENU-731-KD",
    status: "live",
    updated: "4 min ago",
    latitude: 6.4701,
    longitude: 7.5237,
  },
  {
    id: "bus-03",
    name: "Dunamis Bus 03",
    plate: "ENU-218-AB",
    status: "recent",
    updated: "9 min ago",
    latitude: 6.4412,
    longitude: 7.4981,
  },
  {
    id: "bus-04",
    name: "Dunamis Bus 04",
    plate: "ENU-905-XM",
    status: "stale",
    updated: "27 min ago",
    latitude: 6.491,
    longitude: 7.551,
  },
];

export default function LocationPage() {
  const [selectedBus, setSelectedBus] = useState(buses[0]);
  const [showDetails, setShowDetails] = useState(false);

  const liveBuses = useMemo(
    () => buses.filter((bus) => bus.status === "live"),
    []
  );

  return (
    <main className="min-h-screen bg-[#07100c] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-350px] h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[150px]" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-white/[0.06]">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
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
              className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              Driver access
            </a>
          </div>
        </header>

        {/* Main */}
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
          {/* Breadcrumb */}
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs text-white/30 transition hover:text-white/60"
          >
            <BackIcon />
            All locations
          </a>

          {/* Location heading */}
          <div className="mt-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {location.name}
                </h1>

                <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/[0.08] px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {liveBuses.length} live
                </span>
              </div>

              <p className="mt-2 text-sm text-white/35">
                {location.region} · {buses.length} buses
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[11px] text-white/25">
                Location data updated
              </div>
              <div className="mt-1 text-xs text-white/45">
                {location.updated}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_390px]">
            {/* Map */}
            <section className="relative min-h-[520px] overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0a1510]">
              <MockMap selectedBus={selectedBus} />

              {/* Map top controls */}
              <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
                <div className="rounded-xl border border-white/10 bg-[#07100c]/80 px-3 py-2.5 backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    <span className="text-xs font-medium">
                      Live tracking
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-white/30">
                    {liveBuses.length} buses reporting
                  </p>
                </div>

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#07100c]/80 text-white/50 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
                  aria-label="Map information"
                >
                  <InfoIcon />
                </button>
              </div>

              {/* Map legend */}
              <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-[#07100c]/80 p-3 backdrop-blur-xl">
                <div className="flex items-center gap-4 text-[10px] text-white/45">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Live
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    Recent
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-white/30" />
                    Stale
                  </span>
                </div>
              </div>

              {showDetails && (
                <div className="absolute bottom-4 right-4 max-w-[230px] rounded-xl border border-white/10 bg-[#07100c]/90 p-4 backdrop-blur-xl">
                  <p className="text-xs font-medium">Map information</p>
                  <p className="mt-2 text-[10px] leading-5 text-white/35">
                    Bus positions are based on the latest location reported
                    by each driver.
                  </p>
                </div>
              )}
            </section>

            {/* Bus list */}
            <section className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
              <div className="mb-5 px-1">
                <h2 className="text-sm font-semibold">
                  Buses at this location
                </h2>
                <p className="mt-1 text-xs text-white/30">
                  Select a bus to view its latest position.
                </p>
              </div>

              <div className="space-y-2">
                {buses.map((bus) => {
                  const selected = selectedBus.id === bus.id;

                  return (
                    <button
                      key={bus.id}
                      onClick={() => setSelectedBus(bus)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-emerald-400/20 bg-emerald-400/[0.07]"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              selected
                                ? "bg-emerald-400 text-[#06100b]"
                                : "bg-white/[0.06] text-white/45"
                            }`}
                          >
                            <BusIcon />
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">
                              {bus.name}
                            </div>

                            <div className="mt-1 text-[10px] text-white/25">
                              {bus.plate}
                            </div>
                          </div>
                        </div>

                        <Status status={bus.status} />
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">
                        <span className="text-[10px] text-white/25">
                          Last location
                        </span>

                        <span
                          className={`text-[10px] ${
                            bus.status === "live"
                              ? "text-emerald-300"
                              : bus.status === "recent"
                              ? "text-yellow-300"
                              : "text-white/30"
                          }`}
                        >
                          {bus.updated}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected bus */}
              <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[#07100c]/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/25">
                      Selected bus
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedBus.name}
                    </p>
                  </div>

                  <Status status={selectedBus.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <InfoBox
                    label="Latitude"
                    value={selectedBus.latitude.toFixed(5)}
                  />
                  <InfoBox
                    label="Longitude"
                    value={selectedBus.longitude.toFixed(5)}
                  />
                </div>

                <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/[0.06] py-3 text-xs font-medium text-white/65 transition hover:bg-white/[0.09] hover:text-white">
                  Center on bus
                  <TargetIcon />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function Status({ status }: { status: string }) {
  if (status === "live") {
    return (
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-400/[0.08] px-2 py-1 text-[9px] font-medium text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Live
      </span>
    );
  }

  if (status === "recent") {
    return (
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-yellow-400/[0.08] px-2 py-1 text-[9px] font-medium text-yellow-300">
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
        Recent
      </span>
    );
  }

  return (
    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/[0.06] px-2 py-1 text-[9px] font-medium text-white/35">
      <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
      Stale
    </span>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] px-3 py-2.5">
      <div className="text-[9px] text-white/20">{label}</div>
      <div className="mt-1 font-mono text-[10px] text-white/45">
        {value}
      </div>
    </div>
  );
}

function MockMap({
  selectedBus,
}: {
  selectedBus: (typeof buses)[number];
}) {
  const positions: Record<string, { left: string; top: string }> = {
    "bus-01": { left: "48%", top: "42%" },
    "bus-02": { left: "63%", top: "31%" },
    "bus-03": { left: "34%", top: "57%" },
    "bus-04": { left: "72%", top: "62%" },
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Map grid */}
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

      {/* Fake roads */}
      <div className="absolute left-[-10%] top-[45%] h-[3px] w-[120%] rotate-[-18deg] bg-white/[0.035]" />
      <div className="absolute left-[-10%] top-[25%] h-[2px] w-[120%] rotate-[24deg] bg-white/[0.025]" />
      <div className="absolute left-[45%] top-[-20%] h-[140%] w-[3px] rotate-[17deg] bg-white/[0.035]" />
      <div className="absolute left-[70%] top-[-20%] h-[140%] w-[2px] rotate-[-28deg] bg-white/[0.025]" />

      {/* Area shapes */}
      <div className="absolute left-[15%] top-[18%] h-40 w-64 rounded-[45%] border border-white/[0.025] bg-emerald-400/[0.015]" />
      <div className="absolute bottom-[15%] right-[10%] h-48 w-72 rounded-[45%] border border-white/[0.025] bg-white/[0.01]" />

      {/* User position */}
      <div className="absolute left-[51%] top-[51%]">
        <div className="absolute -inset-5 rounded-full bg-blue-400/10 animate-pulse" />
        <div className="relative h-3 w-3 rounded-full border-2 border-white bg-blue-400 shadow-lg shadow-blue-400/40" />
      </div>

      {/* Bus markers */}
      {buses.map((bus) => {
        const position = positions[bus.id];
        const selected = bus.id === selectedBus.id;

        return (
          <div
            key={bus.id}
            className="absolute transition-all duration-500"
            style={{
              left: position.left,
              top: position.top,
              transform: "translate(-50%, -50%)",
            }}
          >
            {selected && (
              <div className="absolute -inset-4 rounded-full border border-emerald-400/30 bg-emerald-400/5 animate-pulse" />
            )}

            <div
              className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#07100c] shadow-xl ${
                bus.status === "live"
                  ? "bg-emerald-400 text-[#06100b]"
                  : bus.status === "recent"
                  ? "bg-yellow-400 text-[#171204]"
                  : "bg-white/40 text-[#07100c]"
              }`}
            >
              <BusIcon />
            </div>

            {selected && (
              <div className="absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#07100c]/90 px-2.5 py-1.5 text-[9px] font-medium backdrop-blur-md">
                {bus.name}
              </div>
            )}
          </div>
        );
      })}

      {/* Map attribution */}
      <div className="absolute bottom-3 right-4 text-[8px] text-white/15">
        Map preview
      </div>
    </div>
  );
}

function BusIcon() {
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

function InfoIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function TargetIcon() {
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
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="8" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
    </svg>
  );
}