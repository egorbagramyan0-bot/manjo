import asyncio
from playwright.async_api import async_playwright

async def verify_site(viewport_type="desktop"):
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch()
        
        # Configure viewport
        if viewport_type == "mobile":
            device = p.devices['iPhone 12']
            context = await browser.new_context(**device)
        else:
            context = await browser.new_context(viewport={"width": 1440, "height": 900})
            
        page = await context.new_page()
        
        # Track loaded image URLs
        loaded_images = []
        page.on("request", lambda request: loaded_images.append(request.url) if request.resource_type == "image" else None)
        
        print(f"\n--- Verifying {viewport_type.upper()} viewport ---")
        try:
            # Go to home page
            await page.goto("http://localhost:5173/", timeout=5000)
            
            # Wait for preloader to fade out
            await page.wait_for_selector(".page-loader-overlay", state="hidden", timeout=5000)
            print("Loader dismissed successfully.")
            
            # Allow some time for hero transitions
            await page.wait_for_timeout(1000)
            
            # Check for broken images
            images = await page.query_selector_all("img")
            print(f"Found {len(images)} img elements in DOM.")
            
            # Verify no naturalWidth is 0 (which means broken image)
            for i, img in enumerate(images):
                src = await img.get_attribute("src")
                natural_width = await img.evaluate("el => el.naturalWidth")
                if natural_width == 0:
                    print(f"WARNING: Image index {i} ({src}) appears to be broken (naturalWidth = 0).")
                else:
                    print(f"Image {i}: {src} loaded successfully (naturalWidth = {natural_width}px).")
                    
            # Capture screenshot
            screenshot_path = f"scratch/test_opt_{viewport_type}.png"
            await page.screenshot(path=screenshot_path)
            print(f"Saved screenshot to {screenshot_path}")
            
            # Scroll down to trigger lazy loading of story/announcements
            print("Scrolling down page to trigger lazy loading...")
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight / 2)")
            await page.wait_for_timeout(1500)
            
            # Verify which images were requested
            print("\nImage network requests intercepted:")
            for img_url in loaded_images:
                print(f"  {img_url}")
                
        except Exception as e:
            print(f"Error during verification: {e}")
            
        await browser.close()

async def main():
    await verify_site("desktop")
    await verify_site("mobile")

if __name__ == "__main__":
    asyncio.run(main())
