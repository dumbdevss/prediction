import WalletConnect from "./connect_wallet";
import Link from "next/link";

export default function Header() {
  return (
    <div className="fixed flex justify-between items-center right-0 left-0 top-0 z-[50] m-4 mb-0">
      <div>
        {/* Add your logo here */}
        <Link href={'/'}>
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-8 w-auto"
          />
        </Link>
      </div>

      <div>
        <WalletConnect />
      </div>
    </div>
  );
}