
# Prerequisites

clasp

Google Account

# Functionality

The script reads from a Spreadsheet with configurable sheet name.
If that sheet does not exist it will be created with correct header row.
The header row contains

- action
- SchichtID
- date
- Location
- event_id
- created_at
- updated_at

The file `config.js` contains the dictionary "shiftinfo" with begin and end information for a shift identifier (like e.g. N for nightshift).

The spreadsheet then is filled with a shiftId for each date, all non-filtered rows with an action value of CREATE or emtpy are processed.
For performance reasons the script only works on rows that are not hiden by a filter, although all lines are initially read.
This is because each an every line is written back into the sheet at the end of the processing, including the event_id of the Google Calendar event. The action DELETE and UPDATE depend on this event_id to delete it (and in case of UPDATE to create a new event).

The implemented actions are

- CREATE
- UPDATE
- DELETE
- READ (row is skipped)




# Initial setup

//fixme

```
google-apps-scripts/app/phy/sheet2calendar$ clasp create --type standalone --title "sheet2calendar"
Created new standalone script: https://script.google.com/d/1JWCFxI3xrerh4JZv2pIUoRHmVvdcfPcuyY5COT9fG-jJsHR3LHCrxPGx/edit
Warning: files in subfolder are not accounted for unless you set a '.claspignore' file.
Cloned 1 file.
└─ appsscript.json
```

```bash
clasp push --force
```




# Configuration

| what                      | key                 | location        |
| ------------------------- | ------------------- | --------------- |
| ID of the Google Sheet    | input_spreadsheetId | config.js       |
| Name of the sheet         | input_sheetName     | config.js       |
| ID of the Google Calendar | output_calendarId   | config.js       |
| default location          | Location            | config.js       |
| Script timezone           | timeZone            | appsscript.json |
| begin/end                 | shiftinfo           | config.js       |

## Example of the shiftinfo

```Javascript
var shiftinfo = {
    'F': {
        from: new Date('2020-01-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 7,
        start_time_minutes: 0,
        end_time_hours: 15,
        end_time_minutes: 30,
        end_offset: 0,
        description: 'Frühdienst'
    },
    'Z': {
        from: new Date('2020-01-01'),
        thru: new Date('2020-01-31'),
        start_time_hours: 9,
        start_time_minutes: 30,
        end_time_hours: 18,
        end_time_minutes: 0,
        end_offset: 0,
        description: 'Zwischendienst'
    },
    'Z': {
        from: new Date('2020-02-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 9,
        start_time_minutes: 30,
        end_time_hours: 18,
        end_time_minutes: 0,
        end_offset: 0,
        description: 'Zwischendienst'
    },
    //...
    'RD': {
        from: new Date('2020-01-01'),
        thru: new Date('2099-12-31'),
        start_time_hours: 12,
        start_time_minutes: 0,
        end_time_hours: 20,
        end_time_minutes: 0,
        end_offset: 0,
        description: 'Rufdienst'
    }
}
```


# Further reading


https://towardsdatascience.com/creating-calendar-events-using-google-sheets-data-with-appscript-203b26446ce9

https://developers.google.com/apps-script/reference/calendar/calendar-event

https://mashe.hawksey.info/2018/02/google-apps-script-patterns-conditionally-updating-rows-of-google-sheet-data-by-reading-and-writing-data-once/


