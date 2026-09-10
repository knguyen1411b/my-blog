'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { Check, Copy, ExternalLink, ImageIcon, Terminal } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

function CodeBlock({ language, codeText }: { language: string; codeText: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeText)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            setCopied(false)
        }
    }

    return (
        <div className="group/code my-6 overflow-hidden rounded-2xl border border-white/10 bg-[#090d16] shadow-2xl transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_28px_rgba(56,189,248,0.12)]">
            {/* macOS-style Window Header Bar */}
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0c101c]/90 px-4 py-2.5 backdrop-blur-md">
                {/* 3 Mac Window Dots */}
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f56]/90 shadow-[0_0_6px_#ff5f56]" />
                    <span className="h-3 w-3 rounded-full bg-[#ffbd2e]/90 shadow-[0_0_6px_#ffbd2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#27c93f]/90 shadow-[0_0_6px_#27c93f]" />
                    <div className="ml-2 flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                        <Terminal className="h-3 w-3 text-cyan-400" />
                        <span className="font-semibold text-slate-300 uppercase tracking-wider">
                            {language || 'shell'}
                        </span>
                    </div>
                </div>

                {/* Copy Button */}
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-slate-400 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-300 active:scale-95"
                    aria-label="Sao chép mã"
                >
                    {copied ? (
                        <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Đã chép</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Sao chép</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code Body */}
            <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-200">
                <code>{codeText}</code>
            </pre>
        </div>
    )
}

export function MarkdownRenderer({ content, className }: { content: string; className?: string }) {
    return (
        <div
            className={`prose-cyber max-w-none text-[15px] sm:text-[16px] leading-relaxed text-slate-300 ${className ?? ''}`}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={{
                    a: ({ href, children }) => {
                        const url = href ?? '#'
                        const isExternal = /^[a-z]+:/i.test(url)

                        if (isExternal) {
                            return (
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 font-medium text-cyan-400 underline decoration-cyan-400/40 underline-offset-4 transition-colors hover:text-cyan-300 hover:decoration-cyan-300"
                                >
                                    <span>{children}</span>
                                    <ExternalLink className="h-3 w-3 inline opacity-70" />
                                </a>
                            )
                        }

                        return (
                            <Link
                                href={url}
                                className="font-medium text-purple-400 underline decoration-purple-400/40 underline-offset-4 transition-colors hover:text-purple-300 hover:decoration-purple-300"
                            >
                                {children}
                            </Link>
                        )
                    },
                    img: ({ src, alt }) =>
                        typeof src === 'string' && src ? (
                            <figure className="group/fig not-prose my-10 overflow-hidden rounded-3xl border border-white/10 bg-[#090d16] shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-500 hover:border-cyan-400/40 hover:shadow-[0_0_35px_rgba(56,189,248,0.18)]">
                                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                                    <Image
                                        src={src}
                                        alt={alt ?? 'Hình ảnh bài viết'}
                                        fill
                                        unoptimized={
                                            src.startsWith('data:') ||
                                            src.startsWith('blob:') ||
                                            src.endsWith('.svg') ||
                                            src.includes('.svg?')
                                        }
                                        sizes="(max-width: 768px) 100vw, 840px"
                                        className="object-cover object-center transition-transform duration-700 ease-out group-hover/fig:scale-[1.02]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/fig:opacity-100" />
                                </div>
                                {alt && (
                                    <figcaption className="flex items-center gap-2 border-t border-white/[0.08] bg-[#0c101c]/90 px-4 py-3 font-mono text-xs text-slate-400">
                                        <ImageIcon className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                                        <span className="italic leading-snug">{alt}</span>
                                    </figcaption>
                                )}
                            </figure>
                        ) : null,
                    p: ({ node, children }) => {
                        const hasImage = node?.children?.some(child => 'tagName' in child && child.tagName === 'img')

                        if (hasImage) {
                            return <div className="my-6">{children}</div>
                        }

                        return <p className="my-5 leading-7 text-slate-300">{children}</p>
                    },
                    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                    em: ({ children }) => <em className="italic text-slate-200">{children}</em>,
                    ul: ({ children }) => (
                        <ul className="my-5 list-disc space-y-2.5 pl-6 text-slate-300 marker:text-cyan-400">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="my-5 list-decimal space-y-2.5 pl-6 text-slate-300 marker:font-mono marker:font-semibold marker:text-purple-400">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => <li className="leading-7 pl-1">{children}</li>,
                    blockquote: ({ children }) => (
                        <blockquote className="relative my-7 rounded-2xl border-l-4 border-l-cyan-400 border border-white/10 bg-gradient-to-r from-cyan-950/30 via-slate-900/40 to-slate-950/20 px-6 py-4 italic text-slate-300 shadow-inner backdrop-blur-sm">
                            <div className="absolute -top-3 left-4 rounded-full border border-cyan-400/30 bg-cyan-950/80 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-300 uppercase tracking-wider">
                                Highlight
                            </div>
                            <div className="pt-1">{children}</div>
                        </blockquote>
                    ),
                    pre: ({ children }) => <>{children}</>,
                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '')
                        const isMultiLine = typeof children === 'string' && children.includes('\n')
                        const isBlock = match || isMultiLine

                        if (isBlock) {
                            const codeText = String(children).replace(/\n$/, '')
                            const language = match ? match[1] : 'bash'
                            return <CodeBlock language={language} codeText={codeText} />
                        }

                        return (
                            <code
                                {...props}
                                className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[13px] font-medium text-cyan-300 shadow-inner"
                            >
                                {children}
                            </code>
                        )
                    },
                    h1: ({ children, ...props }) => (
                        <h1
                            {...props}
                            className="scroll-mt-24 mt-12 mb-6 font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight"
                        >
                            {children}
                        </h1>
                    ),
                    h2: ({ children, ...props }) => (
                        <div className="group/h2 mt-12 mb-5">
                            <h2
                                {...props}
                                className="scroll-mt-24 flex items-center gap-2 font-bold text-xl sm:text-2xl text-white tracking-tight"
                            >
                                <span className="h-5 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-purple-500" />
                                <span>{children}</span>
                            </h2>
                            <div className="mt-2 h-[1px] w-full bg-gradient-to-r from-cyan-500/40 via-purple-500/20 to-transparent" />
                        </div>
                    ),
                    h3: ({ children, ...props }) => (
                        <h3
                            {...props}
                            className="scroll-mt-24 mt-8 mb-4 font-semibold text-lg sm:text-xl text-slate-100 tracking-tight flex items-center gap-2"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
                            <span>{children}</span>
                        </h3>
                    ),
                    h4: ({ children, ...props }) => (
                        <h4 {...props} className="scroll-mt-24 mt-6 mb-3 font-semibold text-base text-slate-200">
                            {children}
                        </h4>
                    ),
                    hr: () => <hr className="my-10 border-t border-white/[0.08]" />,
                    table: ({ children }) => (
                        <div className="my-8 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/60 shadow-xl">
                            <table className="w-full text-left text-sm text-slate-300">{children}</table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="border-b border-white/10 bg-white/5 font-mono text-xs text-cyan-300 uppercase tracking-wider">
                            {children}
                        </thead>
                    ),
                    tbody: ({ children }) => <tbody className="divide-y divide-white/[0.06]">{children}</tbody>,
                    tr: ({ children }) => <tr className="transition-colors hover:bg-white/[0.02]">{children}</tr>,
                    th: ({ children }) => <th className="px-4 py-3 font-bold">{children}</th>,
                    td: ({ children }) => <td className="px-4 py-3">{children}</td>
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
