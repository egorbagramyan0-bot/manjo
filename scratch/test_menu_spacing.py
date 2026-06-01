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
        )
        page = await context.new_page()
        
        # Load Homepage
        await page.goto('http://localhost:5173/')
        await page.wait_for_timeout(3500) # wait for page loader to clear
        
        # Open mobile menu by clicking toggle
        toggle = page.locator('.smm-toggle')
        await toggle.click()
        await page.wait_for_timeout(1500) # wait for staggered open animation
        
        # Bounding box of last menu item and smm-footer
        items = page.locator('.smm-panel-itemLabel')
        count = await items.count()
        last_item = items.nth(count - 1)
        
        last_box = await last_item.bounding_box()
        footer_box = await page.locator('.smm-footer').bounding_box()
        
        print(f"Last Item Box: {last_box}")
        print(f"Footer Box: {footer_box}")
        if last_box and footer_box:
            gap = footer_box['y'] - (last_box['y'] + last_box['height'])
            print(f"Actual Spacing Gap: {gap}px")
            
        artifacts_dir = r"C:\Users\User\.gemini\antigravity-ide\brain\ff6f077d-c976-4cc7-90ac-a2482bfc8a7e"
        os.makedirs(artifacts_dir, exist_ok=True)
        await page.screenshot(path=os.path.join(artifacts_dir, "test_menu_spacing_mobile.png"))
        print("Captured test_menu_spacing_mobile.png")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
