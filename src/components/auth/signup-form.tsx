"use client";

import React from "react";
import { SignUpForm } from "@daveyplate/better-auth-ui";

interface DuxMaxSignUpFormProps {
  className?: string;
}

export const DuxMaxSignUpForm: React.FC<DuxMaxSignUpFormProps> = ({ className }) => {
  return (
    <div className="max-w-md mx-auto space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Create Your DuxMax Account</h1>
        <p className="text-muted-foreground">Join DuxMax and start buying or selling cars in the UAE.</p>
      </div>
      
      <SignUpForm 
        className={className}
        localization={{
          EMAIL_REQUIRED: "Email is required",
          PASSWORD_REQUIRED: "Password is required",
          USERNAME_IS_ALREADY_TAKEN: "Email is already taken"
        }}
      />
      
      <div className="text-center text-sm text-muted-foreground">
        <span>Already have an account? </span>
        <a href="/auth/signin" className="text-primary hover:underline">
          Sign in here
        </a>
      </div>
    </div>
  );
};
