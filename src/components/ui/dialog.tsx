import * as React from 'react';
import * as Primitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Dialog = Primitive.Root;
export const DialogTitle = Primitive.Title;
export const DialogDescription = Primitive.Description;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof Primitive.Content>,
  React.ComponentPropsWithoutRef<typeof Primitive.Content> & { closeLabel?: string }
>(({ className, children, closeLabel = 'Close', ...props }, ref) => (
  <Primitive.Portal>
    <Primitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
    <Primitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-[16%] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-xl border border-border bg-background shadow-2xl',
        className,
      )}
      {...props}
    >
      {children}
      <Primitive.Close
        aria-label={closeLabel}
        className="absolute right-4 top-4 rounded-sm opacity-60 hover:opacity-100 focus-visible:ring-2"
      >
        <X size={18} />
      </Primitive.Close>
    </Primitive.Content>
  </Primitive.Portal>
));
DialogContent.displayName = 'DialogContent';
