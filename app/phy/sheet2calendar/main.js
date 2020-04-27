/**
 * Inserting events from Google Sheets spreadsheet into Google calendar
 *
 * @author: Christian Prior-Mamulyan <cprior@gmail.com>
 * @license: MIT
 *
 */


//to be called from triggers
function main() {
    init();
    worker();
}


function worker() {
    var sheet = SpreadsheetApp.openById(input_spreadsheetId).getSheetByName(input_sheetName);
    var calendar = CalendarApp.getCalendarById(output_calendarId);

    //var events = calendar.getEvents(new Date('2020-05-01'), new Date('2020-05-02'));
    //Logger.log(events)

    //https://mashe.hawksey.info/2018/02/google-apps-script-patterns-conditionally-updating-rows-of-google-sheet-data-by-reading-and-writing-data-once/
    var dataRange = sheet.getDataRange();
    var data = dataRange.getValues();
    data[0].push('is_filtered')
    // //https://stackoverflow.com/a/58042736/9576512
    for (var i = 1; i < data.length; i++) {
        //Logger.log(">"+i+" "+sheet.isRowHiddenByFilter(i)+"");
        if (sheet.isRowHiddenByFilter(i + 1)) data[i].push(true); else data[i].push(false); //otherwise null
    }
    //Logger.log(data)
    var header = data.shift();
    var action_col = header.indexOf("action");
    var location_col = header.indexOf("Location");
    var schichtid_col = header.indexOf("SchichtID");
    var created_at_col = header.indexOf("created_at");
    var updated_at_col = header.indexOf("updated_at");
    var event_id_col = header.indexOf("event_id");
    var is_filtered_col = header.indexOf("is_filtered");

    // convert 2d array into object array
    // https://stackoverflow.com/a/22917499/1027723
    // for pretty version see https://mashe.hawksey.info/?p=17869/#comment-184945
    var obj = data.map(function (values) {
        return header.reduce(function (o, k, i) {
            o[k] = values[i];
            return o;
        }, {});
    });
    //Logger.log(obj)

    // loop through all the data
    obj.forEach(function (row, rowIdx) {
        //only work on rows that were not filtered out
        if (row.is_filtered === false && row.SchichtID != '' && (row.action === '' || row.action === 'CREATE' || row.action === 'UPDATE')) {
            if (row.action === 'UPDATE') {
                //
                calendar.getEventById(row.event_id).deleteEvent();
            }

            var foo = calculateStartEndFromSchichtid(row.date, row.SchichtID);
            try {
                var event = calendar.createEvent(row.SchichtID,
                    new Date(foo.start_time),
                    new Date(foo.end_time),
                    {
                        'location': row.Location,
                        'description': foo.description
                    });
                data[rowIdx][action_col] = 'READ';
                data[rowIdx][created_at_col] = new Date(); //check UPDATE (also gets a new Date)
                data[rowIdx][updated_at_col] = new Date();
                data[rowIdx][event_id_col] = event.getId();
            } catch (e) {
                // modify cell to record error
                data[rowIdx][updated_at_col] = e.message;
            }

        }

        if (row.action === 'DELETE') {
            calendar.getEventById(row.event_id).deleteEvent();
            data[rowIdx][updated_at_col] = new Date();
            data[rowIdx][action_col] = 'READ';
            data[rowIdx][schichtid_col] = '';
            data[rowIdx][location_col] = '';
            data[rowIdx][event_id_col] = '';
        }
    });

    obj.forEach(function (row, rowIdx) {

        data[rowIdx].splice(is_filtered_col)

    });

    //Logger.log(data)

    //overwrites formulas in cells, if present
    dataRange.offset(1, 0, data.length).setValues(data);

    // //https://stackoverflow.com/a/58042736/9576512
    // for (var i = 1; i < spreadsheet.getLastRow(); i++) {
    //     if (!spreadsheet.isRowHiddenByFilter(i)) nonempties.push(data[i])
    // }
    // range = [];
    // Logger.log(nonempties)
}


function calculateStartEndFromSchichtid(date, schichtId) {
    if (date === undefined && schichtId === undefined) {
        throw new Error("ouch") //fixme
    }
    //var schichtinfo = schichtplanung['Dienstzeiten'][schichtId]; //deprecated
    var schichtinfo = buildSchichtinfo(schichtId, date);
    var start_time = new Date(date);
    start_time.setHours(schichtinfo['start_time_hours']);
    start_time.setMinutes(schichtinfo['start_time_minutes']);
    var end_time = new Date(start_time.getFullYear(), start_time.getMonth(), start_time.getDate());
    end_time.setDate(end_time.getDate() + schichtinfo['end_offset'])
    end_time.setHours(schichtinfo['end_time_hours']);
    end_time.setMinutes(schichtinfo['end_time_minutes']);

    var retobj = {
        'SchichtID': schichtId,
        start_time: start_time,
        end_time: end_time,
        description: schichtinfo['description']
    };
    return retobj;
}

//for a specific date and schichtId, get the configured start and end (and offset) info
function buildSchichtinfo(schichtId, when) {
    for (var k in dienstzeitenTimereferenced) {
        if (schichtId == k
            && dienstzeitenTimereferenced[k].from.setHours(0, 0, 0, 0) <= when
            && dienstzeitenTimereferenced[k].thru.setHours(23, 59, 59, 0) >= when) {
            return dienstzeitenTimereferenced[k];
        }
    }
}

function init() {

    try {
        DriveApp.openById(input_spreadsheetId)
    } catch (e) {
        //     //fixme does not trigger
        //     errorHandler(e, 'init')
    }


    var spreadsheet = SpreadsheetApp.openById(input_spreadsheetId);

    if (!spreadsheet.getSheetByName(input_sheetName)) {

        spreadsheet.insertSheet(input_sheetName, 0);

        j = 1;
        for (var column in datatemplate) {
            spreadsheet.getSheetByName(input_sheetName).getRange(1, j).setValue(column);
            j++;
        }

    }


    var dataRange = spreadsheet.getSheetByName(input_sheetName).getDataRange();

    filter = spreadsheet.getSheetByName(input_sheetName).getFilter();
    if (filter !== null) {
        //remove
        filter.remove();
    }
    dataRange.createFilter();


    var newCriteria = SpreadsheetApp.newFilterCriteria()
        .whenCellNotEmpty()
        .build();
    spreadsheet.getSheetByName(input_sheetName).getFilter().setColumnFilterCriteria(2, newCriteria);




}