import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-3xl md:text-4xl font-extrabold mt-10 mb-6 text-neutral-900 tracking-tight">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-5 text-neutral-900 tracking-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-neutral-900">{children}</h3>,
    p: ({ children }) => <p className="mb-5 text-neutral-600 leading-relaxed text-base md:text-lg">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-6 text-neutral-600 space-y-2 text-base md:text-lg">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-6 text-neutral-600 space-y-2 text-base md:text-lg">{children}</ol>,
    li: ({ children }) => <li>{children}</li>,
    a: ({ href, children }) => <a href={href} className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4 decoration-blue-200 hover:decoration-blue-600 transition-all">{children}</a>,
    strong: ({ children }) => <strong className="font-semibold text-neutral-900">{children}</strong>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-neutral-200 pl-4 py-1 italic text-neutral-600 bg-neutral-50 rounded-r-lg my-6">{children}</blockquote>,
    hr: () => <hr className="my-10 border-neutral-200" />,
    ...components,
  }
}
