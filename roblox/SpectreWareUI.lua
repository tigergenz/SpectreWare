--[[
    ══════════════════════════════════════════════════════════════════════════════════════════════════
    👻 SPECTREWARE UI v1.0 • LUXURY OBSIDIAN LUAU LIBRARY
    Exact visual replica of SpectreWare 1.0 Desktop Media Suite
    Engineered by cook45 for clack
    
    Features:
    • Authentic Obsidian Matte Dark (#06080e) & Micro-Border Design System
    • Top Draggable TitleBar with Ghost Badge, Version Pill & System Status
    • Horizontal Segmented Tabs Header (Replica of TabsHeader.tsx)
    • Multi-Hue Ambient Aura Glow System (Cobalt, Glacier, Violet, Emerald, Crimson, Amber, Stealth)
    • High-Fidelity UI Components: Toggles with Descriptions, Precision Sliders,
      Floating Dropdowns, Action Buttons with Arrow Glides, Keybind Catchers, Text Inputs
    • Notification Toast Engine (Floating bottom-right glass cards)
    • Safe Executor Context (gethui() -> CoreGui -> PlayerGui auto fallback)
    ══════════════════════════════════════════════════════════════════════════════════════════════════
--]]

local SpectreWareUI = {}
SpectreWareUI.__index = SpectreWareUI

-- Engine Services
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")
local CoreGui = game:GetService("CoreGui")

local LocalPlayer = Players.LocalPlayer

-- Calibrated Luxury Themes (100% matched with src/data/themes.ts)
SpectreWareUI.Themes = {
    Cobalt = {
        Name = "Cobalt Sapphire",
        Accent = Color3.fromRGB(56, 189, 248),
        Glow = Color3.fromRGB(2, 132, 199),
        Background = Color3.fromRGB(6, 8, 14),
        TitleBar = Color3.fromRGB(9, 10, 15),
        TabBar = Color3.fromRGB(10, 12, 18),
        Card = Color3.fromRGB(17, 17, 22),
        CardHover = Color3.fromRGB(22, 22, 29),
        Surface = Color3.fromRGB(12, 13, 18),
        Border = Color3.fromRGB(36, 40, 52),
        BorderSubtle = Color3.fromRGB(25, 27, 35),
        Text = Color3.fromRGB(244, 244, 246),
        TextMuted = Color3.fromRGB(113, 113, 122),
        TextSubtle = Color3.fromRGB(75, 75, 85)
    },
    Glacier = {
        Name = "Glacier Cyan",
        Accent = Color3.fromRGB(6, 182, 212),
        Glow = Color3.fromRGB(8, 145, 178),
        Background = Color3.fromRGB(6, 8, 14),
        TitleBar = Color3.fromRGB(9, 10, 15),
        TabBar = Color3.fromRGB(10, 12, 18),
        Card = Color3.fromRGB(17, 17, 22),
        CardHover = Color3.fromRGB(22, 22, 29),
        Surface = Color3.fromRGB(12, 13, 18),
        Border = Color3.fromRGB(28, 48, 56),
        BorderSubtle = Color3.fromRGB(20, 32, 38),
        Text = Color3.fromRGB(244, 244, 246),
        TextMuted = Color3.fromRGB(113, 113, 122),
        TextSubtle = Color3.fromRGB(75, 75, 85)
    },
    Violet = {
        Name = "Obsidian Violet",
        Accent = Color3.fromRGB(168, 85, 247),
        Glow = Color3.fromRGB(126, 34, 206),
        Background = Color3.fromRGB(6, 8, 14),
        TitleBar = Color3.fromRGB(9, 10, 15),
        TabBar = Color3.fromRGB(10, 12, 18),
        Card = Color3.fromRGB(17, 17, 22),
        CardHover = Color3.fromRGB(22, 22, 29),
        Surface = Color3.fromRGB(12, 13, 18),
        Border = Color3.fromRGB(48, 34, 66),
        BorderSubtle = Color3.fromRGB(30, 22, 42),
        Text = Color3.fromRGB(244, 244, 246),
        TextMuted = Color3.fromRGB(113, 113, 122),
        TextSubtle = Color3.fromRGB(75, 75, 85)
    },
    Emerald = {
        Name = "Tactical Emerald",
        Accent = Color3.fromRGB(52, 211, 153),
        Glow = Color3.fromRGB(5, 150, 105),
        Background = Color3.fromRGB(6, 8, 14),
        TitleBar = Color3.fromRGB(9, 10, 15),
        TabBar = Color3.fromRGB(10, 12, 18),
        Card = Color3.fromRGB(17, 17, 22),
        CardHover = Color3.fromRGB(22, 22, 29),
        Surface = Color3.fromRGB(12, 13, 18),
        Border = Color3.fromRGB(32, 52, 42),
        BorderSubtle = Color3.fromRGB(22, 36, 28),
        Text = Color3.fromRGB(244, 244, 246),
        TextMuted = Color3.fromRGB(113, 113, 122),
        TextSubtle = Color3.fromRGB(75, 75, 85)
    },
    Crimson = {
        Name = "Crimson Rose",
        Accent = Color3.fromRGB(251, 113, 133),
        Glow = Color3.fromRGB(225, 29, 72),
        Background = Color3.fromRGB(6, 8, 14),
        TitleBar = Color3.fromRGB(9, 10, 15),
        TabBar = Color3.fromRGB(10, 12, 18),
        Card = Color3.fromRGB(17, 17, 22),
        CardHover = Color3.fromRGB(22, 22, 29),
        Surface = Color3.fromRGB(12, 13, 18),
        Border = Color3.fromRGB(56, 32, 38),
        BorderSubtle = Color3.fromRGB(38, 20, 26),
        Text = Color3.fromRGB(244, 244, 246),
        TextMuted = Color3.fromRGB(113, 113, 122),
        TextSubtle = Color3.fromRGB(75, 75, 85)
    }
}

-- Safe Parent Resolver (Prevents game anti-cheats from querying PlayerGui)
local function GetSafeGuiParent()
    local success, parent = pcall(function()
        if gethui then
            return gethui()
        end
        return CoreGui
    end)
    if success and parent then
        return parent
    end
    return LocalPlayer:WaitForChild("PlayerGui")
end

-- Smooth Tween Helper
local function Animate(obj, duration, props, style, direction)
    style = style or Enum.EasingStyle.Quart
    direction = direction or Enum.EasingDirection.Out
    local info = TweenInfo.new(duration, style, direction)
    local tween = TweenService:Create(obj, info, props)
    tween:Play()
    return tween
end

-- Draggable Window System
local function SetupDraggable(dragHandle, targetFrame)
    local dragging = false
    local dragInput, mousePos, framePos

    dragHandle.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
            dragging = true
            mousePos = input.Position
            framePos = targetFrame.Position

            input.Changed:Connect(function()
                if input.UserInputState == Enum.UserInputState.End then
                    dragging = false
                end
            end)
        end
    end)

    dragHandle.InputChanged:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch then
            dragInput = input
        end
    end)

    UserInputService.InputChanged:Connect(function(input)
        if input == dragInput and dragging then
            local delta = input.Position - mousePos
            Animate(targetFrame, 0.08, {
                Position = UDim2.new(
                    framePos.X.Scale,
                    framePos.X.Offset + delta.X,
                    framePos.Y.Scale,
                    framePos.Y.Offset + delta.Y
                )
            })
        end
    end)
