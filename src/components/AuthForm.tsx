import type { ReactNode, FormEvent } from 'react';

type FormProps = {
  children: ReactNode;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
};

const AuthForm = ({ children, onSubmit }: FormProps) => {
  return (
    <form className="auth-form block" onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default AuthForm;
