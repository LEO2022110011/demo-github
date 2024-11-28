import { useState } from "react";

const LoginForm = ({ doLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleLogin() {
        doLogin(username, password);
    }
    function handleKeyup(e) {
        if (e.keyCode === 13) handleLogin();
    };

    return (
        <div
            id="authentication-modal"
            tabIndex="-1"
            aria-hidden="true"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full"
        >
            <div className="relative p-4 w-full max-w-md max-h-full mb-12">
                <div className="relative bg-white rounded-lg shadow ">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Netsoft Group Document System
                        </h3>
                    </div>
                    <div className="p-4 md:p-5">
                        <div className="space-y-4" action="#">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="text-left block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Your username
                                </label>
                                <input
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="text-left block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Your password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyUp={handleKeyup}
                                />
                            </div>

                            <div className="flex items-center h-2"></div>

                            <button
                                onClick={handleLogin}
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
