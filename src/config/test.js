const bcrypt = require("bcrypt");
const password = "Ankit#123";

bcrypt.hash(password, 10).then((hash) => {
  console.log(hash);

  bcrypt.compare(password, hash).then((res) => {
    console.log(res);
  });
});
