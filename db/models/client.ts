import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

import { IClientDocument, IClientModel } from "./@types/client";

const clientSchema = new Schema<IClientDocument, IClientModel>({
	fname: {
		type: String,
		required: true,
		trim: true,
	},
	username: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
	},
	appointments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Appointment",
		},
	],
});

clientSchema.methods.toJSON = function () {
	const client = this;
	const clientObject = client.toObject();
	const { password, ...rest } = clientObject;

	return rest;
};

clientSchema.methods.verifyPassword = async function (password: string) {
	const hashedPassword = this.password;
	const match = await bcrypt.compare(password, hashedPassword);

	return match;
};

clientSchema.statics.getByUsername = function (username: string) {
	return this.findOne({ username });
};

clientSchema.pre("save", async function (next) {
	const client = this;
	if (client.isModified("password")) {
		client.password = await bcrypt.hash(client.password, 8);
	}
	next();
});

const Client = model<IClientDocument, IClientModel>("Client", clientSchema);

export default Client;
