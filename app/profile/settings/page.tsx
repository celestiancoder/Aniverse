// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { updateProfile } from '@/action/user';

// export default function ProfileSettingsPage() {
//   const { data: session, update } = useSession();
//   const router = useRouter();
//   const [username, setUsername] = useState('');
//   const [profileImage, setProfileImage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Initialize state from session
//   useEffect(() => {
//     if (session?.user) {
//       // console.log('Initializing state from session:', {
//       //   name: session.user.name,
//       //   image: session.user.image,
//       // });
//       setUsername(session.user.name || '');
//       setProfileImage(session.user.image || '');
//     }
//   }, [session]);

//   const handleSave = async () => {
//     try {
//       setError('');
//       setSuccess('');
//       setIsLoading(true);
      
//       if (!session?.user?.id) {
//         throw new Error('User not logged in');
//       }

//       let imageUrl = profileImage;

//       // If a new image is uploaded, upload it to Cloudinary via the API route
//       if (profileImage && profileImage.startsWith('data:image')) {
//         const response = await fetch('/api/upload', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ image: profileImage }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || 'Failed to upload image');
//         }

//         const data = await response.json();
//         imageUrl = data.url;
//       }

//       // Save changes to the database
//       const result = await updateProfile({
//         userId: session.user.id,
//         username,
//         profileImage: imageUrl,
//       });

//       if (!result.success) {
//         throw new Error(result.error || 'Failed to update profile');
//       }

//       // console.log('Before update, session:', session);

//       // Update the session with new user data
//       await update({
//         ...session,
//         user: {
//           ...session.user,
//           name: username,
//           image: imageUrl,
//         },
//       });
//       // console.log('After update, new session:', session);
//       // setUsername(username);
//       // setProfileImage(imageUrl);

//       setSuccess('Profile updated successfully!');
      
//       // Force a refresh to ensure new data is displayed
      
//       router.refresh();
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       setError(error instanceof Error ? error.message : 'Failed to update profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           {success}
//         </div>
//       )}

//       {/* Profile Photo Upload */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium mb-2">Profile Photo</label>
//         <div className="flex items-center space-x-4">
//           <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gray-200">
//             {profileImage ? (
//               <Image
//                 src={profileImage}
//                 alt="Profile"
//                 fill
//                 className="object-cover"
//               />
//             ) : (
//               <div className="flex items-center justify-center h-full text-gray-500">No image</div>
//             )}
//           </div>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (file) {
//                 const reader = new FileReader();
//                 reader.onload = (event) => {
//                   setProfileImage(event.target?.result as string);
//                 };
//                 reader.readAsDataURL(file);
//               }
//             }}
//           />
//         </div>
//       </div>

//       {/* Username Input */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium mb-2">Username</label>
//         <Input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="Enter your username"
//         />
//       </div>

//       {/* Save Button */}
//       <Button onClick={handleSave} disabled={isLoading}>
//         {isLoading ? 'Saving...' : 'Save Changes'}
//       </Button>
//     </div>
//   );
// }