var request = require('request');
const notifier = require('node-notifier');
const path = require('path');
var emoji = require('node-emoji');

var currencies = {
    'aud': '$',
    'brl': '',
    'cad': '$',
    'aud': '',
    'chf': '',
    'clp': '',
    'cny': '',
    'czk': '',
    'dkk': '',
    'eur': '€',
    'gbp': '',
    'hkd': '',
    'huf': '',
    'idr': '',
    'ils': '',
    'inr': '',
    'jpy': '',
    'krw': '',
    'mxn': '',
    'myr': '',
    'nok': '',
    'nzd': '',
    'php': '',
    'pkr': '',
    'pln': '',
    'rub': '',
    'sek': '',
    'sgd': '',
    'thb': '',
    'try': '',
    'twd': '',
    'zar': '',
    'usd': '$'
};

function get_price(callback, currency) {
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
                    callback(null, parseFloat(body[0]["price_" + currency]).toFixed(2) + currencies[currency] + emoji.emojify(":small_red_triangle:"));
                }
                else {
                    callback(null, parseFloat(body[0]["price_" + currency]).toFixed(2) + currencies[currency] + emoji.emojify(":small_red_triangle_down:"));
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
            timeout: 15
        });
    }, "usd");
}, 60000);
