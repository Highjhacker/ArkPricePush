var request = require('request');
const notifier = require('node-notifier');
const path = require('path');
var emoji = require('node-emoji');

function get_price(callback) {
    request({url: 'https://api.coinmarketcap.com/v1/ticker/ark/', json:true}, function(error, response, body) {

        if (error) {
            return callback(error);
        }
        try {
            if (parseFloat(body[0].percent_change_1h) > 0.00) {
                callback(null, body[0].price_usd + "$ " + emoji.emojify(":small_red_triangle:"));
            }
            else {
                callback(null, body[0].price_usd + "$ " + emoji.emojify(":small_red_triangle_down:"));
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
    });
}, 60000);
