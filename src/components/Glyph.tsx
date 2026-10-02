/** Small botanical marks for the quiz answer cards. Line-only, one weight. */
export default function Glyph({
  name,
  className = "h-6 w-6",
}: {
  name: string;
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    leaf: (
      <>
        <path d="M12 21c0-6 3-11 8-13-1 8-4 12-8 13z" />
        <path d="M12 21c0-4-2-7-5-8" />
      </>
    ),
    bloom: (
      <>
        <circle cx="12" cy="12" r="2.4" />
        <path d="M12 9.6c0-3 1.4-5 3-5s3 2 3 5c0 1.6-.6 2.4-1.4 2.4M14.4 12c3 0 5 1.4 5 3s-2 3-5 3c-1.6 0-2.4-.6-2.4-1.4M12 14.4c0 3-1.4 5-3 5s-3-2-3-5c0-1.6.6-2.4 1.4-2.4M9.6 12c-3 0-5-1.4-5-3s2-3 5-3c1.6 0 2.4.6 2.4 1.4" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.2 5.2l1.8 1.8M17 17l1.8 1.8M18.8 5.2L17 7M7 17l-1.8 1.8" />
      </>
    ),
    moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />,
    spark: (
      <>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
        <path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
      </>
    ),
    drop: <path d="M12 3.5s6 6.2 6 10a6 6 0 0 1-12 0c0-3.8 6-10 6-10z" />,
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] ?? null}
    </svg>
  );
}