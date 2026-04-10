"use client"

import * as React from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { ChevronDown, Braces, Coffee, Cpu, Zap, Terminal, Code2 } from "lucide-react"

// Utility function for className merging
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

// Custom hook for click outside detection
function useClickAway(ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])
}

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
          "disabled:pointer-events-none disabled:opacity-50",
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
export interface LanguageOption {
  id: string
  label: string
  icon: React.ElementType
  color: string
}

const languages: LanguageOption[] = [
  { id: "python", label: "Python", icon: Terminal, color: "#3776AB" },
  { id: "javascript", label: "JavaScript", icon: Braces, color: "#F7DF1E" },
  { id: "java", label: "Java", icon: Coffee, color: "#007396" },
  { id: "cpp", label: "C++", icon: Cpu, color: "#00599C" },
  { id: "c", label: "C", icon: Zap, color: "#A8B9CC" },
]

// Icon wrapper with animation
const IconWrapper = ({
  icon: Icon,
  isHovered,
  color,
}: { icon: React.ElementType; isHovered: boolean; color: string }) => (
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
  value: string;
  onSelect: (value: any) => void;
}

// Main component
export function FluidDropdown({ value, onSelect }: FluidDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectedLanguage = languages.find(l => l.id === value) || languages[0]
  const [hoveredLang, setHoveredLang] = React.useState<string | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  useClickAway(dropdownRef, () => setIsOpen(false))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="w-48 relative"
        ref={dropdownRef}
      >
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full justify-between bg-neutral-900 text-neutral-400 px-4",
              "hover:bg-neutral-800 hover:text-neutral-200",
              "focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2 focus:ring-offset-black",
              "transition-all duration-200 ease-in-out",
              "border border-transparent focus:border-neutral-700",
              "h-10 rounded-xl",
              isOpen && "bg-neutral-800 text-neutral-200",
            )}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <span className="flex items-center font-bold">
              <IconWrapper 
                icon={selectedLanguage.icon} 
                isHovered={false} 
                color={selectedLanguage.color} 
              />
              {selectedLanguage.label}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center w-5 h-5"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </Button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 0, height: 0 }}
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
                className="absolute left-0 right-0 top-full mt-2 z-50"
                onKeyDown={handleKeyDown}
              >
                <motion.div
                  className="w-full rounded-2xl border border-white/5 bg-[#0a0a0c] p-1 shadow-2xl backdrop-blur-xl"
                  initial={{ borderRadius: 8 }}
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
                      className="absolute inset-x-1 bg-white/5 rounded-xl"
                      animate={{
                        y: languages.findIndex((l) => (hoveredLang || selectedLanguage.id) === l.id) * 44,
                        height: 44,
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.5,
                      }}
                    />
                    {languages.map((lang) => (
                      <motion.button
                        key={lang.id}
                        onClick={() => {
                          onSelect(lang.id)
                          setIsOpen(false)
                        }}
                        onHoverStart={() => setHoveredLang(lang.id)}
                        onHoverEnd={() => setHoveredLang(null)}
                        className={cn(
                          "relative flex w-full items-center px-4 py-3 text-sm rounded-xl",
                          "transition-colors duration-150",
                          "focus:outline-none",
                          selectedLanguage.id === lang.id || hoveredLang === lang.id
                            ? "text-neutral-100"
                            : "text-neutral-400",
                        )}
                        whileTap={{ scale: 0.98 }}
                        variants={itemVariants}
                      >
                        <IconWrapper
                          icon={lang.icon}
                          isHovered={hoveredLang === lang.id}
                          color={lang.color}
                        />
                        <span className="font-bold">{lang.label}</span>
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
