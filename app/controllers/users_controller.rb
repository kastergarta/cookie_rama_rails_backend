class UsersController < ApplicationController
    before_action :find_user, only: [:show, :destroy]
    def index
      @users = User.all
      render json: @users, include:[:advices]
    end
  
    def show
      render json: @user, include:[:advices]
    end
  
    def new
      @user = User.new
    end
  
    def create
      @user = User.create(user_params)
      render json: @users
    end
  
    def destroy
    @user.destroy
    render json: @users
  end
  
    private
  
      def find_user
  
        @user = User.find(params[:id])
      end
  
      def user_params
        params.require(:user).permit(:name)
      end
  
  end
  