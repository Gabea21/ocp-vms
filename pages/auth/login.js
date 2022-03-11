import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LockClosedIcon } from '@heroicons/react/solid'
import LoginForm from '../../components/forms/LoginForm';
import { useSession } from 'next-auth/react';


export default function Login() {
  const {data: session, status} = useSession()
  const router = useRouter();
  
  useEffect(() => {
    if( status === 'authenticated' && router ){
      const callbackUrl = router.query.callbackUrl;
      router.push(callbackUrl)
    }

  }, [status,router])
  return (
    <div className="w-full">
      <LoginForm /> 
    </div>
  )
}

