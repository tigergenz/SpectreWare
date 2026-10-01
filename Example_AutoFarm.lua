--[[
    ══════════════════════════════════════════════════════════════════
    SpectreWareUI • Example Auto Farm Script
    Demonstrates usage with Toggles, Sliders, Dropdowns & Sections
    ══════════════════════════════════════════════════════════════════
--]]

-- Load the SpectreWareUI library
-- In an executor you can do: local SpectreWareUI = loadstring(game:HttpGet("YOUR_RAW_URL"))()
-- For local testing:
local SpectreWareUI = loadstring(readfile and readfile("SpectreWareUI.lua") or "")()
if not SpectreWareUI then
    -- Fallback for environments without readfile
    warn("SpectreWareUI loaded from module")
end

-- 1. Create Main Window
local Window = SpectreWareUI:CreateWindow({
    Title = "SpectreWare",
    SubTitle = "Auto-Farm Suite v1.0",
    Theme = "Cobalt", -- Available: "Cobalt", "Glacier", "Violet", "Emerald"
    ToggleKey = Enum.KeyCode.RightControl -- Key to show/hide GUI
})

-- 2. Create Tabs
local MainTab = Window:CreateTab("Auto Farm")
local TeleportTab = Window:CreateTab("Teleports")
local VisualsTab = Window:CreateTab("Visuals & ESP")
local SettingsTab = Window:CreateTab("Settings")

-- 3. Populate Main Auto Farm Tab
MainTab:CreateSection("Target Acquisition")

local SelectedMob = "Zombie Level 1"
MainTab:CreateDropdown({
    Name = "Select Monster / NPC",
    Options = { "Zombie Level 1", "Skeleton Boss", "Bandit Rogue", "Dragon Guardian" },
    Default = "Zombie Level 1",
    Callback = function(val)
        SelectedMob = val
        print("[SpectreWare] Target set to:", val)
    end
})

MainTab:CreateSection("Combat Automation")

local AutoAttackEnabled = false
local AttackSpeed = 15

local AutoFarmToggle = MainTab:CreateToggle({
    Name = "Auto Attack & Farm Target",
    Default = false,
    Callback = function(enabled)
        AutoAttackEnabled = enabled
        print("[SpectreWare] Auto Farm Active:", enabled)
        
        -- Execution loop
        task.spawn(function()
            while AutoAttackEnabled do
                task.wait(1 / AttackSpeed)
                -- Auto attack logic goes here (e.g. VirtualUser, Remotes, etc.)
            end
        end)
    end
})

MainTab:CreateSlider({
    Name = "Attack Delay / Hits Per Sec",
    Min = 5,
    Max = 30,
    Default = 15,
    Callback = function(val)
        AttackSpeed = val
        print("[SpectreWare] Attack Speed:", val)
    end
})

MainTab:CreateToggle({
    Name = "Auto Collect Dropped Loot",
    Default = true,
    Callback = function(enabled)
        print("[SpectreWare] Auto Loot:", enabled)
    end
})

-- 4. Teleport Tab
TeleportTab:CreateSection("Waypoints")

TeleportTab:CreateButton({
    Name = "Teleport to Safe Zone",
    Callback = function()
        print("[SpectreWare] Teleporting to Safe Zone...")
    end
})

TeleportTab:CreateButton({
    Name = "Teleport to Blacksmith",
    Callback = function()
        print("[SpectreWare] Teleporting to Blacksmith...")
    end
})

-- 5. Visuals Tab
VisualsTab:CreateSection("Player & Mob Radar")

VisualsTab:CreateToggle({
    Name = "Monster ESP Chams",
    Default = false,
    Callback = function(v)
        print("[SpectreWare] Mob ESP:", v)
    end
})

VisualsTab:CreateToggle({
    Name = "Player Tracer Lines",
    Default = false,
    Callback = function(v)
        print("[SpectreWare] Tracers:", v)
    end
})

-- 6. Settings Tab
SettingsTab:CreateSection("System Preferences")

SettingsTab:CreateButton({
    Name = "Destroy & Unload GUI",
    Callback = function()
        Window.ScreenGui:Destroy()
        print("[SpectreWare] UI Unloaded cleanly.")
    end
})
