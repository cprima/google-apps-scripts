# google-apps-scripts
The repo for google-apps-scripts.

# Requirements

clasp https://github.com/google/clasp

Google Account with "Google Apps Script API" enabled: @see https://script.google.com/u/2/home/usersettings

# Initialization

How to re-create such a repo from scratch:

`cd ./app/phy/fx/ && clasp create --type standalone --title "cpmForexRates"`

Google Script projects cannot be nested, `clasp` will look the path upwards for a clasp.json file.

When the javascript is written with one's favorite editor it is pushed online with `clasp push`.

# Installation 

`clasp login` to create  ~/.clasprc.json with credentials.

# Updating

`clasp push --force`

Check trigger https://script.google.com/ which version is referenced!


# Known Problems

https://github.com/google/clasp/issues/224#issuecomment-453601775

For versions created from clasp deployments, I cannot delete the version, reglardless of having removed all deployments.

