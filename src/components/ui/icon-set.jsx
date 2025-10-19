import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils"; // Your utility for classname merging

// Remove initial mount animations to avoid initial load flicker

const IconGrid = React.forwardRef(({ items, className, onItemClick, selectedValue }, ref) => {
  // Determine grid layout based on number of items
  const getGridClasses = () => {
    if (items.length === 4) {
      return "grid grid-cols-2 gap-4 text-center";
    }
    return "grid grid-cols-2 gap-4 text-center md:grid-cols-3";
  };

  // No initial animations

  return (
    <motion.div
      ref={ref}
      initial={false}
      className={cn(
        getGridClasses(),
        className
      )}
    >
      {items.map((item) => {
        const isSelected = selectedValue === item.value;
        
        return (
          <motion.div
            key={item.id}
            className="group relative flex flex-col items-center justify-center cursor-pointer"
            aria-label={item.name}
            onClick={() => onItemClick && onItemClick(item)}
          >
            <div className="relative">
              <div
                className={`relative flex h-24 w-24 items-center justify-center rounded-2xl border transition-all duration-300 ease-in-out p-4 will-change-transform ${
                  isSelected
                    ? 'bg-blue-500/30 border-blue-400/60 shadow-lg shadow-blue-500/20 -translate-y-1'
                    : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30 hover:shadow-lg hover:-translate-y-1'
                }`}
                
                
              >
                {item.icon}

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </motion.div>
                )}
              </div>

              {/* Selection glow - always rendered, opacity controlled */}
              <div
                className={`absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl -z-10 scale-110 transition-opacity duration-300 ${
                  isSelected ? 'opacity-100' : 'opacity-0'
                }`}
              ></div>
            </div>
            
            <span 
              className={`mt-2 text-sm font-medium transition-colors ${
                isSelected ? 'text-blue-200' : 'text-white/90 group-hover:text-white'
              }`}
            >
              {item.name}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
});

IconGrid.displayName = "IconGrid";

export { IconGrid };