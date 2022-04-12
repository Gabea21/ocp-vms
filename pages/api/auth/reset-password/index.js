import dbConnect from '../../../../mongo/dbConnect';
import User from '../../../../mongo/models/user';
import AccessHash from '../../../../mongo/models/accessHash';
import { hash } from 'bcryptjs';
import mailgunFactory from 'mailgun-js';

const mg_apiKey = process.env.MAILGUN_API_KEY;
const mg_domain = process.env.MAILGUN_DOMAIN;

const mailgun = mailgunFactory({
	apiKey: mg_apiKey,
	domain: mg_domain
});

function sendEmail({ toUser, hash}) {
	console.log('Send to', toUser.email)
	const sendMessage = {
		from: 'aicloudvms@icappelli.com',
		to: toUser.email , // in production uncomment this
		// to: 'gabrielajram@gmail.com',
		subject: 'Smart Building - Reset Password',
		html: `
      <h3>Hello ${toUser.fName} </h3>
      <p>To reset your password please follow this link: <a target="_" href="https://ocp.parked.app/auth/reset-password/${hash}">Reset Password Link</a></p>
      <p>Cheers,</p>
      <p>One Clinton Park Smart Security</p>
    `
	};
	return new Promise((res, rej) => {
		mailgun.messages().send(sendMessage, (error, body) => {
			if (error) {
				rej(error);
				console.log(error, mg_apiKey);
			} else {
				console.log('Message Sent',body);
			}
		});
	});
}

export default async function handler(req, res) {
	const {
		query: { id },
		method
	} = req;

	await dbConnect();

	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'POST' /* Edit a model by its ID */:
			const { email } = req.body;

			try {
				const user = await User.findOne({ email: email });
				if (!user) {
					return res.status(422).send("User doesn't exists!");
				}
				const hasHash = await AccessHash.findOne({ user_id: user._id });
				if (hasHash) {
					return res
						.status(422)
						.send('Email to reset password was already sent!');
				}
				const hash = new AccessHash({ user_id: user._id });
				await hash.save();
			
				const mailRes = sendEmail({ toUser: user, hash: hash._id })
				console.log('mail res ',  mailRes)

				return res.status(200).json({
					success:true,
				   message:
					   'Please check your email to reset the password!'
			   });
			} catch (error) {
				res.status(400).json({ success: false });
				console.log(error);
			}
			break;

		default:
			res.status(400).json({ success: false });
			break;
	}
}
