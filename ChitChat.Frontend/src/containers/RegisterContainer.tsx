import Validations from '@utils/validations';
import React, { useContext, useEffect, useRef, useState } from 'react';
import LoadingComponent from '@components/LoadingComponent';
import {
    createUserWithEmailAndPassword,
    getAuth,
    updateProfile,
} from 'firebase/auth';
import { AuthContext } from '@hooks/UseAuthProvider';
import { AUTH_SET_CREDENTIALS } from '@consts/provider';
import { IError } from 'src/types/error';

function RegisterContainer() {
    const { dispatch } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<IError | null>(null);

    const usernameRef = useRef({} as HTMLInputElement);
    const emailRef = useRef({} as HTMLInputElement);
    const passwordRef = useRef({} as HTMLInputElement);
    const confirmPasswordRef = useRef({} as HTMLInputElement);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const username = usernameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (Validations.isNotStringEmpty(username)) {
            alert('Username cannot be empty');
            return;
        }
        if (Validations.isInvalidEmail(email)) {
            alert('Email must be valid');
            return;
        }
        if (Validations.isInvalidPassword(password)) {
            alert('Password must be at least 6 characters long');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const userCredentials = await createUserWithEmailAndPassword(
                getAuth(),
                email,
                password
            );

            await updateProfile(getAuth().currentUser!, {
                displayName: username,
            });

            if (userCredentials)
                dispatch({
                    type: AUTH_SET_CREDENTIALS,
                    payload: {
                        displayName: userCredentials.user.displayName!,
                        email: userCredentials.user.email!,
                        idToken: userCredentials.user.uid,
                    },
                });
        } catch (error) {
            setError(error as IError);
        }
    };

    useEffect(() => {
        const alertError = () => {
            if (!error) return;
            setIsLoading(false);
            alert(error.message);
        };
        alertError();
    }, [error]);

    return (
        <div className="h-[calc(100dvh-400px)] flex justify-center items-center px-4">
            {isLoading && <LoadingComponent />}
            <article className="w-full max-w-[400px] border p-[2rem]">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <section className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="border p-2"
                                required
                                ref={usernameRef}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="border p-2"
                                required
                                ref={emailRef}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="border p-2"
                                required
                                ref={passwordRef}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password_confirmation">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="password_confirmation"
                                className="border p-2"
                                required
                                ref={confirmPasswordRef}
                            />
                        </div>
                    </section>
                    <hr />
                    <section className="flex flex-col gap-2">
                        <button type="submit" className="w-full border p-2">
                            Register
                        </button>
                        <div className="w-full flex justify-center border">
                            <a href="/" className="w-full text-center p-2">
                                Cancel
                            </a>
                        </div>
                    </section>
                </form>
            </article>
        </div>
    );
}

export default RegisterContainer;
