import Image from 'next/image';
import dynamic from 'next/dynamic';

const MainNav = () => {
  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false },
  );

  return (
    <header>
      <nav className="sticky top-0 flex flex-col lg:flex-row md:flex-row sm:flex-row justify-between items-center h-16 w-full p-4  ">
        <Image src="/solanaLogo.png" width={200} height={20} alt="logo" />
        <WalletMultiButtonDynamic />
      </nav>
    </header>
  );
};

export default MainNav;
