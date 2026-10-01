# 🎮 SpectreWareUI • Roblox Luau Library
### High-End Obsidian Dark UI Framework for Roblox Executors

SpectreWareUI is a standalone Luau GUI library designed specifically for Roblox script execution (Auto Farm, Hubs, Utility suites). It features the same obsidian matte dark theme (`#06080e`), calibrated ambient aura glows, and micro-animations found in the SpectreWare 1.0 desktop suite.

---

## ⚡ Quick Loadstring (Direct from GitHub)

Run this directly in any executor (Synapse, Wave, KRNL, Arceus X, Delta, Codex, etc.):

```lua
local SpectreWareUI = loadstring(game:HttpGet("https://raw.githubusercontent.com/tigergenz/SpectreWare/main/roblox/SpectreWareUI.lua"))()

local Window = SpectreWareUI:CreateWindow({
    Title = "SpectreWare",
    SubTitle = "Suite v1.0",
    Theme = "Cobalt", -- "Cobalt" | "Glacier" | "Violet" | "Emerald"
    ToggleKey = Enum.KeyCode.RightControl
})

local Tab = Window:CreateTab("Auto Farm")
Tab:CreateSection("Target Settings")

Tab:CreateToggle({
    Name = "Auto Attack Mobs",
    Default = false,
    Callback = function(enabled)
        print("Auto Farm Active:", enabled)
    end
})

Tab:CreateSlider({
    Name = "Attack Delay (ms)",
    Min = 5,
    Max = 50,
    Default = 15,
    Callback = function(val)
        print("Delay:", val)
    end
})

Tab:CreateDropdown({
    Name = "Select Monster",
    Options = { "Zombie Lv.1", "Skeleton Boss", "Dragon Guardian" },
    Default = "Zombie Lv.1",
    Callback = function(val)
        print("Target Selected:", val)
    end
})

Tab:CreateButton({
    Name = "Instant Teleport",
    Callback = function()
        print("Teleport Triggered")
    end
})
```

---

## 🎨 Themes Available

| Theme Key | Primary Accent | Vibe / Description |
|---|---|---|
| `"Cobalt"` | `#38bdf8` (Electric Sapphire) | Default SpectreWare focus blue |
| `"Glacier"` | `#06b6d4` (Arctic Ice) | Clean cyan luminescence |
| `"Violet"` | `#a855f7` (Ultraviolet) | Cyberpunk deep neon purple |
| `"Emerald"` | `#34d399` (Matrix Green) | Tactical stealth green |

---

## 🛡️ Executor Safety & Stealth
- **`gethui()` Integration:** Automatically detects and parents GUI to `gethui` if available to bypass basic client GUI detection scripts.
- **Fallbacks:** Seamlessly falls back to `CoreGui` or `PlayerGui` on any executor or in Roblox Studio test environments.
- **Draggable Window:** Header bar dragging supported via smooth `TweenService` and `UserInputService`.
- **Hotkey Toggle:** Default hotkey `Enum.KeyCode.RightControl` (can be configured in `CreateWindow`).
