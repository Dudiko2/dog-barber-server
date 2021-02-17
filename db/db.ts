import mongoose from "mongoose";

export const connectDB = async () => {
	import("./models/client"); // build models
	import("./models/appointment");

	return await mongoose.connect(process.env.MONGO_URI as string, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});
};
