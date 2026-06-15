import { twMerge } from "tailwind-merge";

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "secondary" }) {
  const { className, tone = "primary", ...rest } = props;
  return (
    <button
      className={twMerge(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:opacity-60",
        tone === "primary"
          ? "bg-brand-500 text-white hover:bg-brand-600"
          : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
        className
      )}
      {...rest}
    />
  );
}
