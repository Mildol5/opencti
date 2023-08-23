import type { JSONSchemaType } from 'ajv';
import type { NotifierConnector } from '../../generated/graphql';
import type { BasicStoreEntityNotifier } from './notifier-types';

// region Notifier User interface
export const NOTIFIER_CONNECTOR_UI = 'f39b8ab2c-8f5c-4167-a249-229f34d9442b';
// endregion
// region Notifier Email
export const NOTIFIER_CONNECTOR_EMAIL = '6f5e30a8-56d5-4ff1-8b8d-f90243f771dc';
export const NOTIFIER_CONNECTOR_SIMPLIFIED_EMAIL = '9f73d9f8-cc4c-432b-b5b0-be6b6d6c8d87';

export interface NOTIFIER_CONNECTOR_EMAIL_INTERFACE {
  title: string
  template: string
}

export interface NOTIFIER_CONNECTOR_SIMPLIFIED_EMAIL_INTERFACE {
  title: string
  header: string
  logo: string
  footer: string
  background_color: string
}

export const NOTIFIER_CONNECTOR_EMAIL_CONFIG: JSONSchemaType<NOTIFIER_CONNECTOR_EMAIL_INTERFACE> = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    template: { type: 'string' },
  },
  required: ['title', 'template'],
};
export const NOTIFIER_CONNECTOR_SIMPLIFIED_EMAIL_CONFIG: JSONSchemaType<NOTIFIER_CONNECTOR_SIMPLIFIED_EMAIL_INTERFACE> = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    header: { type: 'string' },
    logo: { type: 'string' },
    footer: { type: 'string' },
    background_color: { type: 'string' },
  },
  required: ['title'],
};
// endregion
// region Notifier Webhook
export const NOTIFIER_CONNECTOR_WEBHOOK = '08f9f00f-4e52-4466-ae27-be9fa9813a88';

export interface NOTIFIER_CONNECTOR_WEBHOOK_INTERFACE {
  verb: string
  url: string
  template: string
  params: { attribute: string, value: string }[],
  headers: { attribute: string, value: string }[],
}

export const NOTIFIER_CONNECTOR_WEBHOOK_CONFIG: JSONSchemaType<NOTIFIER_CONNECTOR_WEBHOOK_INTERFACE> = {
  type: 'object',
  properties: {
    verb: { type: 'string', enum: ['GET', 'POST', 'PUT', ' DELETE'] },
    url: { type: 'string' },
    template: { type: 'string' },
    params: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          attribute: {
            type: 'string',
          },
          value: {
            type: 'string',
          },
        },
        required: ['attribute', 'value']
      },
    },
    headers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          attribute: {
            type: 'string',
          },
          value: {
            type: 'string',
          },
        },
        required: ['attribute', 'value']
      },
    },
  },
  required: ['url', 'verb', 'template'],
};

// endregion

export const BUILTIN_NOTIFIERS_CONNECTORS: Record<string, NotifierConnector> = {
  [NOTIFIER_CONNECTOR_EMAIL]: {
    id: NOTIFIER_CONNECTOR_EMAIL,
    connector_type: 'Notifier',
    name: 'Platform mailer',
    built_in: true,
    connector_schema: JSON.stringify(NOTIFIER_CONNECTOR_EMAIL_CONFIG),
    connector_schema_ui: JSON.stringify({
      template: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 20,
        },
      }
    }),
  },
  [NOTIFIER_CONNECTOR_SIMPLIFIED_EMAIL]: {
    id: NOTIFIER_CONNECTOR_SIMPLIFIED_EMAIL,
    connector_type: 'Notifier',
    name: 'Simple mailer',
    built_in: true,
    connector_schema: JSON.stringify(NOTIFIER_CONNECTOR_SIMPLIFIED_EMAIL_CONFIG),
    connector_schema_ui: JSON.stringify({
      logo: {
        'ui:widget': 'file',
        'ui:options': { accept: 'image/*' } // Because of an open bug: this is not working yet https://github.com/rjsf-team/react-jsonschema-form/issues/3577
      },
      background_color: {
        'ui:widget': 'color', // Same, for now we can't have fully customized components, we will need to investigate in the future
      },
    }),
  },
  [NOTIFIER_CONNECTOR_WEBHOOK]: {
    id: NOTIFIER_CONNECTOR_WEBHOOK,
    connector_type: 'Notifier',
    name: 'Generic webhook',
    built_in: true,
    connector_schema: JSON.stringify(NOTIFIER_CONNECTOR_WEBHOOK_CONFIG),
    connector_schema_ui: JSON.stringify({
      template: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 20,
        },
      }
    }),
  }
};

