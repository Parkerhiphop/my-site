export default function StreamInlineLayout({ children }) {
  return (
    <div className="prose max-w-none prose-p:my-4 prose-p:whitespace-pre-wrap prose-p:text-base prose-p:leading-7 prose-p:text-gray-800 prose-a:font-semibold prose-a:decoration-primary-300 prose-a:underline-offset-4 dark:prose-dark dark:prose-p:text-gray-200 dark:prose-a:decoration-primary-700">
      {children}
    </div>
  );
}
