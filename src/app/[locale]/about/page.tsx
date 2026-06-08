import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'about' })
  const isKo = locale === 'ko'

  const supabase = await createClient()
  const { data: slides } = await supabase
    .from('about_sections')
    .select('*')
    .order('order_index')

  return (
    <div className="pt-16 md:pt-20 flex flex-col min-h-screen relative">
      {/* Sub GNB */}
      <div className="bg-navy/95 backdrop-blur-md sticky top-16 md:top-20 z-40 flex-shrink-0 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
            <div className="hidden md:block"></div>
            <div className="text-center">
              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                {t('title')}
              </h1>
            </div>
            <div className="hidden md:block"></div>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        {slides && slides.length > 0 ? (
          slides.map((slide, index) => (
            <section
              key={slide.id}
              className="w-full relative flex items-center justify-center overflow-hidden min-h-[calc(100vh-140px)] md:min-h-[calc(100vh-160px)]"
            >
              {/* Background Parallax Layer */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-fixed w-full h-full"
                style={{ backgroundImage: `url(${slide.image_url})` }}
              />
              {/* Dark Overlay for Readability */}
              <div className="absolute inset-0 bg-navy/60" />

              {/* Content Container */}
              <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-20">
                <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto transform transition-all duration-700 hover:bg-black/60">
                   <div className="text-gold text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-4">
                     {slide.section_key}
                   </div>
                   <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight whitespace-pre-wrap">
                     {isKo ? slide.title_ko : slide.title_en}
                   </h2>
                   <div className="w-16 h-1 bg-gold mx-auto mb-8 opacity-80" />
                   <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-light whitespace-pre-wrap">
                     {isKo ? slide.content_ko : slide.content_en}
                   </p>
                </div>
              </div>
            </section>
          ))
        ) : (
          <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
            {isKo ? '회사 소개 데이터가 없습니다.' : 'No about data available.'}
          </div>
        )}
      </div>
    </div>
  )
}

