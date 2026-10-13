--[[
    setclipboard(string.format('Places = { %s },\nGames  = { %s },', tostring(game.PlaceId), tostring(game.GameId)))
    print("Copied to clipboard!")
]]

-- Safe Global Resolution (Immune to VM Obfuscator sandbox & Real Executor isolation)
local cloneref = cloneref or function(o) return o end
local rawGame = (typeof(game) == "Instance" and game)
    or (typeof(workspace) == "Instance" and workspace.Parent)
    or (getgenv and getgenv().game)
    or game

local game = cloneref(rawGame)
local waitFn = (task and task.wait) or wait

repeat waitFn() until game:IsLoaded()
repeat waitFn() until game:GetService("Players").LocalPlayer

local StarterGui = game:GetService("StarterGui")
local currentPlaceId = (game and game.PlaceId) or (getgenv and getgenv().game and getgenv().game.PlaceId) or 0
local currentGameId  = (game and game.GameId) or (getgenv and getgenv().game and getgenv().game.GameId) or 0

-- Executor Identification Helper
local function executorName()
    local scopes = {}
    pcall(function()
        if type(getgenv) == "function" then table.insert(scopes, getgenv()) end
    end)
    table.insert(scopes, _G)
    for _, scope in ipairs(scopes) do
        if type(scope) == "table" then
            for _, key in ipairs({ "identifyexecutor", "getexecutorname", "identify_executor" }) do
                if type(scope[key]) == "function" then
                    local ok, name, version = pcall(scope[key])
                    if ok and name and tostring(name) ~= "" then
                        return tostring(name) .. (version and tostring(version) ~= "" and (" " .. tostring(version)) or "")
                    end
                end
            end
        end
    end
    return "Unknown Executor"
end

print(string.format("[SpectreWare Loader] Running on %s (PlaceId: %s | GameId: %s)", executorName(), tostring(currentPlaceId), tostring(currentGameId)))

-- Notification Helper
local function notify(title, text, duration)
    pcall(function()
        StarterGui:SetCore("SendNotification", {
            Title    = title or "SpectreWare",
            Text     = text or "",
            Duration = duration or 4,
            Icon     = "rbxassetid://10734896206"
        })
    end)
end

-- =========================================================================
-- SUPPORTED GAMES DATABASE
-- เพิ่มแมพ/เกมใหม่ได้ง่ายๆ ตรงตารางนี้เลยครับ:
-- =========================================================================
local SupportedGames = {
    ["Anime Breaker"] = {
        Places = { 109928390521457 },
        Games  = { 10675117523 },
        Url    = "https://raw.githubusercontent.com/tigergenz/SpectreMain/refs/heads/main/ANIMEBRE.lua",
    },
    ["Never Town"] = {
        Places = { 77908479907662 },
        Games  = { 10675117523 },
        Url    = "https://raw.githubusercontent.com/SpectreWareZ/SpectreWare/refs/heads/main/Games/NeverTown.lua",
    },
    ["Final Swarm"] = {
        Places   = { 99521272836282, 79787558257549, 797875825749 },
        Games    = { 9551044479 },
        Patterns = { "final swarm", "swarm" },
        Url      = "https://raw.githubusercontent.com/tigergenz/SpectreMain/refs/heads/main/FinalSwarm.lua",
    },
    ["Tower Incremental"] = {
        Places   = { 75766778174856 },
        Games    = { 10765067592 },
        Patterns = { "tower incremental" },
        Url      = "https://raw.githubusercontent.com/tigergenz/SpectreMain/refs/heads/main/TOWER.lua",
    },
    ["Run A Restaurant"] = {
        Places   = { 77843161404023 },
        Games    = { 9970645639 },
        Patterns = { "run a restaurant", "restaurant" },
        Url      = "https://raw.githubusercontent.com/tigergenz/SpectreMain/refs/heads/main/RunARes.lua",
    },
    ["Jump For Animals"] = {
        Places = { 126870639873289 },
        Games  = { 10690360998 },
        Patterns = { "jump for animals" },
        Url      = "https://raw.githubusercontent.com/tigergenz/SpectreMain/refs/heads/main/JFA.lua",
    },
}

-- =========================================================================
-- LOADER LOGIC
-- =========================================================================
local matchedGame = nil
local targetConfig = nil

for gameName, config in pairs(SupportedGames) do
    local isMatch = false

    -- ตรวจสอบ PlaceId
    if config.Places then
        for _, id in ipairs(config.Places) do
            if id == currentPlaceId then
                isMatch = true
                break
            end
        end
    end

    -- ตรวจสอบ GameId (UniverseId)
    if not isMatch and config.Games then
        for _, id in ipairs(config.Games) do
            if id == currentGameId then
                isMatch = true
                break
            end
        end
    end

    -- ตรวจสอบ Name Fallback (กรณีข้ามแมพย่อย/Raid หรือ PlaceId เปลี่ยน)
    if not isMatch and config.Patterns then
        local lowerName = string.lower(game.Name or "")
        for _, pattern in ipairs(config.Patterns) do
            if lowerName:find(pattern, 1, true) then
                isMatch = true
                break
            end
        end
    end

    if isMatch then
        matchedGame = gameName
        targetConfig = config
        break
    end
end

if matchedGame and targetConfig then
    notify("SpectreWare", "Loading " .. matchedGame .. "...", 3)
    
    local ok, scriptContent = pcall(function()
        return game:HttpGet(targetConfig.Url, true)
    end)

    if not ok or type(scriptContent) ~= "string" or #scriptContent < 100 then
        ok, scriptContent = pcall(function()
            return game:HttpGet(targetConfig.Url)
        end)
    end

    if ok and type(scriptContent) == "string" and #scriptContent > 100 then
        local exec, err = loadstring(scriptContent)
        if exec then
            task.spawn(exec)
        else
            warn("[SpectreWare Loader] Compile error: " .. tostring(err))
            notify("SpectreWare", "Compile error! Check console (F9).", 5)
        end
    else
        warn("[SpectreWare Loader] Failed to fetch script from: " .. tostring(targetConfig.Url))
        notify("SpectreWare", "Failed to download script. Check URL/Network!", 5)
    end
else
    warn(string.format("[SpectreWare Loader] Unsupported Game! PlaceId: %s | GameId: %s", tostring(currentPlaceId), tostring(currentGameId)))
    notify("SpectreWare", "Game is not supported! (PlaceId: " .. tostring(currentPlaceId) .. ")", 5)
end
