import { useEffect, useLayoutEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import consola from 'consola/browser'

import { useSubscriptionInfoStoreActions } from '@entities/subscription-info-store/subscription-info-store'
import { LoadingScreen } from '@shared/ui/loading-screen/loading-screen'
import { mapToRemna } from 'src/shared/utils/subscription-converter'

import classes from './root.module.css'
import i18n from '../../i18n/i18n'

export function RootLayout() {
    const actions = useSubscriptionInfoStoreActions()
    const [i18nInitialized, setI18nInitialized] = useState(i18n.isInitialized)

    useLayoutEffect(() => {
        const path = window.location.pathname
        const token = path.split('/sub/')[1]?.split('/')[0]

        if (!token) {
            consola.error('No subscription token found in URL')
            return
        }

        const baseUrl = window.location.origin
        const urlPrefix = `/sub/${token}/info`
        const subscriptionUrl = import.meta.env.DEV ? import.meta.env.VITE_API_URL + urlPrefix : baseUrl + urlPrefix
        fetch(subscriptionUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch subscription info: ${response.status}`)
                }
                return response.json()
            })
            .then(subscriptionData => {
                const subscription = mapToRemna(subscriptionUrl, subscriptionData)
                actions.setSubscriptionInfo({
                    subscription
                })
            })
            .catch(error => {
                consola.error('Error fetching subscription info:', error)
            })
    }, [])

    useEffect(() => {
        if (!i18nInitialized) {
            i18n.on('initialized', () => {
                setI18nInitialized(true)
            })
        }
    }, [i18nInitialized])

    if (!i18nInitialized) {
        return <LoadingScreen height="100vh" />
    }

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <main className={classes.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}