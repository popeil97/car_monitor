var node_mailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
    auth: {
        api_user: 'popeil97', // Sendgrid username
        api_key: 'Cooper97!' // Sendgrid password
    }
};

var client = node_mailer.createTransport(sgTransport(options));

module.exports = {

    send_email: function(email_template) {
        console.log("hit");
        client.sendMail(email_template, function(err, info) {
            if(err) {
                console.log(err);
            }

            else {
                console.log(info);
            }
        });
    }

}