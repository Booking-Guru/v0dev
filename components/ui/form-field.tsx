"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({ label, error, required, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className={cn("text-sm font-medium", required && "after:content-['*'] after:text-red-500 after:ml-1")}>
        {label}
      </Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
}

export function FormInput({ label, error, required, className, ...props }: FormInputProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <Input className={cn(error && "border-red-500 focus-visible:ring-red-500", className)} {...props} />
    </FormField>
  )
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  required?: boolean
}

export function FormTextarea({ label, error, required, className, ...props }: FormTextareaProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <Textarea className={cn(error && "border-red-500 focus-visible:ring-red-500", className)} {...props} />
    </FormField>
  )
}

interface FormSelectProps {
  label: string
  error?: string
  required?: boolean
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export function FormSelect({ label, error, required, placeholder, value, onValueChange, children }: FormSelectProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn(error && "border-red-500 focus-visible:ring-red-500")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </FormField>
  )
}
