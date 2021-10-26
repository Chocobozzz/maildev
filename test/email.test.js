/* global describe, it */
'use strict'

/**
 * MailDev - email.js -- test the email output
 */

const assert = require('assert')
const nodemailer = require('nodemailer')

const MailDev = require('../index.js')

const defaultMailDevOpts = {
  silent: true
}

const defaultNodemailerOpts = {
  port: 1025,
  ignoreTLS: true
}

describe('email', function () {
  it('should stripe javascript from emails', function (done) {
    const maildev = new MailDev(defaultMailDevOpts)
    const transporter = nodemailer.createTransport(defaultNodemailerOpts)

    const email = {
      from: 'johnny.utah@fbi.gov',
      to: 'bodhi@gmail.com',
      subject: 'Test cid replacement #1',
      text: 'The wax at the bank was surfer wax!!!',
      html: '<!DOCTYPE html><html><head></head><body>' +
            '<script type=\'text/javascript\'>alert("Hello World")</script>' +
            '<p>The wax at the bank was surfer wax!!!</p>' +
            '</body></html>'
    }

    maildev.on('new', function (email) {
      maildev.getEmailHTML(email.id, function (_, html) {
        assert.strictEqual(html, '<!DOCTYPE html><html><head></head><body><p>The wax at the bank was surfer wax!!!</p></body></html>')
        maildev.close(function () {
          maildev.removeAllListeners()
          transporter.close()
          done()
        })
      })
    })

    maildev.listen(function (err) {
      if (err) return done(err)
      transporter.sendMail(email)
    })
  })
})
