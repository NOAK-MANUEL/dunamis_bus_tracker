"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const busSchema = z.object({
  name: z.string().min(2, "Bus name is required"),
  plateNumber: z.string().min(3, "Plate number is required"),
  location: z.string().min(1, "Select a location"),
  pin: z.string().regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
});

type BusForm = z.infer<typeof busSchema>;

type Bus = {
  id: string;
  name: string;
  plateNumber: string;
  location: string;
  status: "Live" | "Recent" | "Stale" | "Offline";
  lastUpdate: string;
  active: boolean;
};

const initialBuses: Bus[] = [
  {
    id: "1",
    name: "Dunamis Bus 01",
    plateNumber: "ENU-482-GH",
    location: "Enugu",
    status: "Live",
    lastUpdate: "2 min ago",
    active: true,
  },
  {
    id: "2",
    name: "Dunamis Bus 02",
    plateNumber: "ABJ-731-KD",
    location: "Abuja",
    status: "Live",
    lastUpdate: "4 min ago",
    active: true,
  },
  {
    id: "3",
    name: "Dunamis Bus 03",
    plateNumber: "ENU-218-AB",
    location: "Enugu",
    status: "Recent",
    lastUpdate: "9 min ago",
    active: true,
  },
  {
    id: "4",
    name: "Dunamis Bus 04",
    plateNumber: "LAG-905-XM",
    location: "Lagos",
    status: "Stale",
    lastUpdate: "27 min ago",
    active: true,
  },
  {
    id: "5",
    name: "Dunamis Bus 05",
    plateNumber: "NSK-442-RT",
    location: "Nsukka",
    status: "Live",
    lastUpdate: "1 min ago",
    active: true,
  },
  {
    id: "6",
    name: "Dunamis Bus 06",
    plateNumber: "IBA-318-KL",
    location: "Ibadan",
    status: "Offline",
    lastUpdate: "2 hrs ago",
    active: false,
  },
];

const locations = [
  "Enugu",
  "Abuja",
  "Nsukka",
  "Onitsha",
  "Lagos",
  "Ibadan",
];

function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/80">
        {label}
      </label>

      <input
        {...props}
        className={`w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 transition ${
          error
            ? "border-red-400/50"
            : "border-white/10 focus:border-emerald-400/50"
        }`}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

function LoadingButton({
  loading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
      )}
      {loading ? "Saving..." : children}
    </button>
  );
}

