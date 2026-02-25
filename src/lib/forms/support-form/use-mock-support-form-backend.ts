import { useEffect } from "react";
import { SUPPORT_FORM_LOCAL_STORAGE_MOCK_VALUES_KEY } from "./constants";
import { GenericValue } from "./types";


const isServer = typeof window === 'undefined';

function lsValue(key: string){
    const data = localStorage.getItem(SUPPORT_FORM_LOCAL_STORAGE_MOCK_VALUES_KEY);
    return JSON.parse(data || '{}')[key];
}


const mockAsyncValue = (val: GenericValue) => new Promise(resolve => {
  setTimeout(() => {
    resolve(val);
  }, 3000);
});


export default function useMockSupportFormBackend() {
    useEffect(() => {
        if (!isServer) {
            localStorage.setItem(SUPPORT_FORM_LOCAL_STORAGE_MOCK_VALUES_KEY, JSON.stringify({
                sensorCodes: [
                    { num: '103', description: 'No battery' },
                    { num: '102', description: 'Connection failed' },
                ]
            }));
        }
    }, []);
    const getSensorCodes = () => {
      return mockAsyncValue(lsValue('sensorCodes')) as Promise<GenericValue>;
    }
  return {
    getSensorCodes,
    toString: () => {
        if (isServer) return '{}';
        return localStorage.getItem(SUPPORT_FORM_LOCAL_STORAGE_MOCK_VALUES_KEY);
    },
    isServer
  } as any;
}
