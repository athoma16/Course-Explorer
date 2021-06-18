from django.urls import path

from . import views

urlpatterns = [
	# ex: /api/
	path('', views.index, name='index'),
	# ex: /api/email/
	path('email/', views.email, name='email'),
	# ex: /api/5/
	path('json/', views.specific, name='detail'),
	# ex: /api/search/title/computer_science/
	path('<str:method>/<str:parameter>/<str:keywords>/', views.query, name='query'),

]