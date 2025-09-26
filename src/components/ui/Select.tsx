import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SelectOption } from '@/types';

interface SelectProps {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ options, value, onValueChange, placeholder = "Select...", className, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const selectedOption = options.find(option => option.value === value);

    return (
      <div className="relative">
        <button
          ref={ref}
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
          {...props}
        >
          <span className={cn(!selectedOption && "text-muted-foreground")}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full z-20 mt-1 max-h-60 min-w-[8rem] overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
              {options.map((option) => (
                <button
                  key={option.value}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none bg-white focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                    value === option.value && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    onValueChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
