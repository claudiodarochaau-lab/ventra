#!/bin/bash
# Regenerates all OG share images from og-template.html.
# Run from the repo root: bash assets/og/generate.sh
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
gen() { # name, tag, title
  sed -e "s/{{TAG}}/$2/" -e "s/{{TITLE}}/$3/" og-template.html > _tmp.html
  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --window-size=1200,630 --screenshot="$1.png" "file://$(pwd)/_tmp.html" 2>/dev/null
  rm _tmp.html
}
gen home             "AUSTRALIA'S MANAGED COFFEE PARTNER" "Coffee, fully managed."
gen how-it-works     "THE MANAGED MODEL"                  "One partner managing the whole solution."
gen higher-education "FOR HIGHER EDUCATION"               "Coffee that understands your campus."
gen about            "ABOUT VENTRA"                       "Built from inside the sector."
gen faq              "FAQ"                                "Direct answers."
gen contact          "CONTACT"                            "Book a discovery meeting."
