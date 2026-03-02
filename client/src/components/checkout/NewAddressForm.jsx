const NewAddressForm = ({ register, errors, visible }) => {
  if (!visible) return null;

  const fieldClass =
    'w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/60';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="block text-[11px] text-zinc-500 mb-1">Street</label>
        <input
          {...register('street', { required: visible })}
          placeholder="123 Main St"
          className={fieldClass}
        />
        {errors.street && (
          <p className="text-[10px] text-red-400 mt-1">Street is required</p>
        )}
      </div>

      <div>
        <label className="block text-[11px] text-zinc-500 mb-1">City</label>
        <input
          {...register('city', { required: visible })}
          placeholder="New York"
          className={fieldClass}
        />
        {errors.city && (
          <p className="text-[10px] text-red-400 mt-1">City is required</p>
        )}
      </div>

      <div>
        <label className="block text-[11px] text-zinc-500 mb-1">State</label>
        <input
          {...register('state', { required: visible })}
          placeholder="New York"
          className={fieldClass}
        />
        {errors.state && (
          <p className="text-[10px] text-red-400 mt-1">State is required</p>
        )}
      </div>

      <div>
        <label className="block text-[11px] text-zinc-500 mb-1">ZIP Code</label>
        <input
          {...register('zip', { required: visible })}
          placeholder="10001"
          className={fieldClass}
        />
        {errors.zip && (
          <p className="text-[10px] text-red-400 mt-1">ZIP is required</p>
        )}
      </div>

      <div>
        <label className="block text-[11px] text-zinc-500 mb-1">Country</label>
        <input
          {...register('country', { required: visible })}
          placeholder="US"
          className={fieldClass}
        />
        {errors.country && (
          <p className="text-[10px] text-red-400 mt-1">Country is required</p>
        )}
      </div>
    </div>
  );
};

export default NewAddressForm;
