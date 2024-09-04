import env from 'dotenv/config'
import mongoose from 'mongoose'
export const dbConnect = () => {
  mongoose.connect(process.env.MONGO_URL).then(()=>console.log('mongo is connected')
  ).catch(error=> console.log(`error from mongoDB ${error}`)
  )
}