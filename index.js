
/**
 * MailDev - index.js
 *
 * Author: Dan Farrelly <daniel.j.farrelly@gmail.com>
 * Licensed under the MIT License.
 */

const program = require('commander')
const pkg = require('./package.json')
const mailserver = require('./lib/mailserver')
const logger = require('./lib/logger')
const { options, appendOptions } = require('./lib/options')

module.exports = function (config) {
  const version = pkg.version

  if (!config) {
    // CLI
    config = appendOptions(program.version(version), options)
      .parse(process.argv)
  }

  if (config.verbose) {
    logger.setLevel(2)
  } else if (config.silent) {
    logger.setLevel(0)
  }

  // Start the Mailserver
  mailserver.create(
    config.smtp,
    config.ip,
    config.mailDirectory,
    config.incomingUser,
    config.incomingPass,
    config.hideExtensions
  )

  if (
    config.outgoingHost ||
    config.outgoingPort ||
    config.outgoingUser ||
    config.outgoingPass ||
    config.outgoingSecure
  ) {
    mailserver.setupOutgoing(
      config.outgoingHost,
      parseInt(config.outgoingPort),
      config.outgoingUser,
      config.outgoingPass,
      config.outgoingSecure
    )
  }

  if (config.autoRelay) {
    const emailAddress = typeof config.autoRelay === 'string' ? config.autoRelay : null
    mailserver.setAutoRelayMode(true, config.autoRelayRules, emailAddress)
  }

  if (config.mailDirectory) {
    mailserver.loadMailsFromDirectory()
  }

  function shutdown () {
    logger.info(`Received shutdown signal, shutting down now...`)
    mailserver.close(function () {
      process.exit(0)
    })
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)

  return mailserver
}
