import ReactMarkdown from 'react-markdown';

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose">
      <ReactMarkdown
        components={{
          // Override code blocks for consistent monospace rendering
          code({ inline, className, children, ...props }) {
            if (inline) {
              return <code {...props}>{children}</code>;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
