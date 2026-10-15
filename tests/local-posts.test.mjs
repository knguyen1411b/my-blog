import assert from 'node:assert/strict'
import test from 'node:test'

import originals from '../content/seo/source/blogs.json' with { type: 'json' }
import posts from '../src/content/posts.json' with { type: 'json' }
import { applyBlogContent, getLocalBlog, mergePublishedBlogs } from '../src/lib/blog-content.ts'
import { toSeoDate } from '../src/lib/seo-date.ts'

test('four complete articles resolve by stable ID and slug with genuine zero metrics', () => {
    assert.equal(posts.length, 4)
    assert.equal(new Set(posts.map(post => post.slug)).size, posts.length)
    for (const post of posts) {
        const result = getLocalBlog(post.slug)
        assert.equal(result.id, post.id)
        assert.equal(getLocalBlog(post.id).slug, post.slug)
        assert.equal(result.views, 0)
        assert.equal(result.likes, 0)
        assert.deepEqual(result.comments, [])
        assert.equal(result.status, 'published')
        assert(result.content.includes('## Nguồn đối chiếu'))
        assert(result.content.includes('https://ndknguyen.io.vn/projects/'))
        assert(result.seo.metaTitle && result.seo.metaDescription)
        assert(Number.isFinite(Date.parse(result.publishedAt)))
    }
    assert.equal(getLocalBlog('not-a-post'), null)
})

test('public listing combines four local articles with both existing Firestore articles', () => {
    const existing = originals.map(post =>
        applyBlogContent({ ...post, publishedAt: toSeoDate(post.publishedAt), updatedAt: undefined })
    )
    const list = mergePublishedBlogs(existing)
    assert.equal(list.length, 6)
    assert.equal(new Set(list.map(post => post.slug)).size, 6)
    assert(posts.some(post => post.id === list[0].id))
    for (const post of existing) assert(list.some(item => item.id === post.id))
    assert(Date.parse(list[4].publishedAt) >= Date.parse(list[5].publishedAt))
})

test('local articles survive an empty remote list, deduplicate and respect category and limit', () => {
    assert.equal(mergePublishedBlogs([]).length, 4)
    const duplicate = { ...posts[0], title: 'Stale cloud copy' }
    const draft = { ...posts[1], id: 'draft', slug: 'draft', status: 'draft' }
    const list = mergePublishedBlogs([duplicate, draft])
    assert.equal(list.length, 4)
    assert.equal(list.find(post => post.id === duplicate.id).title, posts[0].title)
    const category = posts[0].category
    const expected = posts.filter(post => post.category.slug === category.slug).length
    assert.equal(mergePublishedBlogs([], { category: category.slug }).length, expected)
    assert.equal(mergePublishedBlogs([], { category: category.name }).length, expected)
    assert.equal(mergePublishedBlogs([], { maxPosts: 2 }).length, 2)
    assert.equal(mergePublishedBlogs([], { category: 'missing-category' }).length, 0)
})
