import Navbar from "@/components/sheard/Navbar"
import Footer from "@/components/sheard/Footer"

// Public site layout: Navbar + Footer wrap every public page in this route
// group. Auth and dashboard routes live outside this group, so they don't
// inherit them.

const RootPagesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />

      {children}

      <Footer />
    </div>
  )
}

export default RootPagesLayout
