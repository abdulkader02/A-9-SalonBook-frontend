"use client"

import { useState } from "react"
import { toast } from "sonner"

// Reusable ImgBB upload logic - used by both Sign Up and Profile Image update.
// Behavior is identical to what SignUpForm had: select -> preview -> upload -> URL.
export const useImgBBUpload = (initialImageUrl?: string) => {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImageUrl ?? null
  )
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl)
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (imageFile && imagePreview) URL.revokeObjectURL(imagePreview)

    if (!file) {
      setImageFile(null)
      setImagePreview(initialImageUrl ?? null)
      setImageUrl(initialImageUrl)
      return
    }

    // Accept image files only
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.")
      event.target.value = ""
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
    if (!apiKey) {
      toast.error("Image upload is unavailable: missing ImgBB API key.")
      event.target.value = ""
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImageUrl(undefined)

    // Upload to ImgBB; only the returned URL is kept.
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("image", file)

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      })
      const result = await res.json().catch(() => null)

      if (!res.ok || !result?.data?.url) {
        toast.error(
          result?.error?.message ?? "Image upload failed. Please try again."
        )
        return
      }

      setImageUrl(result.data.url)
    } catch {
      toast.error("Image upload failed. Please try again.")
    } finally {
      setUploadingImage(false)
    }
  }

  const clearImage = () => {
    if (imageFile && imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
    setImageUrl(undefined)
  }

  return {
    imageFile,
    imagePreview,
    imageUrl,
    uploadingImage,
    handleImageChange,
    clearImage,
  }
}