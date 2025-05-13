
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Heroes & Badges - Overwatch Progression Tracker',
  description: 'Add, edit, or remove heroes and their badges.',
};

export default function ManageBadgesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