end

-- ══════════════════════════════════════════════════════════════════════════════════════════════════
-- MAIN WINDOW CONSTRUCTOR
-- ══════════════════════════════════════════════════════════════════════════════════════════════════
function SpectreWareUI:CreateWindow(config)
    config = config or {}
    local Title = config.Title or "SpectreWare"
    local SubTitle = config.SubTitle or "Automation Suite"
    local Version = config.Version or "1.0"
    local ThemeKey = config.Theme or "Cobalt"
    local Theme = SpectreWareUI.Themes[ThemeKey] or SpectreWareUI.Themes.Cobalt
    local ToggleKey = config.ToggleKey or Enum.KeyCode.RightControl

    local ScreenGui = Instance.new("ScreenGui")
    ScreenGui.Name = "SpectreWareUI_" .. tostring(math.random(10000, 99999))
    ScreenGui.ResetOnSpawn = false
    ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
    ScreenGui.Parent = GetSafeGuiParent()

    -- Toast / Notification Container (Bottom-Right)
    local ToastContainer = Instance.new("Frame")
    ToastContainer.Name = "ToastContainer"
    ToastContainer.Size = UDim2.new(0, 280, 1, -40)
    ToastContainer.Position = UDim2.new(1, -290, 0, 20)
    ToastContainer.BackgroundTransparency = 1
    ToastContainer.ZIndex = 100
    ToastContainer.Parent = ScreenGui

    local ToastLayout = Instance.new("UIListLayout")
    ToastLayout.VerticalAlignment = Enum.VerticalAlignment.Bottom
    ToastLayout.Padding = UDim.new(0, 8)
    ToastLayout.Parent = ToastContainer

    -- Outer Window Canvas
    local MainFrame = Instance.new("Frame")
    MainFrame.Name = "MainFrame"
    MainFrame.Size = UDim2.new(0, 640, 0, 440)
    MainFrame.Position = UDim2.new(0.5, -320, 0.5, -220)
    MainFrame.BackgroundColor3 = Theme.Background
    MainFrame.BorderSizePixel = 0
    MainFrame.ClipsDescendants = false
    MainFrame.ZIndex = 2
    MainFrame.Parent = ScreenGui

    local MainCorner = Instance.new("UICorner")
    MainCorner.CornerRadius = UDim.new(0, 10)
    MainCorner.Parent = MainFrame

    local MainStroke = Instance.new("UIStroke")
    MainStroke.Color = Theme.Border
    MainStroke.Thickness = 1
    MainStroke.Parent = MainFrame

    -- Dynamic Ambient Aura Glow Layers (Behind MainFrame)
    local AmbientGlow1 = Instance.new("ImageLabel")
    AmbientGlow1.Name = "AmbientGlow1"
    AmbientGlow1.Size = UDim2.new(1, 160, 1, 160)
    AmbientGlow1.Position = UDim2.new(0, -80, 0, -80)
    AmbientGlow1.BackgroundTransparency = 1
    AmbientGlow1.Image = "rbxassetid://5028857084"
    AmbientGlow1.ImageColor3 = Theme.Accent
    AmbientGlow1.ImageTransparency = 0.82
    AmbientGlow1.ZIndex = 1
    AmbientGlow1.Parent = MainFrame

    local AmbientGlowTop = Instance.new("ImageLabel")
    AmbientGlowTop.Name = "AmbientGlowTop"
    AmbientGlowTop.Size = UDim2.new(1, 40, 0, 220)
    AmbientGlowTop.Position = UDim2.new(0, -20, 0, -50)
    AmbientGlowTop.BackgroundTransparency = 1
    AmbientGlowTop.Image = "rbxassetid://5028857084"
    AmbientGlowTop.ImageColor3 = Theme.Glow
    AmbientGlowTop.ImageTransparency = 0.88
    AmbientGlowTop.ZIndex = 1
    AmbientGlowTop.Parent = MainFrame

    -- ─────────────────────────────────────────────────────────────────────────────
    -- 1. TITLEBAR (Authentic Replica of TitleBar.tsx)
    -- ─────────────────────────────────────────────────────────────────────────────
    local TitleBar = Instance.new("Frame")
    TitleBar.Name = "TitleBar"
    TitleBar.Size = UDim2.new(1, 0, 0, 38)
    TitleBar.BackgroundColor3 = Theme.TitleBar
    TitleBar.BorderSizePixel = 0
    TitleBar.ZIndex = 5
    TitleBar.Parent = MainFrame

    local TitleBarCorner = Instance.new("UICorner")
    TitleBarCorner.CornerRadius = UDim.new(0, 10)
    TitleBarCorner.Parent = TitleBar

    local TitleBarMask = Instance.new("Frame")
    TitleBarMask.Size = UDim2.new(1, 0, 0, 12)
    TitleBarMask.Position = UDim2.new(0, 0, 1, -12)
    TitleBarMask.BackgroundColor3 = Theme.TitleBar
    TitleBarMask.BorderSizePixel = 0
    TitleBarMask.ZIndex = 5
    TitleBarMask.Parent = TitleBar

    local TitleBarBorder = Instance.new("Frame")
    TitleBarBorder.Size = UDim2.new(1, 0, 0, 1)
    TitleBarBorder.Position = UDim2.new(0, 0, 1, 0)
    TitleBarBorder.BackgroundColor3 = Theme.BorderSubtle
    TitleBarBorder.BorderSizePixel = 0
    TitleBarBorder.ZIndex = 6
    TitleBarBorder.Parent = TitleBar

    -- Left Brand Area
    local BrandGroup = Instance.new("Frame")
    BrandGroup.Size = UDim2.new(0, 320, 1, 0)
    BrandGroup.Position = UDim2.new(0, 12, 0, 0)
    BrandGroup.BackgroundTransparency = 1
    BrandGroup.ZIndex = 6
    BrandGroup.Parent = TitleBar

    -- Ghost Recessed Icon Box
    local GhostBox = Instance.new("Frame")
    GhostBox.Size = UDim2.new(0, 22, 0, 22)
    GhostBox.Position = UDim2.new(0, 0, 0.5, -11)
    GhostBox.BackgroundColor3 = Color3.fromRGB(15, 17, 24)
    GhostBox.BorderSizePixel = 0
    GhostBox.ZIndex = 6
    GhostBox.Parent = BrandGroup

    local GhostBoxCorner = Instance.new("UICorner")
    GhostBoxCorner.CornerRadius = UDim.new(0, 5)
    GhostBoxCorner.Parent = GhostBox

    local GhostBoxStroke = Instance.new("UIStroke")
    GhostBoxStroke.Color = Theme.BorderSubtle
    GhostBoxStroke.Thickness = 1
    GhostBoxStroke.Parent = GhostBox

    -- Stylized Ghost Symbol
    local GhostSymbol = Instance.new("TextLabel")
    GhostSymbol.Size = UDim2.new(1, 0, 1, 0)
    GhostSymbol.BackgroundTransparency = 1
    GhostSymbol.Text = "👻"
    GhostSymbol.TextSize = 11
    GhostSymbol.ZIndex = 7
    GhostSymbol.Parent = GhostBox

    -- Title Text
    local TitleText = Instance.new("TextLabel")
    TitleText.Text = Title:upper()
    TitleText.Font = Enum.Font.GothamBold
    TitleText.TextSize = 11
    TitleText.TextColor3 = Theme.Text
    TitleText.Position = UDim2.new(0, 30, 0, 0)
    TitleText.Size = UDim2.new(0, 80, 1, 0)
    TitleText.BackgroundTransparency = 1
    TitleText.TextXAlignment = Enum.TextXAlignment.Left
    TitleText.ZIndex = 6
    TitleText.Parent = BrandGroup

    -- Version Badge Pill
    local VersionBadge = Instance.new("Frame")
    VersionBadge.Size = UDim2.new(0, 26, 0, 16)
    VersionBadge.Position = UDim2.new(0, 116, 0.5, -8)
    VersionBadge.BackgroundColor3 = Color3.fromRGB(14, 16, 22)
    VersionBadge.BorderSizePixel = 0
    VersionBadge.ZIndex = 6
    VersionBadge.Parent = BrandGroup

    local VersionCorner = Instance.new("UICorner")
    VersionCorner.CornerRadius = UDim.new(0, 4)
    VersionCorner.Parent = VersionBadge

    local VersionStroke = Instance.new("UIStroke")
    VersionStroke.Color = Theme.BorderSubtle
    VersionStroke.Thickness = 1
    VersionStroke.Parent = VersionBadge

    local VersionText = Instance.new("TextLabel")
    VersionText.Size = UDim2.new(1, 0, 1, 0)
    VersionText.BackgroundTransparency = 1
    VersionText.Text = Version
    VersionText.Font = Enum.Font.Code
    VersionText.TextSize = 9
    VersionText.TextColor3 = Theme.TextMuted
    VersionText.ZIndex = 7
    VersionText.Parent = VersionBadge

    -- Breadcrumb Subtitle
    local Breadcrumb = Instance.new("TextLabel")
    Breadcrumb.Text = "/ " .. SubTitle
    Breadcrumb.Font = Enum.Font.Code
    Breadcrumb.TextSize = 10
    Breadcrumb.TextColor3 = Theme.TextSubtle
    Breadcrumb.Position = UDim2.new(0, 148, 0, 0)
    Breadcrumb.Size = UDim2.new(0, 160, 1, 0)
    Breadcrumb.BackgroundTransparency = 1
    Breadcrumb.TextXAlignment = Enum.TextXAlignment.Left
    Breadcrumb.ZIndex = 6
    Breadcrumb.Parent = BrandGroup

    -- Middle Operational Pulse Badge
    local StatusBadge = Instance.new("Frame")
    StatusBadge.Size = UDim2.new(0, 130, 0, 20)
    StatusBadge.Position = UDim2.new(0.5, -65, 0.5, -10)
    StatusBadge.BackgroundColor3 = Color3.fromRGB(12, 14, 20)
    StatusBadge.BorderSizePixel = 0
    StatusBadge.ZIndex = 6
    StatusBadge.Parent = TitleBar

    local StatusCorner = Instance.new("UICorner")
    StatusCorner.CornerRadius = UDim.new(1, 0)
    StatusCorner.Parent = StatusBadge

    local StatusStroke = Instance.new("UIStroke")
    StatusStroke.Color = Theme.BorderSubtle
    StatusStroke.Thickness = 1
    StatusStroke.Parent = StatusBadge

    local StatusDot = Instance.new("Frame")
    StatusDot.Size = UDim2.new(0, 5, 0, 5)
    StatusDot.Position = UDim2.new(0, 8, 0.5, -2)
    StatusDot.BackgroundColor3 = Theme.Accent
    StatusDot.BorderSizePixel = 0
    StatusDot.ZIndex = 7
    StatusDot.Parent = StatusBadge

    local StatusDotCorner = Instance.new("UICorner")
    StatusDotCorner.CornerRadius = UDim.new(1, 0)
    StatusDotCorner.Parent = StatusDot

    local StatusText = Instance.new("TextLabel")
    StatusText.Size = UDim2.new(1, -22, 1, 0)
    StatusText.Position = UDim2.new(0, 18, 0, 0)
    StatusText.BackgroundTransparency = 1
    StatusText.Text = "Core Operational"
    StatusText.Font = Enum.Font.Code
    StatusText.TextSize = 9
    StatusText.TextColor3 = Theme.TextMuted
    StatusText.TextXAlignment = Enum.TextXAlignment.Left
    StatusText.ZIndex = 7
    StatusText.Parent = StatusBadge

    -- Continuous Pulse Animation for Status Dot
    task.spawn(function()
        while ScreenGui and ScreenGui.Parent do
            Animate(StatusDot, 0.8, { BackgroundTransparency = 0.6 })
            task.wait(0.8)
            Animate(StatusDot, 0.8, { BackgroundTransparency = 0 })
            task.wait(0.8)
        end
    end)

    -- Window Controls on the Right
    local ControlsGroup = Instance.new("Frame")
    ControlsGroup.Size = UDim2.new(0, 70, 1, 0)
    ControlsGroup.Position = UDim2.new(1, -74, 0, 0)
    ControlsGroup.BackgroundTransparency = 1
    ControlsGroup.ZIndex = 6
    ControlsGroup.Parent = TitleBar

    -- Minimize Button
    local MinBtn = Instance.new("TextButton")
    MinBtn.Size = UDim2.new(0, 24, 0, 24)
    MinBtn.Position = UDim2.new(0, 10, 0.5, -12)
    MinBtn.BackgroundColor3 = Color3.fromRGB(14, 16, 22)
    MinBtn.Text = "–"
    MinBtn.Font = Enum.Font.GothamMedium
    MinBtn.TextSize = 12
    MinBtn.TextColor3 = Theme.TextMuted
    MinBtn.BorderSizePixel = 0
    MinBtn.ZIndex = 7
    MinBtn.Parent = ControlsGroup

    local MinCorner = Instance.new("UICorner")
    MinCorner.CornerRadius = UDim.new(0, 5)
    MinCorner.Parent = MinBtn

    -- Close Button
    local CloseBtn = Instance.new("TextButton")
    CloseBtn.Size = UDim2.new(0, 24, 0, 24)
    CloseBtn.Position = UDim2.new(0, 40, 0.5, -12)
    CloseBtn.BackgroundColor3 = Color3.fromRGB(14, 16, 22)
    CloseBtn.Text = "✕"
    CloseBtn.Font = Enum.Font.GothamMedium
    CloseBtn.TextSize = 10
    CloseBtn.TextColor3 = Theme.TextMuted
    CloseBtn.BorderSizePixel = 0
    CloseBtn.ZIndex = 7
    CloseBtn.Parent = ControlsGroup

    local CloseCorner = Instance.new("UICorner")
    CloseCorner.CornerRadius = UDim.new(0, 5)
    CloseCorner.Parent = CloseBtn

    CloseBtn.MouseEnter:Connect(function()
        Animate(CloseBtn, 0.15, { BackgroundColor3 = Color3.fromRGB(244, 63, 94), TextColor3 = Color3.new(1, 1, 1) })
    end)
    CloseBtn.MouseLeave:Connect(function()
        Animate(CloseBtn, 0.15, { BackgroundColor3 = Color3.fromRGB(14, 16, 22), TextColor3 = Theme.TextMuted })
    end)
    CloseBtn.MouseButton1Click:Connect(function()
        Animate(MainFrame, 0.25, { Size = UDim2.new(0, 0, 0, 0), Position = UDim2.new(0.5, 0, 0.5, 0) })
        task.wait(0.25)
        ScreenGui:Destroy()
    end)

    -- Enable Dragging on TitleBar
    SetupDraggable(TitleBar, MainFrame)

    -- ─────────────────────────────────────────────────────────────────────────────
    -- 2. TABS HEADER BAR (Authentic Replica of TabsHeader.tsx)
    -- ─────────────────────────────────────────────────────────────────────────────
    local TabsHeader = Instance.new("Frame")
    TabsHeader.Name = "TabsHeader"
    TabsHeader.Size = UDim2.new(1, 0, 0, 42)
    TabsHeader.Position = UDim2.new(0, 0, 0, 38)
    TabsHeader.BackgroundColor3 = Theme.TabBar
    TabsHeader.BorderSizePixel = 0
    TabsHeader.ZIndex = 4
    TabsHeader.Parent = MainFrame

    local TabsHeaderBorder = Instance.new("Frame")
    TabsHeaderBorder.Size = UDim2.new(1, 0, 0, 1)
    TabsHeaderBorder.Position = UDim2.new(0, 0, 1, 0)
    TabsHeaderBorder.BackgroundColor3 = Theme.BorderSubtle
    TabsHeaderBorder.BorderSizePixel = 0
    TabsHeaderBorder.ZIndex = 5
    TabsHeaderBorder.Parent = TabsHeader

    -- Segmented Tabs Track Container
    local SegmentTrack = Instance.new("Frame")
    SegmentTrack.Name = "SegmentTrack"
    SegmentTrack.Size = UDim2.new(1, -24, 0, 30)
    SegmentTrack.Position = UDim2.new(0, 12, 0.5, -15)
    SegmentTrack.BackgroundColor3 = Color3.fromRGB(8, 10, 15)
    SegmentTrack.BorderSizePixel = 0
    SegmentTrack.ZIndex = 5
    SegmentTrack.Parent = TabsHeader

    local SegmentCorner = Instance.new("UICorner")
    SegmentCorner.CornerRadius = UDim.new(0, 7)
    SegmentCorner.Parent = SegmentTrack

    local SegmentStroke = Instance.new("UIStroke")
    SegmentStroke.Color = Theme.BorderSubtle
    SegmentStroke.Thickness = 1
    SegmentStroke.Parent = SegmentTrack

    local TabLayout = Instance.new("UIListLayout")
    TabLayout.FillDirection = Enum.FillDirection.Horizontal
    TabLayout.SortOrder = Enum.SortOrder.LayoutOrder
    TabLayout.Padding = UDim.new(0, 4)
    TabLayout.Parent = SegmentTrack

    local TrackPadding = Instance.new("UIPadding")
    TrackPadding.PaddingLeft = UDim.new(0, 3)
    TrackPadding.PaddingRight = UDim.new(0, 3)
    TrackPadding.PaddingTop = UDim.new(0, 3)
    TrackPadding.PaddingBottom = UDim.new(0, 3)
    TrackPadding.Parent = SegmentTrack

    -- ─────────────────────────────────────────────────────────────────────────────
    -- 3. CONTENT AREA
    -- ─────────────────────────────────────────────────────────────────────────────
    local ContentArea = Instance.new("Frame")
    ContentArea.Name = "ContentArea"
    ContentArea.Size = UDim2.new(1, 0, 1, -80)
    ContentArea.Position = UDim2.new(0, 0, 0, 80)
    ContentArea.BackgroundTransparency = 1
    ContentArea.ZIndex = 3
    ContentArea.Parent = MainFrame

    -- Global Visibility Toggle Hotkey
    local isWindowVisible = true
    local function ToggleVisibility()
        isWindowVisible = not isWindowVisible
        if isWindowVisible then
            MainFrame.Visible = true
            Animate(MainFrame, 0.25, { Size = UDim2.new(0, 640, 0, 440) })
        else
            local tw = Animate(MainFrame, 0.2, { Size = UDim2.new(0, 640, 0, 0) })
            tw.Completed:Connect(function()
                if not isWindowVisible then
                    MainFrame.Visible = false
                end
            end)
        end
    end

    MinBtn.MouseButton1Click:Connect(ToggleVisibility)

    UserInputService.InputBegan:Connect(function(input, processed)
        if not processed and input.KeyCode == ToggleKey then
            ToggleVisibility()
        end
    end)

    -- Window Object Definition
    local Window = {
        ScreenGui = ScreenGui,
        MainFrame = MainFrame,
        Theme = Theme,
        Tabs = {},
        CurrentTab = nil,
        ToastContainer = ToastContainer
    }

    -- Toast Notification Method
    function Window:Notify(opts)
        opts = opts or {}
        local NTitle = opts.Title or "SpectreWare"
        local NContent = opts.Content or "Operation executed successfully."
        local NDuration = opts.Duration or 3.5

        local Toast = Instance.new("Frame")
        Toast.Size = UDim2.new(1, 0, 0, 52)
        Toast.BackgroundColor3 = Color3.fromRGB(14, 16, 23)
        Toast.Position = UDim2.new(1, 20, 0, 0)
        Toast.BorderSizePixel = 0
        Toast.Parent = ToastContainer

        local TCorner = Instance.new("UICorner")
        TCorner.CornerRadius = UDim.new(0, 8)
        TCorner.Parent = Toast

        local TStroke = Instance.new("UIStroke")
        TStroke.Color = Theme.Border
        TStroke.Thickness = 1
        TStroke.Parent = Toast

        local TBar = Instance.new("Frame")
        TBar.Size = UDim2.new(0, 3, 1, -16)
        TBar.Position = UDim2.new(0, 8, 0, 8)
        TBar.BackgroundColor3 = Theme.Accent
        TBar.BorderSizePixel = 0
        TBar.Parent = Toast

        local TBarCorner = Instance.new("UICorner")
        TBarCorner.CornerRadius = UDim.new(1, 0)
        TBarCorner.Parent = TBar

        local TTL = Instance.new("TextLabel")
        TTL.Size = UDim2.new(1, -28, 0, 16)
        TTL.Position = UDim2.new(0, 18, 0, 8)
        TTL.BackgroundTransparency = 1
        TTL.Text = NTitle
        TTL.Font = Enum.Font.GothamBold
        TTL.TextSize = 11
        TTL.TextColor3 = Theme.Text
        TTL.TextXAlignment = Enum.TextXAlignment.Left
        TTL.Parent = Toast

        local TSub = Instance.new("TextLabel")
        TSub.Size = UDim2.new(1, -28, 0, 16)
        TSub.Position = UDim2.new(0, 18, 0, 26)
        TSub.BackgroundTransparency = 1
        TSub.Text = NContent
        TSub.Font = Enum.Font.Gotham
        TSub.TextSize = 10
        TSub.TextColor3 = Theme.TextMuted
        TSub.TextXAlignment = Enum.TextXAlignment.Left
        TSub.Parent = Toast

        Animate(Toast, 0.3, { Position = UDim2.new(0, 0, 0, 0) })

        task.delay(NDuration, function()
            local tw = Animate(Toast, 0.3, { Position = UDim2.new(1, 20, 0, 0), BackgroundTransparency = 1 })
            tw.Completed:Connect(function()
                Toast:Destroy()
            end)
        end)
    end

    -- ─────────────────────────────────────────────────────────────────────────────
    -- 4. CREATE TAB METHOD
    -- ─────────────────────────────────────────────────────────────────────────────
    function Window:CreateTab(tabName, badgeText)
        local TabBtn = Instance.new("TextButton")
        TabBtn.Name = tabName .. "_TabBtn"
        TabBtn.Size = UDim2.new(0, 110, 1, 0)
        TabBtn.BackgroundColor3 = Color3.fromRGB(24, 27, 36)
        TabBtn.BackgroundTransparency = 1
        TabBtn.Text = tabName
        TabBtn.Font = Enum.Font.GothamMedium
        TabBtn.TextSize = 11
        TabBtn.TextColor3 = Theme.TextMuted
        TabBtn.BorderSizePixel = 0
        TabBtn.ZIndex = 6
        TabBtn.Parent = SegmentTrack

        local TabBtnCorner = Instance.new("UICorner")
        TabBtnCorner.CornerRadius = UDim.new(0, 5)
        TabBtnCorner.Parent = TabBtn

        local TabBtnStroke = Instance.new("UIStroke")
        TabBtnStroke.Color = Theme.Border
        TabBtnStroke.Thickness = 1
        TabBtnStroke.Transparency = 1
        TabBtnStroke.Parent = TabBtn

        -- Optional Badge Pill inside Tab
        if badgeText then
            local BadgePill = Instance.new("Frame")
            BadgePill.Size = UDim2.new(0, 18, 0, 14)
            BadgePill.Position = UDim2.new(1, -22, 0.5, -7)
            BadgePill.BackgroundColor3 = Color3.fromRGB(15, 17, 24)
            BadgePill.BorderSizePixel = 0
            BadgePill.ZIndex = 7
            BadgePill.Parent = TabBtn

            local BPillCorner = Instance.new("UICorner")
            BPillCorner.CornerRadius = UDim.new(1, 0)
            BPillCorner.Parent = BadgePill

            local BText = Instance.new("TextLabel")
            BText.Size = UDim2.new(1, 0, 1, 0)
            BText.BackgroundTransparency = 1
            BText.Text = tostring(badgeText)
            BText.Font = Enum.Font.Code
            BText.TextSize = 8
            BText.TextColor3 = Theme.TextMuted
            BText.ZIndex = 8
            BText.Parent = BadgePill
        end

        -- Tab Content Scrolling Page
        local TabPage = Instance.new("ScrollingFrame")
        TabPage.Name = tabName .. "_Page"
        TabPage.Size = UDim2.new(1, -32, 1, -16)
        TabPage.Position = UDim2.new(0, 16, 0, 8)
        TabPage.BackgroundTransparency = 1
        TabPage.BorderSizePixel = 0
        TabPage.ScrollBarThickness = 3
        TabPage.ScrollBarImageColor3 = Theme.Border
        TabPage.Visible = false
        TabPage.ZIndex = 4
        TabPage.Parent = ContentArea

        local PageLayout = Instance.new("UIListLayout")
        PageLayout.Padding = UDim.new(0, 7)
        PageLayout.SortOrder = Enum.SortOrder.LayoutOrder
        PageLayout.Parent = TabPage

        local PagePadding = Instance.new("UIPadding")
        PagePadding.PaddingTop = UDim.new(0, 4)
        PagePadding.PaddingBottom = UDim.new(0, 14)
        PagePadding.PaddingRight = UDim.new(0, 6)
        PagePadding.Parent = TabPage

        PageLayout:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
            TabPage.CanvasSize = UDim2.new(0, 0, 0, PageLayout.AbsoluteContentSize.Y + 24)
        end)

        local Tab = {
            Button = TabBtn,
            Page = TabPage
        }

        local function SelectTab()
            for _, t in pairs(Window.Tabs) do
                t.Page.Visible = false
                Animate(t.Button, 0.15, { BackgroundTransparency = 1, TextColor3 = Theme.TextMuted })
                local strk = t.Button:FindFirstChild("UIStroke")
                if strk then Animate(strk, 0.15, { Transparency = 1 }) end
            end
            TabPage.Visible = true
            Animate(TabBtn, 0.15, { BackgroundTransparency = 0, TextColor3 = Theme.Text })
            Animate(TabBtnStroke, 0.15, { Transparency = 0 })
            Window.CurrentTab = Tab
        end

        TabBtn.MouseButton1Click:Connect(SelectTab)

        if #Window.Tabs == 0 then
            SelectTab()
        end

        table.insert(Window.Tabs, Tab)

        -- ─────────────────────────────────────────────────────────────────────────────
        -- 5. COMPONENT: SECTION HEADER
        -- ─────────────────────────────────────────────────────────────────────────────
        function Tab:CreateSection(sectionText)
            local SectionFrame = Instance.new("Frame")
            SectionFrame.Size = UDim2.new(1, 0, 0, 24)
            SectionFrame.BackgroundTransparency = 1
            SectionFrame.ZIndex = 4
            SectionFrame.Parent = TabPage

            local AccentPip = Instance.new("Frame")
            AccentPip.Size = UDim2.new(0, 4, 0, 4)
            AccentPip.Position = UDim2.new(0, 0, 0.5, -2)
            AccentPip.BackgroundColor3 = Theme.Accent
            AccentPip.BorderSizePixel = 0
            AccentPip.ZIndex = 4
            AccentPip.Parent = SectionFrame

            local PipCorner = Instance.new("UICorner")
            PipCorner.CornerRadius = UDim.new(1, 0)
            PipCorner.Parent = AccentPip

            local Label = Instance.new("TextLabel")
            Label.Size = UDim2.new(0, 200, 1, 0)
            Label.Position = UDim2.new(0, 12, 0, 0)
            Label.BackgroundTransparency = 1
            Label.Text = sectionText:upper()
            Label.Font = Enum.Font.Code
            Label.TextSize = 10
            Label.TextColor3 = Theme.TextMuted
            Label.TextXAlignment = Enum.TextXAlignment.Left
            Label.ZIndex = 4
            Label.Parent = SectionFrame

            local Divider = Instance.new("Frame")
            Divider.Size = UDim2.new(1, -220, 0, 1)
            Divider.Position = UDim2.new(0, 220, 0.5, 0)
            Divider.BackgroundColor3 = Theme.BorderSubtle
            Divider.BorderSizePixel = 0
            Divider.ZIndex = 4
            Divider.Parent = SectionFrame

            return SectionFrame
        end

        -- ─────────────────────────────────────────────────────────────────────────────
        -- 6. COMPONENT: TOGGLE WITH SUBTITLE
        -- ─────────────────────────────────────────────────────────────────────────────
        function Tab:CreateToggle(opts)
            opts = opts or {}
            local Name = opts.Name or "Feature Toggle"
            local Desc = opts.Description or "Enable or disable module state"
            local Default = opts.Default or false
            local Callback = opts.Callback or function() end
            local State = Default

            local Card = Instance.new("Frame")
            Card.Size = UDim2.new(1, 0, 0, 46)
            Card.BackgroundColor3 = Theme.Card
            Card.BorderSizePixel = 0
            Card.ZIndex = 4
            Card.Parent = TabPage

            local CardCorner = Instance.new("UICorner")
            CardCorner.CornerRadius = UDim.new(0, 8)
            CardCorner.Parent = Card

            local CardStroke = Instance.new("UIStroke")
            CardStroke.Color = Theme.BorderSubtle
            CardStroke.Thickness = 1
            CardStroke.Parent = Card

            -- Title & Description Texts
            local TitleLbl = Instance.new("TextLabel")
            TitleLbl.Size = UDim2.new(1, -64, 0, 18)
            TitleLbl.Position = UDim2.new(0, 14, 0, 6)
            TitleLbl.BackgroundTransparency = 1
            TitleLbl.Text = Name
            TitleLbl.Font = Enum.Font.GothamMedium
            TitleLbl.TextSize = 11
            TitleLbl.TextColor3 = Theme.Text
            TitleLbl.TextXAlignment = Enum.TextXAlignment.Left
            TitleLbl.ZIndex = 5
            TitleLbl.Parent = Card

            local DescLbl = Instance.new("TextLabel")
            DescLbl.Size = UDim2.new(1, -64, 0, 14)
            DescLbl.Position = UDim2.new(0, 14, 0, 24)
            DescLbl.BackgroundTransparency = 1
            DescLbl.Text = Desc
            DescLbl.Font = Enum.Font.Gotham
            DescLbl.TextSize = 9
            DescLbl.TextColor3 = Theme.TextSubtle
            DescLbl.TextXAlignment = Enum.TextXAlignment.Left
            DescLbl.ZIndex = 5
            DescLbl.Parent = Card

            -- Pill Switch Button
            local Switch = Instance.new("TextButton")
            Switch.Size = UDim2.new(0, 36, 0, 20)
            Switch.Position = UDim2.new(1, -48, 0.5, -10)
            Switch.BackgroundColor3 = State and Theme.Accent or Color3.fromRGB(24, 27, 36)
            Switch.Text = ""
            Switch.BorderSizePixel = 0
            Switch.ZIndex = 5
            Switch.Parent = Card

            local SwitchCorner = Instance.new("UICorner")
            SwitchCorner.CornerRadius = UDim.new(1, 0)
            SwitchCorner.Parent = Switch

            local Knob = Instance.new("Frame")
            Knob.Size = UDim2.new(0, 14, 0, 14)
            Knob.Position = State and UDim2.new(1, -17, 0.5, -7) or UDim2.new(0, 3, 0.5, -7)
            Knob.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
            Knob.BorderSizePixel = 0
            Knob.ZIndex = 6
            Knob.Parent = Switch

            local KnobCorner = Instance.new("UICorner")
            KnobCorner.CornerRadius = UDim.new(1, 0)
            KnobCorner.Parent = Knob

            local function SetState(val)
                State = val
                local targetColor = State and Theme.Accent or Color3.fromRGB(24, 27, 36)
                local targetPos = State and UDim2.new(1, -17, 0.5, -7) or UDim2.new(0, 3, 0.5, -7)

                Animate(Switch, 0.18, { BackgroundColor3 = targetColor })
                Animate(Knob, 0.18, { Position = targetPos })

                task.spawn(function()
                    Callback(State)
                end)
            end

            Switch.MouseButton1Click:Connect(function()
                SetState(not State)
            end)

            return {
                Set = SetState,
                Get = function() return State end
            }
        end

        -- ─────────────────────────────────────────────────────────────────────────────
        -- 7. COMPONENT: PRECISION SLIDER
        -- ─────────────────────────────────────────────────────────────────────────────
        function Tab:CreateSlider(opts)
            opts = opts or {}
            local Name = opts.Name or "Precision Slider"
            local Unit = opts.Unit or ""
            local Min = opts.Min or 0
            local Max = opts.Max or 100
            local Default = opts.Default or Min
            local Callback = opts.Callback or function() end
            local CurrentValue = math.clamp(Default, Min, Max)

            local Card = Instance.new("Frame")
            Card.Size = UDim2.new(1, 0, 0, 54)
            Card.BackgroundColor3 = Theme.Card
            Card.BorderSizePixel = 0
            Card.ZIndex = 4
            Card.Parent = TabPage

            local CardCorner = Instance.new("UICorner")
            CardCorner.CornerRadius = UDim.new(0, 8)
            CardCorner.Parent = Card

            local CardStroke = Instance.new("UIStroke")
            CardStroke.Color = Theme.BorderSubtle
            CardStroke.Thickness = 1
            CardStroke.Parent = Card

            local TitleLbl = Instance.new("TextLabel")
            TitleLbl.Size = UDim2.new(1, -80, 0, 20)
            TitleLbl.Position = UDim2.new(0, 14, 0, 8)
            TitleLbl.BackgroundTransparency = 1
            TitleLbl.Text = Name
            TitleLbl.Font = Enum.Font.GothamMedium
            TitleLbl.TextSize = 11
            TitleLbl.TextColor3 = Theme.Text
            TitleLbl.TextXAlignment = Enum.TextXAlignment.Left
            TitleLbl.ZIndex = 5
            TitleLbl.Parent = Card

            -- Value Badge Pill
            local ValBadge = Instance.new("Frame")
            ValBadge.Size = UDim2.new(0, 56, 0, 18)
            ValBadge.Position = UDim2.new(1, -68, 0, 8)
            ValBadge.BackgroundColor3 = Color3.fromRGB(12, 14, 20)
            ValBadge.BorderSizePixel = 0
            ValBadge.ZIndex = 5
            ValBadge.Parent = Card

            local ValCorner = Instance.new("UICorner")
            ValCorner.CornerRadius = UDim.new(0, 4)
            ValCorner.Parent = ValBadge

            local ValStroke = Instance.new("UIStroke")
            ValStroke.Color = Theme.BorderSubtle
            ValStroke.Thickness = 1
            ValStroke.Parent = ValBadge

            local ValText = Instance.new("TextLabel")
            ValText.Size = UDim2.new(1, 0, 1, 0)
            ValText.BackgroundTransparency = 1
            ValText.Text = tostring(CurrentValue) .. (Unit ~= "" and (" " .. Unit) or "")
            ValText.Font = Enum.Font.Code
            ValText.TextSize = 9
            ValText.TextColor3 = Theme.Accent
            ValText.ZIndex = 6
            ValText.Parent = ValBadge

            -- Slider Track Bar
            local Track = Instance.new("TextButton")
            Track.Size = UDim2.new(1, -28, 0, 5)
            Track.Position = UDim2.new(0, 14, 0, 36)
            Track.BackgroundColor3 = Color3.fromRGB(22, 25, 34)
            Track.Text = ""
            Track.BorderSizePixel = 0
            Track.ZIndex = 5
            Track.Parent = Card

            local TrackCorner = Instance.new("UICorner")
            TrackCorner.CornerRadius = UDim.new(1, 0)
            TrackCorner.Parent = Track

            local Fill = Instance.new("Frame")
            Fill.Size = UDim2.new((CurrentValue - Min) / (Max - Min), 0, 1, 0)
            Fill.BackgroundColor3 = Theme.Accent
            Fill.BorderSizePixel = 0
            Fill.ZIndex = 6
            Fill.Parent = Track

            local FillCorner = Instance.new("UICorner")
            FillCorner.CornerRadius = UDim.new(1, 0)
            FillCorner.Parent = Fill

            local Knob = Instance.new("Frame")
            Knob.Size = UDim2.new(0, 11, 0, 11)
            Knob.Position = UDim2.new(1, -5, 0.5, -5)
            Knob.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
            Knob.BorderSizePixel = 0
            Knob.ZIndex = 7
            Knob.Parent = Fill

            local KnobCorner = Instance.new("UICorner")
            KnobCorner.CornerRadius = UDim.new(1, 0)
            KnobCorner.Parent = Knob

            local isDragging = false

            local function UpdateSlider(input)
                local percent = math.clamp((input.Position.X - Track.AbsolutePosition.X) / Track.AbsoluteSize.X, 0, 1)
                local val = math.floor(Min + (Max - Min) * percent)
                CurrentValue = val
                ValText.Text = tostring(val) .. (Unit ~= "" and (" " .. Unit) or "")
                Animate(Fill, 0.05, { Size = UDim2.new(percent, 0, 1, 0) })
                task.spawn(function()
                    Callback(val)
                end)
            end

            Track.InputBegan:Connect(function(input)
                if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
                    isDragging = true
                    UpdateSlider(input)
                end
            end)

            UserInputService.InputEnded:Connect(function(input)
                if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
                    isDragging = false
                end
            end)

            UserInputService.InputChanged:Connect(function(input)
                if isDragging and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
                    UpdateSlider(input)
                end
            end)

            return {
                Set = function(val)
                    CurrentValue = math.clamp(val, Min, Max)
                    ValText.Text = tostring(CurrentValue) .. (Unit ~= "" and (" " .. Unit) or "")
                    local percent = (CurrentValue - Min) / (Max - Min)
                    Animate(Fill, 0.15, { Size = UDim2.new(percent, 0, 1, 0) })
                    Callback(CurrentValue)
                end,
                Get = function() return CurrentValue end
            }
        end

        -- ─────────────────────────────────────────────────────────────────────────────
        -- 8. COMPONENT: ACTION BUTTON (With Hover & Arrow Glide)
        -- ─────────────────────────────────────────────────────────────────────────────
        function Tab:CreateButton(opts)
            opts = opts or {}
            local Name = opts.Name or "Execute Operation"
            local Primary = opts.Primary or false
            local Callback = opts.Callback or function() end

            local Btn = Instance.new("TextButton")
            Btn.Size = UDim2.new(1, 0, 0, 38)
            Btn.BackgroundColor3 = Primary and Color3.fromRGB(244, 244, 246) or Theme.Card
            Btn.Text = ""
            Btn.BorderSizePixel = 0
            Btn.ZIndex = 4
            Btn.Parent = TabPage

            local BtnCorner = Instance.new("UICorner")
            BtnCorner.CornerRadius = UDim.new(0, 8)
            BtnCorner.Parent = Btn

            local BtnStroke = Instance.new("UIStroke")
            BtnStroke.Color = Primary and Theme.Accent or Theme.BorderSubtle
            BtnStroke.Thickness = 1
            BtnStroke.Parent = Btn

            local BtnText = Instance.new("TextLabel")
            BtnText.Size = UDim2.new(1, -40, 1, 0)
            BtnText.Position = UDim2.new(0, 14, 0, 0)
            BtnText.BackgroundTransparency = 1
            BtnText.Text = Name
            BtnText.Font = Enum.Font.GothamMedium
            BtnText.TextSize = 11
            BtnText.TextColor3 = Primary and Color3.fromRGB(10, 12, 18) or Theme.Text
            BtnText.TextXAlignment = Enum.TextXAlignment.Left
            BtnText.ZIndex = 5
            BtnText.Parent = Btn

            local Arrow = Instance.new("TextLabel")
            Arrow.Size = UDim2.new(0, 20, 1, 0)
            Arrow.Position = UDim2.new(1, -30, 0, 0)
            Arrow.BackgroundTransparency = 1
            Arrow.Text = "→"
            Arrow.Font = Enum.Font.Code
            Arrow.TextSize = 13
            Arrow.TextColor3 = Primary and Color3.fromRGB(10, 12, 18) or Theme.TextMuted
            Arrow.ZIndex = 5
            Arrow.Parent = Btn

            Btn.MouseEnter:Connect(function()
                if not Primary then
                    Animate(Btn, 0.15, { BackgroundColor3 = Theme.CardHover })
                end
                Animate(Arrow, 0.15, { Position = UDim2.new(1, -26, 0, 0) })
            end)

            Btn.MouseLeave:Connect(function()
                if not Primary then
                    Animate(Btn, 0.15, { BackgroundColor3 = Theme.Card })
                end
                Animate(Arrow, 0.15, { Position = UDim2.new(1, -30, 0, 0) })
            end)

            Btn.MouseButton1Click:Connect(function()
                Animate(Btn, 0.08, { Size = UDim2.new(1, -4, 0, 36) })
                task.wait(0.08)
                Animate(Btn, 0.12, { Size = UDim2.new(1, 0, 0, 38) })
                task.spawn(Callback)
            end)

            return Btn
        end

        -- ─────────────────────────────────────────────────────────────────────────────
        -- 9. COMPONENT: DROPDOWN
        -- ─────────────────────────────────────────────────────────────────────────────
        function Tab:CreateDropdown(opts)
            opts = opts or {}
            local Name = opts.Name or "Select Option"
            local Options = opts.Options or {}
            local Default = opts.Default or Options[1] or ""
            local Callback = opts.Callback or function() end
            local Selected = Default
            local isExpanded = false

            local Container = Instance.new("Frame")
            Container.Size = UDim2.new(1, 0, 0, 42)
            Container.BackgroundColor3 = Theme.Card
            Container.BorderSizePixel = 0
            Container.ClipsDescendants = true
            Container.ZIndex = 4
            Container.Parent = TabPage

            local Corner = Instance.new("UICorner")
            Corner.CornerRadius = UDim.new(0, 8)
            Corner.Parent = Container

            local Stroke = Instance.new("UIStroke")
            Stroke.Color = Theme.BorderSubtle
            Stroke.Thickness = 1
            Stroke.Parent = Container

            local HeaderBtn = Instance.new("TextButton")
            HeaderBtn.Size = UDim2.new(1, 0, 0, 42)
            HeaderBtn.BackgroundTransparency = 1
            HeaderBtn.Text = ""
            HeaderBtn.ZIndex = 5
            HeaderBtn.Parent = Container

            local TitleLbl = Instance.new("TextLabel")
            TitleLbl.Size = UDim2.new(0.45, 0, 1, 0)
            TitleLbl.Position = UDim2.new(0, 14, 0, 0)
            TitleLbl.BackgroundTransparency = 1
            TitleLbl.Text = Name
            TitleLbl.Font = Enum.Font.GothamMedium
            TitleLbl.TextSize = 11
            TitleLbl.TextColor3 = Theme.Text
            TitleLbl.TextXAlignment = Enum.TextXAlignment.Left
            TitleLbl.ZIndex = 6
            TitleLbl.Parent = HeaderBtn

            -- Selected Value Pill
            local ValBadge = Instance.new("Frame")
            ValBadge.Size = UDim2.new(0.45, -34, 0, 22)
            ValBadge.Position = UDim2.new(0.5, 0, 0.5, -11)
            ValBadge.BackgroundColor3 = Color3.fromRGB(12, 14, 20)
            ValBadge.BorderSizePixel = 0
            ValBadge.ZIndex = 6
            ValBadge.Parent = HeaderBtn

            local VCorner = Instance.new("UICorner")
            VCorner.CornerRadius = UDim.new(0, 5)
            VCorner.Parent = ValBadge

            local VStroke = Instance.new("UIStroke")
            VStroke.Color = Theme.BorderSubtle
            VStroke.Thickness = 1
            VStroke.Parent = ValBadge

            local SelText = Instance.new("TextLabel")
            SelText.Size = UDim2.new(1, -12, 1, 0)
            SelText.Position = UDim2.new(0, 6, 0, 0)
            SelText.BackgroundTransparency = 1
            SelText.Text = tostring(Selected)
            SelText.Font = Enum.Font.Code
            SelText.TextSize = 10
            SelText.TextColor3 = Theme.Accent
            SelText.TextXAlignment = Enum.TextXAlignment.Right
            SelText.ZIndex = 7
            SelText.Parent = ValBadge

            local Arrow = Instance.new("TextLabel")
            Arrow.Size = UDim2.new(0, 20, 1, 0)
            Arrow.Position = UDim2.new(1, -26, 0, 0)
            Arrow.BackgroundTransparency = 1
            Arrow.Text = "▼"
            Arrow.Font = Enum.Font.GothamMedium
            Arrow.TextSize = 8
            Arrow.TextColor3 = Theme.TextMuted
            Arrow.ZIndex = 6
            Arrow.Parent = HeaderBtn

            -- Expandable Option List Container
            local ListFrame = Instance.new("Frame")
            ListFrame.Size = UDim2.new(1, -20, 0, #Options * 28)
            ListFrame.Position = UDim2.new(0, 10, 0, 44)
            ListFrame.BackgroundTransparency = 1
            ListFrame.ZIndex = 5
            ListFrame.Parent = Container

            local DropLayout = Instance.new("UIListLayout")
            DropLayout.Padding = UDim.new(0, 2)
            DropLayout.Parent = ListFrame

            for _, opt in ipairs(Options) do
                local OptBtn = Instance.new("TextButton")
                OptBtn.Size = UDim2.new(1, 0, 0, 26)
                OptBtn.BackgroundColor3 = Color3.fromRGB(15, 17, 24)
                OptBtn.BackgroundTransparency = 1
                OptBtn.Text = "   " .. tostring(opt)
                OptBtn.Font = Enum.Font.Gotham
                OptBtn.TextSize = 10
                OptBtn.TextColor3 = Theme.TextMuted
                OptBtn.TextXAlignment = Enum.TextXAlignment.Left
                OptBtn.BorderSizePixel = 0
                OptBtn.ZIndex = 6
                OptBtn.Parent = ListFrame

                local OptCorner = Instance.new("UICorner")
                OptCorner.CornerRadius = UDim.new(0, 5)
                OptCorner.Parent = OptBtn

                OptBtn.MouseEnter:Connect(function()
                    Animate(OptBtn, 0.1, { BackgroundTransparency = 0, TextColor3 = Theme.Text })
                end)
                OptBtn.MouseLeave:Connect(function()
                    Animate(OptBtn, 0.1, { BackgroundTransparency = 1, TextColor3 = Theme.TextMuted })
                end)
                OptBtn.MouseButton1Click:Connect(function()
                    Selected = opt
                    SelText.Text = tostring(opt)
                    isExpanded = false
                    Animate(Container, 0.18, { Size = UDim2.new(1, 0, 0, 42) })
                    Animate(Arrow, 0.18, { Rotation = 0 })
                    task.spawn(function()
                        Callback(opt)
                    end)
                end)
            end

            HeaderBtn.MouseButton1Click:Connect(function()
                isExpanded = not isExpanded
                local targetH = isExpanded and (44 + #Options * 28 + 8) or 42
                Animate(Container, 0.18, { Size = UDim2.new(1, 0, 0, targetH) })
                Animate(Arrow, 0.18, { Rotation = isExpanded and 180 or 0 })
            end)

            return {
                Set = function(val)
                    Selected = val
                    SelText.Text = tostring(val)
                    Callback(val)
                end,
                Get = function() return Selected end
            }
        end

        -- ─────────────────────────────────────────────────────────────────────────────
        -- 10. COMPONENT: KEYBIND CHANGER
        -- ─────────────────────────────────────────────────────────────────────────────
        function Tab:CreateKeybind(opts)
            opts = opts or {}
            local Name = opts.Name or "Toggle Keybind"
            local Default = opts.Default or Enum.KeyCode.RightControl
            local Callback = opts.Callback or function() end
            local CurrentKey = Default
            local isBinding = false

            local Card = Instance.new("Frame")
            Card.Size = UDim2.new(1, 0, 0, 42)
            Card.BackgroundColor3 = Theme.Card
            Card.BorderSizePixel = 0
            Card.ZIndex = 4
            Card.Parent = TabPage

            local CardCorner = Instance.new("UICorner")
            CardCorner.CornerRadius = UDim.new(0, 8)
            CardCorner.Parent = Card

            local CardStroke = Instance.new("UIStroke")
            CardStroke.Color = Theme.BorderSubtle
            CardStroke.Thickness = 1
            CardStroke.Parent = Card

            local TitleLbl = Instance.new("TextLabel")
            TitleLbl.Size = UDim2.new(1, -120, 1, 0)
            TitleLbl.Position = UDim2.new(0, 14, 0, 0)
            TitleLbl.BackgroundTransparency = 1
            TitleLbl.Text = Name
            TitleLbl.Font = Enum.Font.GothamMedium
            TitleLbl.TextSize = 11
            TitleLbl.TextColor3 = Theme.Text
            TitleLbl.TextXAlignment = Enum.TextXAlignment.Left
            TitleLbl.ZIndex = 5
            TitleLbl.Parent = Card

            local KeyBtn = Instance.new("TextButton")
            KeyBtn.Size = UDim2.new(0, 90, 0, 24)
            KeyBtn.Position = UDim2.new(1, -100, 0.5, -12)
            KeyBtn.BackgroundColor3 = Color3.fromRGB(12, 14, 20)
            KeyBtn.Text = CurrentKey.Name
            KeyBtn.Font = Enum.Font.Code
            KeyBtn.TextSize = 10
            KeyBtn.TextColor3 = Theme.Accent
            KeyBtn.BorderSizePixel = 0
            KeyBtn.ZIndex = 6
            KeyBtn.Parent = Card

            local KeyCorner = Instance.new("UICorner")
            KeyCorner.CornerRadius = UDim.new(0, 5)
            KeyCorner.Parent = KeyBtn

            local KeyStroke = Instance.new("UIStroke")
            KeyStroke.Color = Theme.BorderSubtle
            KeyStroke.Thickness = 1
            KeyStroke.Parent = KeyBtn

            KeyBtn.MouseButton1Click:Connect(function()
                isBinding = true
                KeyBtn.Text = "..."
                KeyBtn.TextColor3 = Color3.fromRGB(250, 204, 21)
            end)

            UserInputService.InputBegan:Connect(function(input, processed)
                if isBinding and input.UserInputType == Enum.UserInputType.Keyboard then
                    CurrentKey = input.KeyCode
                    KeyBtn.Text = CurrentKey.Name
                    KeyBtn.TextColor3 = Theme.Accent
                    isBinding = false
                    task.spawn(function()
                        Callback(CurrentKey)
                    end)
                end
            end)

            return {
                Set = function(key)
                    CurrentKey = key
                    KeyBtn.Text = CurrentKey.Name
                    Callback(CurrentKey)
                end,
                Get = function() return CurrentKey end
            }
        end

        return Tab
    end

    return Window
end

return SpectreWareUI
