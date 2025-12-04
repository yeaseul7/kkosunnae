'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { auth } from './firebase';
import { firestore } from './firebase';
import {
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  signInWithEmailLink,
  isSignInWithEmailLink,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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

  // 사용자 상태 업데이트 및 이메일 링크 인증 처리
  useEffect(() => {
    // 인증 상태 변경 구독 (즉시 현재 상태를 반환함)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // 이메일 링크 인증 처리 (전역적으로 처리)
    const handleEmailLinkAuth = async () => {
      if (typeof window === 'undefined') return;

      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          let emailForSignIn = window.localStorage.getItem('emailForSignIn');

          // 같은 브라우저가 아니면 이메일 입력 필요
          if (!emailForSignIn) {
            emailForSignIn = window.prompt('이메일 주소를 입력해주세요:');
          }

          if (emailForSignIn) {
            await signInWithEmailLink(
              auth,
              emailForSignIn,
              window.location.href,
            );

            // authMode 확인
            const authMode =
              window.localStorage.getItem('authMode') || 'register';
            window.localStorage.removeItem('emailForSignIn');
            window.localStorage.removeItem('authMode');

            // 인증된 사용자 정보로 기존 사용자인지 확인
            const currentUser = auth.currentUser;
            if (currentUser) {
              try {
                const userDoc = await getDoc(
                  doc(firestore, 'users', currentUser.uid),
                );
                const isExistingUser = userDoc.exists();

                // 로그인 모드: 기존 사용자만 메인으로, 신규 사용자(Firestore 문서 없음)는 /register로
                // 회원가입 모드: 신규 사용자는 /register로, 기존 사용자는 메인으로
                if (authMode === 'login') {
                  if (isExistingUser) {
                    // 기존 사용자: 메인 페이지로
                    window.location.href = '/';
                  } else {
                    // Firebase Auth에는 계정이 있지만 Firestore 문서가 없는 경우
                    // 프로필 정보가 없으므로 회원가입 페이지로 이동
                    if (window.location.pathname !== '/register') {
                      window.location.href = '/register';
                    } else {
                      window.history.replaceState(
                        {},
                        document.title,
                        '/register',
                      );
                    }
                  }
                } else {
                  // 회원가입 모드
                  if (isExistingUser) {
                    // 이미 Firestore에 문서가 있는 경우: 메인 페이지로
                    window.location.href = '/';
                  } else {
                    // 신규 사용자: 회원가입 페이지로
                    if (window.location.pathname !== '/register') {
                      window.location.href = '/register';
                    } else {
                      window.history.replaceState(
                        {},
                        document.title,
                        '/register',
                      );
                    }
                  }
                }
              } catch (error) {
                console.error('사용자 정보 확인 중 오류:', error);
                if (window.location.pathname !== '/register') {
                  window.location.href = '/register';
                } else {
                  window.history.replaceState({}, document.title, '/register');
                }
              }
            }
          }
        } catch (error) {
          console.error('이메일 링크 로그인 실패:', error);
          window.localStorage.removeItem('emailForSignIn');
          // 에러가 발생해도 /register 페이지로 이동
          if (window.location.pathname !== '/register') {
            window.location.href = '/register';
          } else {
            window.history.replaceState({}, document.title, '/register');
          }
        }
      }
    };

    handleEmailLinkAuth();

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
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;

      // Firestore에서 사용자 존재 여부 확인
      if (currentUser) {
        try {
          const userDoc = await getDoc(
            doc(firestore, 'users', currentUser.uid),
          );
          const isExistingUser = userDoc.exists();

          // 신규 사용자는 /register로 리다이렉트
          if (!isExistingUser) {
            if (typeof window !== 'undefined') {
              window.location.href = '/register';
            }
          }
          // 기존 사용자는 onAuthStateChanged가 자동으로 처리함
        } catch (error) {
          console.error('사용자 정보 확인 중 오류:', error);
          // 에러 발생 시에도 신규 사용자로 간주하고 /register로 이동
          if (typeof window !== 'undefined') {
            window.location.href = '/register';
          }
        }
      }
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
