"use server";

import { Client } from "@notionhq/client";
import nodemailer from "nodemailer";
import {
  CreatePageParameters,
  CreatePageResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { redirect, RedirectType } from "next/navigation";

// prettier-ignore
export async function addProspectToNotion(params: {
  fullName: string;
  society?: string;
  email: string;
  phoneNumber?: string;
  message: string;
  website?: string;
}) {
  const { fullName, society, email, phoneNumber, message, website } = params;
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  if (!process.env.NOTION_DATABASE_ID) throw new Error("Database ID is missing");

  const PROPERTIES: CreatePageParameters["properties"] = {};

  if (fullName)    PROPERTIES["Nom complet"]   = { title: [{ text: { content: fullName } }] };
  if (society)     PROPERTIES["Entreprise"]    = { rich_text: [{ text: { content: society } }] };
  if (email)       PROPERTIES["Email"]         = { email: email };
  if (phoneNumber) PROPERTIES["Telephone"]     = { phone_number: phoneNumber };
  if (message)     PROPERTIES["Message"]       = { rich_text: [{ text: { content: message } }] };
  if (website)     PROPERTIES["Site internet"] = { url: website };

  PROPERTIES.Etat = { select: { name: "A contacter" } };

  const { url } = (await notion.pages.create({
    properties: PROPERTIES,
    parent: {
      type: "database_id",
      database_id: process.env.NOTION_DATABASE_ID,
    },
  })) as CreatePageResponse & { url: string };

  await sendNotificationMail(url);

  redirect("https://webmanu.dev/formulaire-envoyee", RedirectType.push);
}

async function sendNotificationMail(url: string) {
  const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "noreply@webmanu.dev",
      pass: process.env.ZOHO_SMTP_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Emmanuel SARPEDON" <noreply@webmanu.dev>',
    to: process.env.ZOHO_NOTIFICATION_EMAIL,
    subject: "Webmanu.dev | Nouvelle demande depuis formulaire de contact",
    html: `${url}`,
  };

  await transporter.sendMail(mailOptions);
}
