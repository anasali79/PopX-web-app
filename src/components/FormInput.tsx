
import React from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, required = false, className, ...props }, ref) => {
    return (
      <div className="mb-4 animate-slide-up">
        <label className="form-label">
          {label}
          {required && <span className="text-purple">*</span>}
        </label>
        <input
          ref={ref}
          className={cn("form-input input-transition", className)}
          {...props}
        />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
