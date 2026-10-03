export default function SectionContainer({ children, className = '' }) {
  return (
    <div
      className={`mx-auto max-w-3xl px-4 sm:px-6 md:max-w-6xl xl:max-w-7xl xl:px-0 ${className}`}
    >
      {children}
    </div>
  );
}
