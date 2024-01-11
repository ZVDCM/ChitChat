import React, { createContext, useReducer } from 'react';
import { AUTH_SET_CREDENTIALS } from '@consts/actions';

type user = { uid: string; displayName: string; email: string };
type token = string;

interface IInitialState {
    user: user;
    token: token;
}

const initialState: IInitialState | null = null;

interface IAction {
    type: string;
    payload?: IInitialState;
}

interface IContext {
    state: IInitialState | null;
    dispatch: React.Dispatch<IAction>;
}

export const AuthContext = createContext<IContext>({
    state: initialState,
    dispatch: () => {},
});

const authReducer = (
    state: IInitialState | null,
    action: IAction
): IInitialState | null => {
    if (!action.payload) return null;

    switch (action.type) {
        case AUTH_SET_CREDENTIALS: {
            return {
                ...state,
                ...action.payload,
            };
        }
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
