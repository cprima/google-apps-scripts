/**
 * Automated handling of forex exchange rate processing.
 *
 * @author: Christian Prior-Mamulyan <cprior@gmail.com>
 * @license: MIT
 *
 */


//to be called from triggers
function main() {
    init();
    doCbaam();
    doEcb();
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

    //read RSS
    root = getFeedDocument(input_cbaam_feedurl);
    //get the items of interest
    var items = root.getChild('channel').getChildren('item');

    for (var i in items) {

        data = datatemplate;

        data.id = items[i].getChild('guid').getValue();
        data.title = items[i].getChild('title').getText();
        data.date = new Date(items[i].getChild('pubDate').getText());
        data.rate = parseFloat(myGetNthElementFromSplitText(items[i], "title", " - ", 2));
        data.multiplier = myGetNthElementFromSplitText(items[i], "title", " - ", 1);
        data.currency = myGetNthElementFromSplitText(items[i], "title", " - ", 0);

        //attempt to insert only selected currencies
        if (process_cbaam_currencies.indexOf(data.currency) >= 0) {
            appendRowIfNotExists(output_spreadsheetId, output_cbaam_sheetname, data, 'AMD');
        }
    }
}

//reading RSS feed and persiting to Google Sheet
/* sample item
<item rdf:about="http://www.ecb.europa.eu/stats/exchange/eurofxref/html/eurofxref-graph-usd.en.html?date=2019-11-15&amp;rate=1.1034">
<title xml:lang="en">1.1034 USD = 1 EUR 2019-11-15 ECB Reference rate</title>
<link>http://www.ecb.europa.eu/stats/exchange/eurofxref/html/eurofxref-graph-usd.en.html?date=2019-11-15&amp;rate=1.1034</link>
<description xml:lang="en">1 EUR buys 1.1034 US dollar (USD) - The reference exchange rates are published both by electronic market information providers and on the ECB's website shortly after the concertation procedure has been completed. Reference rates are published according to the same  calendar as the TARGET system.</description>
<dc:date>2019-11-15T14:15:00+01:00</dc:date>
<dc:language>en</dc:language>
<cb:statistics>
<cb:country>U2</cb:country>
<cb:institutionAbbrev>ECB</cb:institutionAbbrev>
<cb:exchangeRate>
<cb:value frequency="daily" decimals="4">1.1034</cb:value>
<cb:baseCurrency unit_mult="0">EUR</cb:baseCurrency>
<cb:targetCurrency>USD</cb:targetCurrency>
<cb:rateType>Reference rate</cb:rateType>
</cb:exchangeRate>
</cb:statistics>
</item>
*/
//@see: https://www.ecb.europa.eu/rss/fxref-usd.html
function doEcb() {

    var ns = XmlService.getNamespace('http://purl.org/rss/1.0/');
    var dc = XmlService.getNamespace('http://purl.org/dc/elements/1.1/');
    var cb = XmlService.getNamespace('http://www.cbwiki.net/wiki/index.php/Specification_1.1');
    var rdf = XmlService.getNamespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

    //read RSS
    root = getFeedDocument(input_ecbusd_feedurl);

    //get the items of interest
    var items = root.getChildren('item', ns);

    for (var i = 0; i < items.length; i++) {
        data = datatemplate;

        data.id = items[i].getAttribute('about', rdf).getValue();
        data.title = items[i].getChild('title', ns).getText();
        data.date = new Date(items[i].getChild('date', dc).getText());
        data.rate = parseFloat(items[i].getChild('statistics', cb)
            .getChild('exchangeRate', cb)
            .getChild('value', cb).getValue());
        data.multiplier = Math.pow(10, parseInt(items[i]
            .getChild('statistics', cb)
            .getChild('exchangeRate', cb)
            .getChild('baseCurrency', cb)
            .getAttribute('unit_mult')
            .getValue()));
        data.currency = items[i].getChild('statistics', cb).getChild('exchangeRate', cb).getChild('targetCurrency', cb).getValue();

        //attempt to insert
        appendRowIfNotExists(output_spreadsheetId, output_ecbusd_sheetname, data, 'EUR');

        //Logger.log('%s (%s) from %s with %s for %s times %s', data.title, data.id, data.date, data.rate, data.currency, data.multiplier);
    }

}

function myGetNthElementFromSplitText(item, elementname, splitstring, position) {
    return item.getChild(elementname).getText().split(splitstring)[position];
}

//return all values in a single column as a list
//used as poor mans UNIQUE to check which data already exists
function getColumnValues(sheet, colNum) {
    if (colNum == undefined) { colNum = 1 }
    //read all existing guid values to prevent duplicates later
    //getRange(row, column, numRows, numColumns)
    var temp = sheet.getRange(1, colNum, sheet.getLastRow(), 1).getValues();
    existingGuids = [];
    for (var i in temp) {
        if (i >= 1) {//dont need the header row
            existingGuids.push(temp[i][0]);
        }
    }
    return existingGuids
}

//returns the parsed XML from a RSS feed location
function getFeedDocument(url) {
    return XmlService.parse(UrlFetchApp.fetch(url).getContentText()).getRootElement();
}

function appendRowIfNotExists(spreadsheetId, sheetName, data, baseCurrency) {

    //where to write to
    sheet = SpreadsheetApp
        .openById(spreadsheetId)
        .getSheetByName(sheetName);

    //get all existing entries
    existingIdentifiers = getColumnValues(sheet);

    if (existingIdentifiers.indexOf(data.id) == -1) {
        sheet.appendRow([data.id,
        data.title,
        data.date,
        data.currency,
        baseCurrency + '/' + data.currency,
        data.rate,
        data.multiplier,
        ScriptApp.getScriptId(),
        new Date()]);
    }
}

//https://stackoverflow.com/a/22200230/9576512
function emailReport() {
    var charts = SpreadsheetApp.openById(output_spreadsheetId).getSheetByName('vizAMD-USD-EUR').getCharts();
    Logger.log(charts);
    if (charts.length > 0) {

        var chartBlobs = new Array(charts.length);
        var emailBody = "Charts<br>";
        var emailImages = {};
        for (var i = 0; i < charts.length; i++) {
            chartBlobs[i] = charts[i].getAs("image/png").setName("chartBlob" + i);
            emailBody = emailBody + "<img src='cid:chart" + i + "'><br>";
            emailImages["chart" + i] = chartBlobs[i];
        }

        MailApp.sendEmail({
            to: 'cprior@gmail.com',
            subject: 'chart',
            htmlBody: emailBody,
            inlineImages: emailImages
        });


    }
}


function init() {

    tocheck = [output_cbaam_sheetname, output_ecbusd_sheetname]

    for (var i = 0; i < tocheck.length; i++) {

        if (!SpreadsheetApp.openById(output_spreadsheetId).getSheetByName(tocheck[i])) {

            SpreadsheetApp.openById(output_spreadsheetId).insertSheet(tocheck[i], 0);

            j = 1;
            for (var column in datatemplate) {
                SpreadsheetApp.openById(output_spreadsheetId).getSheetByName(tocheck[i]).getRange(1, j).setValue(column);
                j++;
            }

        }

    }

}