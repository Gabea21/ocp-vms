import NextAuth from 'next-auth';
import CredentialsProvider  from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { MongoClient } from 'mongodb';  //Switch to Mongoose Todo
import { compare } from 'bcryptjs';

export default NextAuth({
    //Configure JWT
    session: {
        jwt: true,
    },
    //Specify Provider
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "email", type: "text" },
                password: {  label: "password", type: "password" },
                fName: {  label: "first-name", type: "text" },
                lName: {  label: "last-name", type: "text" }

              },
                async authorize(credentials) {
                    //Connect to DB
                    const client = await MongoClient.connect(
                        process.env.MONGODB_URI,
                        { useNewUrlParser: true, useUnifiedTopology: true }
                    );
                    //Get all the users
                    const users = await client.db().collection('users');
                    //Find user with the email  
                    const result = await users.findOne({
                        email: credentials.email,
                    });
                    console.log('serv-res', result)
                    //Not found - send error res
                    if (!result) {
                        client.close();
                        throw new Error('No user found with the email');
                    }
                    //Check hased password with DB password
                    const checkPassword = await compare(credentials.password, result.password);
                    console.log('Email + Pwd Compare:' + checkPassword)
                    //Incorrect password - send response
                    if (!checkPassword) {
                        client.close();
                        throw new Error('Password doesnt match');
                    }
                    //Else send success response
                    client.close();

                    return { email: result.email };
            },
        }),
        GoogleProvider({ //New
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                  prompt: "consent",
                  access_type: "offline",
                  response_type: "code"
                }
              }
          }),
        
    ],
    secret: process.env.JWT_SECRET_KEY,

    // jwt:{ // New
    //     encrypton: true
    // },
    // callbacks: { //new
    //     async jwt(token, account) {
    //         console.log(token,account)
    //       if (account?.accessToken) {
    //         token.accessToken = account.accessToken;
    //       }
    //       return token;
    //     },
    //     redirect: async (url, _baseUrl) => {
    //       if (url === '/profile') {
    //         return Promise.resolve('/');
    //       }
    //       return Promise.resolve('/');
    //     },
    // }, 

    pages: {
		signIn: "/auth/login",
	},
	debug: true,
});