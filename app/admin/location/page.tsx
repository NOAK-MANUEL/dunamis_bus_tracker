"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@/components/loader";
import { LocationForm, locationSchema } from "@/lib/validation";


type Location = {
  id: string;
  name: string;
  description: string;
  buses: number;
  live: number;
  active: boolean;
  updated: string;
};

const initialLocations: Location[] = [
  {
    id: "1",
    name: "Enugu",
    description: "Dunamis buses operating around Enugu.",
    buses: 8,
    live: 7,
    active: true,
    updated: "2 min ago",
  },
  {
    id: "2",
    name: "Abuja",
    description: "Dunamis buses operating around Abuja.",
    buses: 7,
    live: 6,
    active: true,
    updated: "4 min ago",
  },
  {
    id: "3",
    name: "Nsukka",
    description: "Dunamis buses operating around Nsukka.",
    buses: 5,
    live: 5,
    active: true,
    updated: "1 min ago",
  },
  {
    id: "4",
    name: "Onitsha",
    description: "Dunamis buses operating around Onitsha.",
    buses: 6,
    live: 5,
    active: true,
    updated: "6 min ago",
  },
  {
    id: "5",
    name: "Lagos",
    description: "Dunamis buses operating around Lagos.",
    buses: 5,
    live: 4,
    active: true,
    updated: "11 min ago",
  },
  {
    id: "6",
    name: "Ibadan",
    description: "Dunamis buses operating around Ibadan.",
    buses: 4,
    live: 2,
    active: true,
    updated: "18 min ago",
  },
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



export default function LocationsPage() {
  const [locations, setLocations] = useState(initialLocations);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<Location | null>(null);
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<LocationForm>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(search.toLowerCase()) ||
      location.description.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setSelectedLocation(null);

    form.reset({
      name: "",
      description: "",
    });

    setModal("add");
  };

  const openEdit = (location: Location) => {
    setSelectedLocation(location);

    form.reset({
      name: location.name,
      description: location.description,
    });

    setModal("edit");
  };

  const submit = async (data: LocationForm) => {
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (modal === "add") {
      const newLocation: Location = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description || "",
        buses: 0,
        live: 0,
        active: true,
        updated: "Just now",
      };

      setLocations((current) => [newLocation, ...current]);
      setSuccess("Location added successfully");
    }

    if (modal === "edit" && selectedLocation) {
      setLocations((current) =>
        current.map((location) =>
          location.id === selectedLocation.id
            ? {
                ...location,
                name: data.name,
                description: data.description || "",
                updated: "Just now",
              }
            : location
        )
      );

      setSuccess("Location updated successfully");
    }

    setModal(null);

    setTimeout(() => setSuccess(""), 3000);
  };

  const toggleLocation = (location: Location) => {
    setLocations((current) =>
      current.map((item) =>
        item.id === location.id
          ? {
              ...item,
              active: !item.active,
            }
          : item
      )
    );

    setSuccess(
      location.active
        ? `${location.name} has been deactivated`
        : `${location.name} has been activated`
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
              <p className="text-xs text-white/35">
                Location management
              </p>
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
              Locations
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Manage the locations where Dunamis buses operate.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
          >
            + Add location
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
            <p className="text-sm text-white/40">Total locations</p>
            <p className="mt-3 text-3xl font-semibold">
              {locations.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <p className="text-sm text-white/40">Active</p>
            <p className="mt-3 text-3xl font-semibold">
              {locations.filter((location) => location.active).length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <p className="text-sm text-white/40">Buses across locations</p>
            <p className="mt-3 text-3xl font-semibold text-emerald-400">
              {locations.reduce(
                (total, location) => total + location.buses,
                0
              )}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search locations..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-emerald-400/50 sm:max-w-md"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:border-white/[0.12]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                      ◎
                    </div>

                    <div>
                      <h2 className="font-semibold">
                        {location.name}
                      </h2>

                      <p className="mt-1 text-xs text-white/30">
                        Updated {location.updated}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                      location.active
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-white/5 text-white/30"
                    }`}
                  >
                    {location.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-5 min-h-10 text-sm leading-5 text-white/40">
                  {location.description || "No description provided."}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="text-xs text-white/30">Buses</p>
                    <p className="mt-1 text-lg font-semibold">
                      {location.buses}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="text-xs text-white/30">Live</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-400">
                      {location.live}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => openEdit(location)}
                    className="flex-1 rounded-lg border border-white/10 py-2.5 text-xs text-white/60 transition hover:bg-white/5 hover:text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleLocation(location)}
                    className="flex-1 rounded-lg border border-white/10 py-2.5 text-xs text-white/60 transition hover:bg-white/5 hover:text-white"
                  >
                    {location.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-16 text-center">
              <p className="text-sm text-white/40">
                No locations found.
              </p>
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
                  {modal === "add"
                    ? "Add location"
                    : "Edit location"}
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  {modal === "add"
                    ? "Create a new tracking location."
                    : "Update location information."}
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
                label="Location name"
                placeholder="Enugu"
                {...form.register("name")}
                error={form.formState.errors.name?.message}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Description
                </label>

                <textarea
                  {...form.register("description")}
                  rows={4}
                  placeholder="Dunamis buses operating around Enugu..."
                  className={`w-full resize-none rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 transition ${
                    form.formState.errors.description
                      ? "border-red-400/50"
                      : "border-white/10 focus:border-emerald-400/50"
                  }`}
                />

                {form.formState.errors.description && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
              >
                {modal === "add"
                  ? "Add location"
                  : "Save changes"}
              </LoadingButton>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}