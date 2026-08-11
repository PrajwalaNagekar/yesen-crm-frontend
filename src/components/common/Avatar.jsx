import { getInitials } from '../../utils/initials.js';
import { getAvatarGradient } from '../../utils/colors.js';

export default function Avatar({ name, size = 40, className = '' }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white shadow-sm ring-2 ring-white transition-transform duration-200 ${getAvatarGradient(name)} ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.38) }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}
