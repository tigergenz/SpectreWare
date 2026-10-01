--[[
    ══════════════════════════════════════════════════════════════════
    SpectreWareUI v1.0 • Roblox Lua Library
    Designed for Executors (CoreGui / gethui safe fallback)
    Theme: Obsidian Matte Dark (#06080e) with Ambient Aura Glow
    Developed by cook45 for clack
    ══════════════════════════════════════════════════════════════════
--]]

local SpectreWareUI = {}
SpectreWareUI.__index = SpectreWareUI

-- Services
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")
local CoreGui = game:GetService("CoreGui")

local LocalPlayer = Players.LocalPlayer

-- Themes matching SpectreWare 1.0 specifications
SpectreWareUI.Themes = {
    Cobalt = {
        Accent = Color3.fromRGB(56, 189, 248),
        Glow = Color3.fromRGB(2, 132, 199),
        Background = Color3.fromRGB(6, 8, 14),
        Card = Color3.fromRGB(13, 16, 24),
        CardHover = Color3.fromRGB(18, 22, 34),
        Text = Color3.fromRGB(244, 244, 245),
        Muted = Color3.fromRGB(113, 113, 122),
        Border = Color3.fromRGB(30, 36, 50)
    },
    Glacier = {
        Accent = Color3.fromRGB(6, 182, 212),
        Glow = Color3.fromRGB(8, 145, 178),
        Background = Color3.fromRGB(6, 8, 14),
        Card = Color3.fromRGB(13, 16, 24),
        CardHover = Color3.fromRGB(18, 22, 34),
        Text = Color3.fromRGB(244, 244, 245),
        Muted = Color3.fromRGB(113, 113, 122),
        Border = Color3.fromRGB(25, 45, 55)
    },
    Violet = {
        Accent = Color3.fromRGB(168, 85, 247),
        Glow = Color3.fromRGB(126, 34, 206),
        Background = Color3.fromRGB(6, 8, 14),
        Card = Color3.fromRGB(14, 15, 25),
        CardHover = Color3.fromRGB(20, 22, 36),
        Text = Color3.fromRGB(244, 244, 245),
        Muted = Color3.fromRGB(113, 113, 122),
        Border = Color3.fromRGB(40, 30, 58)
    },
    Emerald = {
        Accent = Color3.fromRGB(52, 211, 153),
        Glow = Color3.fromRGB(5, 150, 105),
        Background = Color3.fromRGB(6, 8, 14),
        Card = Color3.fromRGB(12, 18, 20),
        CardHover = Color3.fromRGB(16, 26, 28),
        Text = Color3.fromRGB(244, 244, 245),
        Muted = Color3.fromRGB(113, 113, 122),
        Border = Color3.fromRGB(25, 48, 38)
    }
}

-- Safe Parent Resolver
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

-- Fast tween helper
local function Tween(obj, duration, props, style, direction)
    style = style or Enum.EasingStyle.Quart
    direction = direction or Enum.EasingDirection.Out
    local info = TweenInfo.new(duration, style, direction)
    local tween = TweenService:Create(obj, info, props)
    tween:Play()
    return tween
end

-- Draggable implementation
local function EnableDragging(dragHandle, targetFrame)
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
            Tween(targetFrame, 0.08, {
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

-- Create Main Window
function SpectreWareUI:CreateWindow(config)
    config = config or {}
    local Title = config.Title or "SpectreWare"
    local SubTitle = config.SubTitle or "1.0 • Suite"
    local Theme = SpectreWareUI.Themes[config.Theme] or SpectreWareUI.Themes.Cobalt
    local ToggleKey = config.ToggleKey or Enum.KeyCode.RightControl

    local ScreenGui = Instance.new("ScreenGui")
    ScreenGui.Name = "SpectreWare_" .. tostring(math.random(1000, 9999))
    ScreenGui.ResetOnSpawn = false
    ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
    ScreenGui.Parent = GetSafeGuiParent()

    -- Outer Window Canvas
    local MainFrame = Instance.new("Frame")
    MainFrame.Name = "MainFrame"
    MainFrame.Size = UDim2.new(0, 620, 0, 410)
    MainFrame.Position = UDim2.new(0.5, -310, 0.5, -205)
    MainFrame.BackgroundColor3 = Theme.Background
    MainFrame.BorderSizePixel = 0
    MainFrame.ClipsDescendants = false
    MainFrame.Parent = ScreenGui

    local MainCorner = Instance.new("UICorner")
    MainCorner.CornerRadius = UDim.new(0, 10)
    MainCorner.Parent = MainFrame

    local MainStroke = Instance.new("UIStroke")
    MainStroke.Color = Theme.Border
    MainStroke.Thickness = 1
    MainStroke.Parent = MainFrame

    -- Soft Ambient Glow Layer behind window
    local GlowLayer = Instance.new("ImageLabel")
    GlowLayer.Name = "AmbientGlow"
    GlowLayer.Size = UDim2.new(1, 140, 1, 140)
    GlowLayer.Position = UDim2.new(0, -70, 0, -70)
    GlowLayer.BackgroundTransparency = 1
    GlowLayer.Image = "rbxassetid://5028857084" -- Soft Gaussian glow radial asset
    GlowLayer.ImageColor3 = Theme.Accent
    GlowLayer.ImageTransparency = 0.82
    GlowLayer.ZIndex = 0
    GlowLayer.Parent = MainFrame

    -- Top TitleBar
    local TitleBar = Instance.new("Frame")
    TitleBar.Name = "TitleBar"
    TitleBar.Size = UDim2.new(1, 0, 0, 42)
    TitleBar.BackgroundColor3 = Color3.fromRGB(10, 12, 18)
    TitleBar.BorderSizePixel = 0
    TitleBar.ZIndex = 2
    TitleBar.Parent = MainFrame

    local TitleBarCorner = Instance.new("UICorner")
    TitleBarCorner.CornerRadius = UDim.new(0, 10)
    TitleBarCorner.Parent = TitleBar

    -- Mask bottom rounded corners of TitleBar
    local TitleBarMask = Instance.new("Frame")
    TitleBarMask.Size = UDim2.new(1, 0, 0, 10)
    TitleBarMask.Position = UDim2.new(0, 0, 1, -10)
    TitleBarMask.BackgroundColor3 = Color3.fromRGB(10, 12, 18)
    TitleBarMask.BorderSizePixel = 0
    TitleBarMask.ZIndex = 2
    TitleBarMask.Parent = TitleBar

    local TitleBarLine = Instance.new("Frame")
    TitleBarLine.Size = UDim2.new(1, 0, 0, 1)
    TitleBarLine.Position = UDim2.new(0, 0, 1, 0)
    TitleBarLine.BackgroundColor3 = Theme.Border
    TitleBarLine.BorderSizePixel = 0
    TitleBarLine.ZIndex = 3
    TitleBarLine.Parent = TitleBar

    -- Logo & Brand
    local BrandContainer = Instance.new("Frame")
    BrandContainer.Size = UDim2.new(0, 250, 1, 0)
    BrandContainer.BackgroundTransparency = 1
    BrandContainer.Position = UDim2.new(0, 14, 0, 0)
    BrandContainer.ZIndex = 3
    BrandContainer.Parent = TitleBar

    local BrandIcon = Instance.new("Frame")
    BrandIcon.Size = UDim2.new(0, 20, 0, 20)
    BrandIcon.Position = UDim2.new(0, 0, 0.5, -10)
    BrandIcon.BackgroundColor3 = Theme.Card
    BrandIcon.BorderSizePixel = 0
    BrandIcon.Parent = BrandContainer

    local BrandIconCorner = Instance.new("UICorner")
    BrandIconCorner.CornerRadius = UDim.new(0, 5)
    BrandIconCorner.Parent = BrandIcon

    local BrandIconDot = Instance.new("Frame")
    BrandIconDot.Size = UDim2.new(0, 6, 0, 6)
    BrandIconDot.Position = UDim2.new(0.5, -3, 0.5, -3)
    BrandIconDot.BackgroundColor3 = Theme.Accent
    BrandIconDot.BorderSizePixel = 0
    BrandIconDot.Parent = BrandIcon

    local BrandIconDotCorner = Instance.new("UICorner")
    BrandIconDotCorner.CornerRadius = UDim.new(1, 0)
    BrandIconDotCorner.Parent = BrandIconDot

    local TitleLabel = Instance.new("TextLabel")
    TitleLabel.Text = Title:upper()
    TitleLabel.Font = Enum.Font.GothamBold
    TitleLabel.TextSize = 12
    TitleLabel.TextColor3 = Theme.Text
    TitleLabel.Position = UDim2.new(0, 28, 0, 0)
    TitleLabel.Size = UDim2.new(0, 100, 1, 0)
    TitleLabel.BackgroundTransparency = 1
    TitleLabel.TextXAlignment = Enum.TextXAlignment.Left
    TitleLabel.Parent = BrandContainer

    local SubLabel = Instance.new("TextLabel")
    SubLabel.Text = SubTitle
    SubLabel.Font = Enum.Font.Gotham
    SubLabel.TextSize = 10
    SubLabel.TextColor3 = Theme.Muted
    SubLabel.Position = UDim2.new(0, 28 + TitleLabel.TextBounds.X + 8, 0, 0)
    SubLabel.Size = UDim2.new(0, 80, 1, 0)
    SubLabel.BackgroundTransparency = 1
    SubLabel.TextXAlignment = Enum.TextXAlignment.Left
    SubLabel.Parent = BrandContainer

    -- Window Controls (Minimize / Close)
    local WindowControls = Instance.new("Frame")
    WindowControls.Size = UDim2.new(0, 60, 1, 0)
    WindowControls.Position = UDim2.new(1, -66, 0, 0)
    WindowControls.BackgroundTransparency = 1
    WindowControls.ZIndex = 3
    WindowControls.Parent = TitleBar

    local CloseBtn = Instance.new("TextButton")
    CloseBtn.Size = UDim2.new(0, 24, 0, 24)
    CloseBtn.Position = UDim2.new(1, -26, 0.5, -12)
    CloseBtn.BackgroundColor3 = Color3.fromRGB(15, 18, 25)
    CloseBtn.Text = "✕"
    CloseBtn.Font = Enum.Font.GothamMedium
    CloseBtn.TextSize = 11
    CloseBtn.TextColor3 = Theme.Muted
    CloseBtn.BorderSizePixel = 0
    CloseBtn.Parent = WindowControls

    local CloseBtnCorner = Instance.new("UICorner")
    CloseBtnCorner.CornerRadius = UDim.new(0, 5)
    CloseBtnCorner.Parent = CloseBtn

    CloseBtn.MouseEnter:Connect(function()
        Tween(CloseBtn, 0.15, { BackgroundColor3 = Color3.fromRGB(239, 68, 68), TextColor3 = Color3.new(1, 1, 1) })
    end)
    CloseBtn.MouseLeave:Connect(function()
        Tween(CloseBtn, 0.15, { BackgroundColor3 = Color3.fromRGB(15, 18, 25), TextColor3 = Theme.Muted })
    end)
    CloseBtn.MouseButton1Click:Connect(function()
        ScreenGui:Destroy()
    end)

    -- Dragging Enabled on TitleBar
    EnableDragging(TitleBar, MainFrame)

    -- Body Container
    local Body = Instance.new("Frame")
    Body.Size = UDim2.new(1, 0, 1, -42)
    Body.Position = UDim2.new(0, 0, 0, 42)
    Body.BackgroundTransparency = 1
    Body.ZIndex = 1
    Body.Parent = MainFrame

    -- Left Sidebar for Tabs
    local Sidebar = Instance.new("Frame")
    Sidebar.Size = UDim2.new(0, 160, 1, 0)
    Sidebar.BackgroundColor3 = Color3.fromRGB(8, 10, 15)
    Sidebar.BorderSizePixel = 0
    Sidebar.Parent = Body

    local SidebarCorner = Instance.new("UICorner")
    SidebarCorner.CornerRadius = UDim.new(0, 10)
    SidebarCorner.Parent = Sidebar

    local SidebarMask = Instance.new("Frame")
    SidebarMask.Size = UDim2.new(0, 10, 1, 0)
    SidebarMask.Position = UDim2.new(1, -10, 0, 0)
    SidebarMask.BackgroundColor3 = Color3.fromRGB(8, 10, 15)
    SidebarMask.BorderSizePixel = 0
    SidebarMask.Parent = Sidebar

    local SidebarLine = Instance.new("Frame")
    SidebarLine.Size = UDim2.new(0, 1, 1, 0)
    SidebarLine.Position = UDim2.new(1, 0, 0, 0)
    SidebarLine.BackgroundColor3 = Theme.Border
    SidebarLine.BorderSizePixel = 0
    SidebarLine.Parent = Sidebar

    local TabScroll = Instance.new("ScrollingFrame")
    TabScroll.Size = UDim2.new(1, -12, 1, -20)
    TabScroll.Position = UDim2.new(0, 6, 0, 10)
    TabScroll.BackgroundTransparency = 1
    TabScroll.BorderSizePixel = 0
    TabScroll.ScrollBarThickness = 2
    TabScroll.ScrollBarImageColor3 = Theme.Border
    TabScroll.Parent = Sidebar

    local TabListLayout = Instance.new("UIListLayout")
    TabListLayout.Padding = UDim.new(0, 4)
    TabListLayout.SortOrder = Enum.SortOrder.LayoutOrder
    TabListLayout.Parent = TabScroll

    -- Right Content Area
    local ContentContainer = Instance.new("Frame")
    ContentContainer.Size = UDim2.new(1, -170, 1, -16)
    ContentContainer.Position = UDim2.new(0, 168, 0, 8)
    ContentContainer.BackgroundTransparency = 1
    ContentContainer.Parent = Body

    -- Toggle Window Visibility with Hotkey
    local isVisible = true
    UserInputService.InputBegan:Connect(function(input, processed)
        if not processed and input.KeyCode == ToggleKey then
            isVisible = not isVisible
            MainFrame.Visible = isVisible
        end
    end)

    -- Window Object
    local Window = {
        ScreenGui = ScreenGui,
        MainFrame = MainFrame,
        Theme = Theme,
        Tabs = {},
        CurrentTab = nil
    }

    -- Create Tab Method
    function Window:CreateTab(tabName)
        local TabButton = Instance.new("TextButton")
        TabButton.Name = tabName .. "_Btn"
        TabButton.Size = UDim2.new(1, 0, 0, 32)
        TabButton.BackgroundColor3 = Color3.fromRGB(12, 15, 22)
        TabButton.BackgroundTransparency = 1
        TabButton.Text = "   " .. tabName
        TabButton.Font = Enum.Font.GothamMedium
        TabButton.TextSize = 11
        TabButton.TextColor3 = Theme.Muted
        TabButton.TextXAlignment = Enum.TextXAlignment.Left
        TabButton.BorderSizePixel = 0
        TabButton.Parent = TabScroll

        local TabBtnCorner = Instance.new("UICorner")
        TabBtnCorner.CornerRadius = UDim.new(0, 6)
        TabBtnCorner.Parent = TabButton

        local ActiveIndicator = Instance.new("Frame")
        ActiveIndicator.Size = UDim2.new(0, 2, 0, 14)
        ActiveIndicator.Position = UDim2.new(0, 3, 0.5, -7)
        ActiveIndicator.BackgroundColor3 = Theme.Accent
        ActiveIndicator.BorderSizePixel = 0
        ActiveIndicator.BackgroundTransparency = 1
        ActiveIndicator.Parent = TabButton

        local IndicatorCorner = Instance.new("UICorner")
        IndicatorCorner.CornerRadius = UDim.new(1, 0)
        IndicatorCorner.Parent = ActiveIndicator

        -- Tab Content Page
        local TabPage = Instance.new("ScrollingFrame")
        TabPage.Name = tabName .. "_Page"
        TabPage.Size = UDim2.new(1, -6, 1, 0)
        TabPage.BackgroundTransparency = 1
        TabPage.BorderSizePixel = 0
        TabPage.ScrollBarThickness = 3
        TabPage.ScrollBarImageColor3 = Theme.Border
        TabPage.Visible = false
        TabPage.Parent = ContentContainer

        local PageListLayout = Instance.new("UIListLayout")
        PageListLayout.Padding = UDim.new(0, 6)
        PageListLayout.SortOrder = Enum.SortOrder.LayoutOrder
        PageListLayout.Parent = TabPage

        local PagePadding = Instance.new("UIPadding")
        PagePadding.PaddingTop = UDim.new(0, 4)
        PagePadding.PaddingBottom = UDim.new(0, 10)
        PagePadding.PaddingRight = UDim.new(0, 6)
        PagePadding.Parent = TabPage

        -- Auto update canvas size
        PageListLayout:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
            TabPage.CanvasSize = UDim2.new(0, 0, 0, PageListLayout.AbsoluteContentSize.Y + 20)
        end)

        local Tab = {
            Button = TabButton,
            Page = TabPage,
            Elements = {}
        }

        local function Select()
            for _, t in pairs(Window.Tabs) do
                t.Page.Visible = false
                Tween(t.Button, 0.15, { BackgroundTransparency = 1, TextColor3 = Theme.Muted })
                local ind = t.Button:FindFirstChild("Frame")
                if ind then
                    Tween(ind, 0.15, { BackgroundTransparency = 1 })
                end
            end
            TabPage.Visible = true
            Tween(TabButton, 0.15, { BackgroundTransparency = 0, BackgroundColor3 = Theme.Card, TextColor3 = Theme.Text })
            Tween(ActiveIndicator, 0.15, { BackgroundTransparency = 0 })
            Window.CurrentTab = Tab
        end

        TabButton.MouseButton1Click:Connect(Select)

        if #Window.Tabs == 0 then
            Select()
        end

        table.insert(Window.Tabs, Tab)

        -- Element: Section Title
        function Tab:CreateSection(text)
            local SectionLabel = Instance.new("TextLabel")
            SectionLabel.Size = UDim2.new(1, 0, 0, 22)
            SectionLabel.BackgroundTransparency = 1
            SectionLabel.Text = text:upper()
            SectionLabel.Font = Enum.Font.GothamBold
            SectionLabel.TextSize = 10
            SectionLabel.TextColor3 = Theme.Muted
            SectionLabel.TextXAlignment = Enum.TextXAlignment.Left
            SectionLabel.Parent = TabPage
            return SectionLabel
        end

        -- Element: Toggle
        function Tab:CreateToggle(opts)
            opts = opts or {}
            local Name = opts.Name or "Toggle Feature"
            local Default = opts.Default or false
            local Callback = opts.Callback or function() end
            local State = Default

            local Card = Instance.new("Frame")
            Card.Size = UDim2.new(1, 0, 0, 36)
            Card.BackgroundColor3 = Theme.Card
            Card.BorderSizePixel = 0
            Card.Parent = TabPage

            local CardCorner = Instance.new("UICorner")
            CardCorner.CornerRadius = UDim.new(0, 6)
            CardCorner.Parent = Card

            local CardStroke = Instance.new("UIStroke")
            CardStroke.Color = Theme.Border
            CardStroke.Thickness = 1
            CardStroke.Parent = Card

            local Label = Instance.new("TextLabel")
            Label.Size = UDim2.new(1, -60, 1, 0)
            Label.Position = UDim2.new(0, 12, 0, 0)
            Label.BackgroundTransparency = 1
            Label.Text = Name
            Label.Font = Enum.Font.GothamMedium
            Label.TextSize = 11
            Label.TextColor3 = Theme.Text
            Label.TextXAlignment = Enum.TextXAlignment.Left
            Label.Parent = Card

            -- Toggle Switch Pill
            local Switch = Instance.new("TextButton")
            Switch.Size = UDim2.new(0, 34, 0, 18)
            Switch.Position = UDim2.new(1, -44, 0.5, -9)
            Switch.BackgroundColor3 = State and Theme.Accent or Color3.fromRGB(24, 28, 40)
            Switch.Text = ""
            Switch.BorderSizePixel = 0
            Switch.Parent = Card

            local SwitchCorner = Instance.new("UICorner")
            SwitchCorner.CornerRadius = UDim.new(1, 0)
            SwitchCorner.Parent = Switch

            local Knob = Instance.new("Frame")
            Knob.Size = UDim2.new(0, 12, 0, 12)
            Knob.Position = State and UDim2.new(1, -15, 0.5, -6) or UDim2.new(0, 3, 0.5, -6)
            Knob.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
            Knob.BorderSizePixel = 0
            Knob.Parent = Switch

            local KnobCorner = Instance.new("UICorner")
            KnobCorner.CornerRadius = UDim.new(1, 0)
            KnobCorner.Parent = Knob

            local function SetState(val)
                State = val
                local targetColor = State and Theme.Accent or Color3.fromRGB(24, 28, 40)
                local targetPos = State and UDim2.new(1, -15, 0.5, -6) or UDim2.new(0, 3, 0.5, -6)

                Tween(Switch, 0.18, { BackgroundColor3 = targetColor })
                Tween(Knob, 0.18, { Position = targetPos })

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

        -- Element: Slider
        function Tab:CreateSlider(opts)
            opts = opts or {}
            local Name = opts.Name or "Slider"
            local Min = opts.Min or 0
            local Max = opts.Max or 100
            local Default = opts.Default or Min
            local Callback = opts.Callback or function() end
            local CurrentValue = math.clamp(Default, Min, Max)

            local Card = Instance.new("Frame")
            Card.Size = UDim2.new(1, 0, 0, 48)
            Card.BackgroundColor3 = Theme.Card
            Card.BorderSizePixel = 0
            Card.Parent = TabPage

            local CardCorner = Instance.new("UICorner")
            CardCorner.CornerRadius = UDim.new(0, 6)
            CardCorner.Parent = Card

            local CardStroke = Instance.new("UIStroke")
            CardStroke.Color = Theme.Border
            CardStroke.Thickness = 1
            CardStroke.Parent = Card

            local Label = Instance.new("TextLabel")
            Label.Size = UDim2.new(1, -80, 0, 20)
            Label.Position = UDim2.new(0, 12, 0, 6)
            Label.BackgroundTransparency = 1
            Label.Text = Name
            Label.Font = Enum.Font.GothamMedium
            Label.TextSize = 11
            Label.TextColor3 = Theme.Text
            Label.TextXAlignment = Enum.TextXAlignment.Left
            Label.Parent = Card

            local ValueLabel = Instance.new("TextLabel")
            ValueLabel.Size = UDim2.new(0, 60, 0, 20)
            ValueLabel.Position = UDim2.new(1, -72, 0, 6)
            ValueLabel.BackgroundTransparency = 1
            ValueLabel.Text = tostring(CurrentValue)
            ValueLabel.Font = Enum.Font.GothamBold
            ValueLabel.TextSize = 10
            ValueLabel.TextColor3 = Theme.Accent
            ValueLabel.TextXAlignment = Enum.TextXAlignment.Right
            ValueLabel.Parent = Card

            -- Track
            local Track = Instance.new("TextButton")
            Track.Size = UDim2.new(1, -24, 0, 4)
            Track.Position = UDim2.new(0, 12, 0, 32)
            Track.BackgroundColor3 = Color3.fromRGB(24, 28, 40)
            Track.Text = ""
            Track.BorderSizePixel = 0
            Track.Parent = Card

            local TrackCorner = Instance.new("UICorner")
            TrackCorner.CornerRadius = UDim.new(1, 0)
            TrackCorner.Parent = Track

            local Fill = Instance.new("Frame")
            Fill.Size = UDim2.new((CurrentValue - Min) / (Max - Min), 0, 1, 0)
            Fill.BackgroundColor3 = Theme.Accent
            Fill.BorderSizePixel = 0
            Fill.Parent = Track

            local FillCorner = Instance.new("UICorner")
            FillCorner.CornerRadius = UDim.new(1, 0)
            FillCorner.Parent = Fill

            local isDragging = false

            local function UpdateValue(input)
                local percent = math.clamp((input.Position.X - Track.AbsolutePosition.X) / Track.AbsoluteSize.X, 0, 1)
                local val = math.floor(Min + (Max - Min) * percent)
                CurrentValue = val
                ValueLabel.Text = tostring(val)
                Tween(Fill, 0.05, { Size = UDim2.new(percent, 0, 1, 0) })
                task.spawn(function()
                    Callback(val)
                end)
            end

            Track.InputBegan:Connect(function(input)
                if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
                    isDragging = true
                    UpdateValue(input)
                end
            end)

            UserInputService.InputEnded:Connect(function(input)
                if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
                    isDragging = false
                end
            end)

            UserInputService.InputChanged:Connect(function(input)
                if isDragging and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
                    UpdateValue(input)
                end
            end)

            return {
                Set = function(val)
                    CurrentValue = math.clamp(val, Min, Max)
                    ValueLabel.Text = tostring(CurrentValue)
                    local percent = (CurrentValue - Min) / (Max - Min)
                    Tween(Fill, 0.15, { Size = UDim2.new(percent, 0, 1, 0) })
                    Callback(CurrentValue)
                end,
                Get = function() return CurrentValue end
            }
        end

        -- Element: Action Button
        function Tab:CreateButton(opts)
            opts = opts or {}
            local Name = opts.Name or "Execute Action"
            local Callback = opts.Callback or function() end

            local Button = Instance.new("TextButton")
            Button.Size = UDim2.new(1, 0, 0, 34)
            Button.BackgroundColor3 = Theme.Card
            Button.Text = Name
            Button.Font = Enum.Font.GothamMedium
            Button.TextSize = 11
            Button.TextColor3 = Theme.Text
            Button.BorderSizePixel = 0
            Button.Parent = TabPage

            local BtnCorner = Instance.new("UICorner")
            BtnCorner.CornerRadius = UDim.new(0, 6)
            BtnCorner.Parent = Button

            local BtnStroke = Instance.new("UIStroke")
            BtnStroke.Color = Theme.Border
            BtnStroke.Thickness = 1
            BtnStroke.Parent = Button

            Button.MouseEnter:Connect(function()
                Tween(Button, 0.15, { BackgroundColor3 = Theme.CardHover })
            end)
            Button.MouseLeave:Connect(function()
                Tween(Button, 0.15, { BackgroundColor3 = Theme.Card })
            end)
            Button.MouseButton1Click:Connect(function()
                Tween(Button, 0.08, { BackgroundColor3 = Theme.Accent, TextColor3 = Color3.fromRGB(0, 0, 0) })
                task.wait(0.1)
                Tween(Button, 0.15, { BackgroundColor3 = Theme.CardHover, TextColor3 = Theme.Text })
                task.spawn(Callback)
            end)

            return Button
        end

        -- Element: Dropdown
        function Tab:CreateDropdown(opts)
            opts = opts or {}
            local Name = opts.Name or "Dropdown"
            local Options = opts.Options or {}
            local Default = opts.Default or Options[1] or ""
            local Callback = opts.Callback or function() end
            local Selected = Default
            local isExpanded = false

            local Container = Instance.new("Frame")
            Container.Size = UDim2.new(1, 0, 0, 36)
            Container.BackgroundColor3 = Theme.Card
            Container.BorderSizePixel = 0
            Container.ClipsDescendants = true
            Container.Parent = TabPage

            local Corner = Instance.new("UICorner")
            Corner.CornerRadius = UDim.new(0, 6)
            Corner.Parent = Container

            local Stroke = Instance.new("UIStroke")
            Stroke.Color = Theme.Border
            Stroke.Thickness = 1
            Stroke.Parent = Container

            local HeaderBtn = Instance.new("TextButton")
            HeaderBtn.Size = UDim2.new(1, 0, 0, 36)
            HeaderBtn.BackgroundTransparency = 1
            HeaderBtn.Text = ""
            HeaderBtn.Parent = Container

            local Label = Instance.new("TextLabel")
            Label.Size = UDim2.new(0.5, 0, 1, 0)
            Label.Position = UDim2.new(0, 12, 0, 0)
            Label.BackgroundTransparency = 1
            Label.Text = Name
            Label.Font = Enum.Font.GothamMedium
            Label.TextSize = 11
            Label.TextColor3 = Theme.Text
            Label.TextXAlignment = Enum.TextXAlignment.Left
            Label.Parent = HeaderBtn

            local SelectedLabel = Instance.new("TextLabel")
            SelectedLabel.Size = UDim2.new(0.5, -34, 1, 0)
            SelectedLabel.Position = UDim2.new(0.5, 0, 0, 0)
            SelectedLabel.BackgroundTransparency = 1
            SelectedLabel.Text = tostring(Selected)
            SelectedLabel.Font = Enum.Font.Gotham
            SelectedLabel.TextSize = 10
            SelectedLabel.TextColor3 = Theme.Accent
            SelectedLabel.TextXAlignment = Enum.TextXAlignment.Right
            SelectedLabel.Parent = HeaderBtn

            local Arrow = Instance.new("TextLabel")
            Arrow.Size = UDim2.new(0, 20, 1, 0)
            Arrow.Position = UDim2.new(1, -26, 0, 0)
            Arrow.BackgroundTransparency = 1
            Arrow.Text = "▼"
            Arrow.Font = Enum.Font.GothamMedium
            Arrow.TextSize = 9
            Arrow.TextColor3 = Theme.Muted
            Arrow.Parent = HeaderBtn

            local ListFrame = Instance.new("Frame")
            ListFrame.Size = UDim2.new(1, -16, 0, #Options * 26)
            ListFrame.Position = UDim2.new(0, 8, 0, 36)
            ListFrame.BackgroundTransparency = 1
            ListFrame.Parent = Container

            local DropLayout = Instance.new("UIListLayout")
            DropLayout.Padding = UDim.new(0, 2)
            DropLayout.Parent = ListFrame

            for _, opt in ipairs(Options) do
                local OptBtn = Instance.new("TextButton")
                OptBtn.Size = UDim2.new(1, 0, 0, 24)
                OptBtn.BackgroundColor3 = Color3.fromRGB(18, 22, 32)
                OptBtn.BackgroundTransparency = 1
                OptBtn.Text = "  " .. tostring(opt)
                OptBtn.Font = Enum.Font.Gotham
                OptBtn.TextSize = 10
                OptBtn.TextColor3 = Theme.Muted
                OptBtn.TextXAlignment = Enum.TextXAlignment.Left
                OptBtn.BorderSizePixel = 0
                OptBtn.Parent = ListFrame

                local OptCorner = Instance.new("UICorner")
                OptCorner.CornerRadius = UDim.new(0, 4)
                OptCorner.Parent = OptBtn

                OptBtn.MouseEnter:Connect(function()
                    Tween(OptBtn, 0.1, { BackgroundTransparency = 0, TextColor3 = Theme.Text })
                end)
                OptBtn.MouseLeave:Connect(function()
                    Tween(OptBtn, 0.1, { BackgroundTransparency = 1, TextColor3 = Theme.Muted })
                end)
                OptBtn.MouseButton1Click:Connect(function()
                    Selected = opt
                    SelectedLabel.Text = tostring(opt)
                    isExpanded = false
                    Tween(Container, 0.18, { Size = UDim2.new(1, 0, 0, 36) })
                    Tween(Arrow, 0.18, { Rotation = 0 })
                    task.spawn(function()
                        Callback(opt)
                    end)
                end)
            end

            HeaderBtn.MouseButton1Click:Connect(function()
                isExpanded = not isExpanded
                local targetHeight = isExpanded and (36 + #Options * 26 + 8) or 36
                Tween(Container, 0.18, { Size = UDim2.new(1, 0, 0, targetHeight) })
                Tween(Arrow, 0.18, { Rotation = isExpanded and 180 or 0 })
            end)

            return {
                Set = function(val)
                    Selected = val
                    SelectedLabel.Text = tostring(val)
                    Callback(val)
                end,
                Get = function() return Selected end
            }
        end

        return Tab
    end

    return Window
end

return SpectreWareUI
