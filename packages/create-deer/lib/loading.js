const ora = require('ora');

function Spinner(text) {
  const opts = { 
    spinner: 'dots',
    text
  };

  return ora(opts);
}


module.exports = Spinner;