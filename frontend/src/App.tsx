import React, { useState, useEffect, createContext } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";

import CommonLayout from "components/layouts/CommonLayout";
import Home from "components/pages/Home";
import SignUp from "components/pages/SignUp";
import SignIn from "components/pages/SignIn";

import { getCurrentUser } from "lib/api/auth";
import { User } from "interfaces/index";

// グローバルで扱う変数・関数
export const AuthContext = createContext(
	{} as {
		loading: boolean;
		setLoading: React.Dispatch<React.SetStateAction<boolean>>;
		isSignedIn: boolean;
		setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
		currentUser: User | undefined;
		setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
	}
);

const App: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
	const [currentUser, setCurrentUser] = useState<User | undefined>();

	// 認証済みのユーザーがいるかどうかチェック
	// 確認できた場合はそのユーザーの情報を取得
	const handleGetCurrentUser = async () => {
		try {
			// 認証済みユーザーの作成
			const res = await getCurrentUser();
			// 認証済みユーザーが居ることの確認
			if (res?.data.isLogin === true) {
				setIsSignedIn(true);
				setCurrentUser(res?.data.data);

				console.log(res?.data.data);
			} else {
				console.log("No current user");
			}
		} catch (err) {
			console.log(err);
		}

		setLoading(false);
	};

	useEffect(() => {
		// 認証済みユーザーの取得
		handleGetCurrentUser();
	}, [setCurrentUser]);

	// ユーザーが認証済みかどうかでルーティングを決定
	// 未認証だった場合は「/signin」ページに促す
	const Private = ({ children }: { children: React.ReactElement }) => {
		if (!loading) {
			if (isSignedIn) {
				return children;
			} else {
				return <Redirect to="/signin" />;
			}
		} else {
			return <></>;
		}
	};

	return (
		<Router>
			{/* グローバルで使う変数を持つ AuthContext で囲む */}
			<AuthContext.Provider
				value={{
					loading,
					setLoading,
					isSignedIn,
					setIsSignedIn,
					currentUser,
					setCurrentUser,
				}}
			>
				<CommonLayout>
					<Switch>
						<Route exact path="/signup" component={SignUp} />
						<Route exact path="/signin" component={SignIn} />
						{/* 未認証なら /singin にリダイレクトする */}
						<Private>
							<Route exact path="/" component={Home} />
						</Private>
					</Switch>
				</CommonLayout>
			</AuthContext.Provider>
		</Router>
	);
};

export default App;
