"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useImgBBUpload } from "@/lib/hooks/useImgBBUpload"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import type { Service, ServiceStatus } from "@/lib/type/services"

interface ServiceFormProps {
  initialValues?: Partial<Service>
  onSubmit: (data: Partial<Service>) => Promise<void>
  submitLabel: string
  isSubmitting?: boolean
}

type FieldName = "serviceName" | "category" | "description" | "price" | "duration"

interface FormValues {
  serviceName: string
  category: string
  description: string
  price: string
  duration: string
  status: ServiceStatus
}

type FieldErrors = Record<FieldName, string | null>

const toFormValues = (initial?: Partial<Service>): FormValues => ({
  serviceName: initial?.serviceName ?? "",
  category: initial?.category ?? "",
  description: initial?.description ?? "",
  price: initial?.price !== undefined ? String(initial.price) : "",
  duration: initial?.duration !== undefined ? String(initial.duration) : "",
  status: initial?.status === "inactive" ? "inactive" : "active",
})

const validate = (values: FormValues): FieldErrors => {
  const price = Number(values.price)
  const duration = Number(values.duration)
  const priceProvided = values.price.trim() !== ""
  const durationProvided = values.duration.trim() !== ""

  return {
    serviceName: values.serviceName.trim() ? null : "Service name is required.",
    category: values.category.trim() ? null : "Category is required.",
    description: values.description.trim() ? null : "Description is required.",
    price:
      priceProvided && Number.isFinite(price) && price > 0
        ? null
        : "Price must be a positive number.",
    duration:
      durationProvided &&
      Number.isFinite(duration) &&
      Number.isInteger(duration) &&
      duration > 0
        ? null
        : "Duration must be a positive whole number of minutes.",
  }
}

const inputClassName =
  "flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"

