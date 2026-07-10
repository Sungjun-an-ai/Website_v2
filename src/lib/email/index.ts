import { Resend } from 'resend'
import { escapeHtml } from '@/lib/security'
import type { InquiryMailSettings } from '@/lib/site/settings'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface InquiryEmailData {
  name: string
  company?: string
  email: string
  phone?: string
  productInterest?: string
  message: string
  locale: string
}

export interface CatalogRequestData {
  name: string
  company?: string
  email: string
  phone?: string
  resourceTitle: string
}

export async function sendInquiryEmail(data: InquiryEmailData, settings?: InquiryMailSettings) {
  const adminEmails = settings?.recipientEmails?.length
    ? settings.recipientEmails
    : [(process.env.ADMIN_EMAIL || 'info@hsurethane.co.kr')]
  const fromName = settings?.fromName || 'Hansung Urethane'

  const subject = data.locale === 'ko'
    ? `[문의] ${data.name}님으로부터 새 문의가 접수되었습니다`
    : `[Inquiry] New inquiry from ${data.name}`

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1B2A6B; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">한성우레탄 - 새 문의 접수</h2>
        <p style="margin: 5px 0 0; color: #D4A843;">Hansung Urethane - New Inquiry</p>
      </div>
      <div style="background: #f9f9f9; padding: 20px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 120px; color: #1B2A6B;">이름 / Name</td>
            <td style="padding: 8px;">${escapeHtml(data.name)}</td>
          </tr>
          ${data.company ? `
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #1B2A6B;">회사 / Company</td>
            <td style="padding: 8px;">${escapeHtml(data.company)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #1B2A6B;">이메일 / Email</td>
            <td style="padding: 8px;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
          </tr>
          ${data.phone ? `
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #1B2A6B;">전화 / Phone</td>
            <td style="padding: 8px;">${escapeHtml(data.phone)}</td>
          </tr>` : ''}
          ${data.productInterest ? `
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #1B2A6B;">관심제품 / Product</td>
            <td style="padding: 8px;">${escapeHtml(data.productInterest)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #1B2A6B; vertical-align: top;">메시지 / Message</td>
            <td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(data.message)}</td>
          </tr>
        </table>
      </div>
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 10px;">
        This email was sent from the Hansung Urethane website contact form.
      </p>
    </div>
  `

  const { data: result, error } = await resend.emails.send({
    from: `${fromName} Website <noreply@hsurethane.com>`,
    to: adminEmails,
    replyTo: data.email,
    subject,
    html: htmlBody,
  })

  if (error) throw error
  return result
}

export async function sendCatalogEmail(data: CatalogRequestData) {
  const adminEmail = process.env.ADMIN_EMAIL || 'info@hsurethane.co.kr'

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1B2A6B; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">한성우레탄 - 자료 다운로드 요청</h2>
        <p style="margin: 5px 0 0; color: #D4A843;">Hansung Urethane - Catalog Download Request</p>
      </div>
      <div style="background: #f9f9f9; padding: 20px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 120px; color: #1B2A6B;">이름 / Name</td>
            <td style="padding: 8px;">${escapeHtml(data.name)}</td>
          </tr>
          ${data.company ? `
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #1B2A6B;">회사 / Company</td>
            <td style="padding: 8px;">${escapeHtml(data.company)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #1B2A6B;">이메일 / Email</td>
            <td style="padding: 8px;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
          </tr>
          ${data.phone ? `
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #1B2A6B;">전화 / Phone</td>
            <td style="padding: 8px;">${escapeHtml(data.phone)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #1B2A6B;">요청 자료</td>
            <td style="padding: 8px;">${escapeHtml(data.resourceTitle)}</td>
          </tr>
        </table>
      </div>
    </div>
  `

  const { data: result, error } = await resend.emails.send({
    from: 'Hansung Urethane Website <noreply@hsurethane.com>',
    to: [adminEmail],
    replyTo: data.email,
    subject: `[자료요청] ${data.name}님이 카탈로그를 다운로드했습니다`,
    html: htmlBody,
  })

  if (error) throw error
  return result
}

export async function sendAutoReplyEmail(data: InquiryEmailData, settings?: InquiryMailSettings) {
  if (settings && !settings.autoReplyEnabled) return null
  const fromName = settings?.fromName || 'Hansung Urethane'
  const subject = data.locale === 'ko'
    ? settings?.autoReplySubjectKo || '한성우레탄 문의가 접수되었습니다'
    : settings?.autoReplySubjectEn || 'Your inquiry has been received - Hansung Urethane'
  const bodyText = data.locale === 'ko'
    ? settings?.autoReplyBodyKo || '문의해 주셔서 감사합니다.\n접수된 문의는 검토 후 빠른 시일 내에 답변 드리겠습니다.'
    : settings?.autoReplyBodyEn || 'Thank you for contacting Hansung Urethane Co., Ltd.\nWe have received your inquiry and will respond as soon as possible.'
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hsurethane.com').replace(/\/$/, '')
  const logoUrl = `${siteUrl}/email/autoreply-logo.png`
  const isKo = data.locale === 'ko'
  const bodyHtml = escapeHtml(bodyText).replace(/\n/g, '<br>')
  const inquiryHtml = escapeHtml(data.message).replace(/\n/g, '<br>')

  const t = isKo
    ? {
        preheader: '한성우레탄입니다. 문의가 정상적으로 접수되었습니다. 검토 후 빠르게 답변 드리겠습니다.',
        greeting: `${escapeHtml(data.name)}님, 안녕하세요.`,
        inquiryLabel: '문의 내용',
        tel: '031-943-8732',
        fax: '031-943-9756',
        signOff1: '감사합니다.',
        signOff2: '한성우레탄 드림',
        footer: '본 메일은 홈페이지 문의 접수에 따라 자동 발송된 메일입니다.<br>© HANSUNG URETHANE. All rights reserved.',
      }
    : {
        preheader: 'Your inquiry to Hansung Urethane has been received. We will respond shortly.',
        greeting: `Dear ${escapeHtml(data.name)},`,
        inquiryLabel: 'YOUR INQUIRY',
        tel: '+82-31-943-8732',
        fax: '+82-31-943-9756',
        signOff1: 'Best regards,',
        signOff2: 'Hansung Urethane Team',
        footer: 'This email was sent automatically upon receipt of your inquiry.<br>© HANSUNG URETHANE. All rights reserved.',
      }

  const htmlBody = `
  <div style="display:none;font-size:1px;color:#EEF0F5;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${t.preheader}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#EEF0F5">
    <tr>
      <td align="center" style="padding:40px 16px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background:#FFFFFF;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(17,28,60,0.10)">
          <tr>
            <td align="left" bgcolor="#111C3C" style="background:#111C3C;padding:0 40px">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="#FFFFFF" style="background:#FFFFFF;border-radius:0 0 18px 18px;padding:20px 12px 14px 12px">
                    <img src="${logoUrl}" alt="한성우레탄 H.S.U 로고" width="153" style="display:block;width:153px;height:auto;border:0">
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="left" bgcolor="#111C3C" style="background:#111C3C;padding:34px 40px 40px 40px;font-family:Impact,'Arial Black',Arial,sans-serif">
              <div style="font-size:38px;color:#FFFFFF;letter-spacing:1px;mso-line-height-rule:exactly;line-height:42px">BONDING</div>
              <div style="font-size:38px;color:#C9992E;letter-spacing:1px;mso-line-height-rule:exactly;line-height:42px">TOMORROW</div>
              <div style="font-size:38px;color:#FFFFFF;letter-spacing:1px;mso-line-height-rule:exactly;line-height:42px">TOGETHER</div>
            </td>
          </tr>
          <tr>
            <td bgcolor="#C9992E" style="background:#C9992E;font-size:0;line-height:0;height:4px">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:44px 44px 8px 44px;font-family:'Malgun Gothic','Apple SD Gothic Neo',Arial,Helvetica,sans-serif;color:#22283A">
              <div style="font-size:20px;font-weight:bold;color:#111C3C;mso-line-height-rule:exactly;line-height:30px">${t.greeting}</div>
              <div style="height:18px;font-size:0;line-height:0">&nbsp;</div>
              <div style="font-size:15px;mso-line-height-rule:exactly;line-height:26px;color:#3A4157">${bodyHtml}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 44px 0 44px">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E4E7EF;border-radius:10px">
                <tr>
                  <td style="padding:18px 26px 6px 26px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;color:#C9992E">${t.inquiryLabel}</td>
                </tr>
                <tr>
                  <td style="padding:0 26px 20px 26px;font-family:'Malgun Gothic','Apple SD Gothic Neo',Arial,Helvetica,sans-serif;font-size:14px;mso-line-height-rule:exactly;line-height:24px;color:#3A4157">${inquiryHtml}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 44px 0 44px">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F5F6FA;border-radius:10px">
                <tr>
                  <td style="padding:22px 26px;font-family:'Malgun Gothic','Apple SD Gothic Neo',Arial,Helvetica,sans-serif">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="72" style="width:72px;padding:5px 0;font-size:11px;font-weight:bold;letter-spacing:2px;color:#C9992E;font-family:Arial,Helvetica,sans-serif">EMAIL</td>
                        <td style="padding:5px 0;font-size:14px;color:#22283A"><a href="mailto:info@hsurethane.co.kr" style="color:#1B2B5E;text-decoration:none;font-weight:bold">info@hsurethane.co.kr</a></td>
                      </tr>
                      <tr>
                        <td width="72" style="width:72px;padding:5px 0;font-size:11px;font-weight:bold;letter-spacing:2px;color:#C9992E;font-family:Arial,Helvetica,sans-serif">TEL</td>
                        <td style="padding:5px 0;font-size:14px;color:#22283A">${t.tel}</td>
                      </tr>
                      <tr>
                        <td width="72" style="width:72px;padding:5px 0;font-size:11px;font-weight:bold;letter-spacing:2px;color:#C9992E;font-family:Arial,Helvetica,sans-serif">FAX</td>
                        <td style="padding:5px 0;font-size:14px;color:#22283A">${t.fax}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 44px 44px 44px;font-family:'Malgun Gothic','Apple SD Gothic Neo',Arial,Helvetica,sans-serif">
              <div style="font-size:15px;mso-line-height-rule:exactly;line-height:26px;color:#3A4157">${t.signOff1}</div>
              <div style="font-size:15px;font-weight:bold;mso-line-height-rule:exactly;line-height:26px;color:#111C3C">${t.signOff2}</div>
            </td>
          </tr>
          <tr>
            <td bgcolor="#F5F6FA" style="background:#F5F6FA;border-top:1px solid #E4E7EF;padding:20px 44px;font-family:'Malgun Gothic','Apple SD Gothic Neo',Arial,Helvetica,sans-serif">
              <div style="font-size:12px;mso-line-height-rule:exactly;line-height:20px;color:#8A90A4">${t.footer}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `

  const { data: result, error } = await resend.emails.send({
    from: `${fromName} <noreply@hsurethane.com>`,
    to: [data.email],
    subject,
    html: htmlBody,
  })

  if (error) throw error
  return result
}
