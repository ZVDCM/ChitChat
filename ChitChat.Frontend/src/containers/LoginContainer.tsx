import React, { useRef } from 'react';

function LoginContainer() {
    const emailRef = useRef({} as HTMLInputElement);
    const passwordRef = useRef({} as HTMLInputElement);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        console.log(email, password);
    };

    return (
        <div className="h-[calc(100dvh-400px)] flex justify-center items-center">
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
