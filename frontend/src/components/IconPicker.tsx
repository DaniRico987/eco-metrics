import React, { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Search, X } from "lucide-react";

interface IconPickerProps {
  selectedIcon: string;
  onSelect: (iconName: string) => void;
}

// Filter out non-component exports if any (though usually Lucide exports components)
// We also exclude the "icons" export if it exists (some versions have it)
const iconList = Object.keys(LucideIcons).filter(
  (key) => key !== "icons" && key !== "createLucideIcon" && key !== "default"
);

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onSelect,
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredIcons = useMemo(() => {
    if (!search) return iconList.slice(0, 100); // Show top 100 by default for perf
    return iconList
      .filter((name) => name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 100); // Limit results for perf
  }, [search]);

  // Dynamic component for the selected icon
  const SelectedIconComponent =
    (LucideIcons as any)[selectedIcon] || LucideIcons.HelpCircle;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors flex items-center gap-3 w-full"
        >
          <SelectedIconComponent className="w-6 h-6 text-primary" />
          <span className="font-medium text-lg">{selectedIcon}</span>
          <span className="ml-auto text-xs text-text-muted">Cambiar</span>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 bg-bg-surface-glass border border-white/10 rounded-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              autoFocus
              type="text"
              placeholder="Buscar ícono..."
              className="input pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-3 h-3 text-text-muted" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
            {filteredIcons.map((iconName) => {
              const Icon = (LucideIcons as any)[iconName];
              if (!Icon) return null;

              const isSelected = selectedIcon === iconName;

              return (
                <button
                  key={iconName}
                  onClick={() => {
                    onSelect(iconName);
                    setIsOpen(false);
                  }}
                  className={`aspect-square flex items-center justify-center rounded-lg transition-all ${
                    isSelected
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110"
                      : "hover:bg-white/10 text-text-secondary hover:text-white"
                  }`}
                  title={iconName}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
          <div className="text-xs text-center text-text-muted">
            Mostrando {filteredIcons.length} de {iconList.length} íconos
          </div>
        </div>
      )}
    </div>
  );
};
