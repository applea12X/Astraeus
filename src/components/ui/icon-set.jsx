import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils"; // Your utility for classname merging

// Animation variants for the container to orchestrate children animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Time delay between each child animating in
    },
  },
};

// Animation variants for each individual grid item
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const IconGrid = React.forwardRef(({ items, className, onItemClick, selectedValue }, ref) => {
  // Determine grid layout based on number of items
  const getGridClasses = () => {
    if (items.length === 4) {
      return "grid grid-cols-2 gap-4 text-center";
    }
    return "grid grid-cols-2 gap-4 text-center md:grid-cols-3";
  };

  // Only trigger container animation on initial mount, not on selection changes
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    if (!hasAnimated) {
      setHasAnimated(true);
    }
  }, [hasAnimated]);

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial={hasAnimated ? false : "hidden"}
      animate={hasAnimated ? false : "visible"}
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
            variants={hasAnimated ? false : itemVariants}
            className="group relative flex flex-col items-center justify-center cursor-pointer"
            aria-label={item.name}
            onClick={() => onItemClick && onItemClick(item)}
          >
            <div 
              className={`relative flex h-24 w-24 items-center justify-center rounded-2xl border transition-all duration-300 ease-in-out backdrop-blur-lg p-4 ${
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
              
              {/* Selection glow */}
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl -z-10 scale-110"></div>
              )}
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