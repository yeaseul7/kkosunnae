'use client';
import { useEffect, useRef, useState } from 'react';
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/firebase/auth';

interface LoginModalProps {
  onClose?: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { loginWithGoogle, user } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // 사용자 로그인 상태 변경 시 모달 닫기
  useEffect(() => {
    if (user) {
      onClose?.();
    }
  }, [user, onClose]);

  useEffect(() => {
    // Check if user is signing in via email link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailForSignIn = window.localStorage.getItem('emailForSignIn');
      if (!emailForSignIn) {
        emailForSignIn = window.prompt('이메일 주소를 입력해주세요:');
      }

      if (emailForSignIn) {
        signInWithEmailLink(auth, emailForSignIn, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            setMessage('로그인 성공!');
            onClose?.();
          })
          .catch((error) => {
            setMessage(`로그인 실패: ${error.message}`);
          });
      }
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleSendEmailLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const actionCodeSettings = {
      url: `${window.location.origin}${window.location.pathname}`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setEmailSent(true);
      setMessage('이메일로 로그인 링크를 전송했습니다. 이메일을 확인해주세요.');
    } catch (error) {
      setMessage(
        `에러: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setMessage('');

    try {
      await loginWithGoogle();
      // onAuthStateChanged가 user 상태를 업데이트하면 모달이 자동으로 닫힘
    } catch (error) {
      setMessage(
        `Google 로그인 실패: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`,
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex fixed inset-0 justify-center items-center z-authModal">
      <div className="absolute inset-0 bg-opaque-layer" />
      <div
        ref={modalRef}
        className="relative p-6 w-full max-w-md rounded-lg shadow-xl bg-element1"
      >
        <h3 className="mb-4 text-xl font-bold">로그인</h3>
        {emailSent ? (
          <div className="space-y-4">
            <p className="text-text2">
              {email}로 로그인 링크를 전송했습니다. 이메일을 확인하고 링크를
              클릭해주세요.
            </p>
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
              className="px-4 py-2 w-full rounded-md bg-primary1 text-button-text hover:bg-primary2"
            >
              다른 이메일로 로그인
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleSendEmailLink} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-text2">이메일</label>
                <input
                  className="p-2 w-full rounded-md border border-border3"
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {message && (
                <p
                  className={`text-sm ${
                    message.includes('성공') || message.includes('전송')
                      ? 'text-primary1'
                      : 'text-destructive1'
                  }`}
                >
                  {message}
                </p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 w-full rounded-md bg-primary1 text-button-text hover:bg-primary2 disabled:opacity-50"
              >
                {isLoading ? '전송 중...' : '이메일로 로그인 링크 보내기'}
              </button>
            </form>
            <div className="flex relative items-center py-2">
              <div className="border-t grow border-border3"></div>
              <span className="mx-4 text-sm text-text3">또는</span>
              <div className="border-t grow border-border3"></div>
            </div>
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="px-4 py-2 w-full rounded-md bg-primary1 text-button-text hover:bg-primary2 disabled:opacity-50"
            >
              {isGoogleLoading ? '로그인 중...' : 'Google로 로그인'}
            </button>
          </div>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text3 hover:text-text1"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
