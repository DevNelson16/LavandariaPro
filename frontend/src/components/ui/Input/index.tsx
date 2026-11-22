import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

function Input({ label, error, id, ...props }: InputProps) {
    return (
        <div className="w-full">
            <label
                htmlFor={id}
                className="mb-2 block text-sm font-medium text-text-main"
            >
                {label}
            </label>

            <input
                id={id}
                {...props}
                className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${error ? 'border-danger' : 'border-gray-300'
                    }`}
            />

            {error && (
                <p className="mt-1 text-xs text-danger">
                    {error}
                </p>
            )}
        </div>
    );
}

export default Input;