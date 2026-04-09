import { setRequestLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'

const fallbackContent = {
  ko: `제1조 (목적)
이 약관은 한성우레탄(이하 "회사")이 제공하는 인터넷 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (용어의 정의)
이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
1. "서비스"란 회사가 제공하는 모든 인터넷 서비스를 말합니다.
2. "이용자"란 이 약관에 따라 회사의 서비스를 이용하는 자를 말합니다.

제3조 (약관의 효력 및 변경)
① 이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.
② 회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 변경된 약관은 서비스 내에 공지함으로써 효력을 발생합니다.

제4조 (서비스의 제공 및 변경)
① 회사는 다음과 같은 서비스를 제공합니다.
  - 제품 정보 제공
  - 문의 접수 서비스
  - 기타 회사가 추가로 개발하거나 제휴를 통해 제공하는 서비스

② 회사는 서비스의 내용을 변경할 수 있으며, 이 경우 변경된 서비스의 내용 및 제공일자를 명시하여 사전에 공지합니다.

제5조 (이용자의 의무)
이용자는 다음 행위를 하여서는 안 됩니다.
1. 신청 또는 변경 시 허위내용의 등록
2. 타인의 정보 도용
3. 회사가 게시한 정보의 변경
4. 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
5. 회사 및 기타 제3자의 저작권 등 지적재산권에 대한 침해
6. 회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위

제6조 (면책조항)
① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
② 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
③ 회사는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.

제7조 (준거법 및 관할법원)
이 약관의 해석 및 회사와 이용자 간의 분쟁에 대하여는 대한민국의 법률을 적용하며, 분쟁에 관한 소송은 회사의 본사 소재지를 관할하는 법원을 제1심 관할법원으로 합니다.

본 이용약관은 2024년 1월 1일부터 적용됩니다.`,

  en: `Article 1 (Purpose)
These Terms of Service govern the rights, obligations, responsibilities, and other necessary matters between Hansung Urethane (hereinafter "Company") and users in relation to the use of internet services (hereinafter "Service") provided by the Company.

Article 2 (Definitions)
The terms used in these Terms of Service are defined as follows:
1. "Service" refers to all internet services provided by the Company.
2. "User" refers to any person who uses the Company's services in accordance with these Terms of Service.

Article 3 (Effectiveness and Amendment of Terms)
① These Terms of Service are effective for all users who wish to use the Service.
② The Company may amend these Terms of Service if deemed necessary, and the amended terms become effective by posting within the Service.

Article 4 (Provision and Change of Service)
① The Company provides the following services:
  - Product information provision
  - Inquiry reception service
  - Other services additionally developed by the Company or provided through partnerships

② The Company may change the content of the Service and in such cases will notify in advance, specifying the changed content and provision date.

Article 5 (User Obligations)
Users must not engage in the following actions:
1. Registering false information when applying or making changes
2. Stealing another person's information
3. Changing information posted by the Company
4. Sending or posting information other than the information specified by the Company (such as computer programs)
5. Infringing on copyrights or other intellectual property rights of the Company or other third parties
6. Damaging the reputation of the Company or other third parties or interfering with their business

Article 6 (Disclaimer)
① The Company is exempt from responsibility for providing the Service if it cannot provide the Service due to natural disasters or equivalent force majeure.
② The Company is not responsible for service disruptions caused by the user's fault.
③ The Company is not responsible for the loss of profits expected by users through use of the Service, and is not responsible for damages caused by data obtained through other services.

Article 7 (Governing Law and Jurisdiction)
The laws of the Republic of Korea apply to the interpretation of these Terms of Service and disputes between the Company and users, and lawsuits regarding disputes shall be under the jurisdiction of the court having jurisdiction over the Company's headquarters as the court of first instance.

These Terms of Service are effective from January 1, 2024.`
}

export default async function TermsPage({
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
      .eq('type', 'terms')
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
            {isKo ? '이용약관' : 'Terms of Service'}
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
