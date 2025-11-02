import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

import '../App.css';

type CommonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
  className?: string;
};

type ButtonCTAProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> & {
    href?: undefined;
    type?: 'button' | 'submit' | 'reset';
  };

type AnchorCTAProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
    href: string;
  };

type CTAButtonProps = ButtonCTAProps | AnchorCTAProps;

export const CTAButton = (props: CTAButtonProps) => {
  const { children, variant = 'primary', icon, className } = props;
  const classes = clsx('btn', variant === 'secondary' && 'secondary', className);

  if ('href' in props && props.href) {
    const { href, ...anchorProps } = props as AnchorCTAProps;
    return (
      <a className={classes} href={href} {...anchorProps}>
        {icon}
        <span>{children}</span>
      </a>
    );
  }

  const { type = 'button', ...buttonProps } = props as ButtonCTAProps;

  return (
    <button className={classes} type={type} {...buttonProps}>
      {icon}
      <span>{children}</span>
    </button>
  );
};
