'use client';
import { OrganizationList } from '@clerk/nextjs';

export const OrganizationSelectView = () => {
        return (
                <OrganizationList
                        afterCreateOrganizationUrl={'/'}
                        afterSelectOrganizationUrl={'/'}
                        hidePersonal
                        skipInvitationScreen
                />
        );
};
