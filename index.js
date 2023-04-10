const server=require("./api/server")
const {PORT}=require("./config/config")

server.listen(PORT, ()=>{
    console.log(`Server ${PORT} da çalışıyor`)
})