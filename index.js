const request = require('request');
const notifier = require('node-notifier');
const path = require('path');
const emoji = require('node-emoji');
var fs = require('fs');
var moment = require('moment');

const currencies = {
    "usd": "\u0024",
    "eur": "\u20AC",
    "aud": "\u0024",
    "gbp": "\u00A3",
    "jpy": "\u00A5",
    "brl": "R\u0024",
    "cad": "\u0024",
    "chf": "CHF",
    "clp": "\u0024",
    "cny": "\u00A5",
    "czk": "CZK",
    "dkk": "DKK",
    "hkd": "HK\u0024",
    "huf": "HUF",
    "idr": "Rp",
    "ils": "\u20AA",
    "inr": "\u20B9",
    "krw": "\u20A9",
    "mxn": "\u0024",
    "myr": "MYR",
    "nok": "NOK",
    "nzd": "NZD",
    "php": "\u20B1",
    "pkr": "\u20A8",
    "pln": "\u007A\u0142",
    "rub": "\u20BD",
    "sek": "SEK",
    "sgd": "S\u0024",
    "thb": "\u0E3F",
    "try": "\u20BA",
    "twd": "NT\u0024",
    "zar": "ZAR"
};

function get_price(callback, currency) {
    // currency = process.argv[2]; // Pour le CLI
    request({
        url: "https://api.coinmarketcap.com/v1/ticker/ark/?convert=" + (currency ? currency : ''),
        json:true
        },
        function(error, response, body) {
            if (error) {
                return callback(error);
            }
            try {

                if (parseFloat(body[0].percent_change_1h) > 0.00) {
                    callback(null, parseFloat(body[0]["price_" + currency]).toFixed(2) + " " +  currencies[currency] + " " +emoji.emojify(":small_red_triangle:"));
                }
                else {
                    callback(null, parseFloat(body[0]["price_" + currency]).toFixed(2) + " " + currencies[currency] + " " + emoji.emojify(":small_red_triangle_down:"));
                }
            } catch (ex) {
                callback(ex);
            }
    });
}

setInterval(function() {
    get_price(function (err, data) {
        notifier.notify({
            title: 'Ark Price',
            message: 'Ark price is ' + data,
            icon: path.join(__dirname, 'logo.png'),
            timeout: 10,
            wait: true
        });
        fs.appendFile("logs.txt", moment().toLocaleString() + " : " + data + "\n", function(error) {
            if (error) {
                console.log(error);
            }
            console.log("Writed to file.");
        });
    }, "usd");
}, 60000);