// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.css'

// const inter = Inter({ subsets: ['latin'] })

// export default function Home() {
//   return (
//     <>
      
//     </>
//   )
// }

import { useState } from 'react';
import Head from 'next/head';
import ImageComponent from '../components/auth/ImageComponents';
import LoginForm from '../components/auth/LoginFormComponents';
import RegisterForm from '../components/auth/RegisterFormComponents';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Head>
        <title>{isLogin ? 'Login' : 'Register'} Page</title>
        <meta name="description" content={isLogin ? 'Login page' : 'Register page'} />
      </Head>
      <div className="container-fluid vh-100">
        <div className="row h-100">
          <ImageComponent />
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="w-75">
              <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>
              {isLogin ? <LoginForm /> : <RegisterForm />}
              <div className="text-center mt-3">
                <a href="#" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


