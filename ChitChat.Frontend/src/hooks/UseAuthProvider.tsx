import React, { createContext, useReducer } from 'react';
import { AUTH_SET_CREDENTIALS } from '@consts/provider';

interface IInitialState {
    displayName: string;
    email: string;
    idToken: string;
}

const initialState: IInitialState | null = null;

interface IAction {
    type: string;
    payload: IInitialState | null;
}

interface IContext {
    state: IInitialState | null;
    dispatch: React.Dispatch<IAction>;
}

export const AuthContext = createContext<IContext>({
    state: initialState,
    dispatch: () => {},
});

const authReducer = (state: IInitialState | null, action: IAction) => {
    switch (action.type) {
        case AUTH_SET_CREDENTIALS:
            if (!action.payload) return null;
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

interface IProps {
    children: React.ReactNode;
}

function UseAuthProvider({ children }: IProps) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}

export default UseAuthProvider;
