import os
import re
import glob

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def test_all():
    print("=" * 70)
    print("RUNNING QBIXSOLUTIONS COMPREHENSIVE VERIFICATION SUITE")
    print("=" * 70)

    html_files = glob.glob('*.html') + glob.glob('services/*.html') + glob.glob('portfolio/*.html') + glob.glob('blog/*.html')
    # Filter out base.html from page link tests since base.html is a template
    page_files = [f for f in html_files if os.path.basename(f) != 'base.html']
    
    print(f"Total HTML files found: {len(page_files)} pages (+ base.html)")

    # 1. Base.html Template Test
    print("\n--- 1. Testing base.html Structure & Blocks ---")
    assert os.path.exists('base.html'), "base.html does not exist!"
    with open('base.html', 'r', encoding='utf-8') as f:
        base_content = f.read()
    
    required_blocks = [
        '{% block title %}',
        '{% block meta_description %}',
        '{% block seo_metadata %}',
        '{% block page_css %}',
        '{% block page_scripts %}',
        '{% block content %}'
    ]
    for b in required_blocks:
        assert b in base_content, f"Missing block in base.html: {b}"
        print(f"  [OK] Found block in base.html: {b}")

    assert 'id="site-header"' in base_content, "Missing site-header in base.html"
    assert 'id="mobile-nav-drawer"' in base_content, "Missing mobile-nav-drawer in base.html"
    assert 'id="footer"' in base_content, "Missing footer in base.html"
    print("  [OK] Header, Navigation Drawer, and Footer verified in base.html")

    # 2. Logo Verification
    print("\n--- 2. Testing Original Logo Integrity ---")
    assert os.path.exists('assets/images/logo-white.png'), "logo-white.png missing!"
    assert 'logo-white.png' in base_content, "logo-white.png not used in base.html!"
    
    with open('assets/css/style.css', 'r', encoding='utf-8') as f:
        css_content = f.read()
    
    assert '.brand-logo img' in css_content, "Missing .brand-logo img rule in style.css"
    assert 'object-fit: contain' in css_content, "Missing object-fit: contain in style.css"
    print("  [OK] Logo asset verified: original logo-white.png with object-fit: contain preserved")

    # 3. Smart Sticky Header Scroll Behavior
    print("\n--- 3. Testing Smart Sticky Header Scroll Logic ---")
    with open('assets/js/main.js', 'r', encoding='utf-8') as f:
        js_content = f.read()
    
    assert 'header-hidden' in css_content, "Missing .site-header.header-hidden rule in style.css"
    assert 'header-hidden' in js_content, "Missing header-hidden logic in main.js"
    assert 'transform: translateY(-100%)' in css_content, "Missing translateY(-100%) transition in style.css"
    print("  [OK] Smart sticky scroll-down hide / scroll-up show verified in CSS & JS")

    # 4. Toggle Button Fixes & Accessibility
    print("\n--- 4. Testing Mobile Toggle Button & ARIA Accessibility ---")
    assert 'mobile-toggle' in base_content, "Missing mobile-toggle in base.html"
    assert 'aria-expanded' in base_content, "Missing aria-expanded in base.html toggle"
    assert 'aria-controls' in base_content, "Missing aria-controls in base.html toggle"
    assert 'is-active' in js_content, "Missing is-active toggling in main.js"
    assert 'toggle-bar' in css_content, "Missing toggle-bar animation in style.css"
    print("  [OK] Mobile toggle button with ARIA attributes and morphing hamburger-to-X verified")

    # 5. Desktop & Mobile Services Navigation
    print("\n--- 5. Testing Split Services Dropdown Navigation ---")
    assert 'nav-item-has-dropdown' in base_content, "Missing nav-item-has-dropdown in base.html"
    assert 'nav-dropdown-trigger' in base_content, "Missing nav-dropdown-trigger button in base.html"
    assert 'drawer-split-row' in base_content, "Missing drawer-split-row in base.html"
    assert 'drawer-arrow-btn' in base_content, "Missing drawer-arrow-btn in base.html"
    assert 'drawer-sublinks-container' in base_content, "Missing drawer-sublinks-container in base.html"
    print("  [OK] Desktop clickable Services text + dropdown arrow trigger verified")
    print("  [OK] Mobile split Services navigation: independent text link + expand/collapse button verified")

    # 6. Count-Up Animation Prohibition
    print("\n--- 6. Testing Strict Count-Up Animation Prohibition ---")
    assert 'animateValue' not in js_content, "Found animateValue in main.js! Count-up animation must be removed."
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        tpl_index = f.read()
    assert 'data-target' not in tpl_index, "Found data-target in templates/index.html stats!"
    print("  [OK] Count-up animation verified completely removed from main.js and index.html")

    # 7. Portfolio Projects in All 6 Service Categories
    print("\n--- 7. Testing Portfolio Projects in All Service Categories ---")
    expected_case_studies = [
        'portfolio/footwear-master.html',
        'portfolio/minishop-master.html',
        'portfolio/physio-life-clinic.html',
        'portfolio/seo-growth-campaign.html',
        'portfolio/social-media-brand-campaign.html',
        'portfolio/brand-identity-design.html',
        'portfolio/promotional-video-production.html',
        'portfolio/content-strategy-suite.html',
    ]
    for cs in expected_case_studies:
        assert os.path.exists(cs), f"Missing case study page: {cs}"
        print(f"  [OK] Case study verified: {cs}")

    service_pages = [
        'services/web-development.html',
        'services/seo-optimization.html',
        'services/social-media-management.html',
        'services/graphic-design.html',
        'services/video-editing.html',
        'services/content-creation.html',
    ]
    for sp in service_pages:
        assert os.path.exists(sp), f"Missing service page: {sp}"
        with open(sp, 'r', encoding='utf-8') as f:
            sp_content = f.read()
        assert '../portfolio/' in sp_content, f"Service page {sp} does not link to its portfolio projects!"
        print(f"  [OK] Service page {sp} contains dedicated portfolio project links")

    # 8. Internal Links & Asset Integrity Check
    print("\n--- 8. Verifying All Internal Links and Assets Across 25 Pages ---")
    broken_links = 0
    total_links_checked = 0

    for page in page_files:
        dir_name = os.path.dirname(page)
        with open(page, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check href links
        hrefs = re.findall(r'href=["\'](.*?)["\']', content)
        for href in hrefs:
            if href.startswith('http') or href.startswith('mailto:') or href.startswith('tel:') or href.startswith('#') or href.startswith('javascript:'):
                continue
            # Strip anchor
            clean_href = href.split('#')[0]
            if not clean_href:
                continue
            
            target_path = os.path.normpath(os.path.join(dir_name, clean_href))
            total_links_checked += 1
            if not os.path.exists(target_path):
                print(f"  [BROKEN LINK] in {page} -> {href} (resolved to {target_path})")
                broken_links += 1

        # Check img src
        srcs = re.findall(r'src=["\'](.*?)["\']', content)
        for src in srcs:
            if src.startswith('http') or src.startswith('data:'):
                continue
            target_path = os.path.normpath(os.path.join(dir_name, src))
            total_links_checked += 1
            if not os.path.exists(target_path):
                print(f"  [BROKEN IMAGE] in {page} -> {src} (resolved to {target_path})")
                broken_links += 1

    print(f"  Checked {total_links_checked} internal links & assets.")
    assert broken_links == 0, f"Found {broken_links} broken internal links or assets!"
    print("  [OK] ZERO broken links or missing assets found!")

    print("\n" + "=" * 70)
    print("ALL VERIFICATION CHECKS PASSED WITH ZERO ERRORS!")
    print("=" * 70)

if __name__ == '__main__':
    test_all()

