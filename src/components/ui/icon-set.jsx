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

const IconGrid = React.forwardRef(({ items, className, onItemClick }, ref) => {
  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "grid grid-cols-2 gap-4 text-center md:grid-cols-3",
        className
      )}
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          className="group relative flex flex-col items-center justify-center cursor-pointer"
          aria-label={item.name}
          onClick={() => onItemClick && onItemClick(item)}
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg p-4 transition-all duration-300 ease-in-out hover:bg-white/15 hover:border-white/30 hover:shadow-lg hover:-translate-y-1">
            {item.icon}
          </div>
          <span className="mt-2 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
            {item.name}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
});

IconGrid.displayName = "IconGrid";

export { IconGrid };