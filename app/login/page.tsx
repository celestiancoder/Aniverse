import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { IconBrandGithub } from "@tabler/icons-react"
import { login } from '@/action/user'
import { auth,signIn } from '@/app/api/auth/[...nextauth]/auth'
import { redirect } from 'next/navigation'

const Login = async() => {

    const session=await auth()
    const user=session?.user;
    if (user) redirect('/')

  const handleGithubSignIn = async () => {
    'use server'
    await signIn('github')
  }

  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <Image
        src="/images/registerimage.webp"
        alt="Background"
        fill
        className="object-cover z-0" // Ensure the image stays behind the form
      />

      {/* Form Content with Blur Effect */}
      <div className="relative z-10 h-full flex items-center"> {/* Flex container to align form */}
        <div className="max-w-md w-full rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white/30 border border-white/10 backdrop-blur-sm dark:bg-black/30 ml-8"> {/* Move form to the left with ml-8 */}
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">Welcome</h2>

          <form className="my-8" action={login}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Tyler" type="text" name="name" />
            </div>

            <Label htmlFor="email">Email Address</Label>
            <Input id="email" placeholder="email@gmail.com" type="email" name="email" />
            
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="**********" type="password" name="password" />
            
            <Button type="submit" className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-4 rounded-lg hover:opacity-90 transition-opacity mt-4">
              Log in &rarr;
            </Button>
          </form>
          
          {/* Separate GitHub form outside the main form */}
          <form action={handleGithubSignIn}>
            <section className='flex flex-col space-y-4 my-5'>
              <Button type='submit'>
                <IconBrandGithub />
                <span>Github</span>
              </Button>
            </section>
          </form>
          
          <div className="flex justify-center mt-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-purple-500 hover:underline">
                Sign-up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
