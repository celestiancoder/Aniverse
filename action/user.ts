'use server'

import connectDB from "@/app/api/db";
import { User } from "@/app/api/models/User";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { signIn } from "@/app/api/auth";
// import { revalidatePath } from "next/cache";

const login = async(formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
      
  const result = await signIn('credentials', {
    redirect: false,
    callbackUrl: "/",
    email,
    password,
  });
      
  if (result?.error) {
    throw new Error(result.error);
  }
      
  // Redirect to home page after successful login
  redirect('/');
  
}

const register = async(formData: FormData) => {
  const Name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!Name || !email || !password) {
    throw new Error("Please fill all the fields")
  }
  
  await connectDB();
  
  const existingUser = await User.findOne({email})
  if (existingUser) throw new Error("User already exists")
  
  const hashedPassword = await hash(password, 12)
  
  await User.create({Name, email, password: hashedPassword})
  
  redirect('/login')
}

// export async function updateProfile({
//   userId,
//   username,
//   profileImage,
// }: {
//   userId: string;
//   username?: string;
//   profileImage?: string; // Make this optional
// }) {
//   try {
//     await connectDB();
    
    
    
//     // Create update object based on provided values
//     const updateData: { name?: string; image?: string } = {};
    
//     if (username) {
//       updateData.name = username;
//     }
    
//     if (profileImage) {
//       updateData.image = profileImage;
//     }
    
    
//     // Only update if we have something to update
//     if (Object.keys(updateData).length > 0) {
//       const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         updateData,
//         { new: true } // Return the updated document
        
//       );
      
//       if (!updatedUser) {
//         throw new Error("User not found");
//       }
      
//     }

    
    
//     // Revalidate paths to ensure data is fresh everywhere
//     revalidatePath('/');
//     revalidatePath('/profile');
//     revalidatePath('/profile/settings');
    
    
//     return { success: true };
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return { 
//       success: false, 
//       error: error instanceof Error ? error.message : "Failed to update profile" 
//     };
//   }
// }

export { register, login };