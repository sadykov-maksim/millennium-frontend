"use client";
import { useEffect, useState, createContext, useContext, PropsWithChildren } from 'react';
import { Placeholder } from '@telegram-apps/telegram-ui';
import {initData, useSignal} from "@telegram-apps/sdk-react";

// Типы для контекста
interface WebSocketContextType {
    authStatus: string | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// WebSocketProvider
export function WebSocketProvider({ children }: PropsWithChildren) {
    const [authStatus, setAuthStatus] = useState<string | null>(null);
    const [serverError, setServerError] = useState<boolean>(false);
    const initDataRaw = useSignal(initData.raw);

    useEffect(() => {
        const socket = new WebSocket(`wss://ws.mnchrm.pro/verify?${initDataRaw}`);

        socket.onopen = () => {
            console.log('WebSocket соединение установлено');
            setServerError(false);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                switch (data.message) {
                    case 'User verified':
                        setAuthStatus('Успешная верификация пользователя');
                        break;
                    case 'User not found':
                        setAuthStatus('Ошибка: Пользователь не найден');
                        break;
                    case 'Invalid signature':
                        setAuthStatus('Ошибка: Неверная подпись данных');
                        break;
                    default:
                        setAuthStatus(`Неизвестный ответ сервера: ${JSON.stringify(data)}`);
                        break;
                }

            } catch (e) {
                console.error('Ошибка обработки сообщения от WebSocket:', e);
            }
        };

        socket.onclose = (event) => {
            console.log(`WebSocket соединение закрыто: ${event.reason || 'нет причины'}`);
            setServerError(true);
        };

        socket.onerror = (error) => {
            console.error('Ошибка WebSocket:', error);
            setServerError(true);
        };

        return () => {
            socket.close();
        };
    }, []);

    if (serverError) {
        return (
            <div className="server-error">
                <Placeholder
                    header="Внутренняя ошибка сервера"
                    description="Попробуйте зайти позже."
                >
                    <img
                        alt="Ошибка сервера"
                        src="/loading.gif"
                        style={{ maxWidth: '100%', height: '250px' }}
                    />
                </Placeholder>
            </div>
        );
    }

    return (
        <WebSocketContext.Provider value={{ authStatus }}>
            {authStatus && <div className="auth-status">{authStatus}</div>}
            {children}
        </WebSocketContext.Provider>
    );
}

// Хук для использования контекста WebSocket
export function useWebSocket() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket должен использоваться внутри WebSocketProvider');
    }
    return context;
}
