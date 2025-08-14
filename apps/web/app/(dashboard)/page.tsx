'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { Button } from '@workspace/ui/components/button';

export default function Page() {
        const users = useQuery(api.users.getMany);
        const addUser = useMutation(api.users.addUser);
        return (
                <>
                        <UserButton />

                        <OrganizationSwitcher hidePersonal={true} />
                        {JSON.stringify(users, null, 2)}
                        <Button onClick={() => addUser()}>Add</Button>
                </>
        );
}
