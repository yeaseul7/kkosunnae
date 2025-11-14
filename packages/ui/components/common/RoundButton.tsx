'use client';

import Link from 'next/link';

interface RoundButtonProps {
  to?: string;
  bgcolor?: string;
  hoverColor?: string;
  borderColor?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function RoundButton({
  to,
  bgcolor,
  hoverColor,
  borderColor,
  onClick,
  children,
  className = '',
  ...rest
}: RoundButtonProps) {
  const baseClasses =
    'px-4 py-1 rounded-full border flex items-center justify-center font-medium transition-all duration-500 ease-in-out';
  const defaultBgColor = bgcolor || 'bg-white';
  const defaultBorderColor = borderColor || 'border-stone-900';
  const defaultTextColor = 'text-stone-900';

  const defaultHoverColor = hoverColor || 'hover:bg-stone-900 hover:text-white';

  const buttonClasses = `${baseClasses} ${defaultBgColor} ${defaultBorderColor} ${defaultTextColor} ${defaultHoverColor} ${className}`;

  if (to) {
    return (
      <Link href={to} className={buttonClasses} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
