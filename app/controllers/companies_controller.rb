class CompaniesController < ApplicationController

  def new_employee
    @user = User.new
    @company = Company.find(params[:id])
  end
end
