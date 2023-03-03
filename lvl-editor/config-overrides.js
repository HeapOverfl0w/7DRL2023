const {aliasDangerous, aliasJest, configPaths} = require('react-app-rewire-alias/lib/aliasDangerous')

const aliasPaths = configPaths('./jsconfig.json')

module.exports = aliasDangerous(aliasPaths)
module.exports.jest = aliasJest(aliasPaths)