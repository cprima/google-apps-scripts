/**
 * Automated handling of forex exchange rate processing.
 *
 * @author: Christian Prior-Mamulyan <cprior@gmail.com>
 * @license: MIT
 *
 */


//to be called from triggers
function main() {
    doCbaam()
    doEcb()
    updateGraphFile()
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
    init();
    if (isArmenianworkingday()) {
        //read RSS
        root = getFeedDocument(input_cbaam_feedurl);

        if (root !== false) {
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
    }//end if isArmenianworkingday()
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
    init();
    if (isGermanbankworkingday()) {
        var ns = XmlService.getNamespace('http://purl.org/rss/1.0/');
        var dc = XmlService.getNamespace('http://purl.org/dc/elements/1.1/');
        var cb = XmlService.getNamespace('http://www.cbwiki.net/wiki/index.php/Specification_1.1');
        var rdf = XmlService.getNamespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

        //read RSS
        root = getFeedDocument(input_ecbusd_feedurl);

        if (root !== false) {
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
    }//end if isGermanbankworkingday()
}

//helper function to parse RSS feed XML data
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

    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    //var response = UrlFetchApp.fetch(url); //cba.am strangely returns with 200 but fetch fails hard
    var responseCode = response.getResponseCode();

    //cba.am sometimes returns with 200 when in fact:
    //Error occured , please check URLSystem.Net.WebException: Unable to connect to the remote server
    if (responseCode === 200) {
        try {
            return XmlService.parse(response.getContentText()).getRootElement()
        }
        catch (err) {
            return false
        }
    } else {
        return false
    }
}

//writing to a Google Sheets spreadsheet
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

//returns the first chart found in a given spreadsheet's sheet
//called by e.g. updateGraphFile()
function getChartBlob(sheetname) {
    var charts = SpreadsheetApp.openById(output_spreadsheetId).getSheetByName(sheetname).getCharts();
    if (charts.length > 0) {
        return charts[0].getAs("image/png");
    }
}

//returns the first chart found in a given spreadsheet's sheet
function getVisualizationChart(sheetname) {
    var charts = SpreadsheetApp.openById(output_spreadsheetId).getSheetByName(sheetname).getCharts();
    if (charts.length > 0) {
        return charts[0];
    }
}

//deprecated: sending emails upon Google Apps trigger
function emailReport() {
    //https://stackoverflow.com/a/22200230/9576512

    //legacy function
    var chart = getChartBlob('vizAMD-USD-EUR');
    var emailBody = "Charts<br>" + "<img src='cid:chart" + "'><br>";
    emailImages = {};
    emailImages["chart"] = chart;

    for (var i in output_report_mailaddresses) {
        MailApp.sendEmail({
            to: output_report_mailaddresses[i],
            subject: output_report_subject,
            htmlBody: emailBody,
            inlineImages: emailImages
        });
    }

    //current functionality 2020-06
    dispatchNewsletter()
}

//helper function to write a file to Gogle Drive
function updateGraphFile() {
    //http://drive.google.com/uc?id=1QmDis_Qzhy6DEdGTQ6exLRIKKGuGxCmY
    init();

    folder = DriveApp.getFolderById(output_spreadsheetId).getParents().next()

    var chart = getChartBlob(output_visualization_sheetname);

    try {
        var file = DriveApp.getFileById(output_chartfileid);
        //https://stackoverflow.com/a/24226885/9576512
        //Resources > Advanced Google services
        Drive.Files.update({ mimeType: 'image/png' }, file.getId(), chart);
    } catch (e) {
        folder.createFile(chart.setName(output_chartfilename))
    }

}

//function to set up the project when called initially. Also does basic init checks on each execution.
function init() {

    try {
        DriveApp.openById(output_spreadsheetId)
    } catch (e) {
        //     //fixme does not trigger
        //     errorHandler(e, 'init')
    }

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

// function errorHandler(e, functionname) {
//     throw new Error("An error occurred in " + functionname);
//     Logger.log(JSON.stringify(e))
// }


//call the mail sending function only if there is fresh data
function dispatchNewsletter() {

    init()

    dailyValues = getRange("processing", 1)
    var rateDate = dailyValues[1][0];

    var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
    var now = new Date();
    var from = new Date(now.getTime() - 1 * MILLIS_PER_DAY);
    var to = new Date(now.getTime());

    //if there is data fresher than the last day
    //var myBool = ( (1.1>=1.0) && (2==2) )
    //var myBool = ( (now >= rateDate) && ( from <= rateDate ) )
    if ((now >= rateDate) && (from <= rateDate)) { automateMailchimp() }
}


//helper function to handle missing data.
function setValueOrDefault(param, digits) {
    digits = typeof digits !== 'undefined' ? digits : 0;
    if (param == '') { return unknownExchangeRate }
    else if (typeof param == 'number') { return param.toFixed(digits) }
    else return param;
}

//making API calls to Mailchimp to create and send a campaign
//1. creates a campaign
//2. uploads the current chart visualization
//3. fills a Mailchimp template with current data
//4. sends the campaign
function automateMailchimp() {

    init()

    dailyValues = getRange("processing", 1)
    var rateDate = dailyValues[1][0];
    var AMDEUR_pair = setValueOrDefault(dailyValues[0][1]);
    var AMDUSD_pair = setValueOrDefault(dailyValues[0][2]);
    var EURUSD_pair = setValueOrDefault(dailyValues[0][6]);
    var AMDEUR_rate = setValueOrDefault(dailyValues[1][1], 2);
    var AMDUSD_rate = setValueOrDefault(dailyValues[1][2], 2);
    var EURUSD_rate = setValueOrDefault(dailyValues[1][6], 4);

    //https://developers.google.com/apps-script/reference/utilities/utilities#formatDate(Date,String,String)
    var rateFormattedDate = Utilities.formatDate(rateDate, "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
    var nowFormattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");


    //---------------------------------------------------------------------------------------------campaign

    subject_line = '[EUR/AMD/USD] ' + dailyValues[0][1] + ': ' + dailyValues[1][1].toFixed(2) + ' ' + dailyValues[0][2] + ': ' + dailyValues[1][2].toFixed(2) + ' ' + dailyValues[0][3] + ': ' + dailyValues[1][3].toFixed(4);

    var data = {
        "type": "regular",
        "recipients": mailchimp_recipients,
        "settings": { "subject_line": subject_line, "reply_to": "cprior@gmail.com", "from_name": "Christian Prior-Mamulyan" }
    }

    response = callMailchimpApi(mailchimp_baseurl + 'campaigns',
        'post',
        data);
    //Logger.log(response.getContentText());

    campaign_id = JSON.parse(response.getContentText())["id"]
    Logger.log("Campaign ID: " + campaign_id);


    //---------------------------------------------------------------------------------------------file

    //var chart = getChartBlob('vizAMD-USD-EUR');
    var chart2 = formatChartAsImage(getVisualizationChart('vizAMD-USD-EUR'));
    //var imageData = Utilities.base64Encode(chart.getAs('image/png').getBytes());
    var imageData2 = Utilities.base64Encode(chart2.getAs('image/png').getBytes());

    var data = {
        "name": "dailyForexAmdEurUsd_" + rateFormattedDate + ".png",
        "file_data": imageData2
    }

    //url='https://us10.api.mailchimp.com/3.0/file-manager/files'
    response = callMailchimpApi(mailchimp_baseurl + 'file-manager/files',
        'post',
        data);
    //Logger.log(response.getContentText());

    //file_id = JSON.parse(response.getContentText())["id"]
    file_full_size_url = JSON.parse(response.getContentText())["full_size_url"]
    //Logger.log('full size url: ' + file_full_size_url);


    //---------------------------------------------------------------------------------------------content

    var imageUrl = "<img width=\"680\" height=\"\" alt=\"Please allow pictures to view the chart.\" border=\"0\" src=\"" + file_full_size_url + "\" style=\"margin-bottom: 40px;\" />"
    var imageTag = '<img src="' + file_full_size_url + '" width="680" height="" alt="alt_text" border="0" style="width: 100%; max-width: 680px; height: auto; font-family: sans-serif; font-size: 15px; line-height: 15px; margin: auto; display: block;" class="g-img">';
    var data = {
        "template": {
            "id": mailchimp_templateid,
            "sections": {
                "title": "Daily EUR/AMD/USD",
                "subtitle": "Official rates from cba.am and ecb.europa.eu",
                "symbol_0": "֏/€",
                "rate_0": AMDEUR_rate,
                "pair_0": AMDEUR_pair,
                "symbol_1": "֏/$",
                "rate_1": AMDUSD_rate,
                "pair_1": AMDUSD_pair,
                "symbol_2": "€/$",
                "rate_2": EURUSD_rate,
                "pair_2": EURUSD_pair,
                "historicExchangeRatesTable": '<h2>Previous exchange rates</h2>' + getHtmlTable("processing", 4),
                "chart": '<h2>Visualization</h2>' + imageTag
            }
        }
    }

    //url='https://us10.api.mailchimp.com/3.0/campaigns/' + campaign_id + '/content'
    response = callMailchimpApi(mailchimp_baseurl + 'campaigns/' + campaign_id + '/content',
        'put',
        data);
    //Logger.log(response.getContentText());


    //---------------------------------------------------------------------------------------------send campaign

    var data = {}
    //url='https://us10.api.mailchimp.com/3.0/campaigns/' + campaign_id + '/actions/send'
    response = callMailchimpApi(mailchimp_baseurl + 'campaigns/' + campaign_id + '/actions/send',
        'post',
        data);
    // Logger.log(response.getContentText());

}

//helper function for the repeated API calls
//url must be the endpoint for the particular call
function callMailchimpApi(url, method, payload) {
    var options = {
        'method': method,
        'muteHttpExceptions': true,
        'headers': {
            'Authorization': 'apikey ' + mailchimp_apikey
        },
        'contentType': 'application/json',
        'payload': JSON.stringify(payload)
    };
    return UrlFetchApp.fetch(url, options);
}


//helper function to pull data from a Google Sheet
function getRange(sheetname, rows) {

    init();

    folder = DriveApp.getFolderById(output_spreadsheetId).getParents().next()
    var sheet = SpreadsheetApp.openById(output_spreadsheetId).getSheetByName(sheetname);
    var range = sheet.getRange(1, 1, rows + 1, sheet.getLastColumn());
    return values = range.getValues();
}

//takes a sheetname and number of rows, constructs HTML table string
function getHtmlTable(sheetname, rows) {
    values = getRange("processing", 10)
    firstpass = true
    //build an array
    values.forEach(function (item, index, array) {
        if (firstpass !== true) {
            array[index][0] = array[index][0].toISOString().slice(0, 10)
            array[index][1] = array[index][1].toFixed(2)
            array[index][2] = array[index][2].toFixed(2)
            array[index][3] = array[index][3].toFixed(4)
        }
        firstpass = false;
        //Logger.log(item)
    })
    //Logger.log(values)

    var cssTable = "text-align:center; margin:8px 0 30px; background-color:#eee8d5; width: 100%;"
    var cssTr = "";
    var cssTd = "padding:8px;";
    //https://stackoverflow.com/a/59833369
    firstpass = true;
    var htmlTable = values.reduce(function (s, e) {
        if (firstpass == true) { celltype = 'th' } else { celltype = 'td'; }
        firstpass = false;
        return s += "<tr style=\"" + cssTr + " \"><" + celltype + " style=\"" + cssTd + "\">" + e.join("</" + celltype + "><" + celltype + " style=\"" + cssTd + "\">") + "</" + celltype + "></tr>"
    }, "<table style=\"" + cssTable + "\" >") + "</table>";

    return htmlTable;
}


//charts from a Sheet are formatted unreliably. Better to channel them through a Slide presentation.
function formatChartAsImage(chart) {
    // https://stackoverflow.com/a/60487108

    // Insert sheets chart into slide as an embedded image
    var proxySaveSlide = SlidesApp.openById(temp_slidesID).getSlides()[0];
    var chartImage = proxySaveSlide.insertSheetsChartAsImage(chart, 0, 0, 1300, 1300);

    // Get image from slides
    var myimage = chartImage.getAs('image/png');

    // Delete image in presentation slide
    chartImage.remove();

    // Return the image
    return myimage;

}