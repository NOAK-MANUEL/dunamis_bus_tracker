// app/admin/locations/page.tsx

"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const locationSchema = z.object({
  name: z
    .string()
    .min(2, "Location name is required")
    .max(100, "Location name is too long"),
  is_active: z.boolean(),
});

const busPinSchema = z.object({
  pin: z
    .string()
    .regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
});

type LocationForm = z.infer<typeof locationSchema>;
type BusPinForm = z.infer<typeof busPinSchema>;

type Bus = {
  id: string;
  name: string;
  plate: string;
  pin: string;
  is_active: boolean;
  last_update: string;
};

type Location = {
  id: string;
  name: string;
  is_active: boolean;
  buses: Bus[];
};

const initialLocations: Location[] = [
  {
    id: "1",
    name: "Enugu",
    is_active: true,
    buses: [
      {
        id: "b1",
        name: "Dunamis Bus 01",
        plate: "ENU-482-GH",
        pin: "1234",
        is_active: true,
        last_update: "2 min ago",
      },
      {
        id: "b2",
        name: "Dunamis Bus 02",
        plate: "ENU-731-KD",
        pin: "5678",
        is_active: true,
        last_update: "4 min ago",
      },
      {
        id: "b3",
        name: "Dunamis Bus 03",
        plate: "ENU-218-AB",
        pin: "2468",
        is_active: true,
        last_update: "9 min ago",
      },
    ],
  },
  {
    id: "2",
    name: "Abuja",
    is_active: true,
    buses: [
      {
        id: "b4",
        name: "Dunamis Bus 04",
        plate: "ABJ-905-XM",
        pin: "1357",
        is_active: true,
        last_update: "3 min ago",
      },
      {
        id: "b5",
        name: "Dunamis Bus 05",
        plate: "ABJ-221-KL",
        pin: "8642",
        is_active: true,
        last_update: "6 min ago",
      },
    ],
  },
  {
    id: "3",
    name: "Nsukka",
    is_active: true,
    buses: [
      {
        id: "b6",
        name: "Dunamis Bus 06",
        plate: "NSK-441-AA",
        pin: "1122",
        is_active: true,
        last_update: "5 min ago",
      },
    ],
  },
  {
    id: "4",
    name: "Onitsha",
    is_active: true,
    buses: [],
  },
  {
    id: "5",
    name: "Lagos",
    is_active: false,
    buses: [],
  },
];

function LoadingButton({
  children,
  loading,
  type = "button",
  onClick,
}: {
  children: React.ReactNode;
  loading?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
      )}
      {children}
    </button>
  );
}

