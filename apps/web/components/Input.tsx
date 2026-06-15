import { twMerge } from "tailwind-merge";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={twMerge(
        "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-500/20 focus:ring-4",
        props.className
      )}
    />
  );
}
