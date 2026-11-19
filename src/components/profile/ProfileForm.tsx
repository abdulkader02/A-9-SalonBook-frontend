"use client"

import { useState } from "react"
import Image from "next/image"
import { Clock, Scissors } from "lucide-react"
import { toast } from "sonner"

import { updateUserProfile } from "@/lib/api/users"
import type { User } from "@/lib/type/users"
import { useImgBBUpload } from "@/lib/hooks/useImgBBUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const roleVariant = {
  admin: "destructive",
  customer: "secondary",
} as const

// Loose "looks like a phone number" check - phone stays optional, but when
// filled in it must contain a real number.
const PHONE_PATTERN = /^\+?[0-9][0-9\s().-]{4,}$/

interface FieldErrors {
  name?: string
  phone?: string
}

interface ProfileFormProps {
  user: User
  userId: string
  onSaved?: (user: User) => void
  // The admin profile shows inline messages under the fields. The customer
  // profile keeps its original toast-only validation so nothing changes there.
  strictValidation?: boolean
}

const ProfileForm = ({
  user,
  userId,
  onSaved,
  strictValidation = false,
}: ProfileFormProps) => {
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone ?? "")
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  // Reuse the existing ImgBB upload hook for profile image updates.
  const { imagePreview, imageUrl, uploadingImage, handleImageChange } =
    useImgBBUpload(user.image ?? undefined)

  // Normalize image URL for display: prefer the new-image preview, then the
  // uploaded URL, then the existing image. Treat null as "no image".
  const displayImage = imagePreview ?? imageUrl ?? user.image ?? null
  const displayRole = user.role || "customer"

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {}

    if (!name.trim()) errors.name = "Full name is required."

    const trimmedPhone = phone.trim()
    if (trimmedPhone) {
      const digits = trimmedPhone.replace(/\D/g, "")
      if (!PHONE_PATTERN.test(trimmedPhone) || digits.length < 5) {
        errors.phone = "Enter a valid phone number."
      }
    }

    return errors
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (strictValidation && fieldErrors.name) {
      setFieldErrors((prev) => ({ ...prev, name: undefined }))
    }
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value)
    if (strictValidation && fieldErrors.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: undefined }))
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (imagePreview && !imageUrl) {
      toast.error("Image upload failed. Please choose the image again.")
      return
    }

    if (strictValidation) {
      const errors = validate()
      setSubmitted(true)
      setFieldErrors(errors)
      if (errors.name || errors.phone) return
    } else if (!name.trim()) {
      toast.error("Full name is required.")
      return
    }

    if (!userId) {
      toast.error("Unable to identify your account. Please sign in again.")
      return
    }

    setSaving(true)
    try {
      // Determine the image URL to send: use the newly uploaded URL if a
      // new image was selected, otherwise preserve the existing image.
      // Convert null to undefined so the field is omitted when there's no image.
      const imageToSend = imageUrl ?? user.image ?? undefined

      await updateUserProfile(userId, {
        name: name.trim(),
        image: imageToSend,
        phone: phone.trim(),
      })

      // Synchronize the visible profile with the updated values.
      onSaved?.({
        ...user,
        name: name.trim(),
        image: imageToSend ?? null,
        phone: phone.trim() || null,
      })

      toast.success("Profile updated successfully.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile."
      )
    } finally {
      setSaving(false)
    }
  }

  const nameError = strictValidation && submitted ? fieldErrors.name : undefined
  const phoneError =
    strictValidation && submitted ? fieldErrors.phone : undefined

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Profile summary card */}
      <div className="lg:col-span-1">
        <div className="rounded-2xl border p-5 sm:p-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex size-24 shrink-0 items-center justify-center rounded-full bg-muted">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={user.name}
                  fill
                  loading="eager"
                  unoptimized
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <Scissors className="size-8" />
                </div>
              )}
              {uploadingImage && (
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                  <Clock className="size-5 animate-spin text-white" />
                </span>
              )}
            </div>
            <p className="text-lg font-semibold">{user.name}</p>
            <Badge variant="secondary" className="shrink-0">
              {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)}
            </Badge>
          </div>

          <Separator className="my-5" />

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex shrink-0 items-center text-muted-foreground">
                <span className="size-5">@</span>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
            {user.phone && (
              <div className="flex items-start gap-3">
                <div className="flex shrink-0 items-center text-muted-foreground">
                  <span className="size-5">&#9742;</span>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {user.phone}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border p-5 sm:p-6">
          <h2 className="mb-5 text-lg font-semibold">Edit Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input
                id="profile-name"
                type="text"
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
                disabled={saving || uploadingImage}
                aria-invalid={Boolean(nameError)}
                required={!strictValidation}
              />
              {nameError && (
                <p className="text-xs text-destructive">{nameError}</p>
              )}
            </div>

            {/* Profile Image */}
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={saving}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground hover:file:bg-accent/80"
              />
              {uploadingImage && (
                <p className="text-xs text-muted-foreground">
                  Uploading image...
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone Number</Label>
              <Input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(event) => handlePhoneChange(event.target.value)}
                placeholder="e.g. +1 555 123 4567"
                disabled={saving || uploadingImage}
                aria-invalid={Boolean(phoneError)}
              />
              {phoneError ? (
                <p className="text-xs text-destructive">{phoneError}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Optional. Used for appointment reminders.
                </p>
              )}
            </div>

            {/* Read-only fields notice */}
            <div className="space-y-2 border-t pt-4">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Account Information
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <Badge
                    variant={
                      roleVariant[user.role as keyof typeof roleVariant] ??
                      "secondary"
                    }
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={saving || uploadingImage}
            >
              {saving ? (
                <>
                  <Clock className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileForm
