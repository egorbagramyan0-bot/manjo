import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={'width': 375, 'height': 667},
            is_mobile=True,
            has_touch=True,
        )
        page = await context.new_page()
        
        # Test Home Page
        await page.goto('http://localhost:5173/')
        await page.wait_for_timeout(2000) # give it more time to finish transition
        
        print("=== HOME PAGE ===")
        elements = [
            'html', 'body', '#root', '.bg-grain-container',
            'header:not(.staggered-mobile-menu-header)', 
            '.staggered-mobile-menu-wrapper', 
            'header.staggered-mobile-menu-header',
            '.staggered-mobile-menu-header-bg',
            '#hero'
        ]

        for sel in elements:
            box = await page.locator(sel).bounding_box()
            info = await page.evaluate(f"""(sel) => {{
                const el = document.querySelector(sel);
                if (!el) return null;
                const cs = window.getComputedStyle(el);
                return {{
                    position: cs.position,
                    top: cs.top,
                    transform: cs.transform,
                    marginTop: cs.marginTop,
                    paddingTop: cs.paddingTop,
                    height: cs.height
                }};
            }}""", sel)
            print(f"--- {sel} ---")
            if box:
                print(f"  Bounding Box: x={box['x']}, y={box['y']}, w={box['width']}, h={box['height']}")
            else:
                print("  No bounding box")
            if info:
                for k, v in info.items():
                    print(f"  {k}: {v}")

        # Test Menu Page
        await page.goto('http://localhost:5173/menu')
        await page.wait_for_timeout(2000)
        
        print("\n=== MENU PAGE ===")
        menu_elements = [
            '.bg-grain-container',
            'header.staggered-mobile-menu-header',
            '.staggered-mobile-menu-header-bg',
            '.mp-header'
        ]
        
        for sel in menu_elements:
            box = await page.locator(sel).bounding_box()
            info = await page.evaluate(f"""(sel) => {{
                const el = document.querySelector(sel);
                if (!el) return null;
                const cs = window.getComputedStyle(el);
                return {{
                    position: cs.position,
                    top: cs.top,
                    transform: cs.transform,
                    marginTop: cs.marginTop,
                    paddingTop: cs.paddingTop,
                    height: cs.height
                }};
            }}""", sel)
            print(f"--- {sel} ---")
            if box:
                print(f"  Bounding Box: x={box['x']}, y={box['y']}, w={box['width']}, h={box['height']}")
            else:
                print("  No bounding box")
            if info:
                for k, v in info.items():
                    print(f"  {k}: {v}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
