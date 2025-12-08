'use client';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useClickOutsideModal } from '@/packages/utils/clickEvent';

interface LoginModalProps {
  onClose?: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { loginWithGoogle, loginWithGithub, user } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const modalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  useEffect(() => {
    if (user) {
      onClose?.();
    }
  }, [user, onClose]);

  useClickOutsideModal(modalRef, () => onClose?.(), !!onClose);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setMessage('');

    try {
      await loginWithGoogle();
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
  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    setMessage('');

    try {
      await loginWithGithub();
    } catch (error) {
      setMessage(
        `Github 로그인 실패: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`,
      );
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="flex fixed inset-0 justify-center items-center z-[9999]">
      <div className="absolute inset-0 bg-opaque-layer z-[9998]" />
      <div
        ref={modalRef}
        className="relative p-6 w-full max-w-md rounded-lg shadow-xl bg-element1 z-[9999]"
      >
        <h3 className="mb-4 text-xl font-bold">
          {authMode === 'login' ? '로그인' : '회원가입'}
        </h3>
        {emailSent ? (
          <div className="space-y-4">
            <p className="text-text2">
              {email}로 회원가입 링크를 전송했습니다. 이메일을 확인하고 링크를
              클릭해주세요.
            </p>
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
                setEmailError('');
                setEmailTouched(false);
                setMessage('');
              }}
              className="px-4 py-2 w-full rounded-md bg-primary1 text-button-text hover:bg-primary2"
            >
              {authMode === 'login'
                ? '다른 이메일로 로그인'
                : '다른 이메일로 회원가입'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-4 justify-center my-8">
              <button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLoading}
                className="flex justify-center items-center"
              >
                {isGoogleLoading ? (
                  `${authMode === 'login' ? '로그인' : '회원가입'} 중...`
                ) : (
                  <div className="p-2 rounded-full border border-border3 hover:bg-gray-50">
                    <FcGoogle className="text-2xl" />
                  </div>
                )}
              </button>
              <button
                onClick={handleGithubLogin}
                disabled={isGithubLoading || isLoading}
                className="flex justify-center items-center"
              >
                {isGithubLoading ? (
                  `${authMode === 'login' ? '로그인' : '회원가입'} 중...`
                ) : (
                  <div className="p-2 rounded-full border border-border3 hover:bg-gray-50">
                    <FaGithub className="text-2xl" />
                  </div>
                )}
              </button>
            </div>
            {authMode === 'login' ? (
              <div className="flex justify-end mt-16 text-text3">
                아직 회원이 아니신가요?
                <button
                  className="pl-2 text-primary1 hover:text-primary2"
                  onClick={() => {
                    setAuthMode('register');
                    setEmailError('');
                    setMessage('');
                    setEmailTouched(false);
                  }}
                >
                  회원가입하기
                </button>
              </div>
            ) : (
              <div className="flex justify-end mt-16 text-text3">
                이미 회원이신가요?
                <button
                  className="pl-2 text-primary1 hover:text-primary2"
                  onClick={() => {
                    setAuthMode('login');
                    setEmailError('');
                    setMessage('');
                    setEmailTouched(false);
                  }}
                >
                  로그인하기
                </button>
              </div>
            )}
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
