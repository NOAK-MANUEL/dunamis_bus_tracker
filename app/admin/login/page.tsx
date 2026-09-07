"use client"

import LoadingButton from "@/components/loader";
import { AdminLoginInput, adminLoginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function AdminLoginPage() {
  const {handleSubmit, formState:{isSubmitting,errors}, register,} = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
   
  });

  const loginAdmin = async (data:AdminLoginInput)=>{

  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/10 ring-1 ring-green-500/20">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7 text-green-500"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 16.5h14M6.5 16.5V9.75A1.75 1.75 0 0 1 8.25 8h7.5a1.75 1.75 0 0 1 1.75 1.75v6.75M8 8V6.5A1.5 1.5 0 0 1 9.5 5h5A1.5 1.5 0 0 1 16 6.5V8M4 16.5h16v2H4v-2Z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Dunamis Bus Tracker
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Administrator portal
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-lg font-medium">Welcome back</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Sign in to manage buses and locations.
            </p>
          </div>

          <form onSubmit={handleSubmit(loginAdmin)} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                required
                className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-700 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-700 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/10"
              />
            </div>

            <LoadingButton
              loading={isSubmitting}

              className="bg-green-600 text-white hover:bg-green-500"
            >
              Sign in
            </LoadingButton>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Dunamis International Gospel Centre
        </p>
      </div>
    </main>
  );
}