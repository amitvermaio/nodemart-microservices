import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { asyncregisteruser } from '../../store/actions/authActions';
import FooterSection from '../FooterSection';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullname: '',
      username: '',
      email: '',
      password: '',
      role: 'user',
    },
  });

  const onSubmit = async (data) => {
    const result = await dispatch(asyncregisteruser(data));
    if (result) {
      navigate('/');
    }
  };

  return (
    <div>
      <section className="bg-zinc-950 text-zinc-100 min-h-[100vh] border-t border-zinc-900/80 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="mb-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[11px] text-zinc-400 hover:text-cyan-300 transition-colors"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-700">
                <ArrowLeftIcon className="h-3.5 w-3.5" />
              </span>
              Back to home
            </Link>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-6 sm:gap-8 items-center">
            <div className="space-y-4">
              <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
                Join NodeMart
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Create your account
              </h1>
              <p className="font-body text-sm sm:text-base text-zinc-400 max-w-md">
                One login for your shopping, collections and seller dashboard. Keep everything about your builds in a single workspace.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-5 sm:px-6 sm:py-6 space-y-4"
            >
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-zinc-300">
                  Full name
                </label>
                <input
                  type="text"
                  {...register('fullname', { required: 'Full name is required' })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                  placeholder="Ada Lovelace"
                />
                {errors.fullname && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.fullname.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-zinc-300">
                  Username
                </label>
                <input
                  type="text"
                  {...register('username', { required: 'Username is required' })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                  placeholder="@maker"
                />
                {errors.username && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-zinc-300">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /.+@.+\..+/, message: 'Enter a valid email' },
                  })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                  placeholder="you@nodemart.dev"
                />
                {errors.email && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-zinc-300">
                  Password
                </label>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                  })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-zinc-300">
                  Account type
                </label>
                <div className="flex items-center gap-4 text-[11px] text-zinc-300">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      value="user"
                      {...register('role', { required: 'Please choose an account type' })}
                      className="h-3 w-3 rounded border-zinc-700 bg-zinc-950 text-cyan-500 focus:ring-cyan-500/70"
                    />
                    <span>User</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      value="seller"
                      {...register('role', { required: 'Please choose an account type' })}
                      className="h-3 w-3 rounded border-zinc-700 bg-zinc-950 text-cyan-500 focus:ring-cyan-500/70"
                    />
                    <span>Seller</span>
                  </label>
                </div>
                <p className="mt-1 text-[10px] text-amber-300 font-medium">
                  To buy products on NodeMart, please select the <span className="underline">User</span> role.
                  Sellers are not allowed to buy products on this platform.
                </p>
                {errors.role && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.role.message}</p>
                )}
              </div>

              <p className="text-[10px] text-zinc-500">
                By creating an account you agree to the workspace terms. You can update your details at any time from your profile.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center rounded-full bg-cyan-500/90 px-4 py-2 text-xs font-medium text-zinc-950 hover:bg-cyan-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </button>

              <p className="text-[11px] text-zinc-500 text-center">
                Already have an account?{' '}
                <Link to="/signin" className="text-cyan-300 hover:text-cyan-200 font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
      <FooterSection />
    </div>
  );
};

export default Signup;