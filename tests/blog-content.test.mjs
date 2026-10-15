import assert from 'node:assert/strict'
import test from 'node:test'

import originals from '../content/seo/source/blogs.json' with { type: 'json' }
import revisions from '../src/content/blogs.json' with { type: 'json' }
import { applyBlogContent } from '../src/lib/blog-content.ts'

test('rewrites both published posts while preserving their existing URLs, author and metrics', () => {
    assert.equal(originals.length, 2)
    assert.equal(Object.keys(revisions).length, originals.length)
    for (const original of originals) {
        const blog = applyBlogContent({ ...original, updatedAt: undefined })
        assert.equal(blog.id, original.id)
        assert.equal(blog.slug, original.slug)
        assert.equal(blog.publishedAt, original.publishedAt)
        assert.equal(blog.author, original.author)
        assert.equal(blog.views, original.views)
        assert.notEqual(blog.content, original.content)
        assert(blog.content.includes('https://ndknguyen.io.vn/projects/'))
        assert(blog.content.includes('https://ndknguyen.io.vn/cv'))
        assert.match(blog.updatedAt, /^2026-10-15T/)
    }
})

test('later admin edits and new article records pass through unchanged', () => {
    const edited = { ...originals[0], content: 'New content', updatedAt: '2026-10-16T00:00:00Z' }
    assert.equal(applyBlogContent(edited), edited)
    const future = { id: 'future-post', slug: 'future-post', title: 'Future post' }
    assert.equal(applyBlogContent(future), future)
})
