'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  signInWithEmailLink,
} from 'firebase/auth';

// 컨텍스트 타입 정의
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

// AuthContext 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
});

// AuthProvider 컴포넌트 정의
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 사용자 상태 업데이트
  useEffect(() => {
    // 인증 상태 변경 구독 (즉시 현재 상태를 반환함)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 로그인 함수
  const login = async (email: string) => {
    await signInWithEmailLink(auth, email, window.location.href);
  };

  // 회원가입 함수
  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  // 로그아웃 함수
  const logout = async () => {
    await signOut(auth);
  };

  // Google 로그인 함수 (팝업 사용)
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // 팝업이 성공적으로 완료되면 onAuthStateChanged가 자동으로 user를 업데이트함
    } catch (error) {
      console.error('Google 로그인 팝업 실패:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, loginWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 사용자 정의 훅
export const useAuth = () => useContext(AuthContext);
