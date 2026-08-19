export default function SkeletonBone({ className = '', rounded = 'rounded-lg' }) {
  return (
    <div
      className={`skeleton-shimmer ${rounded} ${className}`}
      aria-hidden
    />
  );
}
