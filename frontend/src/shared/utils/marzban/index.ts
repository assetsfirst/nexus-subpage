import { GetSubscriptionInfoByShortUuidCommand } from '@remnawave/backend-contract'
import { z } from 'zod'

interface ProxyConfig {
    id: string;
    flow: string;
}

interface Proxies {
    vless?: ProxyConfig;
    vmess?: ProxyConfig;
    trojan?: ProxyConfig;
    shadowsocks?: ProxyConfig;
    [key: string]: ProxyConfig | undefined;
}

type DataLimitResetStrategy =
    | "daily"
    | "monthly"
    | "no_reset"
    | "weekly";

type UserStatus =
    | "active"
    | "disabled"
    | "expired"
    | "limited"
    | "on_hold";

interface SubscriptionInfo {
    proxies: Proxies;
    expire: number; // Unix timestamp
    data_limit: null | number; // Bytes
    data_limit_reset_strategy: DataLimitResetStrategy;
    sub_updated_at: null | string; // ISO date string
    sub_last_user_agent: null | string;
    online_at: null | string; // ISO date string
    on_hold_expire_duration: null | number;
    on_hold_timeout: null | string;
    next_plan: null | unknown;
    username: string;
    status: UserStatus;
    used_traffic: number; // Bytes
    lifetime_used_traffic: number; // Bytes
    created_at: string; // ISO date string
    links: string[];
    subscription_url: string;
}

export function mapToRemna(response: SubscriptionInfo): GetSubscriptionInfoByShortUuidCommand.Response['response'] {

    // Calculate days left from expire timestamp
    const now = Date.now()
    const expireMs = response.expire * 1000
    const daysLeft = Math.ceil((expireMs - now) / (1000 * 60 * 60 * 24))

    // Format traffic used (convert bytes to readable format)
    const formatTraffic = (bytes: number): string => {
        if (bytes === 0) return "0"
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${Math.round(bytes / 1024**i * 100) / 100  } ${  sizes[i]}`
    }

    const shortUuid = response.subscription_url.split('/sub/')[1]?.split('/')[0] ?? ''

    return {
        subscriptionUrl: response.subscription_url,
        happ: {
            cryptoLink: ''
        },
        user: {
            username: response.username,
            shortUuid,
            trafficLimitStrategy: response.data_limit_reset_strategy.toUpperCase() as "DAY" | "MONTH" | "NO_RESET" | "WEEK",
            daysLeft: Math.max(0, daysLeft), // Ensure non-negative
            trafficUsed: formatTraffic(response.used_traffic),
            trafficLimit: response.data_limit ? formatTraffic(response.data_limit) : "∞",
            expiresAt: new Date(expireMs),
            isActive: response.status === 'active',
            userStatus: response.status.toUpperCase() as "ACTIVE" | "DISABLED" | "EXPIRED" | "LIMITED"
        },
        isFound: true,
        links: response.links,
        ssConfLinks: {}
    }
}
