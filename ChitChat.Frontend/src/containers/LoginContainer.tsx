import { UserCredential } from 'firebase/auth';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '@hooks/UseAuthProvider';
import { AUTH_SET_CREDENTIALS } from '@consts/provider';
import { IError } from 'src/types/error';
import LoadingComponent from '@components/LoadingComponent';
import Auth from 'src/firebase/auth';

function LoginContainer() {
    const { dispatch } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<IError | null>(null);

    const emailRef = useRef({} as HTMLInputElement);
    const passwordRef = useRef({} as HTMLInputElement);

    const setCredentials = (userCredentials: UserCredential): void => {
        dispatch({
            type: AUTH_SET_CREDENTIALS,
            payload: {
                displayName: userCredentials.user.displayName!,
                email: userCredentials.user.email!,
                idToken: userCredentials.user.uid,
            },
        });
    };

    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        setIsLoading(true);

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        try {
            const userCredentials = await Auth.login(email, password);
            if (!userCredentials) {
                setError({
                    code: 'REGISTRATION_ERROR',
                    message: 'Registration failed',
                });
                return;
            }
            setCredentials(userCredentials);
        } catch (error) {
            setError(error as IError);
        }
    };

    useEffect(() => {
        const alertError = (): void => {
            if (!error) return;
            setIsLoading(false);
            alert(error.message);
        };

        alertError();
    }, [error]);

    return (
        <div className="h-[calc(100dvh-400px)] flex justify-center items-center">
            {isLoading && <LoadingComponent />}
            <div className="w-full flex flex-col gap-4 items-center translate-y-[-4rem] px-4">
                <p>
                    Not a member?{' '}
                    <a href="register" className="hover:underline">
                        Register
                    </a>
                </p>
                <article
                    className="w-full max-w-[400px] border p-[2rem]"
                    onSubmit={handleSubmit}
                >
                    <form className="flex flex-col gap-4">
                        <section className="flex flex-col gap-2">
                            <div className="flex flex-col">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    className="border p-2"
                                    ref={emailRef}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="border p-2"
                                    ref={passwordRef}
                                />
                            </div>
                        </section>
                        <hr />
                        <section>
                            <button type="submit" className="w-full border p-2">
                                Login
                            </button>
                        </section>
                    </form>
                </article>
            </div>
        </div>
    );
}

export default LoginContainer;
