import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
	primary:
		"bg-[#1acb5b] text-black border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]",
	secondary:
		"bg-white text-black border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]",
	ghost:
		"bg-transparent text-[#1acb5b] border-2 border-[#1acb5b] hover:bg-[#1acb5b] hover:text-black",
	danger:
		"bg-red-500 text-white border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none",
};

const sizeClasses: Record<ButtonSize, string> = {
	sm: "px-3 py-2 text-sm min-h-[36px]",
	md: "px-5 py-3 text-base min-h-[44px]",
	lg: "px-7 py-4 text-lg min-h-[52px]",
};

export function Button({
	variant = "primary",
	size = "md",
	loading = false,
	fullWidth = false,
	disabled,
	className,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			{...props}
			disabled={disabled || loading}
			className={cn(
				"inline-flex items-center justify-center gap-2 font-bold font-[Space_Grotesk,sans-serif] transition-all duration-100 cursor-pointer select-none",
				variantClasses[variant],
				sizeClasses[size],
				fullWidth && "w-full",
				(disabled || loading) &&
					"opacity-50 cursor-not-allowed pointer-events-none",
				className,
			)}
		>
			{loading && (
				<span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
			)}
			{children}
		</button>
	);
}
