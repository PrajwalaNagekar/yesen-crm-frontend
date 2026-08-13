import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Package, Plus, Wrench, MessageCircle } from 'lucide-react';
import Button from '../common/Button.jsx';

const OPTIONS = [
  { type: 'product', label: 'Add product', icon: Package },
  { type: 'service', label: 'Add service', icon: Wrench },
  { type: 'contact', label: 'Add contact', icon: MessageCircle },
];

export default function AddInquiryMenu({ onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function handleClick(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    function handleKey(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  function handleSelect(type) {
    setOpen(false);
    onSelect(type);
  }

  return (
    <div ref={rootRef} className="relative">
      <Button size="md" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <Plus size={16} />
        Add
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xl shadow-slate-900/10">
          {OPTIONS.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleSelect(type)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                <Icon size={16} />
              </span>
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
