'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';

import { Button } from '@workspace/ui/components/button';

export default function Page() {
        const users = useQuery(api.users.getMany);
        const addUser = useMutation(api.users.addUser);
        return (
                <div className="flex flex-col items-center justify-center min-h-svh gap-4">
                        <UserButton />

                        <OrganizationSwitcher hidePersonal={true} />

                        <Button onClick={() => addUser()}>Add</Button>
                </div>
        );
}
