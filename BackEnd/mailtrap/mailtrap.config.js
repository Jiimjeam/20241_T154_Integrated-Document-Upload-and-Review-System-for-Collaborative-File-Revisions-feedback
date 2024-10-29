
// import {MailtrapClient} from "mailtrap";
// import dotenv from "dotenv";


// dotenv.config();
// const TOKEN = process.env.MAILTRAP_TOKEN;
// const ENDPOINT= process.env.MAILTRAP_ENDPOINT;

// const client = new MailtrapClient({
//   token: TOKEN,
// });

// const sender = {
//   email: "hello@demomailtrap.com",
//   name: "Bryan",
// };
// const recipients = [
//   {
//     email: "2201100367@student.buksu.edu.ph",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     html: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);



import {MailtrapClient} from "mailtrap";
import dotenv from "dotenv";


dotenv.config();

//Pwede siya ani
// const TOKEN = process.env.MAILTRAP_TOKEN;
// const ENDPOINT= process.env.MAILTRAP_ENDPOINT;

//Instead ani nga function pero same ras sila
export const mailtrapClient = new MailtrapClient({ endpoint: process.env.MAILTRAP_ENDPOINT,token: process.env.MAILTRAP_TOKEN });

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};

