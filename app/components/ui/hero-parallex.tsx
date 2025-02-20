"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Grechen_Fuemen } from "next/font/google";
import { Emblema_One } from "next/font/google";
import { FlipWords } from "@/components/ui/flipwords";
import { MotionValue } from "framer-motion";


const Grechen_FuemenFont=Grechen_Fuemen({
  subsets:["latin"],
  weight:"400"
})
const Emblema_OneFont=Emblema_One({
  subsets:["latin"],
  weight:"400"
})

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5); // Keep 5 items per row for desktop
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        {/* First Row */}
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-4 sm:space-x-10 md:space-x-20 mb-10 md:mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        {/* Second Row */}
        <motion.div className="flex flex-row space-x-4 sm:space-x-10 md:space-x-20 mb-10 md:mb-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        {/* Third Row */}
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-4 sm:space-x-10 md:space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0 font-extrabold">
      <h1 className={`text-3xl md:text-7xl font-extrabold text-white ${Emblema_OneFont.className} `}>
        Discover the Best of <FlipWords words={["Anime","Manga","Novel"]}/>
      </h1>
      <p className={`max-w-4xl  text-2xl md:text-xl mt-8 text-neutral-200 ${Grechen_FuemenFont.className}`}>
        Explore a curated collection of the most popular anime, manga, and novels. Dive into new worlds and find your next favorite!
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-48 w-32 sm:h-64 sm:w-48 md:h-96 md:w-[30rem] relative flex-shrink-0"
    >
      <Link
        href={product.link}
        className="block group-hover/product:shadow-2xl"
      >
        <Image
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-2 left-2 md:bottom-4 md:left-4 opacity-0 group-hover/product:opacity-100 text-white text-sm md:text-base">
        {product.title}
      </h2>
    </motion.div>
  );
};
