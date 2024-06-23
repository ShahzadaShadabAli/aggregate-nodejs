import express from "express"
import mongoose from "mongoose"
import Review from "./reviewsModel.js"

const app = express()

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://yourusername:yourpassword@cluster0.ll8hkwp.mongodb.net/yourdbname?retryWrites=true&w=majority&appName=Cluster0')
        if (conn) {
            console.log("Database Connected Successfully")
        }
    } catch (error) {
        console.log(error.message)
    }
}

connectDB()

app.get('/', (req, res) => {
    res.send("<h1>Hello World</h1>")
})

//Get the reviews of cake
app.get("/getReviews", async (req, res) => {
    try {
        const product = req.query.product
        const date = req.query.date
        const startTime = new Date(date);
        startTime.setHours(0, 0, 0, 0);

        const endTime = new Date(date);
        endTime.setHours(23, 59, 59, 999);
        const pipeline = [
            //Matching
            {
                $match: {
                    dateCreated: {
                        $gte: startTime,
                        $lt: endTime
                    },
                    product: product
                }
            },
            //Grouping
            {
                $group: {
                    _id: "$stars",
                    count: { $sum: 1 },
                    product: { $first: "$product" }
                }
            },
            //Sorting
            {
                $sort: { dateCreated: -1 }
            }

        ]
        const reviews = await Review.aggregate(pipeline)
        res.status(200).json(reviews)
    } catch (error) {
        res.status(400).json(error.message)
    }
})




app.listen(5000, console.log("Running on 5000"))
