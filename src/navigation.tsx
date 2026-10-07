import { createContext, useContext, type MouseEvent, type ReactNode } from 'react';

export const NavigationContext = createContext<(path: string) => void>(() => {});

export function NavigationLink({
  to,
  children,
  className,
  ...props
}: {
  to: string;
  children: ReactNode;
  className?: string;
  'aria-current'?: 'page';
}) {
  const navigate = useContext(NavigationContext);
  const click = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={click} className={className} {...props}>
      {children}
    </a>
  );
}
