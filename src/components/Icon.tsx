/* A small, consistent line-icon set. All 24x24, 1.4 stroke, so they sit
   together without one looking louder than the others. */
const paths: Record<string, React.ReactNode> = {
  truck: (
    <>
      <path d="M2 7h11v9H2zM13 10h4l4 3.5V16h-8" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  vial: (
    <>
      <path d="M10 2.5h4M11 2.5v6L6.5 17a2.5 2.5 0 0 0 2.1 4h6.8a2.5 2.5 0 0 0 2.1-4L13 8.5v-6" />
      <path d="M8 15h8" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20 4v4h-4" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="1.6" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </>
  ),
  bottle: (
    <>
      <path d="M10 2.5h4v3l2 3v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-12l2-3z" />
      <path d="M8 13h8" />
    </>
  ),
  drop: <path d="M12 3s6 6.4 6 10.4A6 6 0 0 1 6 13.4C6 9.4 12 3 12 3z" />,
  sparkle: (
    <>
      <path d="M12 3.5 13.6 9 19 10.6 13.6 12.2 12 17.7 10.4 12.2 5 10.6 10.4 9z" />
      <path d="M18.5 16.5 19.2 18.6 21.3 19.3 19.2 20 18.5 22.1 17.8 20 15.7 19.3 17.8 18.6z" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="9" width="17" height="11.5" rx="1" />
      <path d="M2.5 9h19M12 9v11.5" />
      <path d="M12 9S9.5 3.5 7 5s2 4 5 4zM12 9s2.5-5.5 5-4-2 4-5 4z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 12.5H6L5 8z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
  check: <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />,
};

export default function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: keyof typeof paths | string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] ?? null}
    </svg>
  );
}

export const ICON_NAMES = Object.keys(paths);
