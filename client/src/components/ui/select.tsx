import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

// Create a context to manage scroll locking across components
const ScrollLockContext = React.createContext({
  lockScroll: () => {},
  unlockScroll: () => {},
  isLocked: false,
  setOpen: (open: boolean) => {},
});

// Create a provider component to wrap our application
const ScrollLockProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isLocked, setIsLocked] = React.useState(false);
  const scrollPosition = React.useRef(0);
  
  const lockScroll = React.useCallback(() => {
    if (typeof window !== 'undefined' && !isLocked) {
      scrollPosition.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';
      setIsLocked(true);
    }
  }, [isLocked]);
  
  const unlockScroll = React.useCallback(() => {
    if (typeof window !== 'undefined' && isLocked) {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition.current);
      setIsLocked(false);
    }
  }, [isLocked]);
  
  const setOpen = React.useCallback((open: boolean) => {
    if (open) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }, [lockScroll, unlockScroll]);
  
  return (
    <ScrollLockContext.Provider value={{ lockScroll, unlockScroll, isLocked, setOpen }}>
      {children}
    </ScrollLockContext.Provider>
  );
};

// Custom hook to use scroll lock
const useScrollLock = () => React.useContext(ScrollLockContext);

// Wrap the Select component to include scroll lock functionality
const Select = ({ children, onOpenChange, ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) => {
  const { setOpen } = useScrollLock();
  
  // Handle opening and closing
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };
  
  return (
    <SelectPrimitive.Root onOpenChange={handleOpenChange} {...props}>
      {children}
    </SelectPrimitive.Root>
  );
};

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  // Use scroll lock context
  const { lockScroll } = useScrollLock();
  
  // Combine event handling
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Stop propagation to prevent any scroll
    e.stopPropagation();
    
    // Lock scroll when the dropdown is opened
    lockScroll();
    
    // Call the original onClick if it exists
    if (props.onClick) {
      props.onClick(e);
    }
  };
  
  // Render the trigger with our enhancements
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
  // Get scroll lock functions from context
  const { unlockScroll } = useScrollLock();
  
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        onCloseAutoFocus={(event) => {
          // Prevent the default focus behavior
          event.preventDefault();
          // Trigger scroll unlock
          unlockScroll();
        }}
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md select-none",
          className
        )}
        position="popper" 
        sideOffset={4}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "w-full min-w-[var(--radix-select-trigger-width)]"
          )}
          // Prevent mousedown events (which can cause focus changes)
          onMouseDown={(e) => e.preventDefault()}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
})
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    // Disable text selection which can cause scroll jumps
    onMouseDown={(e) => e.preventDefault()}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  ScrollLockProvider,
}
