"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { errorMessages } from "@/lib/utils"

interface ValidationRule {
  required?: boolean
  validator?: (value: any) => boolean
  message?: string
}

interface ValidationRules {
  [key: string]: ValidationRule
}

interface UseFormProps<T> {
  initialValues: T
  validationRules?: ValidationRules
  onSubmit: (values: T) => Promise<void> | void
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>("")

  const setValue = useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }))

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }))
      }
    },
    [errors],
  )

  const validateField = useCallback(
    (name: keyof T, value: any): string | undefined => {
      const rule = validationRules[name as string]
      if (!rule) return undefined

      if (rule.required && (!value || (typeof value === "string" && !value.trim()))) {
        return rule.message || errorMessages.required
      }

      if (value && rule.validator && !rule.validator(value)) {
        return rule.message || "Invalid value"
      }

      return undefined
    },
    [validationRules],
  )

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName as keyof T, values[fieldName as keyof T])
      if (error) {
        newErrors[fieldName as keyof T] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [values, validationRules, validateField])

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      setSubmitError("")

      if (!validateForm()) {
        return
      }

      setIsSubmitting(true)

      try {
        await onSubmit(values)
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, validateForm, onSubmit],
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setSubmitError("")
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    isSubmitting,
    submitError,
    setValue,
    handleSubmit,
    reset,
    validateField,
    setSubmitError,
  }
}
