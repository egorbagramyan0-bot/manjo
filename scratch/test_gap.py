import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            is_mobile=True,
            has_touch=True,
        )
        page = await context.new_page()
        
        # Test Home Page
        await page.goto('http://localhost:5173/')
        await page.wait_for_timeout(2000)
        
        # Inject style to make the background bright red
        await page.evaluate("""() => {
            const style = document.createElement('style');
            style.innerHTML = `
                .staggered-mobile-menu-header-bg {
                    background-color: red !important;
                    opacity: 1 !important;
                }
            `;
            document.head.appendChild(style);
        }""")
        
        artifacts_dir = r"C:\Users\User\.gemini\antigravity-ide\brain\ff6f077d-c976-4cc7-90ac-a2482bfc8a7e"
        await page.screenshot(path=os.path.join(artifacts_dir, "test_red_header.png"))
        print("Captured test_red_header.png with forced red background")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
