app.js

第4行 var cookieParser = require('cookie-parser');
第30行 app.use(cookieParser());

set cookie:
第179行 res.cookie('name', account);

access cookie:
第60行 console.log(req.cookies.name)

delete cookie:
第53行 res.clearCookie('name');

index.html
把 Logout 的 href從 login.html 改成 / (如此一來每次點logout 就會跳到 /, 53行的delete cookie就會清除原本的name)
