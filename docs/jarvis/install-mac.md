# 🍎 Cara Install Jarvis di Mac (zsh) - VERSI V3 (AUTO-MSG)

1.  Buka Terminal.
2.  Buka file config zsh dengan perintah:
    ```bash
    nano ~/.zshrc
    ```
3.  Hapus kode Jarvis lama, ganti dengan yang baru (fitur auto-message):

    ```bash
    # -------------------------------------------
    # 🤖 JARVIS ALIASES (Agus Finance Workflow)
    # -------------------------------------------
    echo "🤖 Jarvis aliases loaded!"

    # 1. jarvis-in: Masuk kerja (Sync dari cloud/Github branch update)
    function jarvis-in() {
        echo "🚀 Jarvis-In: Syncing workspace from origin/update..."
        git checkout update
        git pull origin update
        echo "✅ Ready to work! Workspace updated."
    }

    # 2. jarvis-out: Pulang kerja (Simpan & Push ke update)
    # Jika lupa kasih pesan, otomatis pakai Timestamp.
    function jarvis-out() {
        local msg="$1"
        if [ -z "$msg" ]; then
            msg="Auto-save: $(date '+%Y-%m-%d %H:%M:%S')"
            echo "⚠️ No message provided. Using default: '$msg'"
        fi

        git add .
        git commit -m "$msg"
        git push origin update
        echo "✅ Work saved and pushed to 'update'! Safe to go home."
    }

    # 3. jarvis-merge: Rilis fitur (Merge Update -> Main)
    function jarvis-merge() {
        echo "🚀 Merging 'update' to 'main'..."
        git checkout main
        git pull origin main
        git merge update
        git push origin main
        git checkout update
        echo "✅ Merged to main and back to workspace!"
    }
    
    # 4. jarvis-setup: Reset/Sync total (Main -> Update)
    function jarvis-setup() {
        echo "🚀 Starting Jarvis Setup (Sync Main -> Update)..."
        git checkout main
        git pull origin main
        git checkout update
        git merge main
        echo "✅ Workspace synced with Main!"
    }
    # -------------------------------------------
    ```

4.  Simpan file (`Ctrl + O` -> `Enter` -> `Ctrl + X`).
5.  Refresh terminal: `source ~/.zshrc`
