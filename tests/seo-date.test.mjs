import assert from 'node:assert/strict'
import test from 'node:test'

import { toSeoDate } from '../src/lib/seo-date.ts'

test('normalizes legacy Vietnamese publication dates', () => {
    assert.equal(toSeoDate('01 tháng 09, 2026'), '2026-09-01T00:00:00.000Z')
    assert.equal(toSeoDate('1 tháng 9 2026'), '2026-09-01T00:00:00.000Z')
})

test('preserves the instant in ISO dates with a timezone', () => {
    assert.equal(toSeoDate('2026-09-01T00:30:00+07:00'), '2026-08-31T17:30:00.000Z')
    assert.equal(toSeoDate('2026-09-01'), '2026-09-01T00:00:00.000Z')
})

test('omits absent, relative and invalid dates instead of inventing a date', () => {
    for (const value of [undefined, '', 'Vừa xong', '31 tháng 02, 2026', '2026-02-31', 'not-a-date']) {
        assert.equal(toSeoDate(value), undefined)
    }
    assert.equal(toSeoDate('29 tháng 02, 2024'), '2024-02-29T00:00:00.000Z')
})
