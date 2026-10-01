@echo off
title SpectreWare 1.0 - Core Engine Launcher
cd /d "%~dp0"
echo Starting SpectreWare 1.0...
start "" node .\node_modules\electron\cli.js .
exit
