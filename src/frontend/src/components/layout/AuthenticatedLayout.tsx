import { ReactNode } from 'react';
import SidebarNav from './SidebarNav';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
