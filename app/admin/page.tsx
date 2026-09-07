"use client";

import Link from "next/link";
import AddAdmin from "@/components/admin/addAdmin";
import AddBus from "@/components/admin/addBus";
import AddLocation from "@/components/admin/addLocation";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/* Schemas                                                                    */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/* Mock data                                                                   */
/* -------------------------------------------------------------------------- */

const locations = [
  { id: "1", name: "Enugu", buses: 8, live: 7 },
  { id: "2", name: "Abuja", buses: 7, live: 6 },
  { id: "3", name: "Nsukka", buses: 5, live: 5 },
  { id: "4", name: "Onitsha", buses: 6, live: 5 },
  { id: "5", name: "Lagos", buses: 5, live: 4 },
  { id: "6", name: "Ibadan", buses: 4, live: 2 },
];

const buses = [
  {
    name: "Dunamis Bus 01",
    plate: "ENU-482-GH",
    location: "Enugu",
    status: "Live",
    updated: "2 min ago",
  },
  {
    name: "Dunamis Bus 02",
    plate: "ABJ-731-KD",
    location: "Abuja",
    status: "Live",
    updated: "4 min ago",
  },
  {
    name: "Dunamis Bus 03",
    plate: "ENU-218-AB",
    location: "Enugu",
    status: "Recent",
    updated: "9 min ago",
  },
  {
    name: "Dunamis Bus 04",
    plate: "LAG-905-XM",
    location: "Lagos",
    status: "Stale",
    updated: "27 min ago",
  },
];


export default function AdminPage() {

    const [modal, setModal] = useState<
    "bus" | "location" | "admin" | null
  >(null);

  /* ------------------------------- Bus form ------------------------------ */

 

  
  

  return (
    <main className="min-h-screen bg-[#07100c] text-white">
      {/* Header */}

      <header className="border-b border-white/[0.07] bg-[#07100c]/90">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-sm font-black text-black">
              D
            </div>

            <div>
              <p className="font-semibold">Dunamis Bus Tracker</p>
              <p className="text-xs text-white/35">Administration</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white sm:block"
            >
              View tracker
            </Link>

            <Link
              href="/admin/login"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">
        {/* Heading */}

        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-emerald-400">
            Overview
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Monitor buses, locations and tracker activity.
          </p>
        </div>

       
        {/* Stats */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total buses", "35", "+2 this month"],
            ["Live now", "29", "83% online"],
            ["Stale", "4", "Need attention"],
            ["Locations", "6", "All active"],
          ].map(([label, value, detail]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
            >
              <p className="text-sm text-white/40">{label}</p>

              <div className="mt-4 flex items-end justify-between">
                <p className="text-3xl font-semibold">{value}</p>

                <span className="text-xs text-white/30">{detail}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Quick actions */}

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="font-semibold">Quick actions</h2>
            <p className="mt-1 text-sm text-white/35">
              Manage the tracker from here.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <button
              onClick={() => setModal("bus")}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition hover:border-emerald-400/20 hover:bg-emerald-400/[0.03]"
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                +
              </span>

              <p className="font-medium">Add bus</p>
              <p className="mt-1 text-sm text-white/35">
                Register a new tracker bus.
              </p>
            </button>

            <button
              onClick={() => setModal("location")}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition hover:border-emerald-400/20 hover:bg-emerald-400/[0.03]"
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                ◎
              </span>

              <p className="font-medium">Add location</p>
              <p className="mt-1 text-sm text-white/35">
                Create a new tracking location.
              </p>
            </button>

            <button
              onClick={() => setModal("admin")}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition hover:border-emerald-400/20 hover:bg-emerald-400/[0.03]"
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                +
              </span>

              <p className="font-medium">Add admin</p>
              <p className="mt-1 text-sm text-white/35">
                Give someone admin access.
              </p>
            </button>
          </div>
        </section>

        {/* Bus activity */}

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]">
            <div className="border-b border-white/[0.07] px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Bus activity</h2>
                  <p className="mt-1 text-xs text-white/35">
                    Latest tracker updates
                  </p>
                </div>

                <Link
                  href="/admin/buses"
                  className="text-xs text-emerald-400 hover:text-emerald-300"
                >
                  View all
                </Link>
              </div>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {buses.map((bus) => (
                <div
                  key={bus.plate}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />

                    <div>
                      <p className="text-sm font-medium">{bus.name}</p>
                      <p className="mt-1 text-xs text-white/30">
                        {bus.plate} · {bus.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs ${
                        bus.status === "Live"
                          ? "text-emerald-400"
                          : bus.status === "Recent"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {bus.status}
                    </span>

                    <span className="text-xs text-white/30">
                      {bus.updated}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locations */}

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]">
            <div className="border-b border-white/[0.07] px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Locations</h2>
                  <p className="mt-1 text-xs text-white/35">
                    Current bus distribution
                  </p>
                </div>

                <Link
                  href="/admin/locations"
                  className="text-xs text-emerald-400 hover:text-emerald-300"
                >
                  Manage
                </Link>
              </div>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div>
                    <p className="text-sm">{location.name}</p>
                    <p className="mt-1 text-xs text-white/30">
                      {location.buses} buses
                    </p>
                  </div>

                  <span className="text-xs text-emerald-400">
                    {location.live} live
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL                                                               */}
      {/* ------------------------------------------------------------------ */}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1711] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <div>
                <h2 className="font-semibold">
                  {modal === "bus"
                    ? "Add bus"
                    : modal === "location"
                    ? "Add location"
                    : "Add admin"}
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  {modal === "bus"
                    ? "Register a bus for tracking."
                    : modal === "location"
                    ? "Create a new tracking location."
                    : "Create an administrator account."}
                </p>
              </div>

              <button
                onClick={() => setModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/5 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Bus */}

            {modal === "bus" && (
              <AddBus setModal={()=>setModal(null)}/>
            )}

            {/* Location */}

            {modal === "location" && (
             <AddLocation closeModal={()=>setModal(null)}/>
            )}

            {/* Admin */}

            {modal === "admin" && (
              <AddAdmin closeModal={()=>setModal(null)}/>
             )}
          </div>
        </div>
      )}
    </main>
  );
}