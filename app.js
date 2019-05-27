const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-body');
const app = new Koa();

const sessions = []

const usersTable = []

function dbRegister(user) {
  usersTable.push(user)
}

function dbGet(user) {
  return usersTable.filter(u => u.eMail === user.eMail && u.keyWord === user.keyWord)[0]
}

app.use(bodyParser({
  multipart: true,
  urlencode: true
}));

router
  .post('/api/register', register)
  .post('/api/login', login)
  .get('/api/users', users);

async function register(ctx) {
  console.log(ctx.request.body)
  dbRegister(ctx.request.body)
  ctx.body = '{}'
}

async function login(ctx) {
  console.log(ctx.request.body);
  if (!dbGet(ctx.request.body)) {
    ctx.throw(403);
  } else {
    const cookieValue = "a" + Math.random()
    sessions.push(cookieValue)
    ctx.cookies.set("auth", cookieValue)
    ctx.body = '{}'
  }
}

async function users(ctx) {
  if (sessions.filter(s => ctx.request.header.cookie.replace('auth=', '') === s)[0])
    ctx.body = { usersTable: usersTable };
  else
    ctx.throw(403);
}

app.use(router.routes());
app.listen(3030);