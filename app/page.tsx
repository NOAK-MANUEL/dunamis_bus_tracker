// app/page.tsx

"use client";

import { getBuses } from "@/actions/buses";
import { useEffect, useMemo, useState } from "react";

type Location = {
  id: string;
  name: string;
  region: string;
  buses: number;
  live: number;
  updated: string;
};

const locations: Location[] = [
  {
    id: "enugu",
    name: "Enugu",
    region: "Enugu State",
    buses: 8,
    live: 7,
    updated: "2 min ago",
  },
  {
    id: "abuja",
    name: "Abuja",
    region: "FCT",
    buses: 6,
    live: 5,
    updated: "4 min ago",
  },
  {
    id: "nsukka",
    name: "Nsukka",
    region: "Enugu State",
    buses: 4,
    live: 4,
    updated: "1 min ago",
  },
  {
    id: "onitsha",
    name: "Onitsha",
    region: "Anambra State",
    buses: 5,
    live: 3,
    updated: "8 min ago",
  },
  {
    id: "lagos",
    name: "Lagos",
    region: "Lagos State",
    buses: 9,
    live: 8,
    updated: "3 min ago",
  },
  {
    id: "ibadan",
    name: "Ibadan",
    region: "Oyo State",
    buses: 3,
    live: 2,
    updated: "11 min ago",
  },
];

export default function HomePage() {
  const [search, setSearch] = useState("");

  const filteredLocations = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return locations;

    return locations.filter(
      (location) =>
        location.name.toLowerCase().includes(value) ||
        location.region.toLowerCase().includes(value)
    );
  }, [search]);

  useEffect(()=>{
    getBuses().then(res=>console.log(res)).catch(err=>console.log(err.message))
  },[])

  return (
    <main className="min-h-screen bg-[#07100c] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute bottom-[-300px] right-[-200px] h-[500px] w-[500px] rounded-full bg-emerald-400/5 blur-[120px]" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-white/[0.06]">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
            <a href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-[#06100b] shadow-lg shadow-emerald-500/10">
                <BusIcon />
              </div>

              <div>
                <div className="text-[15px] font-semibold tracking-tight">
                  Dunamis
                </div>
                <div className="text-[11px] text-white/40">
                  Bus Tracker
                </div>
              </div>
            </a>

            <nav className="hidden items-center gap-8 text-sm text-white/55 sm:flex">
              <a
                href="#locations"
                className="transition hover:text-white"
              >
                Locations
              </a>
              <a
                href="/driver"
                className="transition hover:text-white"
              >
                Driver
              </a>
              <a
                href="/admin/login"
                className="transition hover:text-white"
              >
                Admin
              </a>
            </nav>

            <a
              href="/driver"
              className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-white/[0.08]"
            >
              Driver access
            </a>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              Live bus tracking
            </div>

            <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Find your Dunamis
              <span className="block text-emerald-400">
                bus in real time.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
              See available buses, check their current locations, and know
              when they were last updated before you travel.
            </p>

            {/* Search */}
            <div className="mt-9 flex max-w-xl items-center rounded-2xl border border-white/10 bg-white/[0.045] p-2 shadow-2xl shadow-black/20">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center text-white/35">
                <SearchIcon />
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a location..."
                className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/25"
              />

              <div className="hidden rounded-xl bg-white/[0.06] px-3 py-2 text-[11px] text-white/30 sm:block">
                {filteredLocations.length} locations
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-14 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-4">
            <Stat value="35" label="Buses" />
            <Stat value="29" label="Live now" />
            <Stat value="6" label="Locations" />
            <Stat value="< 5m" label="Avg. update" />
          </div>
        </section>

        {/* Locations */}
        <section
          id="locations"
          className="border-t border-white/[0.06]"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-400/80">
                  Bus locations
                </p>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Choose a location
                </h2>
                <p className="mt-2 text-sm text-white/35">
                  Select a location to see the buses currently serving it.
                </p>
              </div>

              <div className="hidden text-right sm:block">
                <div className="text-xs text-white/25">Last system update</div>
                <div className="mt-1 text-sm text-white/55">
                  Just now
                </div>
              </div>
            </div>

            {filteredLocations.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] py-20 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] text-white/30">
                  <SearchIcon />
                </div>
                <h3 className="mt-4 text-sm font-medium">
                  No locations found
                </h3>
                <p className="mt-1 text-xs text-white/30">
                  Try searching for another city or location.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLocations.map((location) => (
                  <LocationCard
                    key={location.id}
                    location={location}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-white/[0.06]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-400/80">
                  Simple to use
                </p>

                <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  Know where your bus is before you leave.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-6 text-white/35">
                  Drivers update their location directly from their phones.
                  You simply select your location and find the bus you need.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Step
                  number="01"
                  title="Choose"
                  description="Select your destination or pickup location."
                />

                <Step
                  number="02"
                  title="Find"
                  description="See buses currently operating in that area."
                />

                <Step
                  number="03"
                  title="Track"
                  description="View the latest reported position and update time."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Driver CTA */}
        <section className="px-5 pb-16 sm:px-8 sm:pb-20">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-emerald-400/10 bg-gradient-to-br from-emerald-400/[0.08] to-transparent p-8 sm:p-12">
            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400/80">
                  Drivers
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Ready to update your bus?
                </h2>

                <p className="mt-2 max-w-lg text-sm text-white/35">
                  Select your assigned bus and update its current location.
                </p>
              </div>

              <a
                href="/driver"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#06100b] transition hover:bg-emerald-300"
              >
                Open driver portal
                <ArrowIcon />
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.06]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-white/25 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              © {new Date().getFullYear()} Dunamis Church of Nigeria
            </div>

            <div className="flex gap-5">
              <a href="#" className="hover:text-white/50">
                Privacy
              </a>
              <a href="#" className="hover:text-white/50">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="bg-[#07100c] px-5 py-5 sm:px-6">
      <div className="text-xl font-semibold tracking-tight sm:text-2xl">
        {value}
      </div>
      <div className="mt-1 text-xs text-white/30">{label}</div>
    </div>
  );
}

function LocationCard({ location }: { location: Location }) {
  return (
    <a
      href={`/location/${location.id}`}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-white/[0.04]"
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-400/[0.04] blur-2xl transition group-hover:bg-emerald-400/[0.08]" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/[0.08] text-emerald-400">
            <LocationIcon />
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/[0.07] px-2.5 py-1 text-[10px] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live
          </div>
        </div>

        <h3 className="mt-6 text-lg font-semibold tracking-tight">
          {location.name}
        </h3>

        <p className="mt-1 text-xs text-white/30">
          {location.region}
        </p>

        <div className="my-5 h-px bg-white/[0.06]" />

        <div className="flex items-end justify-between">
          <div>
            <div className="text-xl font-semibold">
              {location.buses}
            </div>
            <div className="mt-0.5 text-[11px] text-white/30">
              buses available
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-medium text-emerald-300">
              {location.live} live
            </div>
            <div className="mt-1 text-[10px] text-white/25">
              Updated {location.updated}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs font-medium text-white/35 transition group-hover:text-emerald-300">
          View buses
          <ArrowIcon />
        </div>
      </div>
    </a>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
      <div className="text-xs font-medium text-emerald-400">
        {number}
      </div>

      <h3 className="mt-8 text-sm font-semibold">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-white/30">
        {description}
      </p>
    </div>
  );
}

function BusIcon() {
  return (
    <svg
      width="21"
      height="21"
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

function SearchIcon() {
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
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="20"
      height="20"
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

function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
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