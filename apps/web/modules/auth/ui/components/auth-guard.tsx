'use client';

import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { AuthLayout } from '../layout/auth-layout';
import { SignInView } from '../views/sign-in-view';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
        return (
                <>
                        <AuthLoading>
                                <AuthLayout>
                                        <p>Loading</p>
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
