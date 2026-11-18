"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AlertCircle, Clock, Scissors } from "lucide-react"
import { toast } from "sonner"

import { useSession } from "@/lib/auth-client"
import { getUserById, updateUserProfile } from "@/lib/api/users"
import type { User } from "@/lib/type/users"
import { useImgBBUpload } from "@/lib/hooks/useImgBBUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const roleVariant = {
  admin: "destructive",
  customer: "secondary",
} as const

const CustomerProfilePage = () => {
  const { data: session, isPending: sessionLoading } = useSession()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [saving, setSaving] = useState(false)

  // Local form state (name and phone). Image is handled by the upload hook.
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const customerId = session?.user?.id

  // Reuse the existing ImgBB upload hook for profile image updates.
  const {
    imagePreview,
    imageUrl,
    uploadingImage,
    handleImageChange,
    clearImage,
  } = useImgBBUpload(user?.image ?? undefined)

  // Normalize image URL for display: prefer the new-image preview, then the
  // uploaded URL, then the existing image. Treat null as "no image".
  const displayImage = imagePreview ?? imageUrl ?? user?.image ?? null

  // Fetch the profile when the session and customer ID are available.
  useEffect(() => {
    if (sessionLoading) return
    if (!customerId) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const data = await getUserById(customerId)
        // console.log("Profile API Data:", data)
        setUser(data)
        setName(data.name)
        setPhone(data.phone ?? "")
      } catch {
        setErrorMessage("We couldn't load your profile right now.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [sessionLoading, customerId])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!name.trim()) {
      toast.error("Full name is required.")
      return
    }

    if (!customerId) {
      toast.error("Unable to identify your account. Please sign in again.")
      return
    }

    setSaving(true)
    try {
      // Determine the image URL to send: use the newly uploaded URL if a
      // new image was selected, otherwise preserve the existing image.
      // Convert null to undefined so the field is omitted when there's no image.
      const imageToSend = imageUrl ?? user?.image ?? undefined

      await updateUserProfile(customerId, {
        name: name.trim(),
        image: imageToSend,
        phone: phone.trim() || undefined,
      })

      // Synchronize the visible profile with the updated values.
      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: name.trim(),
              image: imageToSend ?? null,
              phone: phone.trim() || null,
            }
          : null
      )

      toast.success("Profile updated successfully.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile."
      )
    } finally {
      setSaving(false)
    }
  }

  if (sessionLoading || loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Skeleton header */}
        <div className="flex flex-col gap-3">
          <div className="h-8 w-1/3 animate-pulse rounded-lg bg-muted" />
          <div className="h-5 w-full max-w-xs animate-pulse rounded bg-muted" />
        </div>

        {/* Skeleton form */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="rounded-2xl border p-5 sm:p-6 h-full flex flex-col"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground animate-pulse" />
              <div className="mt-3 flex flex-col gap-3">
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-5 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </span>
          <h2 className="font-semibold">Unable to load profile</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            {errorMessage}
          </p>
          <Button variant="outline" nativeButton={false} render={<Link href="/dashboard/customer" />}>
            Back to Dashboard
          </Button>
        </div>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Scissors className="size-5" />
          </span>
          <h2 className="font-semibold">Profile not found</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            We couldn&apos;t find your profile information.
          </p>
          <Button variant="outline" nativeButton={false} render={<Link href="/dashboard/customer" />}>
            Back to Dashboard
          </Button>
        </div>
      </section>
    )
  }
  const displayRole = user.role || "customer"

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          My Profile
        </h1>
        <p className="text-base text-muted-foreground">
          Manage your personal information and profile settings.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Scissors className="size-8" />
                  </div>
                )}
                {uploadingImage && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                    <Clock className="size-5 text-white animate-spin" />
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
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              {user.phone && (
                <div className="flex items-start gap-3">
                  <div className="flex shrink-0 items-center text-muted-foreground">
                    <span className="size-5">&#9742;</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
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
            <h2 className="text-lg font-semibold mb-5">Edit Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={saving || uploadingImage}
                  required
                />
              </div>

              {/* Profile Image */}
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={saving}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/80"
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
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="e.g. +1 555 123 4567"
                  disabled={saving || uploadingImage}
                />
                <p className="text-xs text-muted-foreground">
                  Optional. Used for appointment reminders.
                </p>
              </div>

              {/* Read-only fields notice */}
              <div className="space-y-2 pt-4 border-t">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Account Information
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <Badge variant={roleVariant[user.role as keyof typeof roleVariant] ?? "secondary"}>
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
                    <Clock className="animate-spin mr-2" />
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
    </section>
  )
}

export default CustomerProfilePage
