import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  badge?: string;
  description?: string;
  disabled?: boolean;
}

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option',
  className = '',
  size = 'sm'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 rounded-lg bg-[#141419] hover:bg-[#181820] border border-white/[0.08] hover:border-white/[0.14] text-zinc-200 transition-all outline-none ${
          size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-2 text-xs'
        } ${isOpen ? 'border-zinc-500/50 ring-1 ring-white/[0.04]' : ''}`}
      >
        <div className="flex items-center gap-2 truncate">
          <span className="font-mono text-zinc-200 truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-zinc-200' : ''
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 rounded-lg bg-[#131317] border border-white/[0.09] shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
          <div className="space-y-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              const isDisabled = opt.disabled;

              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled) {
                      onChange(opt.value);
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs text-left transition-colors ${
                    isSelected
                      ? 'bg-zinc-800 text-white font-medium'
                      : isDisabled
                      ? 'text-zinc-600 cursor-not-allowed opacity-50'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono truncate">{opt.label}</span>
                      {opt.badge && (
                        <span className={`text-[8px] font-mono px-1 py-0.1 rounded ${
                          isSelected ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-500'
                        }`}>
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    {opt.description && (
                      <span className="text-[10px] text-zinc-500 truncate">{opt.description}</span>
                    )}
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-zinc-200 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
