'use client'

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ❌ YEH LINE DELETE KARDO - 'use client' ke sath 'force-dynamic' nahi chalta
// export const dynamic = 'force-dynamic';

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('🔐 Token received');
        
        // ✅ Save token to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        
        let userData = null;

        try {
          // ✅ Try to fetch user data
          console.log('📡 Fetching user data...');
          const userResponse = await fetch('https://just-becho-backend.vercel.app/api/auth/me', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (userResponse.ok) {
            const data = await userResponse.json();
            console.log('✅ User data received:', data);
            
            if (data.success && data.user) {
              userData = data.user;
            }
          }
        } catch (fetchError) {
          console.log('❌ User fetch failed:', fetchError.message);
        }

        // ✅ Save user data to localStorage
        if (userData && typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('💾 User data saved');

          // ✅ Check if profile is completed
          if (!userData.profileCompleted) {
            console.log('🔄 Profile not completed, redirecting...');
            router.push('/complete-profile?token=' + token);
            return;
          }

          // ✅ Redirect to home page
          console.log('🚀 Redirecting to home page');
          router.push('/');
        } else {
          throw new Error('Could not fetch user data');
        }

      } catch (err) {
        console.error('❌ Auth process error:', err);
        setError(err.message);
        
        // Clear any stored data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        
        // Redirect to home after delay
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    authenticateUser();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Authentication Successful!</h2>
          <p className="text-gray-600 mb-6">We're preparing your dashboard...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Authentication Failed</h2>
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <p className="text-gray-400 text-sm">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function AuthSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}