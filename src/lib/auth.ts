import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set");
}

const client = new MongoClient(uri);
const db = client.db("salonbook");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: {
        type: ["admin", "customer"],
        input: false,
        defaultValue: "customer",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    // Assignment requires min 6 chars; Better Auth's default is 8.
    minPasswordLength: 6,
  },
});
