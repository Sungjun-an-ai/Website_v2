import { setRequestLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'

const fallbackContent = {
  ko: `제1조 (개인정보의 처리 목적)
한성우레탄(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.

1. 민원사무 처리: 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보 목적으로 개인정보를 처리합니다.

제2조 (개인정보의 처리 및 보유 기간)
① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
  - 민원사무 처리: 3년

제3조 (처리하는 개인정보의 항목)
① 회사는 다음의 개인정보 항목을 처리하고 있습니다.
  - 필수항목: 이름, 연락처, 이메일 주소
  - 선택항목: 회사명, 문의 내용

제4조 (개인정보의 제3자 제공)
회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.

제5조 (정보주체의 권리·의무 및 행사방법)
① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
  1. 개인정보 열람요구
  2. 오류 등이 있을 경우 정정 요구
  3. 삭제요구
  4. 처리정지 요구

제6조 (개인정보 보호책임자)
회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
  - 담당부서: 관리팀
  - 연락처: info@hsurethane.co.kr

본 개인정보처리방침은 2024년 1월 1일부터 적용됩니다.`,

  en: `Article 1 (Purpose of Processing Personal Information)
Hansung Urethane (hereinafter "Company") processes personal information for the following purposes. The personal information being processed will not be used for purposes other than the following, and if the purpose of use changes, necessary measures such as obtaining separate consent will be taken in accordance with Article 18 of the Personal Information Protection Act.

1. Handling Civil Complaints: Personal information is processed for the purpose of verifying the identity of complainants, confirming complaints, contacting and notifying for fact-finding, and notifying the results of processing.

Article 2 (Processing and Retention Period of Personal Information)
① The Company processes and retains personal information within the personal information retention and use period pursuant to laws and regulations or within the personal information retention and use period agreed upon when collecting personal information from the data subject.
② The retention period for each personal information processing is as follows:
  - Handling Civil Complaints: 3 years

Article 3 (Items of Personal Information Processed)
① The Company processes the following personal information items:
  - Required items: Name, contact number, email address
  - Optional items: Company name, inquiry content

Article 4 (Provision of Personal Information to Third Parties)
The Company processes personal information of data subjects only within the scope specified in Article 1, and provides personal information to third parties only in cases corresponding to Article 17 of the Personal Information Protection Act, such as consent of the data subject or special provisions of the law.

Article 5 (Rights and Obligations of Data Subjects and How to Exercise Them)
① Data subjects may exercise the following personal information protection rights against the Company at any time:
  1. Request to access personal information
  2. Request for correction if there are errors
  3. Request for deletion
  4. Request to stop processing

Article 6 (Personal Information Protection Officer)
The Company designates a Personal Information Protection Officer as follows to take overall responsibility for personal information processing and to handle complaints from data subjects related to personal information processing:
  - Department: Management Team
  - Contact: info@hsurethane.co.kr

This Privacy Policy is effective from January 1, 2024.`
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const isKo = locale === 'ko'
  let content = isKo ? fallbackContent.ko : fallbackContent.en

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('legal_pages')
      .select('content')
      .eq('type', 'privacy')
      .eq('locale', locale)
      .single()

    if (data?.content) {
      content = data.content
    }
  } catch {
    // Use fallback content
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {isKo ? '개인정보처리방침' : 'Privacy Policy'}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed font-sans">
            {content}
          </pre>
        </div>
      </div>
    </div>
  )
}
