const usersR=require("./users")
const toysR=require("./toys")

exports.routesInit=(app)=>{
    app.use("/toys",toysR)
    app.use("/users",usersR)
}
