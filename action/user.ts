'use server'
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";


const login=async(formData:FormData)=>{
    const email =formData.get('email') as string
    const password=formData.get('password') as string

    if (!email || !password) {
        throw new Error('Email and password are required');
      }
    
      const result = await signIn('credentials', {
        redirect: false,
        callbackUrl:"/",
        email,
        password,
      });
    
      if (result?.error) {
        throw new Error(result.error);
      }
    
      // Redirect to home page after successful login
      redirect('/');
}

const register=async(formData:FormData)=>{
    const Name=formData.get('name') as string;
    const email=formData.get('email') as string;
    const password=formData.get('password') as string;

    if (!Name || !email || !password){
        throw new Error("Please fill all the fields")
    }

    await connectDB();

    const existingUser=await User.findOne({email})
    if (existingUser) throw new Error("User already exists")

    const hashedPassword = await hash(password,12)

    await User.create({Name,email,password:hashedPassword})

    redirect('/login')

    
}

export {register,login};