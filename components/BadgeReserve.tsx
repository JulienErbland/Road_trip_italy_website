// components/BadgeReserve.tsx
export default function BadgeReserve() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: 'rgba(201, 168, 76, 0.15)', color: 'var(--color-gold)', border: '1px solid rgba(201, 168, 76, 0.3)' }}
    >
      ✓ Réservé
    </span>
  )
}
