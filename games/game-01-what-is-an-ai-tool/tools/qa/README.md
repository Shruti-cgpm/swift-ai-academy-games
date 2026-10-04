# QA scripts (Playwright) - templates
These click through THIS game's screen order. For another game, copy and change the screen-by-screen steps; keep the checks.
    npm i playwright && npx playwright install chromium
    GAME_URL=file:///path/to/game/index.html node tools/qa/desktop_flow.js   # overflow at 1024x600, 1280x720
    node tools/qa/phone_flow.js    # Pixel 7 + 360x640, taps every control, checks sideways scroll
    node tools/qa/drag_cancel.js   # drag: Esc, release outside window, release on empty area, normal drop, tap
Pass = "no overflow" / "all taps OK" and an empty [] (no page errors).
