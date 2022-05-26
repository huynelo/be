const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const moment = require('moment');
const { numberWithCommas } = require('../utils/helpers');
require('dotenv/config');

const sendEmail = async (data) => {
  // console.log('data sending:', data);

  const readHTMLFile = function(path, result) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
      if (err) {
        throw err;
      } else {
        result(null, html);
      }
    });
  };

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'support@hotspotasian.com',
      pass: 'jwjielkixxxhuaag'
    }
  });

  const templateEmailComfirmationPayment = path.join(__dirname, '../../public/templates/email-confirm-payment.html');
  readHTMLFile(templateEmailComfirmationPayment, async function(err, html) {
    const template = handlebars.compile(html);
    const replacements = {
      firstName: data.firstName,
      lastName: data.lastName,
      rentDays: data.rentDays,
      bookingId: data.bookingId,
      bookingDate: moment(data.createdAt).format('DD MMM YYYY, HH:mm'),
      packageName: data.packageName,
      price: data.price,
      quantity: data.quantity,
      hotelName: data.hotelName,
      address: data.address,
      city: data.city,
      country: data.country,
      total: numberWithCommas(data.total),
      deposit: data.deposit,
      notes: data.notes,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      arrivalTime: data.arrivalTime,
      departTime: data.departTime,
    };

    const htmlToSend = await template(replacements);
    const mailOptions = {
      from: '"Hotspot Asian" <support@hotspotasian.com>',
      to : data.email,
      subject : '[Hotspot Asian] Booking Confirmation',
      cc: "support@hotspotasian.com",
      html : htmlToSend
    };

    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        throw err;
      }
      // console.log(response);
    });
  });
}

module.exports = {
  sendEmail,
};
