const mongoose=require("mongoose")

const Connection=async(username,password)=>{
    const URL=`mongodb+srv://${username}:${password}@cluster0.jva3xr4.mongodb.net/?retryWrites=true&w=majority`;
    try {
        await mongoose.connect(URL)
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error while connecting to the database ', error);
    }
}

module.exports=Connection