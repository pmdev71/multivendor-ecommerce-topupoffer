import { redirect } from 'next/navigation';

/**
 * Seller Root Page - Redirects to Dashboard
 */
export default function SellerPage() {
  redirect('/seller/dashboard');
}

