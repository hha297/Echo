'use client';

import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { AuthLayout } from '../layout/auth-layout';
import { SignInView } from '../views/sign-in-view';
import { Loader2Icon } from 'lucide-react';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
        return (
                <>
                        <AuthLoading>
                                <AuthLayout>
                                        <Loader2Icon className="animate-spin size-10 text-primary" />
                                        <p>Loading...</p>
                                </AuthLayout>
                        </AuthLoading>
                        <Authenticated>{children}</Authenticated>
                        <Unauthenticated>
                                <AuthLayout>
                                        <SignInView />
                                </AuthLayout>
                        </Unauthenticated>
                </>
        );
};
