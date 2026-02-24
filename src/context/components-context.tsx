import React, { createContext, useContext, ReactNode } from 'react';

export interface InjectedComponents {
    Pagination: React.ComponentType<any>;
    OpenChatbotTrigger: React.ComponentType<any>;
}

const ComponentContext = createContext<InjectedComponents>({
    Pagination: () => null,
    OpenChatbotTrigger: () => null,
});

export const ComponentProvider: React.FC<{
    components: InjectedComponents;
    children: ReactNode
}> = ({ components, children }) => {
    return (
        <ComponentContext.Provider value={components}>
            {children}
        </ComponentContext.Provider>
    );
};

export const useComponents = () => useContext(ComponentContext);