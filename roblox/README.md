# 🎮 SpectreWareUI • Roblox Luau Library
### High-End Obsidian Dark UI Framework for Roblox Executors

SpectreWareUI is a standalone Luau GUI library designed specifically for Roblox script execution (Auto Farm, Hubs, Utility suites). It is an authentic 1:1 visual replica of the **SpectreWare 1.0** desktop suite, featuring the obsidian matte dark palette (`#06080e`), multi-hue ambient aura glow system, horizontal segmented tabs header, and refined micro-border cards.

---

## ⚡ Quick Loadstring (Direct from GitHub)

Run this directly in any executor (Synapse, Wave, KRNL, Arceus X, Delta, Codex, etc.):

```lua
local SpectreWareUI = loadstring(game:HttpGet("https://raw.githubusercontent.com/tigergenz/SpectreWare/main/roblox/SpectreWareUI.lua"))()

local Window = SpectreWareUI:CreateWindow({
    Title = "SpectreWare",
    SubTitle = "Auto-Farm Suite",
    Version = "1.0",
    Theme = "Cobalt", -- "Cobalt" | "Glacier" | "Violet" | "Emerald" | "Crimson"
    ToggleKey = Enum.KeyCode.RightControl
})

-- Trigger Toast Notification
Window:Notify({
    Title = "SpectreWare Subsystems",
    Content = "Core automation verified & operational.",
    Duration = 3
})

-- Create Horizontal Segmented Tabs (Like TabsHeader.tsx)
local MainTab = Window:CreateTab("Auto Farm", "PRO")
local VisualsTab = Window:CreateTab("Visuals")
local SettingsTab = Window:CreateTab("Settings")

-- Section Header
MainTab:CreateSection("Target Settings")

-- Dropdown with Value Pill
MainTab:CreateDropdown({
    Name = "Select Monster / NPC",
    Options = { "Zombie Lv.1", "Skeleton Boss", "Bandit Rogue" },
    Default = "Zombie Lv.1",
    Callback = function(val)
        print("Target Selected:", val)
    end
})

-- Toggle with Subtitle Description
MainTab:CreateToggle({
    Name = "Auto Attack Target",
    Description = "Continuously strike locked targets using active weapon",
    Default = false,
    Callback = function(enabled)
        print("Auto Attack:", enabled)
    end
})

-- Precision Slider with Unit Badge
MainTab:CreateSlider({
    Name = "Attack Delay",
    Unit = "hits/s",
    Min = 5,
    Max = 35,
    Default = 15,
    Callback = function(val)
        print("Hits/sec:", val)
    end
})

-- Action Button with Arrow Glide
MainTab:CreateButton({
    Name = "Instant Warp to Safe Zone",
    Primary = true,
    Callback = function()
        print("Teleport Triggered")
    end
})

-- Keybind Changer
SettingsTab:CreateKeybind({
    Name = "UI Toggle Keybind",
    Default = Enum.KeyCode.RightControl,
    Callback = function(key)
        print("New key:", key.Name)
    end
})
```

---

## 🎨 Themes Available

| Theme Key | Primary Accent | Background | Vibe / Description |
|---|---|---|---|
| `"Cobalt"` | `#38bdf8` (Electric Sapphire) | `#06080e` | Default SpectreWare deep-focus blue |
| `"Glacier"` | `#06b6d4` (Arctic Ice) | `#06080e` | Clean cyan luminescence |
| `"Violet"` | `#a855f7` (Ultraviolet) | `#06080e` | Cyberpunk deep neon purple |
| `"Emerald"` | `#34d399` (Matrix Green) | `#06080e` | Tactical stealth green |
| `"Crimson"` | `#fb7185` (Crimson Rose) | `#06080e` | High-contrast luxury red |

---

## 🛡️ Executor Safety & Features
- **`gethui()` Integration:** Automatically detects and parents GUI to `gethui` to bypass client GUI detection scripts.
- **Fallbacks:** Seamlessly falls back to `CoreGui` or `PlayerGui` on any executor or in Roblox Studio test environments.
- **TitleBar Controls:** Smooth window dragging (`UserInputService`), Ghost brand badge, Version pill, operational status indicator, and minimize/close buttons.
- **Toast Engine:** Floating bottom-right notification cards with accent colored indicator lines.
- **Hotkey Toggle:** Default hotkey `Enum.KeyCode.RightControl` (rebindable inside UI).
