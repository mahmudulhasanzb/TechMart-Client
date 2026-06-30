'use client';

import { HeroUIProvider } from '@heroui/react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }) {
  return (
    <>
      <HeroUIProvider className="h-full">
        {children}
      </HeroUIProvider>
      <Toaster />
    </>
  );
}
