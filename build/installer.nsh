; Upgrades over versions up to 1.6.1 (which shipped deep node_modules folders under
; resources\app.asar.unpacked, past Windows' 260-character path limit, so their uninstaller
; failed and blocked the upgrade): clear that folder first. PowerShell deletes past the limit;
; NSIS RMDir and cmd's rd do not. Only old program files are removed; her data in
; %APPDATA%\Calm Path is never touched.
!macro customInit
  ReadEnvStr $0 LOCALAPPDATA
  IfFileExists "$0\Programs\calm-path\resources\app.asar.unpacked\*.*" 0 calmpath_clean_done
    nsExec::Exec `powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command "Remove-Item -LiteralPath '$0\Programs\calm-path\resources\app.asar.unpacked' -Recurse -Force"`
    Pop $1
    FileOpen $2 "$TEMP\calmpath-upgrade-clean.txt" w
    FileWrite $2 "cleaned old unpacked folder, delete exit $1"
    FileClose $2
  calmpath_clean_done:
!macroend
