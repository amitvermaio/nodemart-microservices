import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { productApi } from '../api/axios';

const CATEGORY_OPTIONS = ['Accessories', 'Clothing', 'Audio', 'Lighting', 'Desk', 'Bundles', 'Learning', 'Posters'];

const AddProduct = () => {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priceAmount: '',
      priceCurrency: 'INR',
      stock: '',
      categories: [],
    },
  });

  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setImageFiles((prev) => {
      const combined = [...prev, ...files];
      return combined.slice(0, 5);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const onSubmit = async (data) => {
    const selectedCategories = data.categories
      ? Array.isArray(data.categories)
        ? data.categories
        : [data.categories]
      : [];

    const payload = {
      title: data.title.trim(),
      description: data.description.trim(),
      price: {
        amount: Number(data.priceAmount),
        currency: data.priceCurrency,
      },
      stock: data.stock ? Number(data.stock) : 0,
      category: selectedCategories,
    };

    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('priceAmount', String(payload.price.amount));
    formData.append('priceCurrency', payload.price.currency);
    formData.append('stock', String(payload.stock));

    payload.category.forEach((cat) => {
      formData.append('category', cat);
    });

    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    const res = await productApi.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.status === 201) {
      toast.success('Product Added Successfully!');
    }

    reset();
    setImageFiles([]);
  };

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="space-y-2">
            <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
              Seller
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Add new product
            </h1>
            <p className="font-body text-sm sm:text-base text-zinc-400 max-w-xl">
              List a new item on NodeMart. You can fine-tune inventory, pricing and media later from the dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-3 py-1.5 text-[11px] font-medium text-zinc-300 hover:border-cyan-500 hover:text-cyan-200 transition-colors"
          >
            Back to dashboard
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)] gap-6 sm:gap-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-5 sm:px-6 sm:py-6 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-zinc-300">
                  Title
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                  placeholder="Minimalist standing desk setup"
                />
                {errors.title && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-zinc-300">
                  Categories
                </label>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <label
                      key={cat}
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/80 px-2 py-1 cursor-pointer hover:border-cyan-500/70 hover:text-cyan-200 transition-colors"
                    >
                      <input
                        type="checkbox"
                        value={cat}
                        className="h-3 w-3 rounded border-zinc-700 bg-zinc-950 text-cyan-500 focus:ring-cyan-500/70"
                        {...register('categories')}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Pick all that apply. These will be stored in the category array.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-zinc-300">
                Description
              </label>
              <textarea
                rows={4}
                {...register('description', { required: 'Description is required' })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70 resize-none"
                placeholder="Describe what makes this product useful for your buyers, how it’s used and what’s included."
              />
              {errors.description && (
                <p className="text-[11px] text-red-400 mt-0.5">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-zinc-300">
                  Price amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('priceAmount', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' },
                  })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                  placeholder="3299"
                />
                {errors.priceAmount && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.priceAmount.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-zinc-300">
                  Currency
                </label>
                <select
                  {...register('priceCurrency')}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-zinc-300">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('stock', {
                    min: { value: 0, message: 'Stock cannot be negative' },
                  })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                  placeholder="10"
                />
                {errors.stock && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.stock.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-zinc-300">Images</p>
                  <p className="text-[11px] text-zinc-500">
                    Upload up to 5 images<span className='text-red-500'> *</span>. They will be sent as files in FormData.
                  </p>
                </div>
              </div>

              <div className="max-w-xs">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesChange}
                  className="block w-full text-[11px] text-zinc-300 file:mr-2 file:rounded-md file:border-0 file:bg-zinc-100 file:px-2 file:py-1 file:text-[11px] file:font-medium file:text-zinc-900 hover:file:bg-cyan-400 hover:file:text-zinc-950"
                />
                <p className="mt-1 text-[10px] text-zinc-500">
                  You can select multiple files at once. Only the first 5 are kept.
                </p>
              </div>

              {imageFiles.length > 0 && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {imageFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${file.lastModified}-${index}`}
                      className="relative rounded-xl border border-zinc-800 bg-zinc-900/70 overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Product"
                        className="h-24 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-zinc-200 hover:bg-red-500/80 hover:text-white transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <p className="text-[11px] text-zinc-500 max-w-xs">
                When you save, this will create a draft payload ready to be sent to the product service.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-cyan-500/90 px-5 py-2 text-xs font-medium text-zinc-950 hover:bg-cyan-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving…' : 'Save draft'}
              </button>
            </div>
          </form>

          <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-4 sm:px-5 sm:py-5 space-y-4 text-[11px] text-zinc-400">
            <p className="font-medium text-zinc-200">Listing tips</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                Use clear, specific titles so your items surface in search.
              </li>
              <li>
                Group related keywords into categories to keep filtering sharp.
              </li>
              <li>
                Start with a smaller stock number and adjust once you see demand.
              </li>
              <li>
                Add at least one primary image and a thumbnail for best display.
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;