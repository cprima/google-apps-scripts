
//per-installation configuration
var output_spreadsheetId = "1phpfJD2aPkxjL5KUg_OMSdJ3q80UtW5YuA34v3mFVjw"
var output_chartfileid = "1AnA9VFFnOrQK4cwJDFSJV2D7qD_jV5vT"
var temp_slidesID="1aziADlOlUSfF7tJCE19CnZd5fOvxXwdOLvY5gT848uc";
var output_chartfilename = "AMD-EUR-USD.png";

//general
var output_report_mailaddresses = ["cprior@gmail.com", "arminemamulyan1@gmail.com"];
var output_report_subject = "Daily AMD/USD/EUR graph";
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
var unknownExchangeRate = '-';

//cba
var input_cbaam_feedurl = "https://www.cba.am/_layouts/rssreader.aspx?rss=280F57B8-763C-4EE4-90E0-8136C13E47DA";
var output_cbaam_sheetname = 'cba.am';
var process_cbaam_currencies = ["EUR", "USD"];

//ecb
var input_ecbusd_feedurl = "https://www.ecb.europa.eu/rss/fxref-usd.html";
var output_ecbusd_sheetname = 'ecb';

//visualization
var output_visualization_sheetname = 'vizAMD-USD-EUR';

//mailchimp
var url = "https://us10.api.mailchimp.com/3.0/";
var mailchimp_baseurl = url;
var mailchimp_recipients = {"list_id": "448978308e", "segment_opts": {'saved_segment_id': 204165}}
var apikey = "fa19f483fbb0ce911f24c48c6dcfe539-us10";
var mailchimp_apikey = "fa19f483fbb0ce911f24c48c6dcfe539-us10";
var mailchimp_templateid = 377133;