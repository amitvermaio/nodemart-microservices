import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { asyncloginuser } from '../../store/actions/authActions';
import FooterSection from '../FooterSection';

const Signin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (credentials) => {
    if (credentials.usernameOrEmail && credentials.password) {
      let res;
      if (credentials.usernameOrEmail.includes('@')) {
        res = await dispatch(asyncloginuser({ email: credentials.usernameOrEmail, password: credentials.password }));
      } else {
        res = await dispatch(asyncloginuser({ username: credentials.usernameOrEmail, password: credentials.password }));
      }
      if (res) {
        navigate('/');
      }
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
                Welcome back
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Sign in to NodeMart
              </h1>
              <p className="font-body text-sm sm:text-base text-zinc-400 max-w-md">
                Access your orders, favorites and seller dashboard in a few clicks. Use your username or email to continue.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-5 sm:px-6 sm:py-6 space-y-4"
            >
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-zinc-300">
                  Username or email
                </label>
                <input
                  type="text"
                  {...register('usernameOrEmail', { required: 'Username or email is required' })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                  placeholder="you@nodemart.dev or @builder"
                />
                {errors.usernameOrEmail && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.usernameOrEmail.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-zinc-300">
                  Password
                </label>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-3 w-3 rounded border-zinc-700 bg-zinc-950 text-cyan-500 focus:ring-cyan-500/70"
                  />
                  <span>Keep me signed in</span>
                </label>
                <button
                  type="button"
                  className="text-cyan-300 hover:text-cyan-200 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center rounded-full bg-cyan-500/90 px-4 py-2 text-xs font-medium text-zinc-950 hover:bg-cyan-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </button>

              <p className="text-[11px] text-zinc-500 text-center">
                New to NodeMart?{' '}
                <Link to="/signup" className="text-cyan-300 hover:text-cyan-200 font-medium">
                  Create an account
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

export default Signin;