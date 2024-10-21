const { fileActions } = require('./index');


fileActions().then(results => {
    console.log('Results:', results);
}).catch(err => {
    console.error('Error:', err);
});