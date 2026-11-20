import { betterAuth } from "better-auth"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set")
}

// Reuse one MongoClient across serverless invocations so a closed
// connection is never kept around.
const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient
}

const client = globalForMongo.mongoClient ?? new MongoClient(uri)
globalForMongo.mongoClient = client

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
        input: true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Only enforce the extra complexity rules on email/password sign-up.
      if (ctx.path !== "/sign-up/email") {
        return
      }

      const body: unknown = ctx.body
      const password =
        body && typeof body === "object" && "password" in body
          ? (body as { password?: unknown }).password
          : undefined

      if (typeof password !== "string" || password.length === 0) {
        throw new APIError("BAD_REQUEST", {
          message: "Password is required.",
        })
      }

      // Same rules the client form enforces - this is the server-side backstop.
      if (password.length < 6) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must contain at least 6 characters.",
        })
      }

      if (!/[A-Z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must contain one uppercase letter.",
        })
      }

      if (!/[a-z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must contain one lowercase letter.",
        })
      }
    }),
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
})
