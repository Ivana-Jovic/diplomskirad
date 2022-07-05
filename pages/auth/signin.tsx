import { getProviders, signIn as si } from "next-auth/react";
import Layout from "../../components/layout";

export default function SignIn({ providers }) {
  return (
    <Layout>
      <div className="flex flex-col items-center">
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              onClick={() => si(provider.id, { callbackUrl: "/" })}
              className="my-5 mx-auto bg-grey-100  shadow-md  p-3
          hover:shadow-xl active:scale-90 transition duration-150
          text-lg sm:text-2xl font-semibold rounded-lg "
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
        <div>Don't have an account? Register here</div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
