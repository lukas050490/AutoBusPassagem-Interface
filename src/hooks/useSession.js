import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '../services/api';

export function useSession() {
    const [sessionId] = useState(() => {

        let storedSessionId = sessionStorage.getItem('bookingSessionId');
        if (!storedSessionId) {
            storedSessionId = uuidv4();
            sessionStorage.setItem('bookingSessionId', storedSessionId);
        }
        return storedSessionId;
    });

    const [loading] = useState(false);


    useEffect(() => {
        const handleBeforeUnload = () => {
            if (sessionId) {
                const data = JSON.stringify({ sessionId });
                navigator.sendBeacon('/api/sessions/cleanup', data);
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            api.post('/sessions/cleanup', { sessionId }).catch(console.error);
        };
    }, [sessionId]);

    return { sessionId, loading };
}