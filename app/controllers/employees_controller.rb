class EmployeesController < ApplicationController
  def show
    @employee = User.find(params[:id])
    
    respond_to do |format|
      format.json do
        render json: @employee.to_json(:include => [:shifts, :unavailabilities])
      end
    end
  end
end
