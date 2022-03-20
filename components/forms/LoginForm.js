import React from 'react';
import Link from 'next/link';
import { LockClosedIcon } from '@heroicons/react/solid'
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


export default function LoginForm() {

  const [loginEmail, setLoginEmail] = React.useState(
		''
	);
  const [loginPassword, setLoginPassword] = React.useState('');
  const router = useRouter();
  const {data: session} = useSession();
  console.log(session,'session')

  const onSubmit = async(e) => {
    e.preventDefault()
		if (!session) {
			try {
        const result = await signIn("credentials", {
					redirect: false,
					email: loginEmail,
					password: loginPassword,
        });
				if (!result.error) {
					router.replace("/app/dashboard");
         } else{
           console.log(result.error)
          if(result.error === 'Password doesnt match'){
            alert("Password doesnt match")
          }else if(result.error === 'No user found with the email'){
            alert('No user found with the email')
          }
        }
			} catch (error) {
				console.log(error,'eror');
			}
		} else {
			router.push("/app/cameras/main");
		}
  }

  const handleEmailChange = (e) => {
    e.preventDefault();
     setLoginEmail(e.target.value)
     }
  const handlePasswordChange = (e) => {
  e.preventDefault();
    setLoginPassword(e.target.value)
    }
    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-md w-full space-y-8">
          <div>
           <div className="p-2 shadow-2xl bg-white rounded-2xl">
            <img
                className="mx-auto h-28 w-auto"
                src={"/assets/comp-logo.png"}
                alt="Comp. Logo"
              />
           </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
             <Link href="/auth/register" passHref>
                <a href="/auth/register" className="font-medium text-blue-500 hover:text-blue-500">
                    click here to register
                </a>
             </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={(e) => onSubmit(e)}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  onChange={(e) => handleEmailChange(e)}
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={(e) => handlePasswordChange(e)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="/auth/forgot" className="font-medium text-blue-500 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-blue-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                 Login
              </button>
            </div>
          </form>
        </div>
      </div>
    )
}
