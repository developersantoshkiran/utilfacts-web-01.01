'use client';
import { SWRConfig } from 'swr'
import { swrMiddleware } from '../utils/middleware';
import { GET } from '../utils/api';

export const SWRProvider = ({ children }: React.PropsWithChildren) => {
    return <SWRConfig value={{
        fetcher: GET,
        use: [swrMiddleware]
    }}>{children}</SWRConfig>
};