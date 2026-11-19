import SignUpForm from "@/components/auth/SignUpForm";

const SignUpPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) => {
  const { callbackUrl } = await searchParams;

  return <SignUpForm callbackUrl={callbackUrl} />;
};

export default SignUpPage;
