"use client"

import * as React from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { ChevronDown, Layers, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline"
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50 text-white",
          variant === "outline" && "border border-neutral-700 bg-transparent",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

// Types
export interface DropdownOption {
  id: string
  label: string
  Icon: LucideIcon
  color: string
}

// Icon wrapper with animation
const IconWrapper = ({
  Icon,
  isHovered,
  color,
}: { Icon: LucideIcon; isHovered: boolean; color: string }) => (
  <motion.div 
    className="w-4 h-4 mr-2 relative" 
    initial={false} 
    animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
  >
    <Icon className="w-4 h-4" />
    {isHovered && (
      <motion.div
        className="absolute inset-0"
        style={{ color }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Icon className="w-4 h-4" strokeWidth={2} />
      </motion.div>
    )}
  </motion.div>
)

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

interface FluidDropdownProps {
  options: DropdownOption[]
  value: string | null
  onChange: (id: string | null) => void
  placeholder?: string
  className?: string
}

// Main component
export function FluidDropdown({ options, value, onChange, placeholder = "Select option", className }: FluidDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [hoveredOptionId, setHoveredOptionId] = React.useState<string | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.id === value) || options[0]

  // Custom hook for click outside detection
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!dropdownRef.current || dropdownRef.current.contains(event.target as Node)) {
        return
      }
      setIsOpen(false)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={cn("w-full relative z-50", className)}
        ref={dropdownRef}
      >
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full justify-between bg-neutral-900 border-white/10 rounded-2xl h-[46px] px-4",
              "hover:bg-neutral-800 hover:text-neutral-200",
              "focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2 focus:ring-offset-black",
              "transition-all duration-200 ease-in-out",
              "border border-transparent focus:border-neutral-700 text-neutral-400 font-medium",
              isOpen && "bg-neutral-800 text-neutral-200",
            )}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <span className="flex items-center">
              {selectedOption && (
                <IconWrapper 
                  Icon={selectedOption.Icon} 
                  isHovered={false} 
                  color={selectedOption.color} 
                />
              )}
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center w-5 h-5 ml-2"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </Button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 1, y: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  height: "auto",
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 1,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: 0,
                  height: 0,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 1,
                  },
                }}
                className="absolute left-0 right-0 top-full mt-2 z-50 shadow-2xl"
                onKeyDown={handleKeyDown}
              >
                <motion.div
                  className="w-full rounded-2xl border border-neutral-800 bg-neutral-900 p-1 overflow-hidden"
                  initial={{ borderRadius: 12 }}
                  animate={{
                    borderRadius: 16,
                    transition: { duration: 0.2 },
                  }}
                  style={{ transformOrigin: "top" }}
                >
                  <motion.div 
                    className="py-1 relative" 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="visible"
                  >
                    <motion.div
                      layoutId="hover-highlight"
                      className="absolute inset-x-1 bg-neutral-800 rounded-xl"
                      animate={{
                        y: options.findIndex((opt) => (hoveredOptionId || selectedOption?.id) === opt.id) * 44,
                        height: 44,
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.5,
                      }}
                    />
                    {options.map((option, index) => (
                      <motion.button
                        key={option.id}
                        onClick={() => {
                          onChange(option.id === 'all' ? null : option.id)
                          setIsOpen(false)
                        }}
                        onHoverStart={() => setHoveredOptionId(option.id)}
                        onHoverEnd={() => setHoveredOptionId(null)}
                        className={cn(
                          "relative flex w-full items-center px-4 py-3 text-sm rounded-xl",
                          "transition-colors duration-150",
                          "focus:outline-none",
                          selectedOption?.id === option.id || hoveredOptionId === option.id
                            ? "text-white"
                            : "text-neutral-400",
                        )}
                        whileTap={{ scale: 0.98 }}
                        variants={itemVariants}
                      >
                        <IconWrapper
                          Icon={option.Icon}
                          isHovered={hoveredOptionId === option.id}
                          color={option.color}
                        />
                        <span className="font-medium">{option.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </MotionConfig>
  )
}