function Icon({
  children,
  className = "h-4 w-4",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState(initialLocations);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>("1");

  const [locationModal, setLocationModal] = useState<{
    mode: "add" | "edit";
    location?: Location;
  } | null>(null);

  const [pinModal, setPinModal] = useState<{
    locationId: string;
    bus: Bus;
  } | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    locationId: string;
    bus: Bus;
  } | null>(null);

  const filteredLocations = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return locations;

    return locations.filter((location) =>
      location.name.toLowerCase().includes(value)
    );
  }, [locations, search]);

  const totalBuses = locations.reduce(
    (total, location) => total + location.buses.length,
    0
  );

  const activeLocations = locations.filter(
    (location) => location.is_active
  ).length;

  function toggleLocation(locationId: string) {
    setLocations((current) =>
      current.map((location) =>
        location.id === locationId
          ? {
              ...location,
              is_active: !location.is_active,
            }
          : location
      )
    );
  }

  function deleteBus() {
    if (!deleteModal) return;

    setLocations((current) =>
      current.map((location) =>
        location.id === deleteModal.locationId
          ? {
              ...location,
              buses: location.buses.filter(
                (bus) => bus.id !== deleteModal.bus.id
              ),
            }
          : location
      )
    );

    setDeleteModal(null);
  }

  function updateBusPin(busId: string, pin: string) {
    if (!pinModal) return;

    setLocations((current) =>
      current.map((location) =>
        location.id === pinModal.locationId
          ? {
              ...location,
              buses: location.buses.map((bus) =>
                bus.id === busId
                  ? {
                      ...bus,
                      pin,
                    }
                  : bus
              ),
            }
          : location
      )
    );

    setPinModal(null);
  }

  return (
    <main className="min-h-screen bg-[#07100c] text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-320px] h-[600px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/[0.055] blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-black">
              D
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight">
                Dunamis Bus Tracker
              </p>
              <p className="text-[11px] text-white/35">Administration</p>
            </div>
          </div>

          <a
            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2 text-sm text-white/60 transition hover:border-white/[0.14] hover:text-white"
          >
            <Icon>
              <path d="m15 18-6-6 6-6" />
            </Icon>
            Dashboard
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        {/* Heading */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-emerald-400/70">
              Administration
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Manage locations
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
              Manage locations and the buses assigned to each one.
            </p>
          </div>

          <LoadingButton onClick={() => setLocationModal({ mode: "add" })}>
            <Icon>
              <path d="M12 5v14M5 12h14" />
            </Icon>
            Add location
          </LoadingButton>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <p className="text-xs text-white/35">Locations</p>
            <p className="mt-1 text-2xl font-semibold">{locations.length}</p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <p className="text-xs text-white/35">Active</p>
            <p className="mt-1 text-2xl font-semibold">{activeLocations}</p>
          </div>

          <div className="col-span-2 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:col-span-1">
            <p className="text-xs text-white/35">Assigned buses</p>
            <p className="mt-1 text-2xl font-semibold">{totalBuses}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4">
          <Icon className="h-4 w-4 shrink-0 text-white/30">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </Icon>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search locations..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-white/25"
          />
        </div>

        {/* Locations */}
        <div className="mt-5 space-y-3">
          {filteredLocations.map((location) => {
            const isOpen = expanded === location.id;

            return (
              <section
                key={location.id}
                className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]"
              >
                {/* Location heading */}
                <div className="flex items-center gap-3 p-4 sm:p-5">
                  <button
                    onClick={() =>
                      setExpanded(isOpen ? null : location.id)
                    }
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                        location.is_active
                          ? "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-400"
                          : "border-white/[0.08] bg-white/[0.025] text-white/30"
                      }`}
                    >
                      <Icon>
                        <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </Icon>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate text-sm font-semibold">
                          {location.name}
                        </h2>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] ${
                            location.is_active
                              ? "bg-emerald-400/10 text-emerald-400"
                              : "bg-white/[0.06] text-white/35"
                          }`}
                        >
                          {location.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-0.5 text-xs text-white/30">
                        {location.buses.length}{" "}
                        {location.buses.length === 1 ? "bus" : "buses"}
                      </p>
                    </div>

                    <Icon className="ml-auto h-4 w-4 shrink-0 text-white/25">
                      {isOpen ? (
                        <path d="m6 15 6-6 6 6" />
                      ) : (
                        <path d="m6 9 6 6 6-6" />
                      )}
                    </Icon>
                  </button>

                  <button
                    onClick={() => toggleLocation(location.id)}
                    className={`relative h-6 w-10 shrink-0 rounded-full transition ${
                      location.is_active
                        ? "bg-emerald-500"
                        : "bg-white/10"
                    }`}
                    aria-label="Toggle location"
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                        location.is_active ? "left-5" : "left-1"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() =>
                      setLocationModal({
                        mode: "edit",
                        location,
                      })
                    }
                    className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] text-white/40 transition hover:border-white/[0.14] hover:text-white sm:flex"
                    aria-label="Edit location"
                  >
                    <Icon>
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                    </Icon>
                  </button>
                </div>

                {/* Buses */}
                {isOpen && (
                  <div className="border-t border-white/[0.06]">
                    {location.buses.length === 0 ? (
                      <div className="px-5 py-10 text-center">
                        <p className="text-sm text-white/35">
                          No buses assigned to this location.
                        </p>

                        <p className="mt-1 text-xs text-white/20">
                          Buses assigned to this location will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/[0.05]">
                        {location.buses.map((bus) => (
                          <div
                            key={bus.id}
                            className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center"
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/40">
                                <Icon>
                                  <path d="M5 17h14" />
                                  <path d="M6 17V8l1.5-3h9L19 8v9" />
                                  <path d="M8 17v2M16 17v2" />
                                  <path d="M7 9h10" />
                                </Icon>
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="truncate text-sm font-medium">
                                    {bus.name}
                                  </p>

                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      bus.is_active
                                        ? "bg-emerald-400"
                                        : "bg-white/20"
                                    }`}
                                  />
                                </div>

                                <p className="mt-0.5 text-xs text-white/30">
                                  {bus.plate} · Updated {bus.last_update}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 sm:shrink-0">
                              <button
                                onClick={() =>
                                  setPinModal({
                                    locationId: location.id,
                                    bus,
                                  })
                                }
                                className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 text-xs text-white/50 transition hover:border-white/[0.14] hover:text-white"
                              >
                                <Icon className="h-3.5 w-3.5">
                                  <rect
                                    x="4"
                                    y="11"
                                    width="16"
                                    height="9"
                                    rx="2"
                                  />
                                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                                </Icon>
                                Check / change PIN
                              </button>

                              <button
                                onClick={() =>
                                  setDeleteModal({
                                    locationId: location.id,
                                    bus,
                                  })
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/10 text-red-400/60 transition hover:border-red-400/20 hover:bg-red-400/[0.05] hover:text-red-400"
                                aria-label={`Delete ${bus.name}`}
                              >
                                <Icon className="h-3.5 w-3.5">
                                  <path d="M3 6h18" />
                                  <path d="M8 6V4h8v2" />
                                  <path d="m19 6-1 14H6L5 6" />
                                  <path d="M10 11v5M14 11v5" />
                                </Icon>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>
            );
          })}

          {filteredLocations.length === 0 && (
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] py-16 text-center">
              <p className="text-sm text-white/40">No locations found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Location modal */}
      {locationModal && (
        <LocationModal
          mode={locationModal.mode}
          location={locationModal.location}
          onClose={() => setLocationModal(null)}
          onSave={(values) => {
            if (locationModal.mode === "add") {
              const location: Location = {
                id: crypto.randomUUID(),
                name: values.name,
                is_active: values.is_active,
                buses: [],
              };

              setLocations((current) => [...current, location]);
            } else if (locationModal.location) {
              setLocations((current) =>
                current.map((location) =>
                  location.id === locationModal.location?.id
                    ? {
                        ...location,
                        name: values.name,
                        is_active: values.is_active,
                      }
                    : location
                )
              );
            }

            setLocationModal(null);
          }}
        />
      )}

      {/* PIN modal */}
      {pinModal && (
        <PinModal
          bus={pinModal.bus}
          onClose={() => setPinModal(null)}
          onSave={(pin) => updateBusPin(pinModal.bus.id, pin)}
        />
      )}

      {/* Delete modal */}
      {deleteModal && (
        <DeleteBusModal
          bus={deleteModal.bus}
          onClose={() => setDeleteModal(null)}
          onDelete={deleteBus}
        />
      )}
    </main>
  );
}

function LocationModal({
  mode,
  location,
  onClose,
  onSave,
}: {
  mode: "add" | "edit";
  location?: Location;
  onClose: () => void;
  onSave: (values: LocationForm) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LocationForm>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: location?.name ?? "",
      is_active: location?.is_active ?? true,
    },
  });

  async function submit(values: LocationForm) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave(values);
  }

  return (
    <Modal>
      <form onSubmit={handleSubmit(submit)}>
        <ModalHeader
          title={mode === "add" ? "Add location" : "Edit location"}
          onClose={onClose}
        />

        <div className="space-y-5 p-5">
          <div>
            <label className="mb-2 block text-xs font-medium text-white/50">
              Location name
            </label>

            <input
              {...register("name")}
              placeholder="e.g. Enugu"
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-sm outline-none transition placeholder:text-white/20 focus:border-emerald-400/40"
            />

            {errors.name && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
            <div>
              <p className="text-sm font-medium">Active location</p>
              <p className="mt-0.5 text-xs text-white/30">
                Allow this location to appear publicly.
              </p>
            </div>

            <input
              type="checkbox"
              {...register("is_active")}
              className="h-4 w-4 accent-emerald-500"
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-white/[0.06] p-5">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-sm text-white/40 hover:text-white"
          >
            Cancel
          </button>

          <LoadingButton type="submit" loading={isSubmitting}>
            {mode === "add" ? "Add location" : "Save changes"}
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}

function PinModal({
  bus,
  onClose,
  onSave,
}: {
  bus: Bus;
  onClose: () => void;
  onSave: (pin: string) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusPinForm>({
    resolver: zodResolver(busPinSchema),
    defaultValues: {
      pin: bus.pin,
    },
  });

  const [showPin, setShowPin] = useState(false);

  async function submit(values: BusPinForm) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave(values.pin);
  }

  return (
    <Modal>
      <form onSubmit={handleSubmit(submit)}>
        <ModalHeader title="Bus PIN" onClose={onClose} />

        <div className="p-5">
          <div className="mb-5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="text-sm font-medium">{bus.name}</p>
            <p className="mt-1 text-xs text-white/30">{bus.plate}</p>
          </div>

          <label className="mb-2 block text-xs font-medium text-white/50">
            Driver PIN
          </label>

          <div className="relative">
            <input
              {...register("pin")}
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              maxLength={4}
              className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 pr-12 text-lg tracking-[0.35em] outline-none focus:border-emerald-400/40"
            />

            <button
              type="button"
              onClick={() => setShowPin((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              aria-label={showPin ? "Hide PIN" : "Show PIN"}
            >
              <Icon>
                {showPin ? (
                  <>
                    <path d="m3 3 18 18" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c7 0 10 8 10 8a18 18 0 0 1-3.1 4.5" />
                    <path d="M6.6 6.6C3.5 8.7 2 12 2 12s3 8 10 8a10.5 10.5 0 0 0 4-.8" />
                  </>
                ) : (
                  <>
                    <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </Icon>
            </button>
          </div>

          {errors.pin && (
            <p className="mt-1.5 text-xs text-red-400">
              {errors.pin.message}
            </p>
          )}

          <p className="mt-3 text-xs leading-5 text-white/25">
            This PIN is used by the driver to access this bus.
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-white/[0.06] p-5">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-sm text-white/40 hover:text-white"
          >
            Cancel
          </button>

          <LoadingButton type="submit" loading={isSubmitting}>
            Save PIN
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}

function DeleteBusModal({
  bus,
  onClose,
  onDelete,
}: {
  bus: Bus;
  onClose: () => void;
  onDelete: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onDelete();
  }

  return (
    <Modal>
      <div>
        <ModalHeader title="Delete bus" onClose={onClose} />

        <div className="p-5">
          <div className="rounded-xl border border-red-400/10 bg-red-400/[0.04] p-4">
            <p className="text-sm font-medium text-white">{bus.name}</p>
            <p className="mt-1 text-xs text-white/30">{bus.plate}</p>
          </div>

          <p className="mt-5 text-sm leading-6 text-white/45">
            This will remove the bus from this location. This action cannot be
            undone.
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-white/[0.06] p-5">
          <button
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-sm text-white/40 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-500/90 px-4 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            Delete bus
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b1510] shadow-2xl">
        {children}
      </div>
    </div>
  );
}

function ModalHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
      <h2 className="text-sm font-semibold">{title}</h2>

      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/[0.05] hover:text-white"
      >
        <Icon>
          <path d="m6 6 12 12M18 6 6 18" />
        </Icon>
      </button>
    </div>
  );
}