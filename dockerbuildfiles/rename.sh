sed -i 's|/assets|/files/assets|g' /app/dist/index.html
#files in public publicfile_<something>.<ext>
find /app/dist/assets -type f -exec sed -i 's|/publicfile_|/files/publicfile_|g' {} +