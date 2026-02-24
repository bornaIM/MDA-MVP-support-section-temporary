import { ChakraComponent } from '@dexcomit/web-ui-lib';
import React, { createContext, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onClick: Dispatch<SetStateAction<number>>;
};
export interface InjectedComponents {
    Pagination: ({ currentPage, totalPages, onClick, }: PaginationProps) => JSX.Element;
    OpenChatbotTrigger: ChakraComponent<"div", {}>
    RenderSlot: ({ id }: { id: string; }) => JSX.Element
}

export interface InjectedFunctions {
    useGetLocalizedUrl(): (fragment?: string) => string;
}

export interface SupportContextValue extends InjectedComponents, InjectedFunctions {}

const defaultContextValue: SupportContextValue = {
    Pagination: () => <></>,
    OpenChatbotTrigger: () => <></>,
    RenderSlot: () => <></>,
    useGetLocalizedUrl: () => (fragment?: string) => ''
};

const SupportContext = createContext<SupportContextValue>(defaultContextValue);

export const SupportProvider: React.FC<{
    components?: Partial<InjectedComponents>;
    functions?: Partial<InjectedFunctions>;
    children: ReactNode
}> = ({ components = {}, functions = {}, children }) => {
    const value = {
        ...defaultContextValue,
        ...Object.fromEntries(Object.entries(components).filter(([_, v]) => v !== undefined)),
        ...Object.fromEntries(Object.entries(functions).filter(([_, v]) => v !== undefined))
    };
    return (
        <SupportContext.Provider value={value}>
            {children}
        </SupportContext.Provider>
    );
};

export const useProvider = () => useContext(SupportContext);