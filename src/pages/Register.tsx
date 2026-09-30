import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import AuthForm from '../components/AuthForm.tsx';
import Input from '../components/UI/Input.tsx';
import Button from '../components/UI/Button.tsx';
import {
  registerSchema,
  type RegisterFormValues,
} from '../schemas/auth.schema';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import type { ApiError } from '../api/client';

const Register = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const user = await authApi.register(data);
      setUser(user);
    } catch (err) {
      const apiError = err as ApiError;

      if (apiError.error === 'Email already registered') {
        setError('email', { message: apiError.error });
        return;
      }

      if (apiError.details) {
        Object.entries(apiError.details).forEach(([field, messages]) => {
          setError(field as keyof RegisterFormValues, { message: messages[0] });
        });
        return;
      }

      setError('root', { message: apiError.error || 'Something went wrong' });
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)}>
      <h2>Registration</h2>
      <Input
        placeholder="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        placeholder="First Name"
        type="text"
        error={errors.firstName?.message}
        {...register('firstName')}
      />
      <Input
        placeholder="Last Name"
        type="text"
        error={errors.lastName?.message}
        {...register('lastName')}
      />
      <Input
        placeholder="Password"
        isPasswordInput={true}
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        placeholder="Confirm Password"
        isPasswordInput={true}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      {errors.root && <p className="field-error">{errors.root.message}</p>}
      <Button type="submit" disabled={isSubmitting}>
        Registration
      </Button>
      <Link to="/auth/login">Have account? Log in</Link>
    </AuthForm>
  );
};

export default Register;
