'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signIn } from 'next-auth/react';
import { AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);

    const res = await signIn('credentials', {
      name: username,
      password,
      redirect: false,
      callbackUrl: '/',
    });

    if (res?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid credentials',
      });
    } else {
      router.push('/');
    }

    setLoading(false);
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                type='text'
                placeholder='Enter your username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant='destructive'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button disabled={loading} type='submit' className='w-full'>
              {loading && <AlertCircle className='mr-2 h-4 w-4 animate-spin' />}
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <p>
            Don't have an account?{' '}
            <Link href='/register' className='text-blue-600 hover:underline'>
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
