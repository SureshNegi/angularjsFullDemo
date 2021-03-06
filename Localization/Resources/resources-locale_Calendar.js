﻿var locales = {
    fr: {
        "DATETIME_FORMATS": {
            "AMPMS": [
              "AM",
              "PM"
            ],
            "DAY": [
              "Dimanche",
              "Lundi",
              "Mardi",
              "Mercredi",
              "Jeudi",
              "Vendredi",
              "Samedi"
            ],
            "ERANAMES": [
              "avant J\u00e9sus-Christ",
              "apr\u00e8s J\u00e9sus-Christ"
            ],
            "ERAS": [
              "av. J.-C.",
              "ap. J.-C."
            ],
            "FIRSTDAYOFWEEK": 0,
            "MONTH": [
              "Janvier",
              "F\u00e9vrier",
                "Mars",
                "Avril",
              "Mai",
              "Juin",
              "Juillet",
              "Ao\u00fbt",
              "Septembre",
              "Octobre",
              "Novembre",
              "D\u00e9cembre"
            ],
            "SHORTDAY": [
              "Dim",
              "Lun",
              "Mar",
              "Mer",
              "Jeu",
              "Ven",
              "Sam"
            ],
            "SHORTMONTH": [
              "Janv",
              "F\u00e9vr",
              "Mars",
              "Avr",
              "Mai",
              "Juin",
              "Juil",
              "Ao\u00fbt",
              "Sept",
              "Oct",
              "Nov",
              "D\u00e9c"
            ],
            "WEEKENDRANGE": [
              5,
              6
            ],
            "fullDate": "EEEE d MMMM y",
            "longDate": "d MMMM y",
            "medium": "d MMM y HH:mm:ss",
            "mediumDate": "d MMM y",
            "mediumTime": "HH:mm:ss",
            "short": "dd/MM/y HH:mm",
            "shortDate": "dd/MM/y",
            "shortTime": "HH:mm"
        },
        "NUMBER_FORMATS": {
            "CURRENCY_SYM": "\u20ac",
            "DECIMAL_SEP": ",",
            "GROUP_SEP": "\u00a0",
            "PATTERNS": [
                  {
                      "gSize": 3,
                      "lgSize": 3,
                      "maxFrac": 3,
                      "minFrac": 0,
                      "minInt": 1,
                      "negPre": "-",
                      "negSuf": "",
                      "posPre": "",
                      "posSuf": ""
                  },
                {
                    "gSize": 3,
                    "lgSize": 3,
                    "maxFrac": 2,
                    "minFrac": 2,
                    "minInt": 1,
                    "negPre": "-",
                    "negSuf": "\u00a0\u00a4",
                    "posPre": "",
                    "posSuf": "\u00a0\u00a4"
                }
            ]
        },
        "id": "fr-fr",
        "pluralCat": function (n, opt_precision) {
            var i = n | 0; if (i == 0 || i == 1) {
                return PLURAL_CATEGORY.ONE;
            } return PLURAL_CATEGORY.OTHER;
        }
    },
    en: {
        "DATETIME_FORMATS": {
            "AMPMS": [
              "AM",
              "PM"
            ],
            "DAY": [
              "Sunday",
              "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
              "Friday",
              "Saturday"
            ],
            "ERANAMES": [
              "Before Christ",
              "Anno Domini"
            ],
            "ERAS": [
              "BC",
              "AD"
            ],
            "FIRSTDAYOFWEEK": 6,
            "MONTH": [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ],
            "SHORTDAY": [
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat"
            ],
            "SHORTMONTH": [
              "Jan",
              "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
            ],
            "WEEKENDRANGE": [
              5,
              6
            ],
            "fullDate": "EEEE, MMMM d, y",
            "longDate": "MMMM d, y",
            "medium": "MMM d, y h:mm:ss a",
            "mediumDate": "MMM d, y",
            "mediumTime": "h:mm:ss a",
            "short": "M/d/yy h:mm a",
            "shortDate": "M/d/yy",
            "shortTime": "h:mm a"
        },
        "NUMBER_FORMATS": {
            "CURRENCY_SYM": "$",
            "DECIMAL_SEP": ".",
            "GROUP_SEP": ",",
            "PATTERNS": [
                  {
                      "gSize": 3,
                      "lgSize": 3,
                      "maxFrac": 3,
                      "minFrac": 0,
                      "minInt": 1,
                      "negPre": "-",
                      "negSuf": "",
                      "posPre": "",
                      "posSuf": ""
                  },
        {
            "gSize": 3,
            "lgSize": 3,
            "maxFrac": 2,
            "minFrac": 2,
            "minInt": 1,
            "negPre": "-\u00a4",
            "negSuf": "",
            "posPre": "\u00a4",
            "posSuf": ""
        }
            ]
        },
        "id": "en",
        "pluralCat": function (n, opt_precision) { var i = n | 0; var vf = getVF(n, opt_precision); if (i == 1 && vf.v == 0) { return PLURAL_CATEGORY.ONE; } return PLURAL_CATEGORY.OTHER; }
    }

};