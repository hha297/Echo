import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
        return <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">{children}</div>;
};

export default AuthLayout;
