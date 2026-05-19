'use client'

import Image from 'next/image'
import Link from 'next/link'

import ReactMarkdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

export function MarkdownRenderer({ content, className }: { content: string; className?: string }) {
    return (
        <div className={`max-w-none text-[1rem] leading-7 ${className ?? ''}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={{
                    a: ({ href, children }) => {
                        const url = href ?? '#'
                        const isExternal = /^[a-z]+:/i.test(url)

                        if (isExternal) {
                            return (
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    {children}
                                </a>
                            )
                        }

                        return <Link href={url}>{children}</Link>
                    },
                    img: ({ src, alt }) =>
                        typeof src === 'string' && src ? (
                            <span className="group not-prose my-8 block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                                <Image
                                    src={src}
                                    alt={alt ?? 'Post image'}
                                    width={1440}
                                    height={900}
                                    loading="eager"
                                    sizes="(max-width: 768px) 100vw, 840px"
                                    className="h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                            </span>
                        ) : null,
                    p: ({ children }) => <p className="my-5 leading-7 text-[var(--text-muted)]">{children}</p>,
                    strong: ({ children }) => <strong className="font-extrabold text-[var(--text)]">{children}</strong>,
                    em: ({ children }) => <em className="italic text-[var(--text)]">{children}</em>,
                    ul: ({ children }) => (
                        <ul className="my-5 list-disc space-y-2 pl-6 text-[var(--text-muted)]">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="my-5 list-decimal space-y-2 pl-6 text-[var(--text-muted)]">{children}</ol>
                    ),
                    li: ({ children }) => <li className="leading-7">{children}</li>,
                    blockquote: ({ children }) => (
                        <blockquote className="my-6 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3 italic text-[var(--text-muted)]">
                            {children}
                        </blockquote>
                    ),
                    code: ({ children, className }) =>
                        className ? (
                            <code className={className}>{children}</code>
                        ) : (
                            <code className="rounded-md bg-[var(--surface-soft)] px-1.5 py-0.5 text-[0.94em] text-[var(--text)]">
                                {children}
                            </code>
                        ),
                    pre: ({ children }) => (
                        <pre className="my-6 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[#0b1220] p-5 text-[0.9em] leading-7 text-white">
                            {children}
                        </pre>
                    ),
                    h1: ({ children, ...props }) => {
                        return (
                            <h1
                                {...props}
                                className="editorial-title mt-10 mb-5 text-[1.9rem] font-extrabold leading-tight tracking-[-0.02em] text-[var(--text)]"
                            >
                                {children}
                            </h1>
                        )
                    },
                    h2: ({ children, ...props }) => {
                        return (
                            <h2
                                {...props}
                                className="editorial-title mt-10 mb-4 text-[1.6rem] font-extrabold leading-tight tracking-[-0.02em] text-[var(--text)]"
                            >
                                {children}
                            </h2>
                        )
                    },
                    h3: ({ children, ...props }) => {
                        return (
                            <h3
                                {...props}
                                className="mt-8 mb-3 text-[1.35rem] font-bold leading-tight text-[var(--text)]"
                            >
                                {children}
                            </h3>
                        )
                    },
                    h4: ({ children, ...props }) => {
                        return (
                            <h4
                                {...props}
                                className="mt-7 mb-3 text-[1.12rem] font-bold leading-tight text-[var(--text)]"
                            >
                                {children}
                            </h4>
                        )
                    },
                    h5: ({ children, ...props }) => {
                        return (
                            <h5
                                {...props}
                                className="mt-6 mb-2 text-[1.08rem] font-bold leading-tight text-[var(--text)]"
                            >
                                {children}
                            </h5>
                        )
                    },
                    h6: ({ children, ...props }) => {
                        return (
                            <h6
                                {...props}
                                className="mt-6 mb-2 text-[1rem] font-bold leading-tight text-[var(--text-muted)]"
                            >
                                {children}
                            </h6>
                        )
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
