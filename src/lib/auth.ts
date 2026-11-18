
import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set")
}

const client = new MongoClient(uri)
const db = client.db("salonbook")

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      role: {
        type: ["admin", "customer"],
        required: false,
        input: false,
        defaultValue: "customer",
      },

      isBlocked: {
        type: "boolean",
        required: false,
        input: false,
        defaultValue: false,
      },

      phone: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
})
