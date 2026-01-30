import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AddressCard from '../components/profile/AddressCard';

const DUMMY_ADDRESSES = [
  {
    id: 'addr-1',
    street: '221B Baker Street',
    city: 'London',
    state: 'London',
    zip: 'NW1 6XE',
    country: 'United Kingdom',
    isDefault: true,
  },
  {
    id: 'addr-2',
    street: 'MG Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560038',
    country: 'India',
    isDefault: false,
  },
];

const Profile = () => {
  const [addresses, setAddresses] = useState(DUMMY_ADDRESSES);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      street: '',
      city: '',
      stateValue: '',
      zip: '',
      country: '',
    },
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('userAddresses');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          Promise.resolve().then(() => setAddresses(parsed));
          return;
        }
      }
      window.localStorage.setItem('userAddresses', JSON.stringify(DUMMY_ADDRESSES));
      const def = DUMMY_ADDRESSES.find((a) => a.isDefault) || DUMMY_ADDRESSES[0];
      if (def) {
        window.localStorage.setItem('defaultAddress', JSON.stringify(def));
        window.dispatchEvent(new CustomEvent('default-address-updated'));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleMakeDefault = (selected) => {
    setAddresses((prev) => {
      const updated = prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === selected.id,
      }));

      window.localStorage.setItem('userAddresses', JSON.stringify(updated));
      window.localStorage.setItem('defaultAddress', JSON.stringify(updated.find((a) => a.isDefault) || selected));
      window.dispatchEvent(new CustomEvent('default-address-updated'));

      return updated;
    });
  };

  const handleAddAddress = (data) => {
    if (!data.street.trim() || !data.city.trim() || !data.country.trim()) {
      return;
    }

    setAddresses((prev) => {
      const isFirst = prev.length === 0;
      const newAddress = {
        id: `addr-${Date.now()}`,
        street: data.street.trim(),
        city: data.city.trim(),
        state: data.stateValue.trim(),
        zip: data.zip.trim(),
        country: data.country.trim(),
        isDefault: isFirst,
      };

      const updated = [...prev, newAddress].map((addr, index) =>
        isFirst && index === prev.length
          ? { ...addr, isDefault: true }
          : addr
      );

      window.localStorage.setItem('userAddresses', JSON.stringify(updated));
      const def =
        updated.find((a) => a.isDefault) || updated[0] || newAddress;
      if (def) {
        window.localStorage.setItem('defaultAddress', JSON.stringify(def));
        window.dispatchEvent(new CustomEvent('default-address-updated'));
      }

      reset();

      return updated;
    });
  };

  const handleDeleteAddress = (selected) => {
    setAddresses((prev) => {
      const remaining = prev.filter((addr) => addr.id !== selected.id);

      if (remaining.length === 0) {
        window.localStorage.removeItem('userAddresses');
        window.localStorage.removeItem('defaultAddress');
        window.dispatchEvent(new CustomEvent('default-address-updated'));
        return [];
      }

      let updated = remaining;
      if (!remaining.some((addr) => addr.isDefault)) {
        const [first, ...rest] = remaining;
        updated = [{ ...first, isDefault: true }, ...rest];
      }

      window.localStorage.setItem('userAddresses', JSON.stringify(updated));
      const def = updated.find((a) => a.isDefault) || updated[0];
      if (def) {
        window.localStorage.setItem('defaultAddress', JSON.stringify(def));
      }
      window.dispatchEvent(new CustomEvent('default-address-updated'));

      return updated;
    });
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
                This is stored only in your browser for now.
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
                  {...register('stateValue')}
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
              className="mt-1 inline-flex items-center justify-center rounded-full bg-cyan-500/90 px-4 py-1.5 text-xs font-medium text-zinc-950 hover:bg-cyan-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Save address
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onMakeDefault={handleMakeDefault}
              onDelete={handleDeleteAddress}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Profile;