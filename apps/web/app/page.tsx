'use client';

import { add } from '@workspace/math/add';
import { Button } from '@workspace/ui/components/button';
import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { SignInButton, UserButton } from '@clerk/nextjs';

export default function Page() {
        const users = useQuery(api.users.getMany);
        return (
                <>
                        <Authenticated>
                                <UserButton />
                                {JSON.stringify(users)}
                        </Authenticated>
                        <Unauthenticated>
                                <SignInButton>SignIn</SignInButton>
                        </Unauthenticated>
                </>
        );
}
