import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { MongoClient } from 'mongodb'; //Switch to Mongoose Todo
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { compare } from 'bcryptjs';
import clientPromise from '../../../mongo/mongodb';

// For api calls without cert
//const https = require('https')
//const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default NextAuth({
	// //Configure JWT
	session: {
		strategy: "jwt"
	},
	adapter: MongoDBAdapter(clientPromise),

	//Specify Provider
	providers: [
		CredentialsProvider({
			credentials: {
				email: { label: 'email', type: 'text' },
				password: { label: 'password', type: 'password' },
				fName: { label: 'first-name', type: 'text' },
				lName: { label: 'last-name', type: 'text' }
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
					email: credentials.email
				});
				console.log('serv-res', result);
				//Not found - send error res
				if (!result) {
					client.close();
					throw new Error('No user found with the email');
				}
				//Check hased password with DB password
				const checkPassword = await compare(
					credentials.password,
					result.password
				);
				console.log('Email + Pwd Compare:' + checkPassword);
				//Incorrect password - send response
				if (!checkPassword) {
					client.close();
					throw new Error('Password doesnt match');
				}
				//Else send success response
				client.close();

				return { email: result.email };
			}
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET
		})
	],
	secret: process.env.JWT_SECRET_KEY,
	pages: {
		signIn: '/',
		error: '/auth/error', // Error code passed in query string as ?error=
	},
	debug: true,
	callbacks: {
		async jwt({token, account, profile}){
			if(account && profile){
				const userEmail = profile.email
				const accId = account.providerAccountId

				const client = await MongoClient.connect(process.env.MONGODB_URI, {
					useNewUrlParser: true,
					useUnifiedTopology: true
				});

				const accounts = await client.db().collection('accounts');
				const users = await client.db().collection('users');

				let fedUser = await accounts.findOne({provider: account.provider, providerAccountId: accId })
				let dbUser = await users.findOne({email: userEmail})
				client.close();
				if(fedUser){
					token.name = profile.name
					token.email = userEmail
					token.sub = accId
					token.picture = profile.picture
					if(fedUser && dbUser) {
						token.role = dbUser.userType
					} else {
						token.role = 2 // Default User Role
					}
				}
			}
			return token
		},
		async session({ session, token }) {
			if (token) {
				// ROLES: 0 (admin)    1 (manager)  2 (staff)   3(tenant)  100(Register Form Select Error)
				if (token?.role) {
					if (token.role == 0) {
						session.user.role = 'admin';
					} else if (token.role === 1) {
						session.user.role = 'manager';
					} else if (token.role === 2) { // Default User Role
						session.user.role = 'staff';
					} else if (token.role === 3) {
						session.user.role = 'tenant';
					}
				} else {
					session.user.role = 'staff'
				}
			}
			return session
		},
		async redirect({url, baseUrl}) {
			return new URL('/app/dashboard', baseUrl)
		}
	}
});