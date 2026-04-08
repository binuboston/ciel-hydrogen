import {useEffect, useState} from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';

export function Aside({
  children,
  heading,
  id = 'aside',
}: {
  children?: React.ReactNode;
  heading: React.ReactNode;
  id?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const syncStateWithHash = () => {
      setOpen(window.location.hash === `#${id}`);
    };

    syncStateWithHash();
    window.addEventListener('hashchange', syncStateWithHash);
    return () => {
      window.removeEventListener('hashchange', syncStateWithHash);
    };
  }, [id]);

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen && window.location.hash === `#${id}`) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md" side="right">
        <SheetHeader className="border-b pb-3">
          <SheetTitle>{heading}</SheetTitle>
        </SheetHeader>
        <main className="h-[calc(100vh-4.75rem)] overflow-y-auto p-4">{children}</main>
      </SheetContent>
    </Sheet>
  );
}
