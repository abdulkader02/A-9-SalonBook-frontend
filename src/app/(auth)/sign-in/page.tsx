import SignInForm from "@/components/auth/SignInForm";

const SignInPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) => {
  const { callbackUrl } = await searchParams;

  return <SignInForm callbackUrl={callbackUrl} />;
};

export default SignInPage;
