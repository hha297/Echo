import { type IntegrationId, HTML_SCRIPT, JAVASCRIPT_SCRIPT, NEXT_SCRIPT, REACT_SCRIPT } from './constants';

export const createScript = (integrationId: IntegrationId, organizationId: string) => {
        if (integrationId === 'html') {
                return HTML_SCRIPT.replace(/{{ORGANIZATION_ID}}/g, organizationId);
        }

        if (integrationId === 'javascript') {
                return JAVASCRIPT_SCRIPT.replace(/{{ORGANIZATION_ID}}/g, organizationId);
        }
        if (integrationId === 'reactjs') {
                return REACT_SCRIPT.replace(/{{ORGANIZATION_ID}}/g, organizationId);
        }
        if (integrationId === 'nextjs') {
                return NEXT_SCRIPT.replace(/{{ORGANIZATION_ID}}/g, organizationId);
        }

        return '';
};
