const AddressCard = ({ address, onMakeDefault, onDelete }) => {
  const { street, city, state, zip, country, isDefault } = address;

  return (
    <article
      className={`rounded-2xl border bg-zinc-950/70 p-4 sm:p-5 flex flex-col gap-2 transition-colors ${
        isDefault
          ? 'border-cyan-500/60 shadow-[0_0_0_1px_rgba(34,211,238,0.4)]'
          : 'border-zinc-800 hover:border-cyan-500/40 hover:bg-zinc-950'
      }`}
    >
      <header className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-zinc-100">
          {city}, {state}
        </p>
        {isDefault && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/40">
            Default
          </span>
        )}
      </header>
      <p className="text-xs text-zinc-400 leading-relaxed">
        {street}
        {zip ? `, ${zip}` : ''}
      </p>
      <p className="text-[11px] text-zinc-500">{country}</p>

      <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
        <button
          type="button"
          disabled={isDefault}
          onClick={() => !isDefault && onMakeDefault(address)}
          className={`px-3 py-1 rounded-full border font-medium transition-colors ${
            isDefault
              ? 'border-zinc-700 text-zinc-500 cursor-not-allowed'
              : 'border-zinc-700 text-zinc-200 hover:border-cyan-500 hover:text-cyan-200'
          }`}
        >
          {isDefault ? 'Current default' : 'Make default'}
        </button>
        <button
          type="button"
          onClick={() => onDelete && onDelete(address)}
          className="px-3 py-1 rounded-full border border-red-900/60 text-red-300/80 hover:border-red-500/80 hover:text-red-200 transition-colors"
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default AddressCard;
