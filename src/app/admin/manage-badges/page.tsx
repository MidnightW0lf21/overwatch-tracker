
import type { Metadata } from 'next';
import ManageBadgesPageClient from '@/components/admin/ManageBadgesPageClient';

export const metadata: Metadata = {
  title: 'Manage Heroes & Badges - Overwatch Progression Tracker',
  description: 'Add, edit, or remove heroes and their badges.',
};

export default function ManageBadgesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">Manage Heroes & Badges</h1>
        <p className="text-md text-muted-foreground mt-1">
          Add new heroes, edit existing ones, or manage their specific badges.
        </p>
      </header>
      <ManageBadgesPageClient />
    </div>
  );
}
