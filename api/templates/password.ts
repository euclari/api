export const createResetPasswordEmail = ({
	name,
	token,
}: {
	name: string;
	token: string;
}) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <link rel="preload" as="image" href="https://i.imgur.com/5faTBpF.png" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body
    style='font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";background-color:#f8f7f3'>
    <!--$--><!--html--><!--head-->
    <div
      style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0"
      data-skip-in-text="true">
      Redefina sua senha do Clarice
      <div>
         ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
      </div>
    </div>
    <!--body-->
    <table
      border="0"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      align="center">
      <tbody>
        <tr>
          <td
            style='font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";background-color:#f8f7f3'>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="max-width:36rem;margin-left:auto;margin-right:auto;margin-top:2rem;margin-bottom:2rem;padding:0px;background-color:rgb(255,255,255);border-width:1px;border-style:solid;border-color:rgb(229,231,235);border-radius:0.5rem">
              <tbody>
                <tr style="width:100%">
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding:33px 55px;text-align:center">
                      <tbody>
                        <tr>
                          <td>
                            <img
                              alt="Logo Clarice"
                              height="71"
                              src="https://i.imgur.com/5faTBpF.png"
                              style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto"
                              width="60" />
                            <p
                              style="font-size:1.25rem;line-height:1.75rem;font-weight:600;letter-spacing:-0.025em;color:#4a0e69;margin-top:8px;margin-bottom:0">
                              Clarice
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding:0 55px;text-align:center">
                      <tbody>
                        <tr>
                          <td>
                            <h1
                              style="font-size:1.875rem;line-height:2.25rem;font-weight:700;color:rgb(0,0,0);margin-bottom:16px;margin-top:0">
                              Redefinir sua senha
                            </h1>
                            <p
                              style="font-size:1rem;line-height:1.5rem;color:rgb(55,65,81);margin-bottom:22px;margin-top:16px">
                              Olá ${name}, recebemos uma
                              solicitação para redefinir a senha da sua conta no
                              Clarice.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding:0 55px;text-align:center">
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="font-size:1rem;line-height:1.5rem;color:rgb(55,65,81);margin-top:16px;margin-bottom:16px">
                              Clique no botão abaixo para criar uma nova senha.
                              Este link é válido por 10 minutos.
                            </p>
                            <a
                              href="https://euclari.com.br/redefinir-senha?token=${token}"
                              style="line-height:100%;text-decoration:none;display:block;max-width:100%;mso-padding-alt:0px;background-color:#6a4c93;color:white;font-weight:600;border-radius:12px;padding:20px 28px;margin:28px auto 0;width:fit-content;padding-top:20px;padding-right:28px;padding-bottom:20px;padding-left:28px"
                              target="_blank"
                              ><span
                                ><!--[if mso]><i style="mso-font-width:466.6666666666667%;mso-text-raise:30" hidden>&#8202;&#8202;&#8202;</i><![endif]--></span
                              ><span
                                style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:15px"
                                >Redefinir minha senha</span
                              ><span
                                ><!--[if mso]><i style="mso-font-width:466.6666666666667%" hidden>&#8202;&#8202;&#8202;&#8203;</i><![endif]--></span
                              ></a
                            >
                            <p
                              style="margin-top:2rem;font-size:0.875rem;line-height:1.25rem;color:rgb(75,85,99);margin-bottom:16px">
                              Se você não solicitou esta alteração, pode ignorar
                              este e-mail com segurança. Sua conta continua
                              protegida.<br /><br />Atenciosamente,<br />Equipe
                              Clarice ✨
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="margin-top:2rem;font-size:0.875rem;line-height:1.25rem;text-align:center;color:rgb(75,85,99);padding:33px 55px;background-color:#F4F4F4">
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="font-size:11px;line-height:16px;color:#686A71;margin-bottom:0;margin-top:16px">
                              Precisa de ajuda? Entre em contato com nosso
                              <a
                                href="https://euclari.com.br/suporte"
                                style="color:#686A71;text-decoration:underline"
                                >suporte</a
                              >.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!--/$-->
  </body>
</html>
`;
