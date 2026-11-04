#!/usr/bin/env bash
# Version 1 · last updated 2026-11-03 20:45 PST
#
# PUTS A NARRATION ON BACKBLAZE THE ONLY WAY THAT WORKS — and proves it.
#
#   bash upload-audio.sh 113                 # uploads assets/audio/113.mp3 as 113.mp3
#   bash upload-audio.sh 113 ~/Desktop/x.mp3 # uploads that file as 113.mp3
#   bash upload-audio.sh --fix 107 108 113   # adds the missing header to files
#                                         # already in the bucket (no re-upload)
#
# Why this exists. "Download the recording" only SAVES the file if Backblaze
# sends Content-Disposition: attachment with it. That header is set when the
# file is uploaded, and the Backblaze website cannot set it. Nos. 107, 108 and
# 113 went up through the website on 2026-10-14 and their Download button
# played the book in a bare browser tab until 2026-11-03. Every upload made
# with this script carries the header, and the script reads it back from the
# bucket before it says "done".
#
# Run it in a Codespace terminal (or on a Mac with `pip3 install b2`). It asks
# for the key ID and application key one at a time; nothing has to be typed
# into a command line, and both are cleared from the terminal when it ends.
# Delete the key on Backblaze afterwards.

set -u
BUCKET="roya-audio"
HOST="https://f005.backblazeb2.com/file/$BUCKET"

die() { echo "✗ $*" >&2; exit 1; }

ask_key() {
  command -v b2 >/dev/null 2>&1 || { echo "Installing the b2 tool…"; pip install --quiet b2 || die "could not install b2"; }
  if [ -z "${B2_APPLICATION_KEY_ID:-}" ] || [ -z "${B2_APPLICATION_KEY:-}" ]; then
    echo "Paste each value from Backblaze's \"Success!\" box when asked."
    read -r -p "Key ID: " B2_APPLICATION_KEY_ID
    read -r -p "Application key: " B2_APPLICATION_KEY
    export B2_APPLICATION_KEY_ID B2_APPLICATION_KEY
  fi
  [ "${#B2_APPLICATION_KEY}" -eq 31 ] || die "that application key is ${#B2_APPLICATION_KEY} characters, not 31 — copy it again from Backblaze. Nothing was changed."
}
cleanup() { unset B2_APPLICATION_KEY_ID B2_APPLICATION_KEY; }
trap cleanup EXIT

verify() {   # verify NN — read the headers back from the public address
  local n="$1" h
  h=$(curl -sI "$HOST/$n.mp3")
  if echo "$h" | grep -qi '^content-disposition: *attachment'; then
    echo "  ✓ $n.mp3 — Download will save it"
  else
    echo "  ✗ $n.mp3 — NO Content-Disposition: Download will PLAY it. Run: bash upload-audio.sh --fix $n"
    return 1
  fi
}

info() { echo "b2-content-disposition=attachment; filename=\"$1.mp3\""; }

if [ "${1:-}" = "--fix" ]; then
  shift; [ $# -gt 0 ] || die "which numbers? e.g. bash upload-audio.sh --fix 107 108"
  ask_key; bad=0
  for n in "$@"; do
    echo "Fixing $n.mp3"
    b2 file server-side-copy --content-type audio/mpeg --info "$(info "$n")" \
      "b2://$BUCKET/$n.mp3" "b2://$BUCKET/$n.mp3" >/dev/null || { echo "  ✗ the copy failed"; bad=1; continue; }
    verify "$n" || bad=1
  done
  exit $bad
fi

n="${1:-}"; [ -n "$n" ] || die "usage: bash upload-audio.sh NN [file.mp3]   or   bash upload-audio.sh --fix NN …"
src="${2:-assets/audio/$n.mp3}"
[ -f "$src" ] || die "no file at $src"
ask_key
echo "Uploading $src as $n.mp3"
b2 file upload --content-type audio/mpeg --info "$(info "$n")" \
  "$BUCKET" "$src" "$n.mp3" >/dev/null || die "the upload failed"
verify "$n" || exit 1
echo "Done. The audio: field for No. $n is $HOST/$n.mp3"
echo "Now run: node check-book.js $n"
