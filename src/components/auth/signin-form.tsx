'use client';

import React from 'react';
import { SignInForm } from '@daveyplate/better-auth-ui';

interface DuxMaxSignInFormProps {
  className?: string;
}

export const DuxMaxSignInForm: React.FC<DuxMaxSignInFormProps> = ({
  className,
}) => {
  return (
    <div className="max-w-md mx-auto space-y-6 p-6">
      <SignInForm
        className={className}
        localization={{
          EMAIL_REQUIRED: 'Email is required',
          PASSWORD_REQUIRED: 'Password is required',
          INVALID_USERNAME_OR_PASSWORD: 'Invalid email or password',
        }}
      />
    </div>
  );
};
