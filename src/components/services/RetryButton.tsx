"use client"

import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

const RetryButton = ({ label = "Try again" }: { label?: string }) => {
  const router = useRouter()

  return (
    <Button variant="outline" onClick={() => router.refresh()}>
      <RefreshCw className="size-4" />
      {label}
    </Button>
  )
}

export default RetryButton