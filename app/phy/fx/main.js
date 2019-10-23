/**
 * Automated handling of forex exhange rate processing.
 *
 * @author: Christian Prior-Mamulyan <cprior@gmail.com>
 * @license: MIT
 *
 */


//unused
function init() { return; }

//to be called from triggers
function main() {
    init();
    doCbaam();
}

//reading RSS feed and persiting to Google Sheet
/* sample item
<item>
<title>USD - 1 - 475.9600</title>
<link>http://www.cba.am/am/SitePages/ExchangeArchive.aspx</link>
<guid>USD10/22/2019 12:00:00 AM</guid>
<pubDate>10/22/2019 12:00:00 AM</pubDate>
</item>
*/
function doCbaam() {
    //where to write to
    output_cbaam_sheet = SpreadsheetApp.openById(output_cbaam_spreadsheetId).getSheetByName(output_cbaam_sheetname);
    //if entry does not exist already
    output_cbaam_existingGuids = getExistingCbaamGuids(output_cbaam_sheet);

    //read RSS
    var items = getFeedContentParsed(input_cbaam_feedurl)
    for (var i in items) {
        guid = myGetElementText(items[i], "guid") //need this first to check for duplicates
        currency = myGetNthElementText(items[i], "title", " - ", 0); //need this to process only configured currencies

        //insertIfNotExists
        if (process_cbaam_currencies.indexOf(currency) >= 0 && existingGuids.indexOf(guid) == -1) {
            output_cbaam_sheet.appendRow([guid,
                myGetElementText(items[i], "title"),
                new Date(myGetElementText(items[i], "pubDate")), //date
                currency,
                parseFloat(myGetNthElementText(items[i], "title", " - ", 2)), //rate
                myGetNthElementText(items[i], "title", " - ", 1), //multiplier
                ScriptApp.getScriptId(),
                new Date()]);
            //reportIf
            for (var j in output_report_mailaddresses) {
                try {
                    MailApp.sendEmail(
                        output_report_mailaddresses[j], //to
                        currency + ": " + myGetNthElementText(items[i], "title", " - ", 2), //subject
                        "" //body
                    );
                } catch (e) {
                    Logger.log(e)
                }
            }
        }
    }
}

function myGetNthElementText(item, elementname, splitstring, position) {
    return item.getElement(elementname).getText().split(splitstring)[position];
}

function myGetElementText(item, elementname) {
    return item.getElement(elementname).getText();
}



//
function getFeedContentParsed(url) {
    var feed = Xml.parse(UrlFetchApp.fetch(url).getContentText(), false);
    return feed.getElement().getElement("channel").getElements("item");
}

//
function getExistingCbaamGuids(sheet) {
    //read all existing guid values to prevent duplicates later
    //getRange(row, column, numRows, numColumns)
    var temp = sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues();
    existingGuids = [];
    for (var i in temp) {
        if (i >= 1) {//dont need the header row
            existingGuids.push(temp[i][0]);
        }
    }
    return existingGuids
}

//
function test() {
    Logger.log(sheetId)
    Logger.log("test")
}