const ServiceForm = ({
  initialValues,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}: ServiceFormProps) => {
  const [values, setValues] = useState<FormValues>(() =>
    toFormValues(initialValues)
  )
  const [touched, setTouched] = useState<Partial<Record<FieldName | "image", boolean>>>(
    {}
  )
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  // useImgBBUpload handles the file upload internally and exposes upload state
  const {
    imageFile,
    imagePreview,
    imageUrl,
    uploadingImage,
    imageError,
    handleImageChange,
    retryUpload,
    clearImage,
  } = useImgBBUpload(initialValues?.image)

  const errors = validate(values)
  const imageIsValid = Boolean(imageUrl) && !imageError
  const isBusy = isSubmitting || saving

  const showError = (field: FieldName | "image") => submitted || touched[field]

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const markTouched = (field: FieldName | "image") => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleStatusChange = (newValue: string | null) => {
    if (newValue === "active" || newValue === "inactive") {
      setValues((prev) => ({ ...prev, status: newValue }))
    }
  }

  const handleClearImage = () => {
    clearImage()
    markTouched("image")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)

    const hasFieldErrors = Object.values(errors).some(Boolean)

    if (hasFieldErrors || uploadingImage || !imageIsValid || !imageUrl) {
      toast.error("Please fix the highlighted fields before saving.")
      return
    }

    const payload: Partial<Service> = {
      serviceName: values.serviceName.trim(),
      category: values.category.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      duration: Number(values.duration),
      image: imageUrl,
      status: values.status,
    }

    // Keeps every value the user typed if the request fails - the parent only
    // shows an error toast, it never resets this form.
    setSaving(true)
    try {
      await onSubmit(payload)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Image upload area */}
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Service Image <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center gap-3">
          {imagePreview ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Service preview"
                className="h-20 w-32 rounded-xl border object-cover"
              />
              <button
                type="button"
                onClick={handleClearImage}
                aria-label="Remove image"
                className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-destructive text-xs text-white hover:bg-destructive/80"
              >
                ×
              </button>
            </div>
          ) : (
            <label
              htmlFor="service-image"
              className="flex h-20 w-32 cursor-pointer items-center justify-center rounded-xl border border-dashed bg-muted text-xs text-muted-foreground hover:bg-muted/60"
            >
              Upload image
            </label>
          )}
          <input
            type="file"
            id="service-image"
            onChange={handleImageChange}
            onBlur={() => markTouched("image")}
            className="hidden"
            accept="image/*"
          />
        </div>

        {uploadingImage && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            Uploading image...
          </p>
        )}

        {!uploadingImage && imageError && (
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <p className="text-xs text-destructive">{imageError}</p>
            {imageFile && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  void retryUpload()
                }}
              >
                Retry
              </Button>
            )}
          </div>
        )}

        {!uploadingImage && !imageError && !imageUrl && showError("image") && (
          <p className="mt-1.5 text-xs text-destructive">
            Service image is required.
          </p>
        )}
      </div>

      {/* Text fields */}
      <div>
        <label htmlFor="serviceName" className="block text-sm font-medium mb-1.5">
          Service Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="serviceName"
          name="serviceName"
          value={values.serviceName}
          onChange={handleInputChange}
          onBlur={() => markTouched("serviceName")}
          placeholder="e.g. Classic Haircut"
          aria-invalid={showError("serviceName") && Boolean(errors.serviceName)}
          aria-describedby="serviceName-error"
          className={inputClassName}
        />
        {showError("serviceName") && errors.serviceName && (
          <p id="serviceName-error" className="mt-1.5 text-xs text-destructive">
            {errors.serviceName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1.5">
          Category <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={values.category}
          onChange={handleInputChange}
          onBlur={() => markTouched("category")}
          placeholder="e.g. Haircut & Styling"
          aria-invalid={showError("category") && Boolean(errors.category)}
          aria-describedby="category-error"
          className={inputClassName}
        />
        {showError("category") && errors.category && (
          <p id="category-error" className="mt-1.5 text-xs text-destructive">
            {errors.category}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1.5">
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleInputChange}
          onBlur={() => markTouched("description")}
          placeholder="Describe the service..."
          rows={3}
          aria-invalid={showError("description") && Boolean(errors.description)}
          aria-describedby="description-error"
          className="flex min-h-[100px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors resize-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
        />
        {showError("description") && errors.description && (
          <p id="description-error" className="mt-1.5 text-xs text-destructive">
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1.5">
            Price ($) <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={values.price}
            onChange={handleInputChange}
            onBlur={() => markTouched("price")}
            placeholder="e.g. 45"
            step="0.01"
            min="0"
            aria-invalid={showError("price") && Boolean(errors.price)}
            aria-describedby="price-error"
            className={inputClassName}
          />
          {showError("price") && errors.price && (
            <p id="price-error" className="mt-1.5 text-xs text-destructive">
              {errors.price}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium mb-1.5">
            Duration (minutes) <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={values.duration}
            onChange={handleInputChange}
            onBlur={() => markTouched("duration")}
            placeholder="e.g. 60"
            step="1"
            min="0"
            aria-invalid={showError("duration") && Boolean(errors.duration)}
            aria-describedby="duration-error"
            className={inputClassName}
          />
          {showError("duration") && errors.duration && (
            <p id="duration-error" className="mt-1.5 text-xs text-destructive">
              {errors.duration}
            </p>
          )}
        </div>
      </div>

      {/* Status select */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1.5">
          Status
        </label>
        <Select value={values.status} onValueChange={handleStatusChange}>
          <SelectTrigger
            id="status"
            className="w-full justify-between gap-2 rounded-lg border border-input px-3 py-1 text-sm"
          >
            <SelectValue placeholder="Select status" className="text-left">
              <span className="capitalize">{values.status}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        disabled={isBusy || uploadingImage}
        className="w-full"
      >
        {isBusy ? (
          <span className="inline-flex items-center justify-center gap-1.5">
            <Loader2 className="size-4 animate-spin" />
            Saving...
          </span>
        ) : (
          <span>{submitLabel}</span>
        )}
      </Button>
    </form>
  )
}

export { ServiceForm }
