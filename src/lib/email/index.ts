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
    from: `${fromName} Website <noreply@hsurethane.co.kr>`,
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
    from: 'Hansung Urethane Website <noreply@hsurethane.co.kr>',
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
  const bodyHtml = escapeHtml(bodyText).replace(/\n/g, '<br>')

  const htmlBody = data.locale === 'ko' ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1B2A6B; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">한성우레탄</h2>
        <p style="margin: 5px 0 0; color: #D4A843;">BONDING TOMORROW TOGETHER</p>
      </div>
      <div style="padding: 30px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
        <p>${escapeHtml(data.name)}님, 안녕하세요.</p>
        <p>${bodyHtml}</p>
        <p style="color: #666;">
          ✉ info@hsurethane.co.kr<br>
          📞 031-943-8732<br>
          📠 031-943-9756
        </p>
        <p>감사합니다.<br><strong>한성우레탄 드림</strong></p>
      </div>
    </div>
  ` : `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1B2A6B; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">Hansung Urethane</h2>
        <p style="margin: 5px 0 0; color: #D4A843;">BONDING TOMORROW TOGETHER</p>
      </div>
      <div style="padding: 30px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
        <p>Dear ${escapeHtml(data.name)},</p>
        <p>${bodyHtml}</p>
        <p style="color: #666;">
          ✉ info@hsurethane.co.kr<br>
          📞 +82-31-943-8732<br>
          📠 +82-31-943-9756
        </p>
        <p>Best regards,<br><strong>Hansung Urethane Team</strong></p>
      </div>
    </div>
  `

  const { data: result, error } = await resend.emails.send({
    from: `${fromName} <noreply@hsurethane.co.kr>`,
    to: [data.email],
    subject,
    html: htmlBody,
  })

  if (error) throw error
  return result
}
