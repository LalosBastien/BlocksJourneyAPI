import nodemailer from 'nodemailer';
import { promisify } from 'util';
import { readFile } from 'fs';
import path from 'path';
import config from './../../config/mailer.config.json';

const readFileAsync = promisify(readFile);
const initTemplatePath = path.resolve(__dirname, 'mailTemplate/init.html');
const resetTemplatePath = path.resolve(__dirname, 'mailTemplate/reset.html');
const inviteTemplatePath = path.resolve(__dirname, 'mailTemplate/invite.html');

// A recuperer via les variable d'env
const host = 'http://localhost:4200/#';

const openTemplate = templatePath => readFileAsync(templatePath);
const setLinkInTemplate = (pointeur, link, template) => template.replace(`href="${pointeur}"`, `href="${link}"`);
const setProfName = (pointeur, prof, template) => template.replace('$$$', `${prof.nom}`);

const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
});
/**
 * Send email through the transporter
 * @param  {String} destinataire Destination e-mail
 * @param  {String} objet Subject of the mail
 * @param  {String} template Html template
 * @param  {String} text *optionnal*
 *                       Text to replace the E-mail template if the browser can't load the template
 * @return {Promise} Promise
 */
const sendMail = (destinataire, objet, template, text) => transporter.sendMail({
    from: config.sender,
    to: destinataire,
    subject: objet,
    text,
    html: template,
});

const sendInitMail = async (destinataire, token) => {
    try {
        const initLink = `${host}/emailVerified?token=${token}`;
        let template = await openTemplate(initTemplatePath);
        const pointeur = '###';
        template = setLinkInTemplate(pointeur, initLink, template.toString());
        const objet = 'Verifier votre adresse email';
        return sendMail(destinataire, objet, template, null);
    } catch (err) {
        return Promise.reject(err);
    }
};
const sendResetMail = async (destinataire, token) => {
    try {
        const resetLink = `${host}/resetPassword?token=${token}`;
        let template = await openTemplate(resetTemplatePath);
        const pointeur = '###';
        template = setLinkInTemplate(pointeur, resetLink, template.toString());
        const objet = 'Demande de réinitialisation de mot de passe';
        return sendMail(destinataire, objet, template, null);
    } catch (err) {
        return Promise.reject(err);
    }
};

const sendInviteMail = async (destinataire, prof) => {
    try {
        const resetLink = `${host}/prof/accept/${prof.id}`;
        let template = await openTemplate(inviteTemplatePath);
        template = setLinkInTemplate('###', resetLink, template.toString());
        template = setProfName('$$$', prof, template.toString());
        const objet = 'Invitation de ton professeur !';
        return sendMail(destinataire, objet, template, null);
    } catch (err) {
        return Promise.reject(err);
    }
};
export { sendInitMail, sendResetMail, sendInviteMail };
