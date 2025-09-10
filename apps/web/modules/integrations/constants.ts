export const INTEGRATIONS = [
        {
                id: 'html',
                icon: '/languages/html5.svg',
                title: 'HTML',
        },
        {
                id: 'javascript',
                icon: '/languages/javascript.svg',
                title: 'JavaScript',
        },
        {
                id: 'reactjs',
                icon: '/languages/react.svg',
                title: 'React.js',
        },
        {
                id: 'nextjs',
                icon: '/languages/nextjs.svg',
                title: 'Next.js',
        },
];

export type IntegrationId = (typeof INTEGRATIONS)[number]['id'];

export const HTML_SCRIPT = `<script src="http://localhost:3001/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`;
export const REACT_SCRIPT = `<script src="http://localhost:3001/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`;
export const NEXT_SCRIPT = `<script src="http://localhost:3001/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`;
export const JAVASCRIPT_SCRIPT = `<script src="http://localhost:3001/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`;
