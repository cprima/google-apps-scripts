# google-apps-scripts fx

A script to fetch exchange rates for the Armenian Dram and the EUR/USD from the European Central Bank as reference. The script calls the RSS feed from these central banks.

![Graph](http://drive.google.com/uc?id=1QmDis_Qzhy6DEdGTQ6exLRIKKGuGxCmY)

# Requirements

clasp https://github.com/google/clasp

Google Account with "Google Apps Script API" enabled: @see https://script.google.com/u/2/home/usersettings

# Installation

`clasp login` to create  ~/.clasprc.json with credentials.

`cd ./app/phy/fx/ && clasp create --type standalone --title "cpmForexRates"`

Google Script projects cannot be nested, `clasp` will look the path upwards for a clasp.json file.

In [Google Docs](https://docs.google.com/spreadsheets) a spreadsheet needs to be created or selected and its ID from the URI configured in `config.js`. The script will create if they don't exist the sheets 'cba.am' and 'ecb' and write a header line. If sheets with these names already exist nothing will be done initially.

When (the javascript) is written with one's favorite editor it is pushed online with `clasp push`.

With [Google Apps-Script](https://script.google.com/) triggers can be set to periodically fetch the data.

# Updating

`clasp push --force`

Check trigger https://script.google.com/ which version is referenced!


# Known Problems

https://github.com/google/clasp/issues/224#issuecomment-453601775

For versions created from clasp deployments, I cannot delete the version, reglardless of having removed all deployments.

