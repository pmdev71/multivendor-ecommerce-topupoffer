import { redirect } from 'next/navigation';

/**
 * Seller Root Page - Redirects to Dashboard
 * This prevents routing conflicts with other route groups
 */
export default function SellerPage() {
  redirect('/seller/dashboard');
}

