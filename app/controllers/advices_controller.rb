class AdvicesController < ApplicationController
    before_action :find_advice, only: [:show, :edit, :update, :destroy]
  
    def index
      @advices = Advice.all
      render json: @advices
    end
  
    def show
      render json: @advice
    end
  
    def new
      @advice = Advice.new
    end
  
    def create
      @advice = Advice.create(advice_params)
      render json: @advices
    end
  
    def edit
  
    end
  
    def update
      @advice.update(advice_params)
  
      render json: @advice
    end
  
    def destroy
    @advice.destroy
    render json: @advice
    end
  
    private
  
      def find_advice
        @advice = Advice.find(params[:id])
      end
  
      def advice_params
        params.require(:advice).permit(:content, :user_id, :likes)
      end
  end
  