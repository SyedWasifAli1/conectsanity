import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';

interface ShopheadProps {
  headText: string;
  linkChange: string;
}

const Shophead = ({ headText, linkChange }: ShopheadProps) => {
  return (
    <main
      className="relative flex items-center justify-center w-full h-[200px] md:h-[316px] bg-instagram-section bg-cover bg-center mb-9"
      style={{ backgroundImage: "url('/shop-img.png')" }}
    >
      <div className="text-center md:text-left">
        <div className="mx-auto md:mx-0">
          <Image
            className="mx-auto md:top-[161px] md:left-[682px] mb-[-20px]"
            src={'/shop-logo.png'}
            width={77}
            height={77}
            alt="logo"
          />
        </div>

        <h2 className="font-['Poppins'] font-medium text-[24px] md:text-[40px] text-center md:text-left leading-[72px] text-black">
          {headText}
        </h2>

        <span className="flex justify-center md:justify-start items-center mt-2 md:mt-4">
          <p className="font-['Poppins'] font-medium text-[16px] text-black">
            <Link href={'/'}>Home</Link>
          </p>
          <span className="ml-2 md:ml-4">
            <IoIosArrowForward />
          </span>
          <p className="font-['Poppins'] font-light text-[16px] text-black">
            <Link href={'/shop'}>{linkChange}</Link>
          </p>
        </span>
      </div>
    </main>
  );
};

export default Shophead;
