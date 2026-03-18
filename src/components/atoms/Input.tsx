import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	hint?: string;
}

export function Input({
	label,
	error,
	hint,
	className,
	id,
	...props
}: InputProps) {
	const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

	return (
		<div className="flex flex-col gap-1 w-full">
			{label && (
				<label
					htmlFor={inputId}
					className="text-sm font-bold font-[Space_Grotesk,sans-serif] text-white uppercase tracking-wide"
				>
					{label}
					{props.required && <span className="text-[#1acb5b] ml-1">*</span>}
				</label>
			)}
			<input
				id={inputId}
				{...props}
				className={cn(
					"w-full px-4 py-3 min-h-[44px] bg-[#1a1a1a] text-white font-[Space_Grotesk,sans-serif]",
					"border-2 border-black outline-none transition-all duration-100",
					"placeholder:text-gray-500",
					"focus:border-[#1acb5b] focus:shadow-[0_0_0_2px_#1acb5b40]",
					error
						? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_2px_#ef444440]"
						: "",
					"disabled:opacity-50 disabled:cursor-not-allowed",
					className,
				)}
			/>
			{error && (
				<p className="text-xs text-red-400 font-[Space_Grotesk,sans-serif]">
					{error}
				</p>
			)}
			{hint && !error && (
				<p className="text-xs text-gray-400 font-[Space_Grotesk,sans-serif]">
					{hint}
				</p>
			)}
		</div>
	);
}
