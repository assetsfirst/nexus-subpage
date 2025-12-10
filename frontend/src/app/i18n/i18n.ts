import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import i18n from 'i18next'

i18n.use(initReactI18next)
    .use(LanguageDetector)
    .use(HttpApi)
    .init({
        fallbackLng: 'ru',
        debug: import.meta.env.MODE === 'development',
        defaultNS: ['main'],
        ns: ['main'],
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage']
        },
        load: 'languageOnly',
        preload: ['en', 'ru'],
        backend: {
            loadPath: `${import.meta.env.BASE_URL}/locales/{{lng}}/{{ns}}.json`
        },
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: true
        }
    })

export default i18n
