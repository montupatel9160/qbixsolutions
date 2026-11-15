#!/usr/bin/env python3
"""
Qbix Solutions — Static Site Template Compiler
Inherits common Header, Navigation, Drawer, Footer, and Metadata from base.html.
Compiles templates into production static HTML files.
"""

import os
import re
import jinja2

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, 'templates')

PAGES = [
    # Root pages
    {'template': 'index.html', 'output': 'index.html', 'base_path': '', 'active_page': 'home'},
    {'template': 'about.html', 'output': 'about.html', 'base_path': '', 'active_page': 'about'},
    {'template': 'services.html', 'output': 'services.html', 'base_path': '', 'active_page': 'services'},
    {'template': 'portfolio.html', 'output': 'portfolio.html', 'base_path': '', 'active_page': 'portfolio'},
    {'template': 'blog.html', 'output': 'blog.html', 'base_path': '', 'active_page': 'blog'},
    {'template': 'careers.html', 'output': 'careers.html', 'base_path': '', 'active_page': 'careers'},
    {'template': 'contact.html', 'output': 'contact.html', 'base_path': '', 'active_page': 'contact'},
    {'template': 'cookies.html', 'output': 'cookies.html', 'base_path': '', 'active_page': 'cookies'},
    {'template': 'privacy.html', 'output': 'privacy.html', 'base_path': '', 'active_page': 'privacy'},
    {'template': 'terms.html', 'output': 'terms.html', 'base_path': '', 'active_page': 'terms'},

    # Services pages
    {'template': 'services/web-development.html', 'output': 'services/web-development.html', 'base_path': '../', 'active_page': 'services'},
    {'template': 'services/seo-optimization.html', 'output': 'services/seo-optimization.html', 'base_path': '../', 'active_page': 'services'},
    {'template': 'services/social-media-management.html', 'output': 'services/social-media-management.html', 'base_path': '../', 'active_page': 'services'},
    {'template': 'services/graphic-design.html', 'output': 'services/graphic-design.html', 'base_path': '../', 'active_page': 'services'},
    {'template': 'services/video-editing.html', 'output': 'services/video-editing.html', 'base_path': '../', 'active_page': 'services'},
    {'template': 'services/content-creation.html', 'output': 'services/content-creation.html', 'base_path': '../', 'active_page': 'services'},

    # Portfolio Case Study pages
    {'template': 'portfolio/footwear-master.html', 'output': 'portfolio/footwear-master.html', 'base_path': '../', 'active_page': 'portfolio'},
    {'template': 'portfolio/minishop-master.html', 'output': 'portfolio/minishop-master.html', 'base_path': '../', 'active_page': 'portfolio'},
    {'template': 'portfolio/physio-life-clinic.html', 'output': 'portfolio/physio-life-clinic.html', 'base_path': '../', 'active_page': 'portfolio'},
    {'template': 'portfolio/seo-growth-campaign.html', 'output': 'portfolio/seo-growth-campaign.html', 'base_path': '../', 'active_page': 'portfolio'},
    {'template': 'portfolio/social-media-brand-campaign.html', 'output': 'portfolio/social-media-brand-campaign.html', 'base_path': '../', 'active_page': 'portfolio'},
    {'template': 'portfolio/brand-identity-design.html', 'output': 'portfolio/brand-identity-design.html', 'base_path': '../', 'active_page': 'portfolio'},
    {'template': 'portfolio/promotional-video-production.html', 'output': 'portfolio/promotional-video-production.html', 'base_path': '../', 'active_page': 'portfolio'},
    {'template': 'portfolio/content-strategy-suite.html', 'output': 'portfolio/content-strategy-suite.html', 'base_path': '../', 'active_page': 'portfolio'},

    # Blog post
    {'template': 'blog/welcome-to-the-future-of-digital-innovation.html', 'output': 'blog/welcome-to-the-future-of-digital-innovation.html', 'base_path': '../', 'active_page': 'blog'},
]

def build():
    # Setup Jinja2 Environment with loaders for both templates/ and root (for base.html)
    env = jinja2.Environment(
        loader=jinja2.FileSystemLoader([TEMPLATES_DIR, BASE_DIR]),
        autoescape=False,
        trim_blocks=True,
        lstrip_blocks=True
    )

    print("Building static HTML pages from base.html and templates/...")
    success_count = 0

    for page in PAGES:
        tpl_path = page['template']
        out_path = os.path.join(BASE_DIR, page['output'])

        try:
            template = env.get_template(tpl_path)
            rendered = template.render(
                base_path=page['base_path'],
                active_page=page['active_page']
            )

            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            with open(out_path, 'w', encoding='utf-8') as f:
                f.write(rendered)

            print(f"  [OK] Rendered {page['output']}")
            success_count += 1
        except Exception as e:
            print(f"  [ERROR] Failed to render {page['output']}: {e}")

    print(f"\nBuild complete! {success_count}/{len(PAGES)} pages compiled successfully.")

if __name__ == '__main__':
    build()

