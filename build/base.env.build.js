/**
 * Created by LiRui on 2019/6/24.
 */
const fs = require('fs')
const utils = require('./utils')
const project = utils.projectEnv()
fs.writeFileSync('build/env.js', `export default '${project}'`)
