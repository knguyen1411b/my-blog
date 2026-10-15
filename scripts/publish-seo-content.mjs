import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const option = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback)
const root = path.resolve(option('--root', path.join(path.dirname(fileURLToPath(import.meta.url)), '..')))
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const isBlog = read('package.json').name === 'my-blog'
const collection = isBlog ? 'blogs' : 'projects'
const revisions = read('src/content/' + (isBlog ? 'blogs.json' : 'projects.json'))
const source = read('content/seo/source/' + collection + '.json')
const entries = Object.entries(revisions).map(([id, data]) => ({
    id,
    data,
    original: source.find(item => item.id === id)
}))
if (isBlog) entries.push(...read('src/content/posts.json').map(data => ({ id: data.id, data, original: null })))
process.loadEnvFile(path.join(root, '.env'))
const prefix = isBlog ? 'NEXT_PUBLIC_FIREBASE_' : 'NEXT_PUBLIC_'
const config = Object.fromEntries(
    Object.entries({ apiKey: 'API_KEY', appId: 'APP_ID', authDomain: 'AUTH_DOMAIN', projectId: 'PROJECT_ID' }).map(
        ([key, suffix]) => [key, process.env[prefix + suffix]]
    )
)
if (!config.apiKey || !config.projectId)
    throw new Error('Missing Firebase public configuration in the selected repository.')
console.log(
    JSON.stringify(
        {
            projectId: config.projectId,
            collection,
            documents: entries.map(entry => ({
                id: entry.id,
                action: entry.original ? 'merge-update' : 'create-if-absent'
            }))
        },
        null,
        2
    )
)
if (!args.includes('--serve')) {
    console.log('Dry run only. Add --serve to open the authenticated local publisher. No writes performed.')
    process.exit(0)
}
const payload = JSON.stringify({ config, collection, entries }).replace(/</g, '\u003c')
const html = String.raw`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Đồng bộ nội dung SEO lên Firebase</title>
<style>body{max-width:900px;margin:40px auto;padding:0 20px;font:16px/1.6 system-ui;background:#0d1117;color:#e6edf3}input,button{font:inherit;padding:10px;margin:6px 8px 6px 0}input{display:block;min-width:280px}button{cursor:pointer}pre{white-space:pre-wrap;border:1px solid #30363d;padding:18px}small{color:#adb8c4}</style>
<h1>Đồng bộ nội dung SEO</h1><p id="target"></p><p>Đăng nhập tài khoản admin đã có của website. Mật khẩu gửi trực tiếp đến Firebase Authentication qua SDK chính thức; công cụ không lưu mật khẩu hoặc phiên đăng nhập.</p>
<form id="login"><label>Email admin<input name="email" type="email" autocomplete="username" required></label><label>Mật khẩu<input name="password" type="password" autocomplete="current-password" required></label><button>Đăng nhập Firebase</button></form>
<button id="publish" disabled>Đồng bộ và xác minh nội dung</button><p id="status" role="status">Chưa đăng nhập.</p><pre id="plan"></pre><small>Công cụ chỉ ghi các document được liệt kê. Giữ chỉ số tương tác và ngày tạo đã có; dừng nếu nội dung nguồn đã thay đổi. Không thay đổi Security Rules.</small>
<script type="module">
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js';
import { getAuth, setPersistence, inMemoryPersistence, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';
import { getFirestore, doc, runTransaction, getDoc } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';
const payload = __PAYLOAD__;
const app = initializeApp(payload.config), auth = getAuth(app), db = getFirestore(app);
const status = document.getElementById('status'), button = document.getElementById('publish'), form = document.getElementById('login');
document.getElementById('target').textContent = 'Project: ' + payload.config.projectId + ' · Collection: ' + payload.collection + ' · ' + payload.entries.length + ' documents';
document.getElementById('plan').textContent = payload.entries.map(item => (item.original ? 'UPDATE ' : 'CREATE ') + payload.collection + '/' + item.id).join('\n');
form.addEventListener('submit', async event => {
    event.preventDefault(); status.textContent = 'Đang xác thực…'; button.disabled = true;
    try { await setPersistence(auth, inMemoryPersistence); const email = form.elements.email.value; const password = form.elements.password.value; await signInWithEmailAndPassword(auth, email, password); form.elements.password.value = ''; status.textContent = 'Đã đăng nhập: ' + auth.currentUser.email; button.disabled = false; }
    catch (error) { status.textContent = 'Đăng nhập chưa thành công: ' + (error.code || error.message); }
});
const protectedFields = new Set(['views', 'likes', 'comments', 'commentsCount', 'createdAt', 'publishedAt']);
function normalized(value) {
    if (Array.isArray(value)) return value.map(normalized);
    if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, normalized(value[key])]));
    return value;
}
const equal = (a, b) => JSON.stringify(normalized(a)) === JSON.stringify(normalized(b));
button.addEventListener('click', async () => {
    button.disabled = true; status.textContent = 'Đang kiểm tra dữ liệu hiện tại và đồng bộ…';
    try {
        const applied = await runTransaction(db, async transaction => {
            const documents = [];
            for (const entry of payload.entries) { const ref = doc(db, payload.collection, entry.id); const snapshot = await transaction.get(ref); documents.push({ entry, ref, snapshot }); }
            const writes = [];
            for (const { entry, ref, snapshot } of documents) {
                const current = snapshot.exists() ? snapshot.data() : null;
                if (entry.original && !current) throw new Error('Document gốc đã bị xóa: ' + entry.id);
                const data = { ...entry.data };
                if (current) for (const key of Object.keys(data)) {
                    if (protectedFields.has(key)) { delete data[key]; continue; }
                    if (key === 'updatedAt') continue;
                    const before = entry.original ? entry.original[key] : undefined;
                    if (!equal(current[key], data[key]) && !equal(current[key], before)) throw new Error('Nội dung đã thay đổi sau bản sao lưu: ' + entry.id + ' / ' + key);
                }
                writes.push({ ref, id: entry.id, data });
            }
            for (const write of writes) transaction.set(write.ref, write.data, { merge: true });
            return writes;
        });
        const verified = [];
        for (const write of applied) { const snapshot = await getDoc(write.ref); const current = snapshot.data(); if (!snapshot.exists() || Object.keys(write.data).some(key => !equal(current[key], write.data[key]))) throw new Error('Xác minh chưa khớp: ' + write.id); verified.push('OK ' + payload.collection + '/' + write.id); }
        document.getElementById('plan').textContent = verified.join('\n'); status.textContent = 'ĐỒNG BỘ THÀNH CÔNG: ' + verified.length + '/' + payload.entries.length + ' documents đã xác minh.';
    } catch (error) { status.textContent = 'Chưa hoàn tất đồng bộ: ' + (error.code || error.message); button.disabled = false; }
});
</script></html>`
const port = Number(option('--port', isBlog ? '3191' : '3192'))
const server = http.createServer((request, response) => {
    if (request.method !== 'GET' || request.url !== '/') {
        response.writeHead(404)
        response.end()
        return
    }
    response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Frame-Options': 'DENY'
    })
    response.end(html.replace('__PAYLOAD__', payload))
})
server.listen(port, '127.0.0.1', () => console.log('Local publisher: http://127.0.0.1:' + port + '/'))
