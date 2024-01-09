import Validations from '@utils/validations';
import React, { useRef } from 'react';

function RegisterContainer() {
    const usernameRef = useRef({} as HTMLInputElement);
    const emailRef = useRef({} as HTMLInputElement);
    const passwordRef = useRef({} as HTMLInputElement);
    const confirmPasswordRef = useRef({} as HTMLInputElement);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
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

        console.log(username, email, password, confirmPassword);
    };

    return (
        <div className="h-[calc(100dvh-400px)] flex justify-center items-center px-4">
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
