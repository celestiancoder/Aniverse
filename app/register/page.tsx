import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { register } from "@/action/user";

const Register = () => {
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
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-md w-full rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white/30 border border-white/10 backdrop-blur-sm dark:bg-black/30 ml-8">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">Welcome to Aniverse</h2>

          <form className="my-8" action={register}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Tyler" type="text" name="name" />
            </div>

            <Label htmlFor="email">Email Address</Label>
            <Input id="email" placeholder="email@gmail.com" type="email" name="email" />
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="**********" type="password" name="password" />

            {/* Sign Up Button */}
            <Button type="submit" className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-4 rounded-lg hover:opacity-90 transition-opacity mt-4">
              Sign up &rarr;
            </Button>

            {/* "Already have an account?" Link */}
            <div className="flex justify-center mt-4"> {/* Added margin-top (mt-4) for spacing */}
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-500 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;


