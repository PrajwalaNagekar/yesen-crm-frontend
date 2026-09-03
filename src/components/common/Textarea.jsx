export default function Textarea({ label, error, required, className = '', id, ...props }) {
  const textareaId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={textareaId} className="mb-1.5 block text-sm font-semibold tracking-tight text-brand-900">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        required={required}
        className={`field-control min-h-[4.5rem] resize-y ${error ? 'field-control-error' : ''}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
