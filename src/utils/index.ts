const extractIdFormParams = (param :string)=>{
    return param.split("-").pop();
}


export{
    extractIdFormParams
}
