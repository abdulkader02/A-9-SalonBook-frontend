// Auth layout: shared by Sign In and Sign Up. It intentionally omits the
// public Navbar and Footer so these pages stay focused on the form.

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-svh flex-1 flex-col bg-muted/30">{children}</div>
  )
}

export default AuthLayout
