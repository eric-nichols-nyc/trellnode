"use client";

import { forwardRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FormErrors } from "./form-errors";

type FormInputProps = {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

// eslint-disable-next-line react/display-name
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      label,
      type,
      placeholder,
      required,
      disabled,
      errors,
      className,
      defaultValue,
      onBlur,
    },
    ref
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2">
        <div className="space-y-1">
          {label ? (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}{" "}
          <Input
            onBlur={onBlur}
            defaultValue={defaultValue}
            ref={ref}
            required={required}
            name={id}
            id={id}
            placeholder={placeholder}
            type={type}
            disabled={pending || disabled}
            className={cn("text-sm px-2 py-1 h-7", className)}
            aria-describedby={`${id}-error`}
          />
          <Input />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);
