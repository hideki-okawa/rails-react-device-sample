# アカウント作成用コントローラー
class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  private

    def sign_up_params
      # Strong Parameters
      # email, password, password_confirmation, nameは必須
      params.permit(:email, :password, :password_confirmation, :name)
    end
end