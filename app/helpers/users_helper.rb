module UsersHelper
	def hoo_format(open, close)
		open.strftime("%l:%M %P") + " - " + close.strftime("%l:%M %P")
	end
end
