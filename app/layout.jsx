import './globals.css';
import { CartProvider } from '../lib/cart';
import Header from '../components/Header';
import Footer from '../components/Footer';
export const metadata = {
  title: 'Touch of Sabrina — Luxury Women\'s Bags',
  description: 'Shop luxury women\'s bags from Touch of Sabrina — handbags, totes, shoulder bags, crossbody & backpacks. Cash on Delivery, bKash & Nagad accepted across Bangladesh.',
  icons: { icon: '/logo.png' },
  openGraph: { title: 'Touch of Sabrina — Luxury Women\'s Bags', description: 'Elegant premium bags. COD, bKash & Nagad. Delivery across Bangladesh.', type: 'website' },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en"><body><CartProvider><Header /><main className="min-h-screen">{children}</main><Footer /></CartProvider></body></html>
  );
}
