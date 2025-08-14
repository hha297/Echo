'use client';

import { useOrganization } from '@clerk/nextjs';
import { AuthLayout } from '../layout/auth-layout';
import { OrganizationSelectView } from '../views/org-select-view';

export const OrganizationGuard = ({ children }: { children: React.ReactNode }) => {
        const { organization } = useOrganization();

        if (!organization) {
                return (
                        <AuthLayout>
                                <OrganizationSelectView />
                        </AuthLayout>
                );
        }
        return <>{children}</>;
};
