import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router-dom';
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

type LinkCTAProps = CommonProps &
  Omit<ComponentProps<typeof Link>, 'children' | 'className' | 'to'> & {
    to: ComponentProps<typeof Link>['to'];
    href?: undefined;
  };

type CTAButtonProps = ButtonCTAProps | AnchorCTAProps | LinkCTAProps;

export const CTAButton = (props: CTAButtonProps) => {
  const { children, variant = 'primary', icon, className } = props;
  const classes = clsx('btn', variant === 'secondary' && 'secondary', className);

  if ('to' in props && props.to) {
    const { to, ...linkProps } = props as LinkCTAProps;
    return (
      <Link className={classes} to={to} {...linkProps}>
        {icon}
        <span>{children}</span>
      </Link>
    );
  }

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
