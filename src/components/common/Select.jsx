export default function Select({ label, error, className = '', id, children, ...props }) {
  const selectId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-semibold tracking-tight text-brand-900">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`field-control appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 ${
          error ? 'field-control-error' : ''
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        }}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
