"""
HTML → Astro 변환 스크립트
각 HTML 파일에서 <style>, <body> 내용을 추출해 .astro 파일 생성
"""
import re, sys, os

def extract_head_styles(html):
    """<head> 안의 <style> 블록만 추출 (link/script 제외)"""
    styles = re.findall(r'<style>(.*?)</style>', html, re.DOTALL)
    return '\n'.join(styles)

def extract_body(html):
    """<body>~</body> 사이 내용 추출"""
    m = re.search(r'<body[^>]*>(.*)</body>', html, re.DOTALL)
    return m.group(1) if m else ''

def extract_title(html):
    m = re.search(r'<title>(.*?)</title>', html)
    return m.group(1) if m else 'HUIHUI Travel'

def extract_inline_scripts(html):
    """head 안의 <script> 중 src 없는 인라인 스크립트"""
    # head 부분만
    head_m = re.search(r'<head>(.*?)</head>', html, re.DOTALL)
    if not head_m:
        return ''
    head = head_m.group(1)
    scripts = re.findall(r'<script(?![^>]*src)[^>]*>(.*?)</script>', head, re.DOTALL)
    return '\n'.join(s for s in scripts if s.strip())

def convert(src_path, dest_path, depth=0):
    with open(src_path, encoding='utf-8-sig') as f:
        html = f.read()

    title = extract_title(html)
    styles = extract_head_styles(html)
    body = extract_body(html)
    head_scripts = extract_inline_scripts(html)

    # assets 경로: trips/auth 하위면 /assets로 절대경로 통일
    body = re.sub(r'(src|href)=["\'](?:\.\./)?assets/', r'\1="/assets/', body)
    body = re.sub(r'(src|href)=["\']assets/', r'\1="/assets/', body)

    # navbar.js 스크립트 태그 제거 (Navbar 컴포넌트로 대체)
    body = re.sub(r'\s*<script[^>]*navbar\.js[^>]*></script>', '', body)

    # 상대 경로 href (../trips, ../auth, ../index) → 절대경로
    body = re.sub(r'href=["\'](?:\.\./)?(trips/[^"\']+)["\']', r'href="/HUIHUI_Travel/\1"', body)
    body = re.sub(r'href=["\'](?:\.\./)?(auth/[^"\']+)["\']', r'href="/HUIHUI_Travel/\1"', body)
    body = re.sub(r'href=["\'](?:\.\./)?(index\.html)["\']', r'href="/HUIHUI_Travel/\1"', body)
    body = re.sub(r'href=["\'](?:\.\./)?(gallery\.html)["\']', r'href="/HUIHUI_Travel/\1"', body)
    body = re.sub(r'href=["\'](?:\.\./)?(game\.html)["\']', r'href="/HUIHUI_Travel/\1"', body)

    rel_layout = '../' * depth + '../layouts/BaseLayout.astro'
    rel_navbar  = '../' * depth + '../components/Navbar.astro'
    rel_footer  = '../' * depth + '../components/Footer.astro'

    has_footer = '<footer' in html

    out = f"""---
import BaseLayout from '{rel_layout}';
import Navbar from '{rel_navbar}';
{"import Footer from '" + rel_footer + "';" if has_footer else ""}
---
<BaseLayout title="{title}">
  <Navbar />
{body.rstrip()}
{"  <Footer />" if has_footer else ""}

{"<style is:global>" + styles + "</style>" if styles.strip() else ""}
{"<script is:inline>" + head_scripts + "</script>" if head_scripts.strip() else ""}
</BaseLayout>
"""

    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(out)
    print(f'  ✓ {src_path} → {dest_path}')


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, 'src', 'pages')

files = [
    # (src, dest, depth)
    ('index.html',                'index.astro',           0),
    ('gallery.html',              'gallery.astro',         0),
    ('game.html',                 'game.astro',            0),
    ('auth/login.html',           'auth/login.astro',      1),
    ('auth/register.html',        'auth/register.astro',   1),
    ('auth/profile.html',         'auth/profile.astro',    1),
    ('auth/find-account.html',    'auth/find-account.astro', 1),
    ('auth/reset-password.html',  'auth/reset-password.astro', 1),
    ('trips/icheon.html',         'trips/icheon.astro',    1),
    ('trips/daejeon.html',        'trips/daejeon.astro',   1),
    ('trips/dongincheon.html',    'trips/dongincheon.astro', 1),
    ('trips/gangneung.html',      'trips/gangneung.astro', 1),
    ('trips/nowon.html',          'trips/nowon.astro',     1),
    ('trips/paju.html',           'trips/paju.astro',      1),
    ('trips/suwon.html',          'trips/suwon.astro',     1),
    ('trips/yeosu.html',          'trips/yeosu.astro',     1),
]

print('Converting HTML → Astro...')
for src_rel, dest_rel, depth in files:
    src  = os.path.join(ROOT, src_rel)
    dest = os.path.join(SRC, dest_rel)
    if os.path.exists(src):
        convert(src, dest, depth)
    else:
        print(f'  ✗ not found: {src}')

print('\nDone! 모든 페이지 변환 완료.')
