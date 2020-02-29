
/**
 * Helper functions to calculate bank working days in Armenia and Germany.
 *
 * @author: Christian Prior-Mamulyan <cprior@gmail.com>
 * @license: MIT
 *
 */

/**
* Calculates Easter in the Gregorian/Western (Catholic and Protestant) calendar 
* based on the algorithm by Oudin (1940) from http://www.tondering.dk/claus/cal/easter.php
* @returns {array} [int month, int day]
* @see https://gist.github.com/johndyer/0dffbdd98c2046f41180c051f378f343
*/
function getEaster(year) {
    var f = Math.floor,
        // Golden Number - 1
        G = year % 19,
        C = f(year / 100),
        // related to Epact
        H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
        // number of days from 21 March to the Paschal full moon
        I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
        // weekday for the Paschal full moon
        J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
        // number of days from 21 March to the Sunday on or before the Paschal full moon
        L = I - J,
        month = 3 + f((L + 40) / 44),
        day = L + 28 - 31 * f(month / 4);

    //return [month, day];
    return new Date(year, month - 1, day)
}

function getKarfreitag(year) {
    e = getEaster(year);
    dt = new Date(e);
    dt.setDate(dt.getDate() - 2);
    return dt;

}

function getOstermontag(year) {
    e = getEaster(year);
    dt = new Date(e);
    dt.setDate(dt.getDate() + 1);
    return dt;
}

function getHimmelfahrt(year) {
    e = getEaster(year);
    dt = new Date(e);
    dt.setDate(dt.getDate() + 39);
    return dt;
}

function getPfingstsonntag(year) {
    e = getEaster(year);
    dt = new Date(e);
    dt.setDate(dt.getDate() + 49);
    return dt;
}

function getPfingstmontag(year) {
    e = getEaster(year);
    dt = new Date(e);
    dt.setDate(dt.getDate() + 49 + 1);
    return dt;
}

function getNeujahr(year) {
    return new Date(year, 0, 1);
}

function getTagderarbeit(year) {
    return new Date(year, 4, 1);
}

function getTagderdeutscheneinheit(year) {
    return new Date(year, 9, 3);
}

function getHeiligabend(year) {
    return new Date(year, 11, 24);
}

function getWeihnachtsfeiertag1(year) {
    return new Date(year, 11, 25);
}

function getWeihnachtsfeiertag2(year) {
    return new Date(year, 11, 26);
}

function getSilvester(year) {
    return new Date(year, 11, 31);
}

//returns true if Jan 1st or Good Friday or Easter or easter Monday or
//Ascencion day or Whit Sunday or monday after Whit Sunday or May 1st or
// Oct 3rd or Dec 25th or Dec 25th
function isGermannationwideholiday(year, month, day) {
    dt = new Date(year, month - 1, day);
    if (dt.getTime() === getEaster(year).getTime()
        || dt.getTime() === getKarfreitag(year).getTime()
        || dt.getTime() === getOstermontag(year).getTime()
        || dt.getTime() === getHimmelfahrt(year).getTime()
        || dt.getTime() === getPfingstsonntag(year).getTime()
        || dt.getTime() === getPfingstmontag(year).getTime()
        || dt.getTime() === getNeujahr(year).getTime()
        || dt.getTime() === getTagderarbeit(year).getTime()
        || dt.getTime() === getTagderdeutscheneinheit(year).getTime()
        || dt.getTime() === getWeihnachtsfeiertag1(year).getTime()
        || dt.getTime() === getWeihnachtsfeiertag2(year).getTime()) {
        return true
    } else {
        return false
    }
}

//returns true if monday thru friday and not a nationwide holiday
function isGermanworkingday(year, month, day) {
    dt = new Date(year, month - 1, day);
    if (dt.getDay() != 6 && dt.getDay() != 0
        && isGermannationwideholiday(year, month, day) === false) {
        return true;
    } else { return false; }
}

//returns true if monday thru friday and not a nationwide German holiday and not Dec 24th and not Dec 31st
function isGermanbankworkingday(year, month, day) {
    dt = new Date(year, month - 1, day);
    if (isGermanworkingday(year, month, day) === true
        && dt.getTime() !== getHeiligabend(year).getTime()
        && dt.getTime() !== getSilvester(year).getTime()) {
        return true;
    } else { return false; }
}

//returns true for sixteen fiexed dates througout the year
function isArmenianPublicholiday(year, month, day) {
    dt = new Date(year, month - 1, day);
    console.log(dt)
    if (dt.getTime() === new Date(year, 0, 1).getTime()
        || dt.getTime() === new Date(year, 0, 2).getTime()
        || dt.getTime() === new Date(year, 0, 3).getTime()
        || dt.getTime() === new Date(year, 0, 4).getTime()
        || dt.getTime() === new Date(year, 0, 5).getTime()
        || dt.getTime() === new Date(year, 0, 6).getTime()
        || dt.getTime() === new Date(year, 0, 7).getTime()
        || dt.getTime() === new Date(year, 0, 28).getTime()
        || dt.getTime() === new Date(year, 2, 8).getTime()
        || dt.getTime() === new Date(year, 3, 24).getTime()
        || dt.getTime() === new Date(year, 4, 1).getTime()
        || dt.getTime() === new Date(year, 4, 9).getTime()
        || dt.getTime() === new Date(year, 4, 28).getTime()
        || dt.getTime() === new Date(year, 6, 5).getTime()
        || dt.getTime() === new Date(year, 8, 21).getTime()
        || dt.getTime() === new Date(year, 11, 31).getTime()) {
        return true;
    } else { return false; }
}

//returns true if Mon-Fri and not an Armenian holiday
function isArmenianworkingday(year, month, day) {
    dt = new Date(year, month - 1, day);
    if (dt.getDay() != 6
        && dt.getDay() != 0
        && isArmenianPublicholiday(year, month, day) === false) {
        return true;
    } else { return false; }
}