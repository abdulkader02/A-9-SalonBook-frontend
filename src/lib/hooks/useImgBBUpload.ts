"use client"

import { useState } from "react"
import { toast } from "sonner"

const UPLOAD_ERROR_MESSAGE =
  "Image upload failed. Check your connection and try again."

// Only accept a real, absolute https URL from ImgBB - never store an empty or
// broken value in the form.
const isValidHttpsUrl = (value: unknown): value is string => {
  if (typeof value !== "string" || !value) return false

  try {
    return new URL(value).protocol === "https:"
  } catch {
    return false
  }
}

const extractImageUrl = (result: unknown): string | null => {
  if (!result || typeof result !== "object") return null

  const data = (result as { data?: unknown }).data
  if (!data || typeof data !== "object") return null

  const url = (data as { url?: unknown }).url
  return isValidHttpsUrl(url) ? url : null
}

// Reusable ImgBB upload logic - used by Sign Up, Profile Image and Service forms.
// Behavior is identical to what SignUpForm had: select -> preview -> upload -> URL.
export const useImgBBUpload = (initialImageUrl?: string) => {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImageUrl ?? null
  )
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  const revokePreview = (preview: string | null) => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview)
    }
  }

  const uploadFile = async (file: File) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY

    if (!apiKey) {
      setImageError(UPLOAD_ERROR_MESSAGE)
      toast.error("Image upload is unavailable: missing ImgBB API key.")
      return
    }

    setUploadingImage(true)
    setImageError(null)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      })
      const result: unknown = await res.json().catch(() => null)
      const url = extractImageUrl(result)

      if (!res.ok || !url) {
        setImageUrl(undefined)
        setImageError(UPLOAD_ERROR_MESSAGE)
        toast.error(UPLOAD_ERROR_MESSAGE)
        return
      }

      setImageUrl(url)
      setImageError(null)
    } catch {
      setImageUrl(undefined)
      setImageError(UPLOAD_ERROR_MESSAGE)
      toast.error(UPLOAD_ERROR_MESSAGE)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    revokePreview(imagePreview)

    if (!file) {
      setImageFile(null)
      setImagePreview(initialImageUrl ?? null)
      setImageUrl(initialImageUrl)
      setImageError(null)
      return
    }

    // Accept image files only
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.")
      event.target.value = ""
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImageUrl(undefined)
    setImageError(null)

    await uploadFile(file)
  }

  // Re-uploads the currently selected file after a failed attempt.
  const retryUpload = async () => {
    if (!imageFile || uploadingImage) return

    revokePreview(imagePreview)
    setImagePreview(URL.createObjectURL(imageFile))
    setImageUrl(undefined)

    await uploadFile(imageFile)
  }

  const clearImage = () => {
    revokePreview(imagePreview)
    setImageFile(null)
    setImagePreview(null)
    setImageUrl(undefined)
    setImageError(null)
  }

  return {
    imageFile,
    imagePreview,
    imageUrl,
    uploadingImage,
    imageError,
    handleImageChange,
    retryUpload,
    clearImage,
  }
}
