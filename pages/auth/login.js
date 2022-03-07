import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LockClosedIcon } from '@heroicons/react/solid'
import LoginForm from '../../components/forms/LoginForm';
import { useSession } from 'next-auth/react';


export default function Login() {
  const {data: session} = useSession()
  console.log(session)
	const router = useRouter();
  // console.log(session)
  // if(session.users.isAuthenticated){
  //   router.push('/')
  // }
  return (
    <div className="w-full">
      <LoginForm /> 
    </div>
  )
}

