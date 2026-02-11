import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/firebase/auth';

export interface UseFullAdminResult {
    /** Firestore users 문서의 fulladmin 값 */
    fullAdmin: boolean;
    /** 사용자 문서 로드 중 여부 */
    loading: boolean;
}

/**
 * 현재 로그인한 사용자의 fulladmin 여부를 반환합니다.
 * Firestore users/{uid} 문서의 fulladmin 필드를 조회합니다.
 */
export function useFullAdmin(): UseFullAdminResult {
    const { user } = useAuth();
    const [fullAdmin, setFullAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!user?.uid) {
                setFullAdmin(false);
                setLoading(false);
                return;
            }
            try {
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                setFullAdmin(userDoc.data()?.fulladmin === true);
            } catch {
                setFullAdmin(false);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user?.uid]);

    return { fullAdmin, loading };
}
