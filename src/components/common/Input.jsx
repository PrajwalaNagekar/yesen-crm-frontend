export default function Input({ label, error, className = '', id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold tracking-tight text-brand-900">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`field-control ${error ? 'field-control-error' : ''}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
