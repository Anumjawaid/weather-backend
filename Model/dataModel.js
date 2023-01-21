module.exports = (mongoose) => {
    // const cityData = new mongoose.Schema({
    //     Name: {
    //         type: String,
    //         required: true
    //     },
    //     data: {
    //         type: StIbjectring,
    //         required: true
    //     }
    // });
    let YourSchema = new mongoose.Schema({
        Name: {
            type: String,
            required: true
        },
        detail: {
            type: mongoose.SchemaTypes.Mixed,
            required: true
        }
       // inventoryDetails: mongoose.Schema.Types.Mixed
      })
      
     

    return YourSchema;
}