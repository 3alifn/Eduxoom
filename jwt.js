var jwt=  require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

public.get('/set/jwt/', (req, res)=>{
var token= jwt.sign(
  {name: 'mr. bean', age: 56}, 'pipilika',
  {expiresIn: '10s'}
)
app.locals.token= token;
localStorage.setItem('tokenx', token)

res.json({token})


})

public.get('/get/jwt/', (req, res)=>{
const token= localStorage.getItem('tokenx')
  jwt.verify(token, 'pipilika', (err, decoded) => {
    if (err) res.json({err})
    
   else res.json({decoded})
});


});
