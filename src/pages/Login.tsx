import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import AuthForm from '../components/AuthForm.tsx';
import Input from '../components/UI/Input.tsx';
import Button from '../components/UI/Button.tsx';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import type { ApiError } from '../api/client';

const Login = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const user = await authApi.login(data);
      setUser(user);
    } catch (err) {
      const apiError = err as ApiError;
      setError('root', {
        message: apiError.error || 'Invalid email or password',
      });
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)}>
      <h2>Log In</h2>
      <Input
        placeholder="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        placeholder="Password"
        isPasswordInput={true}
        error={errors.password?.message}
        {...register('password')}
      />
      <a href="#">Forgot Password?</a>
      <Button type="submit" disabled={isSubmitting}>
        Log In
      </Button>
      {errors.root && <p className="error">{errors.root.message}</p>}
      <Link to="/auth/register">Don't have account? Registration</Link>
    </AuthForm>
  );
};

export default Login;
