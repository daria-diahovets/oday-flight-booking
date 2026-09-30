import type { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

const Button = ({ children, type = 'button', ...rest }: ButtonProps) => {
  return (
    <button className="button bounce-hover" type={type} {...rest}>
      {children}
    </button>
  );
};

export default Button;
