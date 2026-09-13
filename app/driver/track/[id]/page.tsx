"use client";

import { activateBus, addBusLocation, deactivateBus, getBus } from "@/actions/buses";
import { Bus } from "@/types/database";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const MOVEMENT_THRESHOLD = 100;
const LOCATION_INTERVAL = 5 * 60 * 1000;
const CHECK_INTERVAL = 30 * 60 * 1000;

type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
};

function distanceBetween(a: Coordinates, b: Coordinates) {
  const R = 6371000;

  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;

  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return R * y;
}

export default function DriverTrackPage() {
  const { id } = useParams();

  const [bus, setBus] = useState<Bus | null>(null);
  const [loadingBus, setLoadingBus] = useState(true);

  const [location, setLocation] =
    useState<Coordinates | null>(null);

  const [tracking, setTracking] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const [showActivePopup, setShowActivePopup] =
    useState(false);

  const [busActive, setBusActive] = useState(false);

  const watchId = useRef<number | null>(null);

  const locationTimer =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const checkTimer =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const currentLocation =
    useRef<Coordinates | null>(null);

  const lastConfirmedLocation =
    useRef<Coordinates | null>(null);

  const busMoved = useRef(false);

  /*
   * Get the actual bus.
   */
  useEffect(() => {
    if (!id) return;

    async function fetchBus() {
      try {
        setLoadingBus(true);

        const result = await getBus(id?.toString()||"");

        setBus(result as Bus);
        setBusActive(result?.is_active ?? false);
      } catch (error) {
        console.error("Failed to get bus:", error);
        setLocationError("Unable to load this bus.");
      } finally {
        setLoadingBus(false);
      }
    }

    fetchBus();
  }, [id]);

  /*
   * Save the current GPS position.
   *
   * IMPORTANT:
   * We await addBusLocation().
   */
  async function saveBusLocation() {
    if (!bus) return;

    const current = currentLocation.current;

    if (!current) return;

    try {
      await addBusLocation(
        bus.id,
        current.longitude,
        current.latitude,
        current.accuracy ?? 0
      );

      setLastUpdated(new Date());
    } catch (error) {
      console.error(
        "Failed to save bus location:",
        error
      );
    }
  }

  /*
   * Handle every GPS update.
   */
  async function handlePosition(
    position: GeolocationPosition
  ) {
    const newLocation: Coordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    };

    currentLocation.current = newLocation;

    setLocation(newLocation);
    setLocationError("");

    /*
     * First valid GPS location.
     */
    if (!lastConfirmedLocation.current) {
      lastConfirmedLocation.current = newLocation;

      busMoved.current = false;

      setBusActive(true);

      /*
       * Wait for the location to actually
       * be saved before continuing.
       */
      await saveBusLocation();

      return;
    }

    /*
     * Check movement from the last confirmed
     * location.
     */
    const distance = distanceBetween(
      lastConfirmedLocation.current,
      newLocation
    );

    /*
     * Ignore small GPS jitter.
     */
    if (distance >= MOVEMENT_THRESHOLD) {
      busMoved.current = true;
    }
  }

  /*
   * GPS failure means the bus cannot remain active.
   */
  function handleLocationError(
    error: GeolocationPositionError
  ) {
    setLocationError(
      error.code === error.PERMISSION_DENIED
        ? "Location permission was denied. You cannot activate this bus without location access."
        : "Unable to get your current location. You cannot activate this bus."
    );

    setTracking(false);
    setBusActive(false);
    setLocation(null);

    currentLocation.current = null;

    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(
        watchId.current
      );

      watchId.current = null;
    }

    if (locationTimer.current !== null) {
      clearInterval(locationTimer.current);

      locationTimer.current = null;
    }

    if (checkTimer.current !== null) {
      clearInterval(checkTimer.current);

      checkTimer.current = null;
    }
  }

  /*
   * Start tracking.
   */
  async function startTracking() {
    if (!bus) return;

    if (!("geolocation" in navigator)) {
      setLocationError(
        "Geolocation is not available on this device. You cannot activate this bus."
      );

      setBusActive(false);

      return;
    }

    /*
     * Prevent duplicate watchers/timers.
     */
    if (watchId.current !== null) {
      return;
    }

    setLocationError("");

    /*
     * Continuously monitor driver's GPS.
     */
    watchId.current =
      navigator.geolocation.watchPosition(
        handlePosition,
        handleLocationError,
        {
          enableHighAccuracy: true,
          maximumAge: 10_000,
          timeout: 15_000,
        }
      );
      try{
      await activateBus(id?.toString()||"")
    setTracking(true);

    /*
     * Save the latest location every 5 minutes.
     *
     * The callback waits for addBusLocation()
     * to finish.
     */
    locationTimer.current = setInterval(
      async () => {
        await saveBusLocation();
      },
      LOCATION_INTERVAL
    );

    /*
     * Every 30 minutes check whether the bus
     * has moved at least 100m.
     */
    checkTimer.current = setInterval(() => {
      if (busMoved.current) {
        setShowActivePopup(true);
      }
    }, CHECK_INTERVAL);
  }catch(error){
    toast.error(error instanceof Error && error.message)
  }
  }

  /*
   * Stop tracking.
   */
 async function stopTracking() {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(
        watchId.current
      );

      watchId.current = null;
    }

    if (locationTimer.current !== null) {
      clearInterval(locationTimer.current);

      locationTimer.current = null;
    }

    if (checkTimer.current !== null) {
      clearInterval(checkTimer.current);

      checkTimer.current = null;
    }

    try{
      await deactivateBus(id?.toString()||"" )
      setTracking(false);
    setBusActive(false);

    busMoved.current = false;
    }catch(err){
      toast.error(err instanceof Error && err.message)
    }

    
  }

  /*
   * Driver confirms the bus is still active.
   */
  async function confirmStillActive() {
    const current = currentLocation.current;

    if (!current) {
      setBusActive(false);
      setShowActivePopup(false);

      return;
    }

    /*
     * Current GPS position becomes the new
     * movement reference point.
     */
    lastConfirmedLocation.current = current;

    busMoved.current = false;

    setBusActive(true);
    setShowActivePopup(false);

    /*
     * Wait until the confirmed position
     * has been saved.
     */
    try{
          await saveBusLocation();

        }catch(err){
          toast.error(err instanceof Error && err.message)
        }
  }

  /*
   * Driver says the bus is no longer active.
   */
  function markInactive() {
    setBusActive(false);
    setShowActivePopup(false);

    stopTracking();
  }

  /*
   * Cleanup.
   */
  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(
          watchId.current
        );
      }

      if (locationTimer.current !== null) {
        clearInterval(locationTimer.current);
      }

      if (checkTimer.current !== null) {
        clearInterval(checkTimer.current);
      }
    };
  }, []);

  /*
   * Loading bus.
   */
  if (loadingBus) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07100c] text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-amber-400" />

          <p className="mt-4 text-sm text-white/40">
            Loading bus...
          </p>
        </div>
      </main>
    );
  }

  /*
   * Bus wasn't found.
   */
  if (!bus) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07100c] px-5 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/[0.07] bg-white/[0.025] p-8 text-center">
          <p className="text-sm text-red-300">
            Unable to find this bus.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07100c] text-white">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              D
            </div>

            <div>
              <p className="text-sm font-semibold">
                Dunamis Bus Tracker
              </p>

              <p className="text-xs text-white/40">
                Driver Portal
              </p>
            </div>
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-xs ${
              busActive
                ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                : "border-white/10 bg-white/[0.03] text-white/40"
            }`}
          >
            {busActive ? "Active" : "Inactive"}
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm text-amber-400">
            Bus tracking
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {bus.name}
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Plate number: {bus.plate_number}
          </p>
        </div>

        {locationError && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4">
            <p className="text-sm text-red-300">
              {locationError}
            </p>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <section className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                Current status
              </p>

              <div className="mt-4 flex items-center gap-4">
                <div
                  className={`h-3 w-3 rounded-full ${
                    busActive
                      ? "bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.6)]"
                      : "bg-white/20"
                  }`}
                />

                <div>
                  <p className="text-lg font-medium">
                    {busActive
                      ? "Bus is currently active"
                      : "Bus is currently inactive"}
                  </p>

                  <p className="mt-1 text-sm text-white/40">
                    {tracking
                      ? "Your location is being monitored continuously."
                      : "Location tracking is not active."}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
                <p className="text-xs text-white/30">
                  Latitude
                </p>

                <p className="mt-2 font-mono text-sm font-medium">
                  {location
                    ? location.latitude.toFixed(6)
                    : "Waiting for location"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
                <p className="text-xs text-white/30">
                  Longitude
                </p>

                <p className="mt-2 font-mono text-sm font-medium">
                  {location
                    ? location.longitude.toFixed(6)
                    : "Waiting for location"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
                <p className="text-xs text-white/30">
                  Accuracy
                </p>

                <p className="mt-2 text-sm font-medium">
                  {location?.accuracy != null
                    ? `${Math.round(
                        location.accuracy
                      )} m`
                    : "—"}
                </p>
              </div>
            </div>

            {lastUpdated && (
              <p className="mt-5 text-xs text-white/30">
                Last location saved:{" "}
                {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </section>

          <aside className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-white/30">
              Tracking
            </p>

            <h2 className="mt-3 text-xl font-medium">
              {tracking
                ? "Location tracking enabled"
                : "Ready to track"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Your device location is required before this
              bus can be marked active.
            </p>

            <div className="mt-6">
              {!tracking ? (
                <button
                  type="button"
                  onClick={startTracking}
                  className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
                >
                  Set current location
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopTracking}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition hover:bg-white/[0.07]"
                >
                  Stop tracking
                </button>
              )}
            </div>

            <div className="mt-6 border-t border-white/[0.06] pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">
                  GPS
                </span>

                <span
                  className={
                    location
                      ? "text-amber-300"
                      : "text-white/30"
                  }
                >
                  {location ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-white/40">
                  Tracking
                </span>

                <span>
                  {tracking ? "On" : "Off"}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-white/40">
                  Location sync
                </span>

                <span>Every 5 min</span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-white/40">
                  Activity check
                </span>

                <span>Every 30 min</span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-white/40">
                  Bus status
                </span>

                <span>
                  {busActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {showActivePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#0b1711] p-6 shadow-2xl">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.18em] text-amber-400">
                Bus activity check
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Is this bus still active?
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/40">
                The bus has moved since the last activity
                check. Please confirm that you are still
                operating this bus.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={confirmStillActive}
                className="rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
              >
                Yes, still active
              </button>

              <button
                type="button"
                onClick={markInactive}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium transition hover:bg-white/[0.07]"
              >
                No, mark inactive
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}