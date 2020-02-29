
//per-installation configuration
var output_spreadsheetId = "1phpfJD2aPkxjL5KUg_OMSdJ3q80UtW5YuA34v3mFVjw"

//general
var output_report_mailaddresses = ["cprior@gmail.com", "arminemamulyan1@gmail.com"];
var datatemplate = {
    guid: '',
    title: '',
    date: new Date(),
    currency: '',
    pair: '',
    rate: new Number(),
    multiplier: new Number(),
    scriptId: '',
    created_at: new Date()
};

//cba
var input_cbaam_feedurl = "https://www.cba.am/_layouts/rssreader.aspx?rss=280F57B8-763C-4EE4-90E0-8136C13E47DA";
var output_cbaam_sheetname = 'cba.am';
var process_cbaam_currencies = ["EUR", "USD"];

//ecb
var input_ecbusd_feedurl = "https://www.ecb.europa.eu/rss/fxref-usd.html";
var output_ecbusd_sheetname = 'ecb';
