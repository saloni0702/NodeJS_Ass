const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(`Please Enter your name `, name => {
  console.log(`${name}`);
  readline.close();
});