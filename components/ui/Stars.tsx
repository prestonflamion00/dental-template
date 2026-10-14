/** Star rating: decorative stars plus an accessible text label. */
export function Stars({ rating, size = 16, className = "" }: { rating: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={`Rated ${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9L12 2.8z"
            fill={rating >= i + 0.5 ? "#E0A000" : "currentColor"}
            fillOpacity={rating >= i + 0.5 ? 1 : 0.2}
          />
        </svg>
      ))}
    </span>
  );
}
