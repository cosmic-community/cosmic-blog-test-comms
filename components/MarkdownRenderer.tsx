import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        img: ({ src, alt, ...props }) => {
          // Optimize images served through imgix
          const optimizedSrc = src?.includes('imgix.cosmicjs.com')
            ? `${src}?w=1400&auto=format,compress`
            : src

          return (
            <img
              src={optimizedSrc || ''}
              alt={alt || ''}
              className="rounded-lg w-full"
              loading="lazy"
              {...props}
            />
          )
        },
        a: ({ href, children, ...props }) => (
          <a
            href={href}
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            {...props}
          >
            {children}
          </a>
        ),
        pre: ({ children, ...props }) => (
          <pre className="overflow-x-auto rounded-lg" {...props}>
            {children}
          </pre>
        ),
        code: ({ children, className, ...props }) => {
          const isInline = !className

          if (isInline) {
            return (
              <code
                className="bg-gray-100 text-brand-700 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            )
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}