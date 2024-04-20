'use client';

import Image from 'next/image';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const MainNav = () => {
  return (
    <header className="sticky top-0 flex flex-col lg:flex-row md:flex-row sm:flex-row justify-between items-center h-16 w-full p-4  ">
      <nav className="">
        <Image src="/solanaLogo.png" width={200} height={20} alt="logo" />
      </nav>
      <nav className="">
        <WalletMultiButton />
      </nav>
    </header>
  );
};

export default MainNav;
