'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, Input, Button, Link } from '@heroui/react';
import { signUp } from '@/lib/auth-client';

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());

    setLoading(true);

    try {
      const response = await signUp.email({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        callbackURL: '/dashboard',
      });

      if (response?.error) {
        toast.error('Registration failed. Try again.');
      } else {
        router.push('/dashboard');
        router.refresh();
        toast.success('Registration successful');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-zinc-950 p-4 min-h-screen">
      <Card className="w-full max-w-md bg-zinc-900 border border-zinc-800 text-white p-6 shadow-2xl">
        <CardHeader className="flex flex-col items-center pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            TechMart
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Create a new account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="flex flex-col gap-4">
              <Input
                name="name"
                type="text"
                label="Full Name"
                placeholder="John Doe"
                required
                variant="bordered"
                classNames={{
                  inputWrapper:
                    'border-zinc-700 bg-zinc-800 text-white hover:border-zinc-500',
                  label: 'text-zinc-300',
                }}
              />
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                required
                variant="bordered"
                classNames={{
                  inputWrapper:
                    'border-zinc-700 bg-zinc-800 text-white hover:border-zinc-500',
                  label: 'text-zinc-300',
                }}
              />
              <Input
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                required
                variant="bordered"
                classNames={{
                  inputWrapper:
                    'border-zinc-700 bg-zinc-800 text-white hover:border-zinc-500',
                  label: 'text-zinc-300',
                }}
              />
              
            </div>
            <Button
              type="submit"
              color="primary"
              variant="shadow"
              isLoading={loading}
              className="w-full font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
            >
              Sign Up
            </Button>
          </form>
          <div className="text-center mt-6 text-sm text-zinc-400">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-400 hover:underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
