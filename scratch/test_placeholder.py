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
        await page.wait_for_timeout(3000) # Wait for page load and loader to disappear
        
        # Find comment field and scroll it into view
        textarea = page.locator('#bf-comment')
        await textarea.scroll_into_view_if_needed()
        await page.wait_for_timeout(1000)
        placeholder = await textarea.get_attribute('placeholder')
        print(f"Textarea Placeholder: {repr(placeholder)}")
        
        box = await textarea.bounding_box()
        print(f"Textarea Bounding Box: {box}")
        
        # Verify it has no literal '\\u00A0' or '\\u' escape character
        if '\\u' in placeholder or 'u00A0' in placeholder:
            print("ERROR: Technical symbols still present in placeholder!")
        else:
            print("SUCCESS: Placeholder is clean of technical symbols.")
            
        artifacts_dir = r"C:\Users\User\.gemini\antigravity-ide\brain\ff6f077d-c976-4cc7-90ac-a2482bfc8a7e"
        os.makedirs(artifacts_dir, exist_ok=True)
        await page.screenshot(path=os.path.join(artifacts_dir, "test_placeholder_mobile.png"))
        print("Captured test_placeholder_mobile.png")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
