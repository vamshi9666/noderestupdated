module.exports.successRes=(code,data,message)=>{
    return {
        code,
        data,
        message,
        success:true

    }
}
module.exports.failRes=(code,data,message)=>{
    return {
        code,
        data,
        message,
        success:false

    }
}