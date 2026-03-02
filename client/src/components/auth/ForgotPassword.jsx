import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { authApi } from '../../api/axios';
import FooterSection from '../FooterSection';
import Stepper, { Step } from '../Stepper';

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  const headings = [
    'Forgot your password?',
    'Verify your identity',
    'Set a new password',
  ];


  const EmailForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm({ defaultValues: { email } });

    const onSubmit = async ({ email: inputEmail }) => {
      try {
        const { data } = await authApi.post('/forgot-password', { email: inputEmail });
        toast.success(data.message || 'OTP has been sent to your email.');
        setEmail(inputEmail);
        setCurrentStep(2);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong.');
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-xs text-zinc-400">
          Enter your registered email address and we&apos;ll send you a 6-digit OTP to verify your identity.
        </p>
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium text-zinc-300">Email address</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /.+@.+\..+/, message: 'Enter a valid email' },
            })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
            placeholder="you@nodemart.dev"
          />
          {errors.email && <p className="text-[11px] text-red-400 mt-0.5">{errors.email.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center rounded-full bg-cyan-500/90 px-4 py-2 text-xs font-medium text-zinc-950 hover:bg-cyan-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending OTP…' : 'Send OTP'}
        </button>
      </form>
    );
  };

  const OtpForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm({ defaultValues: { otp: '' } });

    const onSubmit = async ({ otp }) => {
      try {
        const { data } = await authApi.post('/verify-otp', { email, otp });
        toast.success(data.message || 'OTP verified successfully.');
        setResetToken(data.resetToken);
        setCurrentStep(3);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Invalid or expired OTP.');
      }
    };

    const resendOtp = async () => {
      try {
        const { data } = await authApi.post('/forgot-password', { email });
        toast.success(data.message || 'OTP resent.');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to resend OTP.');
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-xs text-zinc-400">
          We&apos;ve sent a 6-digit code to <span className="text-cyan-300 font-medium">{email}</span>. Enter it below.
        </p>
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium text-zinc-300">One-time password</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            {...register('otp', {
              required: 'OTP is required',
              pattern: { value: /^\d{6}$/, message: 'OTP must be 6 digits' },
            })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 tracking-[0.35em] text-center placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
            placeholder="000000"
          />
          {errors.otp && <p className="text-[11px] text-red-400 mt-0.5">{errors.otp.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center rounded-full bg-cyan-500/90 px-4 py-2 text-xs font-medium text-zinc-950 hover:bg-cyan-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Verifying…' : 'Verify OTP'}
        </button>
        <p className="text-[11px] text-zinc-500 text-center">
          Didn&apos;t receive the code?{' '}
          <button type="button" onClick={resendOtp} className="text-cyan-300 hover:text-cyan-200 font-medium">
            Resend OTP
          </button>
        </p>
      </form>
    );
  };

  // Set new password 
  const ResetForm = () => {
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors, isSubmitting },
    } = useForm({ defaultValues: { newPassword: '', confirmPassword: '' } });

    const onSubmit = async ({ newPassword }) => {
      try {
        const { data } = await authApi.post('/reset-password', { resetToken, newPassword });
        toast.success(data.message || 'Password reset successfully.');
        navigate('/signin');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to reset password.');
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-xs text-zinc-400">
          Choose a new password for your account. Make it at least 6 characters long.
        </p>
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium text-zinc-300">New password</label>
          <input
            type="password"
            {...register('newPassword', {
              required: 'Password is required',
              minLength: { value: 6, message: 'At least 6 characters' },
            })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
            placeholder="••••••••"
          />
          {errors.newPassword && (
            <p className="text-[11px] text-red-400 mt-0.5">{errors.newPassword.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium text-zinc-300">Confirm password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (val) => val === watch('newPassword') || 'Passwords do not match',
            })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="text-[11px] text-red-400 mt-0.5">{errors.confirmPassword.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center rounded-full bg-cyan-500/90 px-4 py-2 text-xs font-medium text-zinc-950 hover:bg-cyan-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
    );
  };

  return (
    <div>
      <section className="bg-zinc-950 text-zinc-100 min-h-screen border-t border-zinc-900/80 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="mb-4">
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 text-[11px] text-zinc-400 hover:text-cyan-300 transition-colors"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-700">
                <ArrowLeftIcon className="h-3.5 w-3.5" />
              </span>
              Back to sign in
            </Link>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-6 sm:gap-8 items-center">
            {/* Left info panel */}
            <div className="space-y-4">
              <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
                Account recovery
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {headings[currentStep - 1]}
              </h1>
              <p className="font-body text-sm sm:text-base text-zinc-400 max-w-md">
                We&apos;ll help you get back into your account. Follow the steps to reset your password securely.
              </p>
            </div>

            {/* Right stepper panel */}
            <Stepper
              initialStep={1}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              hideFooter
              disableNavigation
            >
              <Step>
                <EmailForm />
              </Step>
              <Step>
                <OtpForm />
              </Step>
              <Step>
                <ResetForm />
              </Step>
            </Stepper>
          </div>

          <p className="text-[11px] text-zinc-500 text-center mt-6">
            Remember your password?{' '}
            <Link to="/signin" className="text-cyan-300 hover:text-cyan-200 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </section>
      <FooterSection />
    </div>
  );
};

export default ForgotPassword;
