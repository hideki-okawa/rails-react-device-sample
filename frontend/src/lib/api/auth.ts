import client from "lib/api/client";
import Cookies from "js-cookie";

import { SignUpParams, SignInParams } from "interfaces/index";

// サインアップ（新規アカウント作成）
export const signUp = (params: SignUpParams) => {
	return client.post("auth", params);
};

// サインイン（ログイン）
export const signIn = (params: SignInParams) => {
	return client.post("auth/sign_in", params);
};

// サインアウト（ログアウト）
export const signOut = () => {
	return client.delete("auth/sign_out", {
		headers: {
			"access-token": Cookies.get("_access_token"),
			client: Cookies.get("_client"),
			uid: Cookies.get("_uid"),
		},
	});
};

// 認証済みのユーザーを取得
export const getCurrentUser = () => {
	// 未認証なら何も返さない
	if (
		!Cookies.get("_access_token") ||
		!Cookies.get("_client") ||
		!Cookies.get("_uid")
	)
		return;
	// 認証済みならログイン情報を返す
	return client.get("/auth/sessions", {
		headers: {
			"access-token": Cookies.get("_access_token"),
			client: Cookies.get("_client"),
			uid: Cookies.get("_uid"),
		},
	});
};
