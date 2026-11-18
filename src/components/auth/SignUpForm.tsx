"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, signUp } from "@/lib/auth-client"
import { Eye, EyeOff, Scissors, Trash2, Upload, User } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const passwordRules = [
  {
    label: "At least 6 characters",
    test: (value: string) => value.length >= 6,
  },
  {
    label: "One uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "One lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
]

const SignUpForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Selected image file + its local preview + the ImgBB URL once uploaded.
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [uploadingImage, setUploadingImage] = useState(false)

  const validatePassword = (password: string) => {
    const failed = passwordRules.find((rule) => !rule.test(password))
    if (failed) {
      toast.error(`Password must contain ${failed.label.toLowerCase()}.`)
      return false
    }
    return true
  }

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (imagePreview) URL.revokeObjectURL(imagePreview)

    if (!file) {
      setImageFile(null)
      setImagePreview(null)
      setImageUrl(undefined)
      return
    }

    // Accept image files only
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.")
      event.target.value = ""
      setImageFile(null)
      setImagePreview(null)
      setImageUrl(undefined)
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
    if (!apiKey) {
      toast.error("Image upload is unavailable: missing ImgBB API key.")
      event.target.value = ""
      setImageFile(null)
      setImagePreview(null)
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImageUrl(undefined)

    // Upload to ImgBB; only the returned URL is kept for registration.
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
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
    setImageUrl(undefined)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const { name, email, password } = Object.fromEntries(
      formData.entries()
    ) as {
      name: string
      email: string
      password: string
    }

    if (!validatePassword(password)) return

    // An image is optional, but a selected image must be fully uploaded first.
    if (uploadingImage) {
      toast.error("Please wait for the image to finish uploading.")
      return
    }
    if (imageFile && !imageUrl) {
      toast.error("Image upload failed. Please try again or remove the image.")
      return
    }

    setSubmitting(true)
    try {
      const result = await signUp.email({
        name,
        email,
        password,
        // Only the real ImgBB URL is sent — never the local preview.
        ...(imageUrl ? { image: imageUrl } : {}),
        callbackURL: "/",
      })
      if (result.error) {
        toast.error(
          result.error.message ?? "Registration failed. Please try again."
        )
        return
      }
      toast.success("Account created successfully!")
      router.push("/")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }
  const handleGoogleSignUp = async () => {
    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: "/",
      })

      if (error) {
        toast.error("Google sign-up is currently unavailable.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <span className="mb-1 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scissors className="size-5" />
          </span>
          <CardTitle className="text-xl">Create Your Account</CardTitle>
          <CardDescription>
            Join SalonBook to book salon services online.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Jane Doe"
                autoComplete="name"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              <ul className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                {passwordRules.map((rule) => (
                  <li key={rule.label}>• {rule.label}</li>
                ))}
              </ul>
            </div>

            {/* Profile image — select, preview, and ImgBB upload */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="image">
                Profile Image{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <div className="flex items-center gap-3">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Selected profile photo preview"
                    className="size-12 shrink-0 rounded-full border object-cover"
                  />
                ) : (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border bg-muted">
                    <User className="size-5 text-muted-foreground" />
                  </span>
                )}

                <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  <Upload className="size-4" />
                  {imageFile ? "Change image" : "Upload image"}
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>

                {imageFile ? (
                  <button
                    type="button"
                    onClick={clearImage}
                    aria-label="Remove selected image"
                    className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Trash2 className="size-4" />
                  </button>
                ) : null}
              </div>
              {uploadingImage ? (
                <p className="text-xs text-muted-foreground">
                  Uploading image...
                </p>
              ) : null}
              {imageFile && !uploadingImage && !imageUrl ? (
                <p className="text-xs text-destructive">
                  Upload failed — please re-select the image or remove it.
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || uploadingImage}
            >
              {submitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
          <div className="my-4 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignUp}
          >
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUpForm
