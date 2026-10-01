--[[
    ══════════════════════════════════════════════════════════════════════════════════════════════════
    👻 SPECTREWARE AUTO-FARM SUITE v1.0
    Demonstration script using the official SpectreWareUI Luau Library
    ══════════════════════════════════════════════════════════════════════════════════════════════════
--]]

-- Direct Cloud Loader from GitHub Raw URL
local SpectreWareUI = loadstring(game:HttpGet("https://raw.githubusercontent.com/tigergenz/SpectreWare/main/roblox/SpectreWareUI.lua"))()

-- 1. Create Main Window (Exact replica of SpectreWare 1.0 Desktop)
local Window = SpectreWareUI:CreateWindow({
    Title = "SpectreWare",
    SubTitle = "Auto-Farm Suite",
    Version = "1.0",
    Theme = "Cobalt", -- Available: "Cobalt", "Glacier", "Violet", "Emerald", "Crimson"
    ToggleKey = Enum.KeyCode.RightControl
})

-- Trigger Launch Toast
Window:Notify({
    Title = "SpectreWare Subsystems",
    Content = "Core automation modules verified & operational.",
    Duration = 4
})

-- 2. Create Horizontal Tabs (Replica of TabsHeader)
local CombatTab = Window:CreateTab("Auto Farm", "PRO")
local TeleportTab = Window:CreateTab("Teleports")
local VisualsTab = Window:CreateTab("Visuals & ESP")
local SettingsTab = Window:CreateTab("Settings")

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. COMBAT AUTOMATION TAB
-- ─────────────────────────────────────────────────────────────────────────────
CombatTab:CreateSection("Target Selection & Detection")

local TargetMob = "Zombie Level 1"
CombatTab:CreateDropdown({
    Name = "Select Monster / NPC",
    Options = { "Zombie Level 1", "Skeleton Boss [Raid]", "Bandit Rogue", "Ancient Dragon" },
    Default = "Zombie Level 1",
    Callback = function(selected)
        TargetMob = selected
        Window:Notify({
            Title = "Target Acquired",
            Content = "Focus locked onto: " .. selected,
            Duration = 2.5
        })
    end
})

CombatTab:CreateSection("Combat Parameters")

local AutoAttackActive = false
local AttackSpeed = 15

CombatTab:CreateToggle({
    Name = "Auto Attack Target",
    Description = "Repeatedly strike locked targets within range using active weapon",
    Default = false,
    Callback = function(enabled)
        AutoAttackActive = enabled
        Window:Notify({
            Title = "Combat Engine",
            Content = enabled and "Auto-attack routine initiated." or "Auto-attack routine halted.",
            Duration = 2
        })

        task.spawn(function()
            while AutoAttackActive do
                task.wait(1 / AttackSpeed)
                -- Combat logic execution (VirtualUser, Remotes, etc.)
            end
        end)
    end
})

CombatTab:CreateSlider({
    Name = "Attack Delay / Hits Per Second",
    Unit = "hits/s",
    Min = 5,
    Max = 35,
    Default = 15,
    Callback = function(val)
        AttackSpeed = val
    end
})

CombatTab:CreateToggle({
    Name = "Auto Collect Loot & Drops",
    Description = "Instantly magnet dropped currency, gems, and rare loot to inventory",
    Default = true,
    Callback = function(enabled)
        print("[SpectreWare] Auto Loot:", enabled)
    end
})

CombatTab:CreateToggle({
    Name = "Fast Auto-Equip Best Weapon",
    Description = "Equip highest-DPS tool or weapon currently available in backpack",
    Default = true,
    Callback = function(enabled)
        print("[SpectreWare] Auto Equip:", enabled)
    end
})

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. TELEPORTS TAB
-- ─────────────────────────────────────────────────────────────────────────────
TeleportTab:CreateSection("Sanctuary & Hub Waypoints")

TeleportTab:CreateButton({
    Name = "Teleport to Spawn Safe Zone",
    Primary = true,
    Callback = function()
        Window:Notify({
            Title = "Spatial Relocation",
            Content = "Warped player character to Safe Zone.",
            Duration = 2
        })
    end
})

TeleportTab:CreateButton({
    Name = "Teleport to Blacksmith & Merchant",
    Primary = false,
    Callback = function()
        Window:Notify({
            Title = "Spatial Relocation",
            Content = "Warped to Blacksmith Forge.",
            Duration = 2
        })
    end
})

TeleportTab:CreateButton({
    Name = "Teleport to Raid Boss Arena",
    Primary = false,
    Callback = function()
        Window:Notify({
            Title = "Spatial Relocation",
            Content = "Warped to Raid Dungeon Entrance.",
            Duration = 2
        })
    end
})

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. VISUALS & ESP TAB
-- ─────────────────────────────────────────────────────────────────────────────
VisualsTab:CreateSection("Tactical Radar Overlay")

VisualsTab:CreateToggle({
    Name = "Monster ESP Chams",
    Description = "Highlight all hostile NPC boundaries with neon box overlays",
    Default = false,
    Callback = function(v)
        print("[SpectreWare] Mob Chams:", v)
    end
})

VisualsTab:CreateToggle({
    Name = "Player Distance Tracers",
    Description = "Draw direct line indicators from screen center to other players",
    Default = false,
    Callback = function(v)
        print("[SpectreWare] Tracers:", v)
    end
})

VisualsTab:CreateSlider({
    Name = "ESP Max Render Distance",
    Unit = "studs",
    Min = 200,
    Max = 2500,
    Default = 800,
    Callback = function(val)
        print("[SpectreWare] ESP Range:", val)
    end
})

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. SETTINGS TAB
-- ─────────────────────────────────────────────────────────────────────────────
SettingsTab:CreateSection("Keybinds & Controls")

SettingsTab:CreateKeybind({
    Name = "Window Visibility Keybind",
    Default = Enum.KeyCode.RightControl,
    Callback = function(newKey)
        Window:Notify({
            Title = "Hotkey Updated",
            Content = "UI toggle key assigned to: " .. newKey.Name,
            Duration = 3
        })
    end
})

SettingsTab:CreateSection("Suite Lifecycle")

SettingsTab:CreateButton({
    Name = "Unload & Terminate SpectreWare",
    Primary = false,
    Callback = function()
        Window.ScreenGui:Destroy()
    end
})
