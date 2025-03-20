// // app/api/upload/route.ts
// import { NextResponse } from 'next/server';
// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(request: Request) {
//   try {
//     // Check Cloudinary configuration
//     if (!process.env.CLOUDINARY_CLOUD_NAME || 
//         !process.env.CLOUDINARY_API_KEY || 
//         !process.env.CLOUDINARY_API_SECRET) {
//       console.error('Cloudinary configuration missing');
//       return NextResponse.json(
//         { success: false, error: 'Server configuration error' },
//         { status: 500 }
//       );
//     }

//     const { image } = await request.json();

//     if (!image) {
//       return NextResponse.json(
//         { success: false, error: 'Image is required' },
//         { status: 400 }
//       );
//     }

//     // Upload the image to Cloudinary
//     const result = await cloudinary.uploader.upload(image, {
//       folder: 'profile-photos',
//     });

//     // Return the secure URL
//     return NextResponse.json({
//       success: true,
//       url: result.secure_url
//     });
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Failed to upload image',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }