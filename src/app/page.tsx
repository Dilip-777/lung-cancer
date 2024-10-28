'use server';

import UploadCard from '@/components/UploadCard';
import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function Component() {
  const session = await getServerAuthSession();

  if (!session || !session.user) {
    redirect('/login');
  }

  return <UploadCard />;
}
