export default function Input({
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
        className={`w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 ${
          error
            ? "border-red-400/50 focus:border-red-400"
            : "border-white/10 focus:border-emerald-400/50"
        }`}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
