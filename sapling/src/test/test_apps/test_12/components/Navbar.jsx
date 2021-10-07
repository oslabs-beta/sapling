import Image from 'next/image';
import Link from 'next/link';
import logo from '../public/sapling-logo.png';

const Navbar = () => {
  return (
    <nav id="navbar" className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <Link href="/" passHref>
            <Image src={logo} alt="Sapling Tree Logo"/>
        </Link>
      </div>
    </nav>
  )
};

export default Navbar;