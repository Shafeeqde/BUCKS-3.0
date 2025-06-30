import * as React from "react";
import { cn } from "@/lib/utils";

type StrictTextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value"> & {
  value: string;
};

const StrictTextInput = React.forwardRef<HTMLInputElement, StrictTextInputProps>(({ className, value, ...props }, ref) => {
  return (
    <input
      type="text"
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      value={value}
      ref={ref}
      {...props}
    />
  );
});
StrictTextInput.displayName = "StrictTextInput";

export { StrictTextInput };
