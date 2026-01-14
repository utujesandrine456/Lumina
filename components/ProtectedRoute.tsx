import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useDriverStore } from '@/constants/store';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { currentUser } = useDriverStore();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        // Don't redirect if we're already on a public route
        const currentRoute = segments.join('/');
        const publicRoutes = ['', 'index', 'login', 'register', 'otp'];

        const isPublicRoute = publicRoutes.some(route =>
            currentRoute === route || currentRoute.startsWith(route)
        );

        if (!isPublicRoute && !currentUser) {
            // User is not logged in and trying to access protected route
            router.replace('/login');
        }
    }, [currentUser, segments]);

    // If no user and not on public route, show nothing while redirecting
    if (!currentUser) {
        return null;
    }

    return <>{children}</>;
}