export default function BusesPage() {
  const [buses, setBuses] = useState(initialBuses);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [success, setSuccess] = useState("");

  const form = useForm<BusForm>({
    resolver: zodResolver(busSchema),
    defaultValues: {
      name: "",
      plateNumber: "",
      location: "",
      pin: "",
    },
  });

  const filteredBuses = buses.filter((bus) => {
    const matchesSearch =
      bus.name.toLowerCase().includes(search.toLowerCase()) ||
      bus.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      bus.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Active" && bus.active) ||
      (filter === "Inactive" && !bus.active) ||
      bus.status === filter;

    return matchesSearch && matchesFilter;
  });

  const openAdd = () => {
    setSelectedBus(null);
    form.reset({
      name: "",
      plateNumber: "",
      location: "",
      pin: "",
    });
    setModal("add");
  };

  const openEdit = (bus: Bus) => {
    setSelectedBus(bus);
    form.reset({
      name: bus.name,
      plateNumber: bus.plateNumber,
      location: bus.location,
      pin: "",
    });
    setModal("edit");
  };

  const submit = async (data: BusForm) => {
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (modal === "add") {
      const newBus: Bus = {
        id: crypto.randomUUID(),
        name: data.name,
        plateNumber: data.plateNumber.toUpperCase(),
        location: data.location,
        status: "Offline",
        lastUpdate: "Never",
        active: true,
      };

      setBuses((current) => [newBus, ...current]);
      setSuccess("Bus added successfully");
    }

    if (modal === "edit" && selectedBus) {
      setBuses((current) =>
        current.map((bus) =>
          bus.id === selectedBus.id
            ? {
                ...bus,
                name: data.name,
                plateNumber: data.plateNumber.toUpperCase(),
                location: data.location,
              }
            : bus
        )
      );

      setSuccess("Bus updated successfully");
    }

    setModal(null);

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  const toggleBus = async (bus: Bus) => {
    setBuses((current) =>
      current.map((item) =>
        item.id === bus.id
          ? { ...item, active: !item.active }
          : item
      )
    );

    setSuccess(
      bus.active
        ? `${bus.name} has been deactivated`
        : `${bus.name} has been activated`
    );

    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <main className="min-h-screen bg-[#07100c] text-white">
      <header className="border-b border-white/[0.07]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 font-black text-black"
            >
              D
            </Link>

            <div>
              <p className="font-semibold">Dunamis Bus Tracker</p>
              <p className="text-xs text-white/35">Bus management</p>
            </div>
          </div>

          <Link
            href="/admin"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-emerald-400">
              Management
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              Buses
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Manage registered buses and their tracking status.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
          >
            + Add bus
          </button>
        </div>

        {success && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-3 text-sm text-emerald-300">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-black">
              ✓
            </span>
            {success}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <p className="text-sm text-white/40">Total buses</p>
            <p className="mt-3 text-3xl font-semibold">{buses.length}</p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <p className="text-sm text-white/40">Active</p>
            <p className="mt-3 text-3xl font-semibold">
              {buses.filter((bus) => bus.active).length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <p className="text-sm text-white/40">Currently live</p>
            <p className="mt-3 text-3xl font-semibold text-emerald-400">
              {buses.filter((bus) => bus.status === "Live").length}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.025]">
          <div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:flex-row">
            <div className="relative flex-1">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search buses, plates or locations..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-emerald-400/50"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0b1711] px-4 py-3 text-sm text-white/70 outline-none"
            >
              <option>All</option>
              <option>Live</option>
              <option>Recent</option>
              <option>Stale</option>
              <option>Offline</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.07] text-left text-xs text-white/30">
                  <th className="px-5 py-4 font-medium">Bus</th>
                  <th className="px-5 py-4 font-medium">Location</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Last update</th>
                  <th className="px-5 py-4 font-medium">Active</th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.06]">
                {filteredBuses.map((bus) => (
                  <tr
                    key={bus.id}
                    className="transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium">{bus.name}</p>
                      <p className="mt-1 text-xs text-white/30">
                        {bus.plateNumber}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-white/60">
                      {bus.location}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-2 text-xs ${
                          bus.status === "Live"
                            ? "text-emerald-400"
                            : bus.status === "Recent"
                            ? "text-yellow-400"
                            : bus.status === "Stale"
                            ? "text-orange-400"
                            : "text-red-400"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {bus.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-white/35">
                      {bus.lastUpdate}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleBus(bus)}
                        className={`relative h-6 w-11 rounded-full transition ${
                          bus.active
                            ? "bg-emerald-400"
                            : "bg-white/10"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                            bus.active ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openEdit(bus)}
                        className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/50 transition hover:bg-white/5 hover:text-white"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-white/[0.06] md:hidden">
            {filteredBuses.map((bus) => (
              <div key={bus.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{bus.name}</p>
                    <p className="mt-1 text-xs text-white/30">
                      {bus.plateNumber}
                    </p>
                  </div>

                  <span
                    className={`text-xs ${
                      bus.status === "Live"
                        ? "text-emerald-400"
                        : bus.status === "Recent"
                        ? "text-yellow-400"
                        : bus.status === "Stale"
                        ? "text-orange-400"
                        : "text-red-400"
                    }`}
                  >
                    {bus.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/30">Location</p>
                    <p className="mt-1 text-sm text-white/70">
                      {bus.location}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-white/30">Updated</p>
                    <p className="mt-1 text-sm text-white/70">
                      {bus.lastUpdate}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openEdit(bus)}
                    className="flex-1 rounded-lg border border-white/10 py-2 text-xs text-white/60"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleBus(bus)}
                    className="flex-1 rounded-lg border border-white/10 py-2 text-xs text-white/60"
                  >
                    {bus.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredBuses.length === 0 && (
            <div className="px-5 py-16 text-center">
              <p className="text-sm text-white/40">No buses found.</p>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1711] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <div>
                <h2 className="font-semibold">
                  {modal === "add" ? "Add bus" : "Edit bus"}
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  {modal === "add"
                    ? "Register a new bus."
                    : "Update bus information."}
                </p>
              </div>

              <button
                onClick={() => setModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-white/40 hover:bg-white/5 hover:text-white"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={form.handleSubmit(submit)}
              className="space-y-4 p-5"
            >
              <Input
                label="Bus name"
                placeholder="Dunamis Bus 07"
                {...form.register("name")}
                error={form.formState.errors.name?.message}
              />

              <Input
                label="Plate number"
                placeholder="ENU-123-AB"
                {...form.register("plateNumber")}
                error={form.formState.errors.plateNumber?.message}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Location
                </label>

                <select
                  {...form.register("location")}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                >
                  <option value="" className="bg-[#0b1711]">
                    Select location
                  </option>

                  {locations.map((location) => (
                    <option
                      key={location}
                      value={location}
                      className="bg-[#0b1711]"
                    >
                      {location}
                    </option>
                  ))}
                </select>

                {form.formState.errors.location && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {form.formState.errors.location.message}
                  </p>
                )}
              </div>

              {modal === "add" && (
                <Input
                  label="Driver PIN"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="••••"
                  {...form.register("pin")}
                  error={form.formState.errors.pin?.message}
                />
              )}

              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
              >
                {modal === "add" ? "Add bus" : "Save changes"}
              </LoadingButton>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}