export const STATIC_NOTIFIERS: Array<BasicStoreEntityNotifier> = [
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {
    id: 'f4ee7b33-006a-4b0d-b57d-411ad288653d',
    internal_id: 'f4ee7b33-006a-4b0d-b57d-411ad288653d',
    built_in: true,
    name: 'User interface',
    description: 'Publish notification to the user interface',
    notifier_connector_id: NOTIFIER_CONNECTOR_UI,
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {
    id: '44fcf1f4-8e31-4b31-8dbc-cd6993e1b822',
    internal_id: '44fcf1f4-8e31-4b31-8dbc-cd6993e1b822',
    built_in: true,
    name: 'Default mailer',
    description: 'Send notification to the user email',
    notifier_connector_id: NOTIFIER_CONNECTOR_EMAIL,
    notifier_configuration: JSON.stringify({
      title: 'New <%=notification.trigger_type%> notification for <%=notification.name%>',
      template: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
        <html>
            <head>
                <meta content="en-us" http-equiv="Content-Language">
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
                <title>Cyber Threat Intelligence Digest</title>
                <style type="text/css">
                    * {
                        font-family: 'Arial';
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        background-color: #f6f6f6;
                        background: #f6f6f6;
                    }
                    </style>
                </head>
            <body>
              <table align="center" bgcolor="#cccccc" cellpadding="0" cellspacing="0" style="width: 100%; background: #f6f6f6; background-color: #f6f6f6; margin:0; padding:0 20px;">
                  <tr>
                      <td>
                          <table align="center" cellpadding="0" cellspacing="0" style="width: 620px; border-collapse:collapse; text-align:left; font-family:Tahoma; font-weight:normal; font-size:12px; line-height:15pt; color:#444444; margin:0 auto;">
                              <tr>
                                  <td valign="bottom" style="height:5px;margin:0;padding:20px 0 0 0;line-height:0;font-size:2px;"></td>
                              </tr>
                              <tr>
                                  <td style=" width:620px;" valign="top">
                                      <table cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse;font-family: Tahoma; font-weight:normal; font-size:12px; line-height:15pt; color:#444444;" >
                                          <tr>
                                              <td bgcolor="<%=background_color%>" style="width: 320px; padding:10px 0 10px 20px; background: <%=background_color%>; background-color: <%=background_color%>; color:#ffffff;" valign="top">
                                                  <a style="color:#ffffff; text-decoration:underline;" href="<%=platform_uri%>"><%=settings.platform_title%></a><span style="color:#ffffff;"> | </span><a style="color:#ffffff; text-decoration:underline;" href="<%=doc_uri%>">Documentation</a>
                                              </td>
                                              <td bgcolor="<%=background_color%>" style="width: 300px; padding:10px 20px 10px 20px; background: <%=background_color%>; background-color:<%=background_color%>; text-align:right; color:#ffffff;" valign="top">
                                                  Automatic digest subscription
                                              </td>
                                          </tr>
                                          <tr>
                                              <td bgcolor="#ffffff" style="width: 320px; padding:20px 0 15px 20px; background: #ffffff; background-color:#ffffff;" valign="middle">
                                                  <p style="padding:0; margin:0; line-height:160%; font-size:18px;">
                                                      <img src="data:image/png;base64,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Oi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6ZDU3ZDZjMzAtZmNhMS00ZWVlLThkNTgtMTc4MjkyNzI4N2I4IgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmI4ZjllY2Y5LTg5NzMtNDYwOC04ZTllLTQyNTJhMGJkMWEzYSIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjUxNmRmZTRhLTNlMWQtNDAwZS05NmFlLWExMjcyMzBiZmQyYyIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjc0ODQ3MDc3NzM2MDY0IgogICBHSU1QOlZlcnNpb249IjIuMTAuMzIiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzOjAxOjI3VDIwOjE3OjU3KzAxOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyMzowMToyN1QyMDoxNzo1NyswMTowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmIyYmM2NmFiLTAzYzktNDUyNy05ZmFlLTViMGQ0MjEyYTljZiIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiCiAgICAgIHN0RXZ0OndoZW49IiswMjowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNjdhZmE4Zi03ZmMyLTQ2YzQtOWZiNS0zZmJmNmU1NTc2YmMiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTGludXgpIgogICAgICBzdEV2dDp3aGVuPSIyMDIyLTAxLTE4VDE4OjQyOjM4KzAxOjAwIi8+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmMxZjM5ZWYzLTEwZTUtNGI5ZC1hZDFlLWU5ZTA2NTgyZWE4MSIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiCiAgICAgIHN0RXZ0OndoZW49IjIwMjItMDItMjZUMTQ6Mjc6MDErMDE6MDAiLz4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZDc3NzQ2YWEtYWRmNi00MzlhLTg0ZjYtNmQzODRjZWQxZTU2IgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKFdpbmRvd3MpIgogICAgICBzdEV2dDp3aGVuPSIyMDIzLTAxLTI3VDIwOjE3OjU3Ii8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PojwbCQAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwABM5QAATOUAbIPjhIAAAAHdElNRQfnARsTETlvUc6FAAAgAElEQVR42uzdd5hcVf3H8ffZzW56hwQSOhGkTui9SZOWG6oUKSoCP0AUBJSSASY0RaQjIEUBKUrJiXSRjgqSwI0GAgRCIIRA2PS2m909vz/OjQmQZO+ZnZmd2f28nmeeB7LnTPnOmZl7v/ec7zHkYodIZVibbObjoB7WXQxc1AbPtTeRmaO3TERERERERKT1qhQCaedeUwhEREREREREKpsSWNLevQI0KAwiIiIiIiIilUsJLGnfIjMXeFOBEBEREREREalcSmBJR/CiQiAiIiIiIiJSuZTAko7gJYVAREREREREpHIpgSUdwdPAQoVBREREREREpDIpgSXtX2Qa0SwsERERERERkYqlBJZ0FE8oBCIiIiIiIiKVSQks6ShUyF1ERERERESkQimBJR3Ff4EZCoOIiIiIiIhI5VECSyrFPFqTgIpME/C8wigiIiIiIiJSeZTAkkoxn2xmXivv4wWFUURERERERKTyKIElHckbCoGIiIiIiIhI5enUir4LgScVQimR2S22sG4gkfl8JS3eAh4JeMy9gF4KvYiIiIiIiEjbak0CawbZzKEKoZSRW4CDV/jXyCwC0o9Z6/4DbKqwioiIiIiIiLQtLSGU9mRrrFtDYRARERERERFpX5TAkvakGthdYRARERERERFpX5TAas9y8Rrk4lvJxft3oFd9kN54ERERERERkfZFCaz2KBfXkot/BsTAScDV5OJO7fo1W1eNr+m2BdYZDQIRERERERGR9kMJrPYmF28LvAFcA/RL/vXbwH7t/JWvBqwKfAtYXQNBREREREREpP1QAqu9yMWGXHwJ8A9gs+W02KsDRWNrDQgRERERERGR9kMJrPYgF68LvApk8YXMl6d7B4rIbhoUIiIiIiIiIu2HEliVLhfvCbwM7NBCy3kdKCpKYImIiIiIiIi0I0pgVTJfqP2vwOAUrSd1oMhsgnX9NEBERERERERE2odOCkEF8jsK3gCcDKTZcW82cHcHilAXYFvgKQ0WERERERERkcqnGViVxiev/gCcQrrkFcD1ZDMzO1ikDtJgEREREREREWkflMCqJLm4H/Av4Ji0Xbr3695kNt14KNYdjXV9O1C09sI6o0EjIiIiIiIiUvm0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" style="width: 300px;" width="300">
                                                  </p>
                                              </td>
                                              <td bgcolor="#ffffff" style="width: 300px; padding:20px 20px 15px 20px; background: #ffffff; background-color:#ffffff; text-align:center;" valign="middle">
                                                  This email is automatically generated.
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <% content.forEach((contentLine)=> { %>
                              <tr>
                                <td bgcolor="#ffffff" style="padding:10px 20px; background: #ffffff; background-color: #ffffff;" valign="top">
                                    <p style="margin: 0 0 10pt 0; padding: 0; color:#999999; font-size:18pt;"><%= contentLine.title %></p>
                                    <ul>
                                        <% contentLine.events.forEach((contentEvent)=> { %>
                                        <li>
                                            <a style="color:#000000; text-decoration:underline;" href="<%=platform_uri%>/dashboard/id/<%= contentEvent.instance_id %>"><%= contentEvent.message %></a>
                                        </li>
                                        <% }) %>                                        
                                    </ul>
                                </td>
                              </tr>
                              <% }) %>
                              <tr>
                                  <td bgcolor="<%=background_color%>" style="padding:20px 20px 15px 20px; background-color:<%=background_color%>; background:<%=background_color%>;">
                                      <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse:collapse; font-family:Tahoma; font-weight:normal; font-size:12px; line-height:15pt; color:#FFFFFF;">
                                          <tr>
                                              <td style="width:340px; padding:0 20px 0 0;">
                                                  OpenCTI, the open source threat intelligence platform<br>
                                                  <a style="color:#000000; text-decoration:underline;" href="<%=platform_uri%>"><%=settings.platform_title%></a>
                                                  | <a style="color:#000000; text-decoration:underline;" href="<%=settings.platform_email%>"><%=settings.platform_email%></a>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td style="padding:20px 0 0 0;" colspan="2">Copyright &copy; 2023 OpenCTI.</td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td valign="top" style="height:5px;margin:0;padding:0 0 20px 0;line-height:0;font-size:2px;"></td>
                              </tr>
                      </table>
                  </td>
              </tr>
          </table>
       </body>
     </html>
      `
    })
  }
];

export const SIMPLIFIED_EMAIL_TEMPLATE = `
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<% function parseMarkdownLink(text) {
  const regex = /(.*)\\[(.*?)\\]\\((.*?)\\)/;
  const match = text.match(regex);
  if (match) {
    const text = match[1];
    const linkText = match[2].split(' ').map((e) => escape(e)).join(' ');
    const linkUrl = match[3].split(' ').map((e) => escape(e)).join(' ');
    return text + '<a style="color:#fff; text-decoration:underline;" href="' + linkUrl +'">' + linkText + '</a>';
  }
  return text; // If it's not a link, return the original text
} %>
<html>
    <head>
        <meta content="en-us" http-equiv="Content-Language">
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
        <title>Cyber Threat Intelligence Digest</title>
        <style type="text/css">
            * {
                font-family: 'Arial';
            }
            body {
                margin: 0;
                padding: 0;
                background-color: #f6f6f6;
                background: #f6f6f6;
            }
            </style>
        </head>
    <body>
      <table align="center" bgcolor="#cccccc" cellpadding="0" cellspacing="0" style="width: 100%; background: #f6f6f6; background-color: #f6f6f6; margin:0; padding:0 20px;">
          <tr>
              <td>
                  <table align="center" cellpadding="0" cellspacing="0" style="width: 620px; border-collapse:collapse; text-align:left; font-family:Tahoma; font-weight:normal; font-size:12px; line-height:15pt; color:#444444; margin:0 auto;">
                      <tr>
                          <td valign="bottom" style="height:5px;margin:0;padding:20px 0 0 0;line-height:0;font-size:2px;"></td>
                      </tr>
                      <tr>
                          <td style=" width:620px;" valign="top">
                              <table cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse;font-family: Tahoma; font-weight:normal; font-size:12px; line-height:15pt; color:#444444;" >
                                  <tr>
                                      <td bgcolor="<%=background_color%>" style="width: 320px; padding:10px 0 10px 20px; background: <%=background_color%>; background-color: <%=background_color%>; color:#ffffff;" valign="top">
                                          <%- parseMarkdownLink(header)%>
                                      </td>
                                      <td bgcolor="<%=background_color%>" style="width: 300px; padding:10px 20px 10px 20px; background: <%=background_color%>; background-color:<%=background_color%>; text-align:right; color:#ffffff;" valign="top">
                                          Automatic digest subscription
                                      </td>
                                  </tr>
                                  <tr>
                                      <td bgcolor="#ffffff" style="width: 320px; padding:20px 0 15px 20px; background: #ffffff; background-color:#ffffff;" valign="middle">
                                          <p style="padding:0; margin:0; line-height:160%; font-size:18px;">
                                              <img src="<%=logo%>" style="width: 300px;" width="300">
                                          </p>
                                      </td>
                                      <td bgcolor="#ffffff" style="width: 300px; padding:20px 20px 15px 20px; background: #ffffff; background-color:#ffffff; text-align:center;" valign="middle">
                                          This email is automatically generated.
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <% content.forEach((contentLine)=> { %>
                      <tr>
                        <td bgcolor="#ffffff" style="padding:10px 20px; background: #ffffff; background-color: #ffffff;" valign="top">
                            <p style="margin: 0 0 10pt 0; padding: 0; color:#999999; font-size:18pt;"><%= contentLine.title %></p>
                            <ul>
                                <% contentLine.events.forEach((contentEvent)=> { %>
                                <li>
                                    <a style="color:#000000; text-decoration:underline;" href="<%=platform_uri%>/dashboard/id/<%= contentEvent.instance_id %>"><%= contentEvent.message %></a>
                                </li>
                                <% }) %>                                        
                            </ul>
                        </td>
                      </tr>
                      <% }) %>
                      <tr>
                          <td bgcolor="<%=background_color%>" style="padding:20px 20px 15px 20px; background-color:<%=background_color%>; background:<%=background_color%>;">
                              <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse:collapse; font-family:Tahoma; font-weight:normal; font-size:12px; line-height:15pt; color:#FFFFFF;">
                                  <tr>
                                      <td style="width:340px; padding:0 20px 0 0;">
                                          OpenCTI, the open source threat intelligence platform<br>
                                          <%- parseMarkdownLink(footer)%>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="padding:20px 0 0 0;" colspan="2">Copyright &copy; 2023 OpenCTI.</td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td valign="top" style="height:5px;margin:0;padding:0 0 20px 0;line-height:0;font-size:2px;"></td>
                      </tr>
              </table>
          </td>
      </tr>
  </table>
</body>
</html>
`;

export const DEFAULT_TEAM_MESSAGE = {
  notifier_connector_id: NOTIFIER_CONNECTOR_WEBHOOK,
  name: 'Sample of Microsoft Teams message for live trigger',
  description: 'This is a sample notifier to send a Microsoft Teams message. The template is already filled and fully customizable. You need to add the correct Microsoft Teams endpoint to get it working.',
  notifier_configuration: `
    {
      "template": "{\\n        \\"type\\": \\"message\\",\\n        \\"attachments\\": [\\n            {\\n                \\"contentType\\": \\"application/vnd.microsoft.card.thumbnail\\",\\n                \\"content\\": {\\n                    \\"subtitle\\": \\"Operation : <%=content[0].events[0].operation%>\\",\\n                    \\"text\\": \\"<%=(new Date(notification.created)).toLocaleString()%>\\",\\n                    \\"title\\": \\"<%=content[0].events[0].message%>\\",\\n                    \\"buttons\\": [\\n                        {\\n                            \\"type\\": \\"openUrl\\",\\n                            \\"title\\": \\"See in OpenCTI\\",\\n                            \\"value\\": \\"https://YOUR_OPENCTI_URL/dashboard/id/<%=content[0].events[0].instance_id%>\\"\\n                        }\\n                    ]\\n                }\\n            }\\n        ]\\n    }",
      "url": "https://YOUR_DOMAIN.webhook.office.com/YOUR_ENDPOINT",
      "verb": "POST"
    }
  `
};

export const DEFAULT_TEAM_DIGEST_MESSAGE = {
  notifier_connector_id: NOTIFIER_CONNECTOR_WEBHOOK,
  name: 'Sample of Microsoft Teams message for digest trigger',
  description: 'This is a sample notifier to send a Microsoft Teams message. The template is already filled and fully customizable. You need to add the correct Microsoft Teams endpoint to get it working.',
  notifier_configuration: `
    {
      "template": "{\\n    \\"type\\": \\"message\\",\\n    \\"attachments\\": [\\n        {\\n            \\"contentType\\": \\"application/vnd.microsoft.card.adaptive\\",\\n            \\"content\\": {\\n                \\"$schema\\": \\"http://adaptivecards.io/schemas/adaptive-card.json\\",\\n                \\"type\\": \\"AdaptiveCard\\",\\n                \\"version\\": \\"1.0\\",\\n                \\"body\\": [\\n                    {\\n                        \\"type\\": \\"Container\\",\\n                        \\"items\\": [\\n                            {\\n                                \\"type\\": \\"TextBlock\\",\\n                                \\"text\\": \\"<%=notification.name%>\\",\\n                                \\"weight\\": \\"bolder\\",\\n                                \\"size\\": \\"extraLarge\\"\\n                            }, {\\n                                \\"type\\": \\"TextBlock\\",\\n                                \\"text\\": \\"<%=(new Date(notification.created)).toLocaleString()%>\\",\\n                                \\"size\\": \\"medium\\"\\n                            }\\n                        ]\\n                    },\\n                    <% for(var i=0; i<content.length; i++) { %>\\n                    {\\n                        \\"type\\": \\"Container\\",\\n                        \\"items\\": [<% for(var j=0; j<content[i].events.length; j++) { %>\\n                            {\\n                                \\"type\\" : \\"TextBlock\\",\\n                                \\"text\\" : \\"[<%=content[i].events[j].message%>](https://localhost:3000/dashboard/id/<%=content[i].events[j].instance_id%>)\\"\\n                         \\t}<% if(j<(content[i].events.length - 1)) {%>,<% } %>\\n                        <% } %>]\\n\\t\\t   }<% if(i<(content.length - 1)) {%>,<% } %>\\n                    <% } %>\\n                ]\\n            }\\n        }\\n    ],\\n   \\"dataString\\": <%-JSON.stringify(notification)%>\\n}",
      "url": "https://YOUR_DOMAIN.webhook.office.com/YOUR_ENDPOINT",
      "verb": "POST"
    }
  `
};
