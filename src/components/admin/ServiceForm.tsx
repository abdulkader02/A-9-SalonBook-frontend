"use client"

import { useState } from "react"
import { useImgBBUpload } from "@/lib/hooks/useImgBBUpload"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Service } from "@/lib/type/services"

interface ServiceFormProps {
  initialValues?: Partial<Service>
  onSubmit: (data: Partial<Service>) => Promise<void>
  submitLabel: string
  isSubmitting?: boolean
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  initialValues,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<Partial<Service>>(initialValues || {})

  // useImgBBUpload handles the file upload internally and exposes upload state
  const { imagePreview, imageUrl, uploadingImage, handleImageChange, clearImage } =
    useImgBBUpload(initialValues?.image)

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  const handleStatusChange = (newValue: string | null) => {
    if (newValue !== null) {
      setFormData((prev) => ({ ...prev, status: newValue as "active" | "inactive" }))
    }
  }

  const handleClearImage = () => {
    clearImage()
    setFormData((prev) => ({ ...prev, image: undefined }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Validation: all required fields must be present and valid
    const price = Number(formData.price)
    const duration = Number(formData.duration)

    if (!formData.serviceName?.trim() || !formData.category?.trim() || !formData.description?.trim()) {
      toast.error("Please fill in all text fields.")
      return
    }
    if (!formData.image && imageUrl === undefined) {
      // imageUrl is set by hook
      if (!imageUrl) {
        toast.error("Please upload an image for the service.")
        return
      }
    }
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a positive number.")
      return
    }
    if (isNaN(duration) || duration <= 0) {
      toast.error("Duration must be a positive number (minutes).")
      return
    }
    if (uploadingImage) {
      toast.error("Image is still uploading. Please wait.")
      return
    }

    // Combine form data with the uploaded image URL
    const payload: Partial<Service> = {
      ...formData,
      image: imageUrl ?? formData.image,
      status: (formData.status as "active" | "inactive") ?? "active",
    }

    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image upload area */}
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Service Image
        </label>
        <div className="flex items-center gap-3">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Service preview"
                className="w-32 h-20 object-cover rounded-xl border"
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute -top-2 -right-2 size-6 rounded-full bg-destructive text-white flex items-center justify-center text-xs hover:bg-destructive/80"
              >
                ×
              </button>
            </div>
          ) : (
            <label
              htmlFor="service-image"
              className="cursor-pointer flex h-20 w-32 items-center justify-center rounded-xl border border-dashed bg-muted text-xs text-muted-foreground hover:bg-muted/60"
            >
              Upload image
            </label>
          )}
          <input
            type="file"
            id="service-image"
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
          {uploadingImage && (
            <span className="text-xs text-muted-foreground">Uploading...</span>
          )}
        </div>
      </div>

      {/* Text fields */}
      <div>
        <label htmlFor="serviceName" className="block text-sm font-medium mb-1.5">
          Service Name
        </label>
        <input
          type="text"
          id="serviceName"
          name="serviceName"
          value={formData.serviceName !== undefined ? formData.serviceName : ""}
          onChange={handleInputChange}
          placeholder="e.g. Classic Haircut"
          className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1.5">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category !== undefined ? formData.category : ""}
          onChange={handleInputChange}
          placeholder="e.g. Haircut & Styling"
          className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description !== undefined ? formData.description : ""}
          onChange={handleInputChange}
          placeholder="Describe the service..."
          rows={3}
          className="flex min-h-[100px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1.5">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price !== undefined ? String(formData.price) : ""}
            onChange={handleInputChange}
            placeholder="e.g. 45"
            step="0.01"
            min="0"
            className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
            required
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium mb-1.5">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration !== undefined ? String(formData.duration) : ""}
            onChange={handleInputChange}
            placeholder="e.g. 60"
            min="0"
            className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
            required
          />
        </div>
      </div>

      {/* Status select */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1.5">
          Status
        </label>
        <Select
          value={formData.status || "active"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger id="status" className="w-full justify-between gap-2 rounded-lg border border-input px-3 py-1 text-sm">
            <SelectValue placeholder="Select status" className="text-left">
              <span className="capitalize">{formData.status || "Active"}</span>
            </SelectValue>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 pointer-events-none text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit button */}
      <Button type="submit" disabled={isSubmitting || uploadingImage} className="w-full">
        {isSubmitting ? (
          <span className="inline-flex items-center justify-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
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