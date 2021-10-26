module.exports.options = [
  // flag, environment variable, description, default value, function
  ['-s, --smtp <port>', 'MAILDEV_SMTP_PORT', 'SMTP port to catch emails', '1025'],
  ['--mail-directory <path>', 'MAILDEV_MAIL_DIRECTORY', 'Directory for persisting mails'],
  ['--https', 'MAILDEV_HTTPS', 'Switch from http to https protocol', false],
  ['--https-key <file>', 'MAILDEV_HTTPS_KEY', 'The file path to the ssl private key'],
  ['--https-cert <file>', 'MAILDEV_HTTPS_CERT', 'The file path to the ssl cert file'],
  ['--ip <ip address>', 'MAILDEV_IP', 'IP Address to bind SMTP service to', '0.0.0.0'],
  ['--incoming-user <user>', 'MAILDEV_INCOMING_USER', 'SMTP user for incoming emails'],
  ['--incoming-pass <pass>', 'MAILDEV_INCOMING_PASS', 'SMTP password for incoming emails'],
  ['--base-pathname <path>', 'MAILDEV_BASE_PATHNAME', 'Base path for URLs'],
  ['--hide-extensions <extensions>',
    'MAILDEV_HIDE_EXTENSIONS',
    'Comma separated list of SMTP extensions to NOT advertise (SMTPUTF8, PIPELINING, 8BITMIME)',
    [],
    function (val) {
      return val.split(',')
    }
  ],
  ['-v, --verbose'],
  ['--silent']
]

module.exports.appendOptions = function (program, options) {
  return options.reduce(function (chain, option) {
    const flag = option[0]
    const envVariable = option[1]
    const description = option[2]
    const defaultValue = process.env[envVariable] || option[3]
    const fn = option[4]
    if (fn) {
      return chain.option(flag, description, fn, defaultValue)
    }
    return chain.option(flag, description, defaultValue)
  }, program)
}
