import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import eyeOpen from '../../assets/icons/eye-open.svg';
import eyeClose from '../../assets/icons/eye-close.svg';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: string;
  error?: string;
  isPasswordInput?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, isPasswordInput, ...rest }, ref) => {
    const [isHiddenPassword, setIsHiddenPassword] = useState(true);
    let content = (
      <div className="input-block">
        {icon && <img src={icon} alt="" />}
        <input
          className={`${icon ? 'input-icon' : ''} input`}
          ref={ref}
          {...rest}
        />
        {error && <p className="error">{error}</p>}
      </div>
    );
    if (isPasswordInput) {
      content = (
        <div className="input-password">
          <input
            className="input"
            type={isHiddenPassword ? 'password' : 'text'}
            ref={ref}
            {...rest}
          />
          <img
            onClick={() => {
              setIsHiddenPassword((prev) => !prev);
            }}
            src={isHiddenPassword ? eyeOpen : eyeClose}
            alt=""
          />
          {error && <p className="error">{error}</p>}
        </div>
      );
    }
    return content;
  }
);

Input.displayName = 'Input';

export default Input;
