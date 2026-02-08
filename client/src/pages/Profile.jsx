import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import AddressCard from '../components/profile/AddressCard';
import {
  asyncfetchaddresses,
  asyncnewaddress,
  asyncmakedefaultaddress,
  asyncdeleteaddress,
} from '../store/actions/authActions';

const Profile = () => {
  const dispatch = useDispatch();
  const { addresses, isAuthenticated } = useSelector((state) => ({
    addresses: state.auth.addresses || [],
    isAuthenticated: state.auth.isAuthenticated,
  }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    dispatch(asyncfetchaddresses());
  }, [dispatch, isAuthenticated]);

  const handleMakeDefault = async (selected) => {
    if (!selected || selected.isDefault) {
      return;
    }

    const addressId = selected._id || selected.id;
    if (!addressId) {
      return;
    }

    await dispatch(asyncmakedefaultaddress(addressId));
  };

  const handleAddAddress = async (data) => {
    const street = data.street.trim();
    const city = data.city.trim();
    const country = data.country.trim();

    if (!street || !city || !country) {
      return;
    }

    const payload = {
      street,
      city,
      state: (data.state || '').trim(),
      zip: (data.zip || '').trim(),
      country,
      isDefault: addresses.length === 0,
    };

    const success = await dispatch(asyncnewaddress(payload));
    if (success) {
      reset();
    }
  };

  const handleDeleteAddress = async (selected) => {
    const addressId = selected?._id || selected?.id;
    if (!addressId) {
      return;
    }

    await dispatch(asyncdeleteaddress(addressId));
  };

  const defaultAddress =
    addresses.find((a) => a.isDefault) || addresses[0] || null;

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6 sm:mb-8">
          <div className="space-y-2">
            <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
              Profile
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Your profile
            </h1>
            <p className="font-body text-sm sm:text-base text-zinc-400 max-w-xl">
              Manage where your orders are shipped. For now, you can update only your addresses and which one is marked default.
            </p>
          </div>
          {defaultAddress && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-[11px] text-zinc-400 max-w-xs">
              <p className="font-medium text-zinc-200 mb-1">Default address</p>
              <p>{defaultAddress.street}</p>
              <p>
                {defaultAddress.city}, {defaultAddress.state}{' '}
                {defaultAddress.zip && `- ${defaultAddress.zip}`}
              </p>
              <p>{defaultAddress.country}</p>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)] gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="space-y-4">
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-white">
              Saved addresses
            </h2>
            <p className="text-sm text-zinc-400">
              Choose which address is used as default for shipping.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleAddAddress)}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-3"
          >
            <div>
              <p className="text-xs font-medium text-zinc-200 mb-1">
                Add new address
              </p>
              <p className="text-[11px] text-zinc-500">
                Saved to your account and used during checkout.
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Street and house number"
                {...register('street', { required: true })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  {...register('city', { required: true })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                />
                <input
                  type="text"
                  placeholder="State / Region"
                  {...register('state')}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Postal code"
                  {...register('zip')}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                />
                <input
                  type="text"
                  placeholder="Country"
                  {...register('country', { required: true })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 inline-flex items-center justify-center rounded-full bg-cyan-500/90 px-4 py-1.5 text-xs font-medium text-zinc-950 hover:bg-cyan-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Save address
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {addresses.length === 0 ? (
            <p className="text-sm text-zinc-500">
              You have not saved any addresses yet.
            </p>
          ) : (
            addresses.map((address) => (
              <AddressCard
                key={address._id || address.id}
                address={address}
                onMakeDefault={handleMakeDefault}
                onDelete={handleDeleteAddress}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;