# 🪟 Cara Install Jarvis di Windows (PowerShell) - VERSI V3 (AUTO-MSG)

1.  Buka PowerShell.
2.  Buka file profil: `notepad $PROFILE`
3.  Hapus kode lama, ganti dengan versi Auto-Message ini:

    ```powershell
    # -------------------------------------------
    # 🤖 JARVIS ALIASES (Agus Finance / Global Workflow)
    # -------------------------------------------
    Write-Host "🤖 Jarvis aliases loaded!" -ForegroundColor Cyan

    # 1. jarvis-in: Masuk kerja (Sync dari cloud/Github branch update)
    function Jarvis-In {
        Write-Host "🚀 Jarvis-In: Syncing workspace from origin/update..." -ForegroundColor Cyan
        git checkout update
        git pull origin update
        Write-Host "✅ You are now up to date with the remote work!" -ForegroundColor Green
    }

    # 2. jarvis-out: Pulang kerja (Simpan & Push ke update)
    # Jika dijalankan tanpa pesan, otomatis pakai timestamp.
    function Jarvis-Out {
        param([string]$message)
        
        # Jika tidak ada pesan, pakai timestamp otomatis
        if (-not $message) {
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            $message = "Auto-save: $timestamp"
            Write-Host "⚠️ No message provided. Using default: '$message'" -ForegroundColor Yellow
        }

        git add .
        git commit -m "$message"
        git push origin update
        Write-Host "✅ Work saved and pushed to 'update'! Safe to go home." -ForegroundColor Green
    }

    # 3. jarvis-merge: Rilis fitur (Merge Update -> Main)
    function Jarvis-Merge {
        Write-Host "🚀 Merging 'update' to 'main'..." -ForegroundColor Cyan
        git checkout main
        git pull origin main
        git merge update
        git push origin main
        git checkout update
        Write-Host "✅ Merged to main and back to workspace!" -ForegroundColor Green
    }

    # 4. jarvis-setup: Reset/Sync total (Main -> Update)
    function Jarvis-Setup {
        Write-Host "🚀 Starting Jarvis Setup (Sync Main -> Update)..." -ForegroundColor Green
        git checkout main
        git pull origin main
        git checkout update
        git merge main
        Write-Host "✅ Workspace synced with Main!" -ForegroundColor Green
    }
    # -------------------------------------------
    ```

4.  Simpan (`Ctrl + S`) dan restart PowerShell.
