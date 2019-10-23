# google-apps-scripts
The repo for google-apps-scripts.

# Requirements

clasp https://github.com/google/clasp

Google Account with "Google Apps Script API" enabled: @see https://script.google.com/u/2/home/usersettings

# Initialization

How to re-create such a repo from scratch:

`clasp create --type standalone --title "cpmForexRates" --rootDir ./app/phy/fx/`

The `rootDir` only references local file structures, and if wanted needs to be recreated manually in Google Drive.

`clasp push`


# Installation 

`clasp login`

# Updating

`clasp push --force`

`clasp deploy -V 1`

Check trigger https://script.google.com/ which version is referenced!