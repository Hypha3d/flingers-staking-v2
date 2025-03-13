"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  const pathname = usePathname();
  
  return (
    <nav className={styles.navbar}>
      <Link href="/dashboard" className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}>
        Dashboard
      </Link>
      <Link href="/playerHub" className={`${styles.navItem} ${pathname === '/playerHub' ? styles.active : ''}`}>
        Player HUB
      </Link>
      <Link href="/games" className={`${styles.navItem} ${pathname === '/games' ? styles.active : ''}`}>
        Games
      </Link>
      <Link href="/staking" className={`${styles.navItem} ${pathname === '/staking' ? styles.active : ''}`}>
        Staking
      </Link>
      <Link href="/leaderboard" className={`${styles.navItem} ${pathname === '/leaderboard' ? styles.active : ''}`}>
        Leaderboard
      </Link>
    </nav>
  );
};

export default Navbar;