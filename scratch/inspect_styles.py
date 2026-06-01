import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            is_mobile=True,
            has_touch=True,
        )
        page = await context.new_page()
        await page.goto('http://localhost:5173/')
        await page.wait_for_timeout(1000)

        # Inspect elements
        styles = await page.evaluate("""() => {
            const getStyle = (sel) => {
                const el = document.querySelector(sel);
                if (!el) return null;
                const cs = window.getComputedStyle(el);
                return {
                    tagName: el.tagName,
                    id: el.id,
                    className: el.className,
                    position: cs.position,
                    top: cs.top,
                    marginTop: cs.marginTop,
                    paddingTop: cs.paddingTop,
                    height: cs.height,
                    display: cs.display
                };
            };
            return {
                html: getStyle('html'),
                body: getStyle('body'),
                root: getStyle('#root'),
                headerParent: getStyle('header'),
                mobileWrapper: getStyle('.staggered-mobile-menu-wrapper'),
                mobileHeader: getStyle('.staggered-mobile-menu-header'),
                mobileHeaderBg: getStyle('.staggered-mobile-menu-header-bg'),
                heroSection: getStyle('.hero-section')
            };
        }""")

        for name, data in styles.items():
            print(f"--- {name} ---")
            if data:
                for k, v in data.items():
                    print(f"  {k}: {v}")
            else:
                print("  Not found")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
