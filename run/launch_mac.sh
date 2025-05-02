#!/bin/bash
project="Desktop/Life-Happens"

osascript <<EOF
tell application "Terminal"
    do script "cd \"$project\"; cd frontend; echo 'Starting frontend...'; npm start"
    delay 1
    do script "cd \"$project\"; cd backend; source venv/bin/activate; echo 'Starting Python service backend...'; python app.py"
    delay 1
    do script "cd \"$project\"; cd mail_server; source mail_venv/bin/activate; echo 'Starting mail backend....'; python app.py"
end tell
EOF
