import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # iPhone 12 Pro dimensions: 390x844
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            is_mobile=True,
            has_touch=True,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1"
        )
        page = await context.new_page()
        
        # Open localhost
        await page.goto('http://localhost:5173/')
        # Wait a bit for preloader to exit (takes up to 2.5s)
        await page.wait_for_timeout(3500)
        
        artifacts_dir = r"C:\Users\User\.gemini\antigravity-ide\brain\ff6f077d-c976-4cc7-90ac-a2482bfc8a7e"
        os.makedirs(artifacts_dir, exist_ok=True)
        
        # Screen at top
        await page.screenshot(path=os.path.join(artifacts_dir, "mobile_top_clean.png"))
        print("Captured mobile_top_clean.png")
        
        # Scroll down
        await page.evaluate("window.scrollTo(0, 150)")
        await page.wait_for_timeout(1000)
        await page.screenshot(path=os.path.join(artifacts_dir, "mobile_scrolled_clean.png"))
        print("Captured mobile_scrolled_clean.png")
        
        # Go to menu page
        await page.goto('http://localhost:5173/menu')
        await page.wait_for_timeout(3500)
        await page.screenshot(path=os.path.join(artifacts_dir, "menu_top_clean.png"))
        print("Captured menu_top_clean.png")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
